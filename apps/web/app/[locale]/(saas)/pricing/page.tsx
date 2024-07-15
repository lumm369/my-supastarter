import {useTranslations} from 'next-intl';

export default function Pricing() {
  const t = useTranslations('pricing');
  return(
    <>
      <div className='container max-w-6xl pt-32 pb-16'>
        <div>Pricing Page</div>
        <div>{t("title")}</div>
      </div>
    </>
  )
}