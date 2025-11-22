import sgMail from "@sendgrid/mail";

export class EmailService {
  private static initialized = false;

  static initialize(): void {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      throw new Error(
        "SENDGRID_API_KEY is not defined in environment variables"
      );
    }
    sgMail.setApiKey(apiKey);
    this.initialized = true;
  }

  static async sendOTP(email: string, otp: string): Promise<void> {
    if (!this.initialized) {
      this.initialize();
    }

    const msg = {
      to: email,
      from: "lalwanichirag3@gmail.com",
      subject: "Password Reset OTP - Stock Manager",
      text: `Your OTP for password reset is: ${otp}. This OTP will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>You have requested to reset your password. Use the following OTP to proceed:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #333; margin: 0; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p style="color: #666;">This OTP will expire in 10 minutes.</p>
          <p style="color: #666;">If you did not request this, please ignore this email.</p>
        </div>
      `,
    };

    try {
      await sgMail.send(msg);
    } catch (error: any) {
      console.error("Error sending email:", error);

      // Provide more detailed error messages
      if (error.response) {
        const { statusCode, body } = error.response;
        const errorMessage =
          body?.errors?.[0]?.message || "Unknown SendGrid error";

        if (statusCode === 403) {
          throw new Error(
            `SendGrid API error (403 Forbidden): ${errorMessage}. ` +
              `Please verify: 1) Your API key is correct, 2) The "from" email (${msg.from}) is verified in SendGrid, ` +
              `3) Your API key has Mail Send permissions.`
          );
        }

        throw new Error(`SendGrid API error (${statusCode}): ${errorMessage}`);
      }

      throw new Error("Failed to send OTP email");
    }
  }
}
