export const appConfig = {
  i18n: {
    locales: ["en", "de", "es"] as const,
    defaultLocale: "en" as const,
    localeLabels: {
      en: "English",
      es: "Español",
      de: "Deutsch",
    },
    localeCurrencies: {
      en: "USD",
      de: "USD",
      es: "USD",
    },
  },
  marketing: {
    menu: [
      {
        translationKey: "pricing",
        href: "/pricing",
      },
      {
        translationKey: "blog",
        href: "/Blog",
      },
    ],
  },
  copyRight: {
    llc: "WEBWISE SOLUTIONS LLC"
  }
};
