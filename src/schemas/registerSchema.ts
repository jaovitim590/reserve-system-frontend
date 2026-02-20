import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Obrigatório"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Mínimo de 6 caracteres"),
  passwordConfirmation: z.string()
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "As senhas não coincidem",
  path: ["passwordConfirmation"],
})

export type RegisterForm = z.infer<typeof registerSchema>