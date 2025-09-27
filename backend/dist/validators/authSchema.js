"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInInput = exports.signUpInput = void 0;
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
