import prisma  from "@/lib/prisma";
import { NextRequest } from "next/server";
export async function GET() {
  const users = await prisma.user.findMany();
    return new Response(JSON.stringify(users));
}