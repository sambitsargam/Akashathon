"use client";
import { UrlService } from "@src/utils/urlUtils";
import Link from "next/link";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { QontoConnector, QontoStepIcon } from "./Stepper";
import { ExternalLink } from "../shared/ExternalLink";
import { ConnectWalletButton } from "../wallet/ConnectWalletButton";
import { uaktToAKT } from "@src/utils/priceUtils";
import { CustomTooltip } from "../shared/CustomTooltip";
import { RouteStepKeys } from "@src/utils/constants";
import { udenomToDenom } from "@src/utils/mathHelpers";
import { useChainParam } from "@src/context/ChainParamProvider";
import { Button, buttonVariants } from "../ui/button";
import Spinner from "../shared/Spinner";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import { cn } from "@src/utils/styleUtils";
import { Check, Rocket, WarningCircle, XmarkCircleSolid } from "iconoir-react";
import { useWallet } from "@src/context/WalletProvider";
import { MdRestartAlt } from "react-icons/md";

const LiquidityModal = dynamic(() => import("../liquidity-modal"), {
  ssr: false,
  loading: props => {
    if (props.isLoading) {
      return (
        <Button variant="default" disabled size="sm">
          <span>Convert to AKT</span>
          <Spinner size="small" className="ml-2" />
        </Button>
      );
    } else return null;
  }
});

const Payment = dynamic(() => import("../flatpayment/Kado"), {
  ssr: false,
  loading: props => {
    if (props.isLoading) {
      return (
        <Button variant="default" disabled size="sm">
          <span>Get More</span>
          <Spinner size="small" className="ml-2" />
        </Button>
      );
    } else return null;
  }
});

type Props = {};

export const GetStartedStepper: React.FunctionComponent<Props> = () => {
  const [activeStep, setActiveStep] = useState(0);
  const { isWalletConnected, walletBalances, address, refreshBalances } = useWallet();
  const { minDeposit } = useChainParam();
  const aktBalance = walletBalances ? uaktToAKT(walletBalances.uakt) : 0;
  const usdcBalance = walletBalances ? udenomToDenom(walletBalances.usdc) : 0;

  useEffect(() => {
    const getStartedStep = localStorage.getItem("getStartedStep");

    if (getStartedStep) {
      const _getStartedStep = parseInt(getStartedStep);
      setActiveStep(_getStartedStep >= 0 && _getStartedStep <= 2 ? _getStartedStep : 0);
    }
  }, []);

  const handleNext = () => {
    setActiveStep(prevActiveStep => {
      const newStep = prevActiveStep + 1;

      localStorage.setItem("getStartedStep", newStep.toString());

      return newStep;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
    localStorage.setItem("getStartedStep", "0");
  };

  const onStepClick = (step: number) => {
    setActiveStep(step);

    localStorage.setItem("getStartedStep", step.toString());
  };

  return (
    <Stepper activeStep={activeStep} orientation="vertical" connector={<QontoConnector />}>
      <Step>
        <StepLabel
          StepIconComponent={QontoStepIcon}
          onClick={() => (activeStep > 0 ? onStepClick(0) : null)}
          classes={{ label: cn("text-xl tracking-tight", { ["cursor-pointer hover:text-primary"]: activeStep > 0, ["!font-bold"]: activeStep === 0 }) }}
        >
          Wallet
        </StepLabel>

        <StepContent>
          <p className="text-muted-foreground">
            You need at least {minDeposit.akt} AKT or {minDeposit.usdc} USDC in your wallet to deploy on Akash. If you don't have {minDeposit.akt} AKT or{" "}
            {minDeposit.usdc} USDC, you can switch to the sandbox or ask help in our <ExternalLink href="https://discord.gg/akash" text="Discord" />.
          </p>

          <div className="my-4 flex items-center space-x-4">
            <Button variant="default" onClick={handleNext}>
              Next
            </Button>
            <Link className={cn(buttonVariants({ variant: "text" }))} href={UrlService.getStartedWallet()}>
              Learn how
            </Link>
          </div>

          <div className="my-4 flex items-center space-x-2">
            <Check className="text-green-600" />
            <span>Wallet is installed</span>
          </div>

          {isWalletConnected ? (
            <div className="my-4 flex items-center space-x-2">
              <Check className="text-green-600" />
              <span>Wallet is connected</span>
            </div>
          ) : (
            <div>
              <div className="my-4 flex items-center space-x-2">
                <XmarkCircleSolid className="text-destructive" />
                <span>Wallet is not connected</span>
              </div>

              <ConnectWalletButton />
            </div>
          )}

          {walletBalances && (
            <div className="my-4 flex items-center space-x-2">
              {aktBalance >= minDeposit.akt || usdcBalance >= minDeposit.usdc ? (
                <Check className="text-green-600" />
              ) : (
                <CustomTooltip
                  title={
                    <>
                      If you don't have {minDeposit.akt} AKT or {minDeposit.usdc} USDC, you can request authorization for some tokens to get started on our{" "}
                      <ExternalLink href="https://discord.gg/akash" text="Discord" />.
                    </>
                  }
                >
                  <WarningCircle className="text-warning" />
                </CustomTooltip>
              )}
              <span>
                You have <strong>{aktBalance}</strong> AKT and <strong>{usdcBalance}</strong> USDC
              </span>
              <br></br>
              <Payment />
              <LiquidityModal address={address} aktBalance={aktBalance} refreshBalances={refreshBalances} />
             
            </div>
          )}
        </StepContent>
      </Step>

      <Step>
        <StepLabel
          StepIconComponent={QontoStepIcon}
          onClick={() => onStepClick(1)}
          classes={{ label: cn("text-xl tracking-tight", { ["cursor-pointer hover:text-primary"]: activeStep > 1, ["!font-bold"]: activeStep === 1 }) }}
        >
          Docker container
        </StepLabel>
        <StepContent>
          <p className="mb-2 text-muted-foreground">
            To deploy on Akash, you need a docker container image as everything runs within Kubernetes. You can make your own or browse through pre-made
            solutions in the marketplace.
          </p>

          <p className="text-muted-foreground">For the sake of getting started, we will deploy a simple Next.js app that you can find in the deploy page.</p>
          <div className="my-4 flex flex-col flex-wrap items-start space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
            <Button variant="default" onClick={handleNext}>
              Next
            </Button>

            <div>
              <ExternalLink href="https://docs.docker.com/get-started/" text="Learn how" />
            </div>

            <Link href={UrlService.templates()} className={cn("py-4", buttonVariants({ variant: "secondary" }))}>
              Explore Marketplace
            </Link>
          </div>
        </StepContent>
      </Step>

      <Step>
        <StepLabel StepIconComponent={QontoStepIcon} classes={{ label: cn("text-xl tracking-tight", { ["!font-bold"]: activeStep === 2 }) }}>
          Hello world
        </StepLabel>
        <StepContent>
          <p className="text-muted-foreground">
            Deploy your first web app on Akash! This is a simple Next.js app and you can see the{" "}
            <ExternalLink href="https://github.com/maxmaxlabs/hello-akash-world" text="source code here" />.
          </p>
          <div className="my-4 space-x-2">
            <Link
              className={cn("space-x-2", buttonVariants({ variant: "default" }))}
              href={UrlService.newDeployment({ templateId: "hello-world", step: RouteStepKeys.editDeployment })}
            >
              <span>Deploy!</span>
              <Rocket className="rotate-45" />
            </Link>

            <Button onClick={handleReset} className="space-x-2" variant="ghost">
              <span>Reset</span>
              <MdRestartAlt />
            </Button>
          </div>
        </StepContent>
      </Step>
    </Stepper>
  );
};
