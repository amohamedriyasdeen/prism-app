import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET() {
  const users = await prisma.user.findMany();
  return json(users);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, phone, password } = body;

  if (!name || !email || !password)
    return json({ error: "name, email and password are required" }, 400);

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) return json({ error: "Email already exists" }, 409);

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, phone, password: hashedPassword },
  });
  return json(user, 201);
}