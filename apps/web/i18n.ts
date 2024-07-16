import { appConfig } from "@config";
import deepmerge from "deepmerge";
import type { AbstractIntlMessages } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

export const importLocale = async (
  locale: string,
): Promise<AbstractIntlMessages> => {
  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (await import(`./locales/${locale}.json`)).default as AbstractIntlMessages
  );
};

export const getMessagesForLocale = async (
  locale: string,
): Promise<AbstractIntlMessages> => {
  const localeMessages = await importLocale(locale);
  if (locale === appConfig.i18n.defaultLocale) {
    return localeMessages;
  }
  const defaultLocaleMessages = await importLocale(
    appConfig.i18n.defaultLocale,
  );
  return deepmerge(defaultLocaleMessages, localeMessages);
};

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (
    !appConfig.i18n.locales.includes(
      locale as (typeof appConfig.i18n.locales)[number],
    )
  ) {
    notFound();
  }

  return {
    messages: await getMessagesForLocale(locale),
  };
});
