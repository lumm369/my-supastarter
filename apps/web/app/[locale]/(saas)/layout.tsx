import {Header} from '@saas/shared/components/Header';
import { PropsWithChildren } from 'react';

export default function SaasLayout({
  children,
}: PropsWithChildren) {
  return (
    <>
      <Header></Header>
      <main className="min-h-screen">{children}</main>
    </>
  )
}