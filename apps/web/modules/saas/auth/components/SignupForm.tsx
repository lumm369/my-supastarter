"use client";

import { useTranslations } from "next-intl";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/modules/ui/components/form";
import { Input } from "@/modules/ui/components/input";
import { Button } from "@/modules/ui/components/button";
import { Alert, AlertDescription, AlertTitle } from "@/modules/ui/components/alert";
import { AlertTriangleIcon, ArrowRightIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { Link } from "@i18n"
import { SocialSigninButton, oAuthProviders } from "./SocialSigninButton";

export const SignupForm = async () => {
  const t = useTranslations()
  return (
    <div>
      <h1 className="text-3xl font-bold md:text-4xl">
        {t("auth.signup.title")}
      </h1>
      <p className="mb-6 mt-2 text-muted-foreground">
        {t("auth.signup.message")}
      </p>

      <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2">
        {Object.keys(oAuthProviders).map((providerId) => (
          <SocialSigninButton key={providerId} provider={providerId} />
        ))}
      </div>

      <hr className=" my-8" />

      {/* <Form {...form}>
        <form
          className="flex flex-col items-stretch gap-8"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {form.formState.isSubmitted && serverError && (
            <Alert variant="error">
              <AlertTriangleIcon className="size-4" />
              <AlertTitle>{serverError.title}</AlertTitle>
              <AlertDescription>{serverError.message}</AlertDescription>
            </Alert>
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("auth.signup.email")}</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="email" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("auth.signup.password")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      className="pr-10"
                      {...field}
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-xl text-primary"
                    >
                      {showPassword ? (
                        <EyeOffIcon className="size-4" />
                      ) : (
                        <EyeIcon className="size-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormDescription>
                  {t("auth.signup.passwordHint")}
                </FormDescription>
              </FormItem>
            )}
          />

          <Button loading={form.formState.isSubmitting}>
            {t("auth.signup.submit")}
          </Button>

          <div>
            <span className="text-muted-foreground">
              {t("auth.signup.alreadyHaveAccount")}{" "}
            </span>
            <Link
              href={`/auth/login${
                invitationCode
                  ? `?invitationCode=${invitationCode}&email=${email}`
                  : ""
              }`}
            >
              {t("auth.signup.signIn")}
              <ArrowRightIcon className="ml-1 inline size-4 align-middle" />
            </Link>
          </div>
        </form>
      </Form> */}
    </div>
  )
}