const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  async initializeTransporter() {
    try {
      this.transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      await this.transporter.verify();
      console.log('✅ Email service initialized successfully');
    } catch (error) {
      console.error('❌ Email service initialization failed:', error.message);
      this.transporter = null;
    }
  }

  async sendPasswordResetEmail(email, resetCode, userName) {
    try {
      if (!this.transporter) {
        return { success: false, error: 'Email service not configured' };
      }

      const mailOptions = {
        from: `"EduChain" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '🔐 EduChain Password Reset Code',
        html: `
          <h1>Password Reset</h1>
          <p>Hello ${userName || 'there'}!</p>
          <p>Your verification code is: <strong>${resetCode}</strong></p>
          <p>This code expires in 10 minutes.</p>
          <p>Best regards,<br>The EduChain Team</p>
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
