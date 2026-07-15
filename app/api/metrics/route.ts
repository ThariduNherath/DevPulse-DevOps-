import { NextResponse } from "next/server";
import { tickMetrics } from "@/lib/mock-services";

export const dynamic = "force-dynamic";

export async function GET() {
  const services = tickMetrics();
  return NextResponse.json({ services, serverTime: Date.now() });
}
