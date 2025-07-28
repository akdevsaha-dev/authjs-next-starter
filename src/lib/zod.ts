import { z } from "zod"
export const authSchema = z.object({
    email: z.email(),
    password: z.string().min(6, "Password must be atleast 6 characters.").max(32, "Password must not exceed 32 characters")
})

