// SMS Service for sending OTP to phone numbers using Twilio
const twilio = require('twilio');

class SMSService {
  constructor() {
    // Initialize Twilio client
    this.accountSid = process.env.TWILIO_ACCOUNT_SID;
    this.authToken = process.env.TWILIO_AUTH_TOKEN;
    this.phoneNumber = process.env.TWILIO_PHONE_NUMBER;
    
    // Check if Twilio is configured
    this.isConfigured = !!(this.accountSid && this.authToken && this.phoneNumber);
    
    if (this.isConfigured) {
      this.client = twilio(this.accountSid, this.authToken);
      console.log('✅ Twilio SMS service initialized');
    } else {
      console.log('⚠️ Twilio not configured - SMS will be logged to console only');
    }
  }

  async sendOTP(phoneNumber, otp) {
    try {
      console.log(`📱 Attempting to send OTP to: ${phoneNumber}`);
      console.log(`📱 OTP Code: ${otp}`);
      
      if (!this.isConfigured) {
        // Development mode - just log the OTP
        console.log(`📱 [DEV MODE] SMS OTP for ${phoneNumber}: ${otp}`);
        console.log(`📱 [DEV MODE] Full phone number format: ${phoneNumber}`);
        return { 
          success: true, 
          message: 'OTP logged to console (Twilio not configured)',
          mode: 'development'
        };
      }

      // Send actual SMS via Twilio
      const message = await this.client.messages.create({
        body: `Your EduChain verification code is: ${otp}. This code will expire in 10 minutes.`,
        from: this.phoneNumber,
        to: phoneNumber
      });

      console.log(`✅ SMS sent successfully. SID: ${message.sid}`);
      return { 
        success: true, 
        message: 'OTP sent successfully via SMS',
        sid: message.sid,
        mode: 'production'
      };

    } catch (error) {
      console.error('❌ SMS sending error:', error);
      
      // Fallback to development mode if Twilio fails
      console.log(`📱 [FALLBACK] SMS OTP for ${phoneNumber}: ${otp}`);
      return { 
        success: true, 
        message: 'OTP logged to console (SMS service error)',
        error: error.message,
        mode: 'fallback'
      };
    }
  }

  async sendNotification(phoneNumber, message) {
    try {
      console.log(`📱 Attempting to send notification to: ${phoneNumber}`);
      
      if (!this.isConfigured) {
        console.log(`📱 [DEV MODE] SMS notification to ${phoneNumber}: ${message}`);
        return { 
          success: true, 
          message: 'Notification logged to console (Twilio not configured)',
          mode: 'development'
        };
      }

      // Send actual SMS via Twilio
      const smsMessage = await this.client.messages.create({
        body: message,
        from: this.phoneNumber,
        to: phoneNumber
      });

      console.log(`✅ SMS notification sent successfully. SID: ${smsMessage.sid}`);
      return { 
        success: true, 
        message: 'Notification sent successfully via SMS',
        sid: smsMessage.sid,
        mode: 'production'
      };

    } catch (error) {
      console.error('❌ SMS notification error:', error);
      
      // Fallback to development mode
      console.log(`📱 [FALLBACK] SMS notification to ${phoneNumber}: ${message}`);
      return { 
        success: true, 
        message: 'Notification logged to console (SMS service error)',
        error: error.message,
        mode: 'fallback'
      };
    }
  }

  // Method to check if SMS service is properly configured
  getStatus() {
    return {
      configured: this.isConfigured,
      accountSid: this.accountSid ? 'Set' : 'Not set',
      authToken: this.authToken ? 'Set' : 'Not set',
      phoneNumber: this.phoneNumber || 'Not set'
    };
  }
}

module.exports = new SMSService();





















