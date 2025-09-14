const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  async initializeTransporter() {
    try {
      // Use SMTP configuration from environment variables
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER || process.env.EMAIL_USER,
          pass: process.env.SMTP_PASS || process.env.EMAIL_PASS
        }
      });

      await this.transporter.verify();
      console.log('✅ Email service initialized successfully');
    } catch (error) {
      console.error('❌ Email service initialization failed:', error.message);
      this.transporter = null;
    }
  }

  async sendPasswordResetEmail(email, otp, userName) {
    try {
      if (!this.transporter) {
        return { success: false, error: 'Email service not configured' };
      }

      const mailOptions = {
        from: `"EduChain" <${process.env.SMTP_USER || process.env.EMAIL_USER}>`,
        to: email,
        subject: '🔐 EduChain Password Reset OTP',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #333; text-align: center;">Password Reset</h1>
            <p>Hello ${userName || 'there'}!</p>
            <p>You requested a password reset for your EduChain account. Use the following OTP to reset your password:</p>
            <div style="background-color: #f8f9fa; border: 2px solid #dee2e6; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <h2 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h2>
            </div>
            <p><strong>Important:</strong></p>
            <ul>
              <li>This OTP expires in 10 minutes</li>
              <li>Do not share this code with anyone</li>
              <li>If you didn't request this reset, please ignore this email</li>
            </ul>
            <p>Best regards,<br>The EduChain Team</p>
          </div>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Password reset email sent to:', email);
      
      return { success: true, messageId: result.messageId };

    } catch (error) {
      console.error('❌ Failed to send email:', error.message);
      return { success: false, error: error.message };
    }
  }

  async sendPhoneVerificationOTP(email, phoneNumber, otp) {
    try {
      if (!this.transporter) {
        return { success: false, error: 'Email service not configured' };
      }

      const mailOptions = {
        from: `"EduChain" <${process.env.SMTP_USER || process.env.EMAIL_USER}>`,
        to: email,
        subject: '📱 EduChain Phone Verification OTP',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #333; text-align: center;">Phone Number Verification</h1>
            <p>Hello!</p>
            <p>You're verifying your phone number <strong>${phoneNumber}</strong> for your EduChain account.</p>
            <p>Since SMS verification is not available in your region, we're sending the verification code to your email:</p>
            <div style="background-color: #f8f9fa; border: 2px solid #dee2e6; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <h2 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h2>
            </div>
            <p><strong>Important:</strong></p>
            <ul>
              <li>This OTP expires in 2 minutes</li>
              <li>Enter this code in the phone verification form</li>
              <li>Do not share this code with anyone</li>
              <li>If you didn't request this verification, please ignore this email</li>
            </ul>
            <p>Best regards,<br>The EduChain Team</p>
          </div>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Phone verification OTP email sent to:', email);
      
      return { success: true, messageId: result.messageId };

    } catch (error) {
      console.error('❌ Failed to send phone verification email:', error.message);
      return { success: false, error: error.message };
    }
  }

  async testConnection() {
    try {
      if (!this.transporter) {
        return { connected: false, error: 'Email service not configured' };
      }
      await this.transporter.verify();
      return { connected: true, message: 'Email service working' };
    } catch (error) {
      return { connected: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
