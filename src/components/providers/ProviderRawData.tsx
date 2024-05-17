"use client";
import { useState, useEffect } from "react";
import { useAllLeases } from "@src/queries/useLeaseQuery";
import { useWallet } from "@src/context/WalletProvider";
import { ClientProviderDetailWithStatus } from "@src/types/provider";
import { useProviderDetail, useProviderStatus } from "@src/queries/useProvidersQuery";
import { DynamicReactJson } from "@src/components/shared/DynamicJsonView";
import ProviderDetailLayout, { ProviderDetailTabs } from "./ProviderDetailLayout";
import Layout from "../layout/Layout";
import { CustomNextSeo } from "../shared/CustomNextSeo";
import { UrlService, domainName } from "@src/utils/urlUtils";

type Props = {
  owner: string;
};

export const ProviderRawData: React.FunctionComponent<Props> = ({ owner }) => {
  const [provider, setProvider] = useState<Partial<ClientProviderDetailWithStatus> | null>(null);
  const { isLoading: isLoadingProvider, refetch: getProviderDetail } = useProviderDetail(owner, {
    enabled: false,
    retry: false,
    onSuccess: _providerDetail => {
      setProvider(provider => (provider ? { ...provider, ..._providerDetail } : _providerDetail));
    }
  });
  const { address } = useWallet();
  const { data: leases, isFetching: isLoadingLeases, refetch: getLeases } = useAllLeases(address, { enabled: false });
  const {
    data: providerStatus,
    isLoading: isLoadingStatus,
    refetch: getProviderStatus
  } = useProviderStatus(provider?.hostUri || "", {
    enabled: false,
    retry: false,
    onSuccess: _providerStatus => {
      setProvider(provider => (provider ? { ...provider, ...providerStatus } : (providerStatus as ClientProviderDetailWithStatus)));
    }
  });

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (leases) {
      const numberOfDeployments = leases?.filter(d => d.provider === owner).length || 0;
      const numberOfActiveLeases = leases?.filter(d => d.provider === owner && d.state === "active").length || 0;

      setProvider(provider => ({ ...provider, userLeases: numberOfDeployments, userActiveLeases: numberOfActiveLeases }));
    }
  }, [leases]);

  const refresh = () => {
    getProviderDetail();
    getLeases();
    getProviderStatus();
  };

  return (
    <Layout isLoading={isLoadingLeases || isLoadingProvider || isLoadingStatus}>
      <CustomNextSeo title={`Provider raw data for ${owner}`} url={`${domainName}${UrlService.providerDetailRaw(owner)}`} />

      <ProviderDetailLayout address={owner} page={ProviderDetailTabs.RAW} refresh={refresh} provider={provider as ClientProviderDetailWithStatus}>
        {provider && <DynamicReactJson src={JSON.parse(JSON.stringify(provider))} collapsed={1} />}
      </ProviderDetailLayout>
    </Layout>
  );
};
