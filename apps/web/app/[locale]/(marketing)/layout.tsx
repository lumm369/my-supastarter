import { Header } from '@/modules/marketing/shared/components/Header';
import { Footer } from '@/modules/marketing/shared/components/Footer';
import { PropsWithChildren } from 'react';

export default function SaasLayout({
  children,
}: PropsWithChildren) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}