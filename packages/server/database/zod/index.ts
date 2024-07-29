import { z } from "zod"

export const SignUpSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long." }),
  confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters long."})
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
})

export type SignUp = z.infer<typeof SignUpSchema>


export const SignInSchema = z.object({
  email: z.string().email({ message: "Invalid email address."}),
  password: z.string().min(8, { message: "Password must be at least 8 characters long." })
})

export type SignIn = z.infer<typeof SignInSchema>