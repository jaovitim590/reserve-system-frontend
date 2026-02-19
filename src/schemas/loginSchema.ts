import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("E-mail inválido"),
  password: z.string("senha invalida").min(5, "Senha deve ter no mínimo 6 caracteres"),
});

export type LoginForm = z.infer<typeof loginSchema>;