import {Header} from '@saas/shared/components/Header';

export default function SaasLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header></Header>
      {children}
    </>
  )
}