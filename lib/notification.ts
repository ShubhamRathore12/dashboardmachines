import nodemailer from "nodemailer";

// Types for notification system
export type NotificationType =
  | "ACCOUNT_CREATED"
  | "PASSWORD_RESET"
  | "EMAIL_VERIFICATION"
  | "WELCOME"
  | "ORDER_CONFIRMATION"
  | "PAYMENT_RECEIVED"
  | "CUSTOM";

export interface NotificationOptions {
  type: NotificationType;
  recipient: string;
  data: Record<string, any>;
  customSubject?: string;
  customTemplate?: string;
}

// Email templates based on notification type
const EMAIL_TEMPLATES: Record<
  NotificationType,
  { subject: string; template: (data: any) => string }
> = {
  ACCOUNT_CREATED: {
    subject: "Welcome to Our Platform - Account Created",
    template: (data) => `
      <h1>Welcome, ${data.name}!</h1>
      <p>Your account has been successfully created.</p>
      <p>Here are your login details:</p>
      <ul>
        <li><strong>Email:</strong> ${data.email}</li>
        <li><strong>Password:</strong> ${data.password}</li>
      </ul>
      <p>We recommend changing your password after your first login.</p>
      <p>Thank you for joining us!</p>
    `,
  },
  PASSWORD_RESET: {
    subject: "Password Reset Request",
    template: (data) => `
      <h1>Password Reset</h1>
      <p>We received a request to reset your password.</p>
      <p>Click the link below to set a new password:</p>
      <a href="${data.resetLink}">Reset Password</a>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  },
  EMAIL_VERIFICATION: {
    subject: "Verify Your Email Address",
    template: (data) => `
      <h1>Email Verification</h1>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${data.verificationLink}">Verify Email</a>
    `,
  },
  WELCOME: {
    subject: "Welcome to Our Platform",
    template: (data) => `
      <h1>Welcome to Our Platform, ${data.name}!</h1>
      <p>Thank you for joining us. We're excited to have you on board!</p>
    `,
  },
  ORDER_CONFIRMATION: {
    subject: "Order Confirmation",
    template: (data) => `
      <h1>Order Confirmation</h1>
      <p>Thank you for your order #${data.orderId}.</p>
      <p>Your order has been confirmed and is being processed.</p>
    `,
  },
  PAYMENT_RECEIVED: {
    subject: "Payment Received",
    template: (data) => `
      <h1>Payment Received</h1>
      <p>We've received your payment of ${data.amount} for ${data.service}.</p>
      <p>Thank you for your business!</p>
    `,
  },
  CUSTOM: {
    subject: "Notification",
    template: (data) => data.content || "No content provided.",
  },
};

export async function sendNotification(
  options: NotificationOptions
): Promise<boolean> {
  try {
    const { type, recipient, data, customSubject, customTemplate } = options;

    // Get email template and subject
    const template = EMAIL_TEMPLATES[type] || EMAIL_TEMPLATES.CUSTOM;
    const subject = customSubject || template.subject;
    const htmlContent = customTemplate || template.template(data);

    // Configure email transporter (update with your email service)
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.example.com",
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER || "your-email@example.com",
        pass: process.env.EMAIL_PASSWORD || "your-password",
      },
    });

    // Send email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Your App" <noreply@example.com>',
      to: recipient,
      subject: subject,
      html: htmlContent,
    });

    console.log("Notification sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Failed to send notification:", error);
    return false;
  }
}

// For other notification channels (SMS, push notifications, etc.)
export async function sendSMSNotification(
  options: NotificationOptions
): Promise<boolean> {
  // Implement SMS notification service integration
  console.log("SMS notification would be sent:", options);
  return true;
}

export async function sendPushNotification(
  options: NotificationOptions
): Promise<boolean> {
  // Implement push notification service integration
  console.log("Push notification would be sent:", options);
  return true;
}
