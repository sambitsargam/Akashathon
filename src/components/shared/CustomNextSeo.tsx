import { NextSeo } from "next-seo";
import { OpenGraphMedia } from "next-seo/lib/types";
import React from "react";

type Props = {
  title: string;
  description?: string;
  url: string;
  images?: OpenGraphMedia[];
};

export const CustomNextSeo: React.FunctionComponent<Props> = ({ title, description = "", url, images }) => {
  return (
    <NextSeo
      title={title}
      description={description}
      canonical={url}
      openGraph={{
        url,
        title,
        description,
        images
      }}
    />
  );
};
