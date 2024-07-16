import { Logo } from "@shared/components/Logo";
import { appConfig } from "@/config";
import { Link } from "@i18n";

const Footer = () => {
  return (
    <footer className="bg-card py-12 text-card-foreground">
      <div className="container grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div>
          <Logo className="opacity-70 grayscale" />
          <p className="mt-3 text-sm opacity-70">
            © {new Date().getFullYear()} {appConfig.copyRight.llc.toLocaleLowerCase()}.<br />All rights reserved.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Link href="/blog" className="block">
            Blog
          </Link>

          <a href="#features" className="block">
            Feature
          </a>

          <Link href="/pricing" className="block">
            Pricing
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          <Link href="/legal/privacy-policy" className="block">
            Privacy policy
          </Link>

          <Link href="/legal/terms" className="block">
            Terms and conditions
          </Link>
        </div>
      </div>
    </footer>
  )
} 

export { Footer }