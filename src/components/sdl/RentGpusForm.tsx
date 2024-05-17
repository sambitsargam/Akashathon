"use client";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { ApiTemplate, ProfileGpuModel, RentGpusFormValues, Service } from "@src/types";
import { defaultAnyRegion, defaultRentGpuService } from "@src/utils/sdl/data";
import { useRouter, useSearchParams } from "next/navigation";
import { useAtom } from "jotai";
import { EncodeObject } from "@cosmjs/proto-signing";
import { certificateManager } from "@akashnetwork/akashjs/build/certificates/certificate-manager";

import sdlStore from "@src/store/sdlStore";
import { RegionSelect } from "./RegionSelect";
import { AdvancedConfig } from "./AdvancedConfig";
import { GpuFormControl } from "./GpuFormControl";
import { CpuFormControl } from "./CpuFormControl";
import { MemoryFormControl } from "./MemoryFormControl";
import { StorageFormControl } from "./StorageFormControl";
import { TokenFormControl } from "./TokenFormControl";
import { generateSdl } from "@src/utils/sdl/sdlGenerator";
import { UrlService, handleDocClick } from "@src/utils/urlUtils";
import { RouteStepKeys, defaultInitialDeposit } from "@src/utils/constants";
import { deploymentData } from "@src/utils/deploymentData";
import { useCertificate } from "@src/context/CertificateProvider";
import { useSettings } from "@src/context/SettingsProvider";
import { useWallet } from "@src/context/WalletProvider";
import { validateDeploymentData } from "@src/utils/deploymentUtils";
import { TransactionMessageData } from "@src/utils/TransactionMessageData";
import { updateWallet } from "@src/utils/walletUtils";
import { saveDeploymentManifestAndName } from "@src/utils/deploymentLocalDataUtils";
import { DeploymentDepositModal } from "../deployments/DeploymentDepositModal";
import { LinkTo } from "../shared/LinkTo";
import { PrerequisiteList } from "../shared/PrerequisiteList";
import { ProviderAttributeSchemaDetailValue } from "@src/types/providerAttributes";
import { importSimpleSdl } from "@src/utils/sdl/sdlImport";
import { ImageSelect } from "./ImageSelect";
import { event } from "nextjs-google-analytics";
import { AnalyticsEvents } from "@src/utils/analytics";
import { useChainParam } from "@src/context/ChainParamProvider";
import { useGpuModels } from "@src/queries/useGpuQuery";
import { Alert } from "../ui/alert";
import { FormPaper } from "./FormPaper";
import { Button } from "../ui/button";
import { Rocket } from "iconoir-react";
import Spinner from "../shared/Spinner";

type Props = {};

export const RentGpusForm: React.FunctionComponent<Props> = ({}) => {
  const [error, setError] = useState<string | null>(null);
  // const [templateMetadata, setTemplateMetadata] = useState<ITemplate>(null);
  const [isQueryInit, setIsQuertInit] = useState(false);
  const [isCreatingDeployment, setIsCreatingDeployment] = useState(false);
  const [isDepositingDeployment, setIsDepositingDeployment] = useState(false);
  const [isCheckingPrerequisites, setIsCheckingPrerequisites] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [, setDeploySdl] = useAtom(sdlStore.deploySdl);
  const [rentGpuSdl, setRentGpuSdl] = useAtom(sdlStore.rentGpuSdl);
  const { data: gpuModels } = useGpuModels();
  const { handleSubmit, control, watch, setValue, trigger } = useForm<RentGpusFormValues>({
    defaultValues: {
      services: [{ ...defaultRentGpuService }],
      region: { ...defaultAnyRegion }
    }
  });
  const { services: _services } = watch();
  const searchParams = useSearchParams();
  const currentService: Service = (_services && _services[0]) || ({} as any);
  const { settings } = useSettings();
  const { address, signAndBroadcastTx } = useWallet();
  const { loadValidCertificates, localCert, isLocalCertMatching, loadLocalCert, setSelectedCertificate } = useCertificate();
  const [sdlDenom, setSdlDenom] = useState("uakt");
  const { minDeposit } = useChainParam();
  const router = useRouter();

  useEffect(() => {
    if (rentGpuSdl && rentGpuSdl.services) {
      setValue("services", structuredClone(rentGpuSdl.services));
      setValue("region", rentGpuSdl.region || { ...defaultAnyRegion });

      // Set the value of gpu models specifically because nested value doesn't re-render correctly
      // https://github.com/react-hook-form/react-hook-form/issues/7758
      setValue("services.0.profile.gpuModels", rentGpuSdl.services[0].profile.gpuModels || []);
    }

    const subscription = watch(({ services, region }) => {
      setRentGpuSdl({ services: services as Service[], region: region as ProviderAttributeSchemaDetailValue });
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const vendorQuery = searchParams?.get("vendor");
    const gpuQuery = searchParams?.get("gpu");
    if (vendorQuery && gpuQuery && gpuModels && !isQueryInit) {
      // Example query: ?vendor=nvidia&gpu=h100&vram=80Gi&interface=sxm
      const gpuModel = gpuModels.find(x => x.name === vendorQuery)?.models.find(x => x.name === gpuQuery);

      if (gpuModel) {
        const vramQuery = searchParams?.get("vram");
        const interfaceQuery = searchParams?.get("interface");

        const model: ProfileGpuModel = {
          vendor: vendorQuery,
          name: gpuModel.name,
          memory: gpuModel.memory.find(x => x === vramQuery) || "",
          interface: gpuModel.interface.find(x => x === interfaceQuery) || ""
        };
        setValue("services.0.profile.gpuModels", [model]);
      } else {
        console.log("GPU model not found", gpuQuery);
      }

      setIsQuertInit(true);
    }
  }, [searchParams, gpuModels, isQueryInit]);

  async function createAndValidateDeploymentData(yamlStr: string, dseq = null, deposit = defaultInitialDeposit, depositorAddress: string | null = null) {
    try {
      if (!yamlStr) return null;

      const dd = await deploymentData.NewDeploymentData(settings.apiEndpoint, yamlStr, dseq, address, deposit, depositorAddress);
      validateDeploymentData(dd);

      setSdlDenom(dd.deposit.denom);

      return dd;
    } catch (err) {
      console.error(err);
    }
  }

  const createAndValidateSdl = (yamlStr: string | undefined) => {
    try {
      if (!yamlStr) return null;

      const services = importSimpleSdl(yamlStr);

      setError(null);

      return services;
    } catch (err) {
      if (err.name === "YAMLException" || err.name === "CustomValidationError") {
        setError(err.message);
      } else if (err.name === "TemplateValidation") {
        setError(err.message);
      } else {
        setError("Error while parsing SDL file");
        // setParsingError(err.message);
        console.error(err);
      }
    }
  };

  const onSelectTemplate = (template: ApiTemplate) => {
    const result = createAndValidateSdl(template?.deploy);

    if (!result) return;

    // Filter out invalid gpu models
    const _gpuModels = ((result && result[0].profile?.gpuModels) || []).map(templateModel => {
      const isValid = gpuModels?.find(x => x.name === templateModel.vendor)?.models.some(x => x.name === templateModel.name);
      return {
        vendor: isValid ? templateModel.vendor : "nvidia",
        name: isValid ? templateModel.name : "",
        memory: isValid ? templateModel.memory : "",
        interface: isValid ? templateModel.interface : ""
      };
    });

    setValue("services", result as Service[]);
    setValue("services.0.profile.gpuModels", _gpuModels);
    trigger();
  };

  const onPrerequisiteContinue = () => {
    setIsCheckingPrerequisites(false);
    setIsDepositingDeployment(true);
  };

  const onDeploymentDeposit = async (deposit: number, depositorAddress: string) => {
    setIsDepositingDeployment(false);
    await handleCreateClick(deposit, depositorAddress);
  };

  const onSubmit = async (data: RentGpusFormValues) => {
    setRentGpuSdl(data);
    setIsCheckingPrerequisites(true);
  };

  async function handleCreateClick(deposit: number, depositorAddress: string) {
    setError(null);

    try {
      if (!rentGpuSdl) return;

      const sdl = generateSdl(rentGpuSdl.services, rentGpuSdl.region?.key);

      setIsCreatingDeployment(true);

      const dd = await createAndValidateDeploymentData(sdl, null, deposit, depositorAddress);
      const validCertificates = await loadValidCertificates();
      const currentCert = validCertificates.find(x => x.parsed === localCert?.certPem);
      const isCertificateValidated = currentCert?.certificate?.state === "valid";
      const isLocalCertificateValidated = !!localCert && isLocalCertMatching;

      if (!dd) return;

      const messages: EncodeObject[] = [];
      const hasValidCert = isCertificateValidated && isLocalCertificateValidated;
      let _crtpem: string;
      let _encryptedKey: string;

      // Create a cert if the user doesn't have one
      if (!hasValidCert) {
        const { cert: crtpem, publicKey: pubpem, privateKey: encryptedKey } = certificateManager.generatePEM(address);
        _crtpem = crtpem;
        _encryptedKey = encryptedKey;
        messages.push(TransactionMessageData.getCreateCertificateMsg(address, crtpem, pubpem));
      }

      messages.push(TransactionMessageData.getCreateDeploymentMsg(dd));
      const response = await signAndBroadcastTx(messages);

      if (response) {
        // Set the new cert in storage
        if (!hasValidCert) {
          updateWallet(address, wallet => {
            return {
              ...wallet,
              cert: _crtpem,
              certKey: _encryptedKey
            };
          });
          const validCerts = await loadValidCertificates();
          loadLocalCert();
          const currentCert = validCerts.find(x => x.parsed === _crtpem);
          setSelectedCertificate(currentCert);
        }

        setDeploySdl(null);

        // Save the manifest
        saveDeploymentManifestAndName(dd.deploymentId.dseq, sdl, dd.version, address, currentService.image);
        router.push(UrlService.newDeployment({ step: RouteStepKeys.createLeases, dseq: dd.deploymentId.dseq }));

        event(AnalyticsEvents.CREATE_GPU_DEPLOYMENT, {
          category: "deployments",
          label: "Create deployment rent gpu form"
        });
      } else {
        setIsCreatingDeployment(false);
      }
    } catch (error) {
      setIsCreatingDeployment(false);
      setError(error.message);
    }
  }

  return (
    <>
      {isDepositingDeployment && (
        <DeploymentDepositModal
          handleCancel={() => setIsDepositingDeployment(false)}
          onDeploymentDeposit={onDeploymentDeposit}
          denom={currentService?.placement?.pricing?.denom || sdlDenom}
          infoText={
            <Alert className="mb-4" variant="default">
              <p className="text-sm text-muted-foreground">
                To create a deployment, you need to have at least <b>{minDeposit.akt} AKT</b> or <b>{minDeposit.usdc} USDC</b> in an escrow account.{" "}
                <LinkTo onClick={ev => handleDocClick(ev, "https://akash.network/docs/getting-started/intro-to-akash/bids-and-leases/#escrow-accounts")}>
                  <strong>Learn more.</strong>
                </LinkTo>
              </p>
            </Alert>
          }
        />
      )}
      {isCheckingPrerequisites && <PrerequisiteList onClose={() => setIsCheckingPrerequisites(false)} onContinue={onPrerequisiteContinue} />}

      <form onSubmit={handleSubmit(onSubmit)} ref={formRef} autoComplete="off">
        <FormPaper className="mt-4 p-4">
          <ImageSelect control={control as any} currentService={currentService} onSelectTemplate={onSelectTemplate} />

          <div className="mt-4">
            <GpuFormControl
              control={control as any}
              gpuModels={gpuModels}
              serviceIndex={0}
              hasGpu
              currentService={currentService}
              setValue={setValue}
              hideHasGpu
            />
          </div>

          <div className="mt-4">
            <CpuFormControl control={control as any} currentService={currentService} serviceIndex={0} />
          </div>

          <div className="mt-4">
            <MemoryFormControl control={control as any} currentService={currentService} serviceIndex={0} />
          </div>

          <div className="mt-4">
            <StorageFormControl control={control as any} currentService={currentService} serviceIndex={0} />
          </div>

          <div className="grid-col-2 mt-4 grid gap-2">
            <div>
              <RegionSelect control={control} />
            </div>
            <div>
              <TokenFormControl control={control} name="services.0.placement.pricing.denom" />
            </div>
          </div>
        </FormPaper>

        <AdvancedConfig control={control} currentService={currentService} />

        {error && (
          <Alert variant="destructive" className="mt-4">
            {error}
          </Alert>
        )}

        {currentService?.env?.some(x => !!x.key && !x.value) && (
          <Alert variant="warning" className="mt-4">
            Some of the environment variables are empty. Please fill them in the advanced configuration before deploying.
          </Alert>
        )}

        <div className="flex items-center justify-end pt-4">
          <Button size="lg" variant="default" type="submit" disabled={isCreatingDeployment || !!error}>
            {isCreatingDeployment ? (
              <Spinner />
            ) : (
              <>
                Deploy{" "}
                <span className="ml-2 inline-flex items-center">
                  <Rocket className="rotate-45 text-sm" />
                </span>
              </>
            )}
          </Button>
        </div>
      </form>
    </>
  );
};
