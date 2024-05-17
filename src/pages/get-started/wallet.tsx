import React from "react";
import Layout from "@src/components/layout/Layout";
import { useRouter } from "next/router";
import { UrlService, domainName } from "@src/utils/urlUtils";
import { NoWalletSection } from "@src/components/get-started/NoWalletSection";
import Link from "next/link";
import { NoKeplrSection } from "@src/components/get-started/NoKeplrSection";
import { WithKeplrSection } from "@src/components/get-started/WithKeplrSection";
import { CustomNextSeo } from "@src/components/shared/CustomNextSeo";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@src/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@src/components/ui/card";

enum GetWalletSection {
  NoWallet = "no-wallet",
  NoKeplr = "no-keplr",
  HasKeplr = "has-keplr",
  CreateWallet = "create-wallet"
}

type Props = {};

const GetStartedWallet: React.FunctionComponent<Props> = ({}) => {
  const router = useRouter();
  // Fallback to null if the section is not valid
  const currentSection = Object.values(GetWalletSection).includes(router.query.section as GetWalletSection) ? router.query.section : null;

  const sections = [
    {
      title: "I don't have any cryptocurrencies",
      description: "No worries, we'll guide you through the process of getting your hands on some crypto to be able to deploy.",
      id: GetWalletSection.NoWallet
    },
    {
      title: "I have cryptocurrencies, but not on Keplr wallet",
      description: "Great! We'll guide you through the process of installing the Keplr wallet browser extension and swapping your way to the cosmos ecosystem.",
      id: GetWalletSection.NoKeplr
    },
    {
      title: "I have a Keplr wallet",
      description: "If you're already familiar with the cosmos ecosystem and already have a Keplr wallet, it will be super easy to acquire some AKT!",
      id: GetWalletSection.HasKeplr
    }
  ];

  return (
    <Layout>
      <CustomNextSeo
        title="Setup wallet"
        url={`${domainName}${UrlService.getStartedWallet()}`}
        description="Follow the steps to install Keplr and get tokens!"
      />

      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={UrlService.getStarted()}>Get Started</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Setup Wallet</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle>Installing Keplr and getting AKT</CardTitle>
        </CardHeader>
        <CardContent className="mt-4 space-y-4">
          {!currentSection &&
            sections.map((section, index) => (
              <Link className="block px-4 py-2 hover:bg-muted hover:no-underline" key={index} href={UrlService.getStartedWallet(section.id)}>
                <p className="font-bold text-secondary-foreground">{section.title}</p>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </Link>
            ))}

          {currentSection === GetWalletSection.NoWallet && <NoWalletSection />}
          {currentSection === GetWalletSection.NoKeplr && <NoKeplrSection />}
          {currentSection === GetWalletSection.HasKeplr && <WithKeplrSection />}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default GetStartedWallet;
