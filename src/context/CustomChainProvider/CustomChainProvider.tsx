"use client";
import { ChainProvider, useManager } from "@cosmos-kit/react";
import { wallets as keplr } from "@cosmos-kit/keplr";
import { wallets as leap } from "@cosmos-kit/leap-extension";
import { wallets as cosmostation } from "@cosmos-kit/cosmostation-extension";
import { customRegistry } from "@src/utils/customRegistry";
import { GasPrice } from "@cosmjs/stargate";
import { akash, akashAssetList, akashSandbox, akashSandboxAssetList, akashTestnet, akashTestnetAssetList } from "@src/chains";
import { useSelectedNetwork } from "@src/hooks/useSelectedNetwork";
import { useChain } from "@cosmos-kit/react";
import "@interchain-ui/react/styles";
import "@interchain-ui/react/globalStyles";

type Props = {
  children: React.ReactNode;
};

export function CustomChainProvider({ children }: Props) {
  return (
    <ChainProvider
      chains={[akash, akashSandbox, akashTestnet]}
      assetLists={[akashAssetList, akashSandboxAssetList, akashTestnetAssetList]}
      wallets={[...keplr, ...leap, ...cosmostation]}
      sessionOptions={{
        duration: 31_556_926_000, // 1 year
        callback: () => {
          console.log("session expired");
          window.localStorage.removeItem("cosmos-kit@2:core//current-wallet");
          window.location.reload();
        }
      }}
      walletConnectOptions={{
        signClient: {
          projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string
        }
      }}
      endpointOptions={{
        isLazy: true,
        endpoints: {
          akash: { rest: [], rpc: [] },
          "akash-sandbox": { rest: [], rpc: [] },
          "akash-testnet": { rest: [], rpc: [] }
        }
      }}
      signerOptions={{
        preferredSignType: chain => "direct",
        signingStargate: chain => ({
          registry: customRegistry,
          gasPrice: GasPrice.fromString("0.025uakt")
        })
      }}
    >
      {children}
    </ChainProvider>
  );
}

export function useSelectedChain() {
  const { chainRegistryName } = useSelectedNetwork();
  return useChain(chainRegistryName);
}
