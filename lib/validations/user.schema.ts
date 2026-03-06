import { z } from 'zod'

// ── Create User ──
export const CreateUserSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be at most 100 characters'),
    email: z.string().email('Valid email is required'),
    role: z.enum(['ADMIN', 'TEACHER', 'STUDENT'], { message: 'Role is required' }),
})

// ── Update User ──
export const UpdateUserSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    email: z.string().email().optional(),
    role: z.enum(['ADMIN', 'TEACHER', 'STUDENT']).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
}).refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
})

// ── User Query (GET list) ──
export const UserQuerySchema = z.object({
    search: z.string().optional(),
    role: z.enum(['ADMIN', 'TEACHER', 'STUDENT']).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
})

// ── Type Exports ──
export type CreateUserInput = z.infer<typeof CreateUserSchema>
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>
export type UserQueryInput = z.infer<typeof UserQuerySchema>
