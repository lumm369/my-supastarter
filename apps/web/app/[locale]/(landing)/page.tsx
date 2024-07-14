import { Button } from "@ui/components/button"
import {useTranslations} from 'next-intl';

export default function Landing() {
  const t = useTranslations('Landing');
  return(
    <>
      <div>landing page</div>
      <Button>Click Me</Button>
      <div>{t("title")}</div>
    </>
  )
}