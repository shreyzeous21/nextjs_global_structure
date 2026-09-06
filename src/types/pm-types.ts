import { z } from "zod";

export const categoryInputSchema = z.object({
  utype: z
    .array(z.enum(["SA", "A", "V"]))
    .min(1, "At least one user type is required!"),

  cat_name: z
    .string()
    .trim()
    .min(1, "Category name is required!")
    .max(10, "Category name is too long!"),

  cat_status: z.enum(["Y", "N"]),
});

export const categoryIdSchema = z
  .number()
  .int()
  .positive("Invalid category ID");

export type CategoryInput = z.infer<typeof categoryInputSchema>;

export type Category = {
  id: number;
  utype: string; // DB: "SA,A,V"
  cat_name: string;
  cat_status: "Y" | "N";
};
