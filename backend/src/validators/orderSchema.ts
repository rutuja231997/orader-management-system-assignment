import {z} from 'zod';

export const OrderSchema = z.object({
    name:z.string().min(3, 'Name must be at least 3 characters').max(30, 'Name must be at most 30 character'),
    email:z.email(),
    contact_number: z.string().regex(/^\d{10}$/, 'Invalid mobile number...!!!'),
    shipping_address: z.string().max(100, 'Address must be at maximum 100 characters'),
    product_name:z.string().min(3, 'Product name must be at least 3 characters').max(50, 'Product name must be at maximum 50 characters'),
    quantity:z.coerce.number().min(1, 'Quantity must be at least 1').max(100, 'Quantity must be at maximum 100'),
    status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).optional()
}).partial()

export const fileMetaSchema = z.object({
    mimetype: z.string().refine((val)=>{
        const allowed = ["image/jpeg", "image/png"]
        return allowed.includes(val);
    }, "Unsupported file type"),
    size: z.number().max(2 * 1024 * 1024, "File must be under 2MB")
}).partial();