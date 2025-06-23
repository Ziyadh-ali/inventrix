import { z } from "zod"

export const CreateUserSchema = z.object({
    email: z.string().email("Inavlid email address"),
    password: z.string().min(6, "Password must be atleast 6 character"),
});

export const CustomerValidation = z.object({
    name: z.string().min(3, "Name should atleast 3 character or more"),
    address: z.string(),
    mobile: z.number().min(10, "Mobile number should be min 10 digit"),
});

export const ItemValidation = z.object({
    name: z.string().min(3, "Name should atleast 3 character or more"),
    description: z.string().min(5, "Description should atleast 5 character or more"),
    quantity: z.number().min(0, "Quantity should be positive"),
    price: z.number().min(0, "Price should be positive"),
});


export const SaleValidation = z.object({
  date: z.coerce.date({
    required_error: "Date is required",
  }),

  customerName: z
    .string({
      required_error: "Customer name is required",
    })
    .min(2, "Customer name should be at least 2 characters"),

  items: z
    .array(
      z.object({
        name: z.string().min(1, "Item name is required"),
        quantity: z
          .number({
            required_error: "Quantity is required",
            invalid_type_error: "Quantity must be a number",
          })
          .min(1, "Quantity must be at least 1"),
        price: z
          .number({
            required_error: "Price is required",
            invalid_type_error: "Price must be a number",
          })
          .min(1, "Price must be at least 1"),
      })
    )
    .min(1, "At least one item must be selected"),
});