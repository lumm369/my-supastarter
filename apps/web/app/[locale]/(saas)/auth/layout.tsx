import { Logo } from '@/modules/shared/components/Logo';
import { Link } from '@/modules/i18n';
import { LocaleSwitch } from '@/modules/shared/components/LocaleSwitch';
import { ColorModeToggle } from '@/modules/shared/components/ColorModeToggle';
import { Footer } from '@/modules/saas/shared/components/Footer';
import { PropsWithChildren } from 'react';

export default function SaasLayout({
  children,
}: PropsWithChildren) {
  return (
    <div className="flex min-h-screen w-full p-8">
      <div className="flex w-full flex-col items-center justify-between gap-8">
        <div className="container">
          <div className="flex items-center justify-between">
            <Link href="/" className="block">
              <Logo />
            </Link>

            <div className="flex items-center justify-end gap-2">
              <LocaleSwitch />
              <ColorModeToggle />
            </div>
          </div>
        </div>

        <main className="w-full max-w-md">{children}</main>

        <Footer />
      </div>
    </div>
  )
}