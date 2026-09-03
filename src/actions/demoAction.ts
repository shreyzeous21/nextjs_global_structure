"use server";

export async function getData() {
  try {
    const data = {
      name: "John Doe",
      age: 30,
    };
    return data;
  } catch (error: any) {
    console.log(error);
  }
}
