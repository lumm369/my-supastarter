"use client"

import { cn } from "@/modules/ui/lib";
import { Link, usePathname } from "@i18n";
import { Logo } from "@shared/components/Logo";
import { ColorModeToggle } from "@shared/components/ColorModeToggle";
import { LocaleSwitch } from "@shared/components/LocaleSwitch";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react"
import { useDebounceCallback } from "usehooks-ts"
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@ui/components/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@ui/components/button";
import { MenuIcon } from "lucide-react";



const Header = () => {
  const t = useTranslations();
  // const { user } = useUser(); // 授权登录的时候实现
  const user = null;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [isTop, setIsTop] = useState(true);
  
  const debouncedScrollHandler = useDebounceCallback(
    () => {
      setIsTop(window.scrollY <= 10)
    },
    150,
    {
      maxWait: 150
    }
  )
  
  useEffect(() => {
    window.addEventListener("scroll", debouncedScrollHandler);
    debouncedScrollHandler();
    return () => {
      window.removeEventListener("scroll", debouncedScrollHandler);
    };
  }, [debouncedScrollHandler]);

  // 切换页面时，关闭 Sheet
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const menuItems: {
    label: string;
    href: string;
  }[] = [
    {
      label: t("common.menu.pricing"),
      href: "/pricing",
    },
    {
      label: t("common.menu.blog"),
      href: "/blog",
    },
    {
      label: t("common.menu.faq"),
      href: "/faq",
    },
  ];

  const isMenuItemActive = (href: string) => pathname.startsWith(href);

  return (
    <header>
      <nav
        className={`fixed left-0 top-0 z-50 w-full ${isTop ? "shadow-none" : "bg-card/80 shadow-sm backdrop-blur-lg"} transition-shadow duration-200`}
        data-test="navigation"
      >
        <div className="container">
          <div
            className={`flex items-center justify-stretch gap-6 ${isTop ? "py-8" : "py-4"} transition-[padding] duration-200`}
          >
            <div className="flex flex-1 justify-start">
              <Link
                href="/"
                className="block hover:no-underline active:no-underline"
              >
                <Logo />
              </Link>
            </div>
            <div className="hidden flex-1 items-center justify-center md:flex">
              {menuItems.map((menuItem) => (
                <Link
                  key={menuItem.href}
                  href={menuItem.href}
                  className={cn(
                    "block px-3 py-2 text-sm font-medium text-foreground/80",
                    isMenuItemActive(menuItem.href)
                      ? "font-bold text-foreground/100"
                      : "",
                  )}
                >
                  {menuItem.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-1 items-center justify-end gap-3">
              <ColorModeToggle />
              <LocaleSwitch />

              <Sheet
                open={mobileMenuOpen}
                onOpenChange={(open) => setMobileMenuOpen(open)}
              >
                <SheetTrigger asChild>
                  <Button
                    className="md:hidden"
                    size="icon"
                    variant="outline"
                    aria-label="Menu"
                  >
                    <MenuIcon className="size-4" />
                  </Button>
                </SheetTrigger>
                <VisuallyHidden asChild><SheetTitle>Menu</SheetTitle></VisuallyHidden>
                <VisuallyHidden><SheetDescription>description</SheetDescription></VisuallyHidden>
                <SheetContent className="w-[250px]" side="right">
                  <div className="flex flex-col items-start justify-center">
                    {menuItems.map((menuItem) => (
                      <Link
                        key={menuItem.href}
                        href={menuItem.href}
                        className={cn(
                          "block px-3 py-2 text-base font-medium text-foreground/80",
                          isMenuItemActive(menuItem.href)
                            ? "font-bold text-foreground/100"
                            : ""
                        )}
                      >
                        {menuItem.label}
                      </Link>
                    ))}
                    <Link
                      key={user ? "dashboard" : "login"}
                      href={user ? "/dashboard" : "/auth/login"}
                      className="block px-3 py-2 text-base"
                      prefetch={!user}
                    >
                      {user ? t("common.menu.dashboard") : t("common.menu.login")}
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>

              {user ? (
                <Button
                  key="dashboard"
                  className="hidden md:flex"
                  asChild
                  variant="secondary"
                >
                  <Link href="/dashboard">{t("common.menu.dashboard")}</Link>
                </Button>
              ) : (
                <Button
                  key="login"
                  className="hidden md:flex"
                  asChild
                  variant="secondary"
                >
                  <Link href="/auth/signup">{t("common.menu.login")}</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export { Header }