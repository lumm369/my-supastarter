import {useTranslations} from 'next-intl';

export default function Landing() {
  const t = useTranslations('landing');
  return(
    <>
      <div className='container max-w-6xl pt-32 pb-16'>landing page</div>
    </>
  )
}