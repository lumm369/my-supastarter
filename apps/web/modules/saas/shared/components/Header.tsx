"use client"

import { cn } from "@/modules/ui/lib";
import { Link, usePathname } from "@i18n";
import { Logo } from "@shared/components/Logo";
import { ColorModeToggle } from "@shared/components/ColorModeToggle";
import { LocaleSwitch } from "@shared/components/LocaleSwitch";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react"
import { useDebounceCallback } from "usehooks-ts"


const Header = () => {
  const t = useTranslations();
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
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export { Header }
