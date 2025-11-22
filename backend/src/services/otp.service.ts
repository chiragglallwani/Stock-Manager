interface OTPRecord {
  email: string;
  otp: string;
  expires_at: Date;
}

// In-memory storage for OTPs (in production, consider using Redis)
const otpStore = new Map<string, OTPRecord>();

export class OTPService {
  static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static async storeOTP(email: string, otp: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // OTP expires in 10 minutes

    otpStore.set(email, {
      email,
      otp,
      expires_at: expiresAt,
    });

    // Clean up expired OTPs periodically
    this.cleanupExpiredOTPs();
  }

  static async verifyOTP(email: string, otp: string): Promise<boolean> {
    const record = otpStore.get(email);

    if (!record) {
      return false;
    }

    if (new Date() > record.expires_at) {
      otpStore.delete(email);
      return false;
    }

    if (record.otp !== otp) {
      return false;
    }

    // OTP verified successfully, remove it
    otpStore.delete(email);
    return true;
  }

  private static cleanupExpiredOTPs(): void {
    const now = new Date();
    for (const [email, record] of otpStore.entries()) {
      if (now > record.expires_at) {
        otpStore.delete(email);
      }
    }
  }

  static async getOTP(email: string): Promise<string | null> {
    const record = otpStore.get(email);
    if (!record || new Date() > record.expires_at) {
      return null;
    }
    return record.otp;
  }
}
