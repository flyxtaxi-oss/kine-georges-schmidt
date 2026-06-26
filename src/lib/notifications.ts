// Pluggable notification system
// Currently implements EMAIL only. SMS/WhatsApp can be added by implementing the NotificationChannel interface.

export interface NotificationPayload {
  to: string; // email or phone number
  subject: string;
  body: string;
  html?: string;
  metadata?: Record<string, string>;
}

export interface NotificationResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// ─── Channel Interface ─────────────────────────────────────────────
export interface NotificationChannel {
  name: string;
  send(payload: NotificationPayload): Promise<NotificationResult>;
}

// ─── Email Channel ──────────────────────────────────────────────────
export class EmailChannel implements NotificationChannel {
  name = "email";

  async send(payload: NotificationPayload): Promise<NotificationResult> {
    try {
      const response = await fetch("/api/notifications/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.text();
        return { success: false, error };
      }

      const data = await response.json();
      return { success: true, messageId: data.messageId };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

// ─── SMS Channel (Stub — implement later) ───────────────────────────
export class SmsChannel implements NotificationChannel {
  name = "sms";

  async send(_payload: NotificationPayload): Promise<NotificationResult> {
    console.log("[SMS] Channel not yet implemented");
    return { success: false, error: "SMS channel not yet implemented" };
  }
}

// ─── WhatsApp Channel (Stub — implement later) ─────────────────────
export class WhatsAppChannel implements NotificationChannel {
  name = "whatsapp";

  async send(_payload: NotificationPayload): Promise<NotificationResult> {
    console.log("[WhatsApp] Channel not yet implemented");
    return { success: false, error: "WhatsApp channel not yet implemented" };
  }
}

// ─── Notification Service ───────────────────────────────────────────
export class NotificationService {
  private channels: Map<string, NotificationChannel> = new Map();

  register(channel: NotificationChannel) {
    this.channels.set(channel.name, channel);
    return this;
  }

  async send(
    channelName: string,
    payload: NotificationPayload
  ): Promise<NotificationResult> {
    const channel = this.channels.get(channelName);
    if (!channel) {
      return { success: false, error: `Channel "${channelName}" not found` };
    }
    return channel.send(payload);
  }

  async sendAll(payload: NotificationPayload): Promise<NotificationResult[]> {
    const results: NotificationResult[] = [];
    for (const channel of this.channels.values()) {
      results.push(await channel.send(payload));
    }
    return results;
  }
}

// ─── Default Service Instance ───────────────────────────────────────
export const notifications = new NotificationService().register(
  new EmailChannel()
);

// ─── Helper: Booking Confirmation Email ─────────────────────────────
export function buildBookingConfirmationEmail(data: {
  patientName: string;
  date: string;
  time: string;
  practitionerName: string;
  address: string;
}) {
  return {
    subject: `Confirmation de rendez-vous — ${data.date} à ${data.time}`,
    body: `Bonjour ${data.patientName},\n\nVotre rendez-vous avec ${data.practitionerName} est confirmé :\n\n📅 Date : ${data.date}\n🕐 Heure : ${data.time}\n📍 Adresse : ${data.address}\n\nPour annuler ou modifier votre rendez-vous, connectez-vous au portail patient.\n\nCordialement,\n${data.practitionerName}`,
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <div style="background: linear-gradient(135deg, #1B4D4D, #2A7A7A); color: white; padding: 32px; border-radius: 16px 16px 0 0;">
          <h1 style="margin: 0; font-size: 20px;">✅ Rendez-vous confirmé</h1>
        </div>
        <div style="background: white; padding: 32px; border: 1px solid #eee; border-top: none; border-radius: 0 0 16px 16px;">
          <p>Bonjour <strong>${data.patientName}</strong>,</p>
          <p>Votre rendez-vous avec <strong>${data.practitionerName}</strong> est confirmé :</p>
          <div style="background: #FAFAF7; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <p style="margin: 4px 0;">📅 <strong>Date :</strong> ${data.date}</p>
            <p style="margin: 4px 0;">🕐 <strong>Heure :</strong> ${data.time}</p>
            <p style="margin: 4px 0;">📍 <strong>Adresse :</strong> ${data.address}</p>
          </div>
          <p style="color: #6B7280; font-size: 14px;">Pour annuler ou modifier votre rendez-vous, connectez-vous au portail patient.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #9CA3AF; font-size: 12px;">
            ${data.practitionerName}<br />${data.address}
          </p>
        </div>
      </div>
    `,
  };
}

// ─── Helper: New Booking Notification for Practitioner ──────────────
export function buildNewBookingNotification(data: {
  patientName: string;
  patientEmail: string;
  date: string;
  time: string;
  reason?: string;
}) {
  return {
    subject: `Nouveau rendez-vous : ${data.patientName} — ${data.date} à ${data.time}`,
    body: `Nouveau rendez-vous :\n\n👤 Patient : ${data.patientName} (${data.patientEmail})\n📅 Date : ${data.date}\n🕐 Heure : ${data.time}${data.reason ? `\n📝 Motif : ${data.reason}` : ""}\n\nConsultez le tableau de bord pour gérer vos rendez-vous.`,
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <div style="background: linear-gradient(135deg, #C9A96E, #D4BA85); color: white; padding: 32px; border-radius: 16px 16px 0 0;">
          <h1 style="margin: 0; font-size: 20px;">📋 Nouveau rendez-vous</h1>
        </div>
        <div style="background: white; padding: 32px; border: 1px solid #eee; border-top: none; border-radius: 0 0 16px 16px;">
          <div style="background: #FAFAF7; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <p style="margin: 4px 0;">👤 <strong>Patient :</strong> ${data.patientName}</p>
            <p style="margin: 4px 0;">✉️ <strong>Email :</strong> ${data.patientEmail}</p>
            <p style="margin: 4px 0;">📅 <strong>Date :</strong> ${data.date}</p>
            <p style="margin: 4px 0;">🕐 <strong>Heure :</strong> ${data.time}</p>
            ${data.reason ? `<p style="margin: 4px 0;">📝 <strong>Motif :</strong> ${data.reason}</p>` : ""}
          </div>
        </div>
      </div>
    `,
  };
}
