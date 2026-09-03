"use server";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  console.log("Login action called with:", { email, password });

  try {
    // TODO: Implement actual login logic here
    // For now, just simulate a successful login
    return { email, password };
  } catch (error: any) {
    console.log("Unauthorized", error);
    throw new Error("Unauthorized");
  }
}
