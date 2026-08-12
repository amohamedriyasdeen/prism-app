import bcrypt from "bcrypt";
import prisma  from "@/lib/prisma";
import { NextRequest } from "next/server";
export async function GET() {
  const users = await prisma.user.findMany();
    return new Response(JSON.stringify(users));
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, phone, password } = body;
  
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  
  if (existingUser) {
    return new Response("Email already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone,
      password:hashedPassword,
    },
  });
  return new Response(JSON.stringify(user));
}