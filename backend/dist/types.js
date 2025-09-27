"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileMetaSchema = exports.OrderZodSchema = exports.signInInput = exports.signUpInput = void 0;
const zod_1 = require("zod");
exports.signUpInput = zod_1.z.object({
    name: zod_1.z.string().min(3, 'Name must be at least 3 characters').max(30, 'Name must be at most 30 character'),
    email: zod_1.z.email('Invalid email format'),
    password: zod_1.z.string().min(6, 'Name must be at least 6 characters'),
    confirmPassword: zod_1.z.string().min(6, 'Name must be at least 6 characters')
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Password must match',
    path: ["confirmPassword"]
});
exports.signInInput = zod_1.z.object({
    email: zod_1.z.email(),
    password: zod_1.z.string().min(6)
});
exports.OrderZodSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, 'Name must be at least 3 characters').max(30, 'Name must be at most 30 character'),
    email: zod_1.z.email(),
    contact_number: zod_1.z.string().regex(/^\d{10}$/, 'Invalid mobile number...!!!'),
    shipping_address: zod_1.z.string().max(100, 'Address must be at maximum 100 characters'),
    product_name: zod_1.z.string().min(3, 'Product name must be at least 3 characters').max(50, 'Product name must be at maximum 50 characters'),
    quantity: zod_1.z.coerce.number().min(1, 'Quantity must be at least 1').max(100, 'Quantity must be at maximum 100'),
    status: zod_1.z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).optional()
}).partial();
exports.fileMetaSchema = zod_1.z.object({
    mimetype: zod_1.z.string().refine((val) => {
        const allowed = ["image/jpeg", "image/png"];
        return allowed.includes(val);
    }, "Unsupported file type"),
    size: zod_1.z.number().max(2 * 1024 * 1024, "File must be under 2MB")
}).partial();
