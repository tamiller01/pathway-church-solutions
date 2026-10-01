import { NextResponse } from "next/server";

import { getDemoClientAddress, resetDemoRequests } from "@/lib/demoRateLimit";

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const address = getDemoClientAddress(request.headers);
  const requestsCleared = resetDemoRequests(address);
  return NextResponse.json({ reset: true, requestsCleared });
}
