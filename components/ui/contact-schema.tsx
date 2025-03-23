"use client";

import { FC } from "react";
import type { ContactPage, WithContext } from "schema-dts";
import config from "@/config";

interface ContactSchemaProps {
  companyName?: string;
  email?: string;
  phone?: string;
  address?: string;
  url?: string;
}

export const ContactSchema: FC<ContactSchemaProps> = ({
  companyName = config.contact?.contactInfo?.companyName || config.title,
  email = config.contact?.contactInfo?.email || "contact@example.com",
  phone = config.contact?.contactInfo?.phone || "+1-555-123-4567",
  address = config.contact?.contactInfo?.address ||
    "123 Main St, Anytown, AN 12345",
  url = `${config.url}/contact` || "https://example.com/contact",
}) => {
  // Create type-safe schema using schema-dts
  const contactSchema: WithContext<ContactPage> = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `Contact ${companyName}`,
    description:
      "Get in touch with our team for any questions or support needs.",
    mainEntity: {
      "@type": "Organization",
      name: companyName,
      email: email,
      telephone: phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: address,
      },
      url: config.url,
    },
    url: url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
    />
  );
};
