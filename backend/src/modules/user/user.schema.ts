import { z } from 'zod';

//This file validates User Schemas with Zod
export const PasswordSchema = z
  .string()
  .trim()
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(30, { message: "Password must be less than 30 characters" })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: "Password must contain at least one lowercase letter, one uppercase letter, and one number"
  });

  export const EmailSchema = z
 .string()
    .trim()
    .min(1, {message: "Email is required"})
    .email({ message: "Please enter a valid email address." });

// Zod data validation for creating a user
export const CreateUserSchema = z.object({
  email: EmailSchema,
  name: z
    .string()
    .trim()
    .min(3, {message: "Name must be at least three characters long"})
    .max(50, {message: "Name must be less than 50 characters"}),
  password: PasswordSchema
});

// Zod Validation for updating a user
export const UpdateUserInputSchema = z.object({
  email: EmailSchema.optional(),
  name: z
    .string()
    .trim()
    .min(3, {message: "Name must be at least three characters long"})
    .max(50, {message: "Name must be less than 50 characters"})
    .optional(),
  password:PasswordSchema.optional()
}).refine(data => data.email !== undefined || data.name !== undefined || data.password !== undefined, {
  message: "At least one field (email, name, or password) must be provided for update",
});

//LoginSchema
export const LoginSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema
});


// Validation for user ID
export const UserIdSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'ID must contain only numbers')
    .transform(val => parseInt(val, 10))
    .refine(val => val > 0, 'ID must be positive'),
});

// Inferred TypeScript type for use in services, controllers, etc.
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserInputSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type UserIdInput = z.infer<typeof UserIdSchema>;

