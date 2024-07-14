import {useTranslations} from 'next-intl';

export default function Pricing() {
  const t = useTranslations('Pricing');
  return(
    <>
      <div>Pricing Page</div>
      <div>{t("title")}</div>
    </>
  )
}