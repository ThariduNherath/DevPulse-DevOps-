import { NextResponse } from "next/server";
import { getDeployments } from "@/lib/mock-services";

export const dynamic = "force-dynamic";

export async function GET() {
  const deployments = getDeployments();
  return NextResponse.json({ deployments });
}
