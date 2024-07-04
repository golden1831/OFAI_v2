import { z } from "zod";

export const LoginSchema = z.object({
   email: z.string()
      .refine((value) => value.trim() !== '', {
         message: 'Please enter your email.',
      })
      .refine((value) => /^(?!\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value), {
         message: 'Please provide a valid email address.',
      }),

   password: z.string().refine((value) => value.trim() !== '', {
      message: 'Please enter your password.',
   }).refine((value) => value.length >= 10, {
      message: 'Password must be at least 10 characters.',
   }),
});


export const RegisterSchema = z.object({
   email: z.string()
      .refine((value) => value.trim() !== '', {
         message: 'Please enter your email.',
      })
      .refine((value) => /^(?!\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value), {
         message: 'Please provide a valid email address.',
      }),

   password: z.string().refine((value) => value.trim() !== '', {
      message: 'Please enter your password.',
   }).refine((value) => value.length >= 10, {
      message: 'Password must be at least 10 characters.',
   }),
});

export const InfoSchema = z.object({
   firstName: z.string().refine((value) => value.trim() !== '', {
      message: 'Please enter your first name.',
   }),

   lastName: z.string().refine((value) => value.trim() !== '', {
      message: 'Please enter your last name.',
   }),
});