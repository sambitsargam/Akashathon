"use client";
import { Fieldset } from "@src/components/shared/Fieldset";
import { useState } from "react";
import { useSelectedNetwork } from "@src/hooks/useSelectedNetwork";
import { LabelValue } from "@src/components/shared/LabelValue";
import { Button } from "@src/components/ui/button";
import { Edit } from "iconoir-react";
import { CertificateList } from "./CertificateList";
import Layout from "../layout/Layout";
import { SettingsLayout, SettingsTabs } from "./SettingsLayout";
import { SelectNetworkModal } from "./SelectNetworkModal";
import { SettingsForm } from "./SettingsForm";
import { ColorModeSelect } from "./ColorModeSelect";
import { NextSeo } from "next-seo";

type Props = {};

export const SettingsContainer: React.FunctionComponent<Props> = ({}) => {
  const [isSelectingNetwork, setIsSelectingNetwork] = useState(false);
  const selectedNetwork = useSelectedNetwork();

  const onSelectNetworkModalClose = () => {
    setIsSelectingNetwork(false);
  };

  return (
    <Layout isUsingSettings>
      <NextSeo title="Settings" />

      <SettingsLayout page={SettingsTabs.GENERAL} title="Settings">
        {isSelectingNetwork && <SelectNetworkModal onClose={onSelectNetworkModalClose} />}
        <div className="grid-col-1 mb-4 grid gap-4 md:grid-cols-2">
          <Fieldset label="Network">
            <LabelValue
              value={
                <div className="inline-flex items-center">
                  <strong>{selectedNetwork?.title}</strong>

                  <Button onClick={() => setIsSelectingNetwork(true)} size="icon" className="ml-4" variant="outline">
                    <Edit className="text-sm" />
                  </Button>
                </div>
              }
            />

            <SettingsForm />
          </Fieldset>

          <Fieldset label="General">
            <ColorModeSelect />
          </Fieldset>
        </div>

        <Fieldset label="Certificates">
          <CertificateList />
        </Fieldset>
      </SettingsLayout>
    </Layout>
  );
};
