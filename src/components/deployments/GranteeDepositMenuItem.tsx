"use client";
import React, { ReactNode } from "react";
import { Address } from "../shared/Address";
import { FormattedDate } from "react-intl";
import { coinToUDenom } from "@src/utils/priceUtils";
import { GrantType } from "@src/types/grant";
import { AKTAmount } from "../shared/AKTAmount";
import { useDenomData } from "@src/hooks/useWalletBalance";

type Props = {
  grant: GrantType;
  children?: ReactNode;
};

export const GranteeDepositMenuItem: React.FunctionComponent<Props> = ({ grant }) => {
  const denomData = useDenomData(grant.authorization.spend_limit.denom);

  return (
    <div className="text-xs">
      <Address address={grant.granter} disableTooltip />
      &nbsp;<small className="text-muted-foreground">|</small>&nbsp;
      <AKTAmount uakt={coinToUDenom(grant.authorization.spend_limit)} />
      &nbsp;
      {denomData?.label}
      &nbsp;
      <small className="text-muted-foreground">
        (Exp:&nbsp;
        <FormattedDate value={new Date(grant.expiration)} />)
      </small>
    </div>
  );
};
