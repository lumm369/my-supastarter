import { Link } from "@/modules/i18n"
import { Button } from "@/modules/ui/components/button"
import { ArrowRightIcon } from "lucide-react"

const Hero = () => {
  return (
    <div className="containter pb-20 pt-44 text-center">
      <div className="mb-4 flex justify-center">
        <div className="mx-auto flex flex-wrap items-center justify-center rounded-full border border-highlight p-px px-4 py-1 text-sm font-normal text-highlight">
          <span className="flex items-center gap-2 rounded-full font-black text-highlight">
            <span className="size-2 rounded-full bg-highlight"></span>
            New:
          </span>
          <span className="ml-1 block font-medium">
            Amazing feature of you Saas
          </span>
        </div>
      </div>

      <h1 className="mx-auto max-w-3l text-balance text-5xl font-bold lg:text-7xl">
        Your revolutionary Next.js Saas
      </h1>

      <p className="mx-auto mt-4 max-w-lg text-balance text-lg text-foreground/60">
        This is a demo application built with supastarter. It will save you a lot of time and effort  building your next SaaS.
      </p>

      <div className="mt-6 flex flex-col items-center justify-center gap-3 md:flex-row">
        <Button size="lg" asChild>
          <Link href="/auth/login">
            Get started
            <ArrowRightIcon className="ml-2 size-4" />
          </Link>
        </Button>
        <Button variant="outline" size="lg">
          <Link href="/docs">Documentation</Link>
        </Button>
      </div>
    </div>
  )
}

export { Hero}