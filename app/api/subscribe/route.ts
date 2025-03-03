import { NextResponse } from "next/server";
import { emailProvider } from "@/lib/email";

// Prevent caching
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // Get and validate form data
    const { name, email } = await request.json();

    // Validate email format with a more comprehensive check
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Valid email address is required" },
        { status: 400 }
      );
    }

    // Validate name is provided and not empty
    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Get client IP with fallback for development
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      (process.env.NODE_ENV === "development" ? "203.0.113.1" : "unknown");

    // Subscribe the user
    await emailProvider.subscribe({
      email,
      name,
      ip: clientIp,
      metadata: {
        source: "website-form",
        userAgent: request.headers.get("user-agent"),
        referer: request.headers.get("referer"),
        origin: request.headers.get("origin"),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
