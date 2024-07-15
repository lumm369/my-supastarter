export const appConfig = {
  i18n: {
    locales: ["en", "de", "es"] as const,
    defaultLocale: "en" as const,
    localeLabels: {
      en: "English",
      es: "Español",
      de: "Deutsch",
      fr: "asdf",
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
  }
};
