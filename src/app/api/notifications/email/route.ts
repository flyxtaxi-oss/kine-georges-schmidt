import { NextRequest, NextResponse } from "next/server";

// Email notification API route
// Currently a stub — configure with Resend, SendGrid, or Mailgun

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, body: textBody, html } = body;

    if (!to || !subject) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject" },
        { status: 400 }
      );
    }

    const provider = process.env.EMAIL_PROVIDER || "resend";
    const apiKey = process.env.EMAIL_API_KEY;
    const from = process.env.EMAIL_FROM || "noreply@example.com";

    if (!apiKey) {
      console.log("[Email] No API key configured. Email would be sent to:", to);
      console.log("[Email] Subject:", subject);
      console.log("[Email] Body:", textBody);
      return NextResponse.json({
        success: true,
        messageId: "stub-" + Date.now(),
        note: "Email provider not configured — logged to console",
      });
    }

    // ─── Resend ─────────────────────────────────────────────
    if (provider === "resend") {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from,
          to,
          subject,
          text: textBody,
          html,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        return NextResponse.json({ error }, { status: 500 });
      }

      const data = await response.json();
      return NextResponse.json({ success: true, messageId: data.id });
    }

    // ─── SendGrid ───────────────────────────────────────────
    if (provider === "sendgrid") {
      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: from },
          subject,
          content: [
            { type: "text/plain", value: textBody },
            ...(html ? [{ type: "text/html", value: html }] : []),
          ],
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        return NextResponse.json({ error }, { status: 500 });
      }

      return NextResponse.json({ success: true, messageId: response.headers.get("x-message-id") });
    }

    return NextResponse.json(
      { error: `Unsupported email provider: ${provider}` },
      { status: 400 }
    );
  } catch (error) {
    console.error("[Email API Error]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
