"use client";
import React from "react";
import { roundDecimal } from "@src/utils/mathHelpers";
import { useMarketData } from "@src/queries";
import { uAktDenom } from "@src/utils/constants";
import { useUsdcDenom } from "@src/hooks/useDenom";

type ContextType = {
  isLoaded: boolean;
  isLoading: boolean;
  price: number | undefined;
  uaktToUSD: (amount: number) => number | null;
  aktToUSD: (amount: number) => number | null;
  getPriceForDenom: (denom: string) => number;
};

const PricingProviderContext = React.createContext<ContextType>({} as ContextType);

export const PricingProvider = ({ children }) => {
  const { data: marketData, isLoading } = useMarketData({ refetchInterval: 60_000 });
  const usdcIbcDenom = useUsdcDenom();

  function uaktToUSD(amount: number) {
    if (!marketData) return null;
    return roundDecimal((amount * marketData.price) / 1_000_000, 2);
  }

  function aktToUSD(amount: number) {
    if (!marketData) return null;
    return roundDecimal(amount * marketData.price, 2);
  }

  const getPriceForDenom = (denom: string) => {
    switch (denom) {
      case uAktDenom:
        return marketData?.price || 0;
      case usdcIbcDenom:
        return 1; // TODO Get price from API

      default:
        return 0;
    }
  };

  return (
    <PricingProviderContext.Provider value={{ isLoaded: !!marketData, uaktToUSD, aktToUSD, price: marketData?.price, isLoading, getPriceForDenom }}>
      {children}
    </PricingProviderContext.Provider>
  );
};

// Hook
export function usePricing() {
  return { ...React.useContext(PricingProviderContext) };
}
