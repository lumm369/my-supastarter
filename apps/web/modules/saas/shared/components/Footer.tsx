import { Link } from "@i18n";
import { appConfig } from "@/config";

export function Footer() {
  return (
    <footer className="container py-4 text-center text-sm text-muted-foreground">
      <span>
        © {new Date().getFullYear()} {appConfig.copyRight.llc.toLocaleLowerCase()}. All rights reserved.
      </span>
      <span className="opacity-50"> | </span>
      <Link href="/legal/privacy-policy">Privacy policy</Link>
      <span className="opacity-50"> | </span>
      <Link href="/legal/terms">Terms and conditions</Link>
    </footer>
  );
}
