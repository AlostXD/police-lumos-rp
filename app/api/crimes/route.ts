import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const crimes = await prisma.crime.findMany();
  return NextResponse.json(crimes);
}