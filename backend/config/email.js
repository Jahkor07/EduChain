const nodemailer = require('nodemailer');

// Create transporter for Gmail
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASSWORD // Your Gmail app password
    }
  });
};

// Email templates
const emailTemplates = {
  passwordReset: (resetCode, userName = 'User') => ({
    subject: 'EduChain - Password Reset Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">EduChain</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Educational Blockchain Platform</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Password Reset Code</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Hello ${userName},
          </p>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            We received a request to reset your password for your EduChain account. 
            If you didn't make this request, you can safely ignore this email.
          </p>
          
          <div style="background: #e9ecef; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="color: #495057; margin: 0 0 15px 0; font-weight: bold;">Your 6-Digit Reset Code:</p>
            <div style="background: #fff; padding: 20px; border: 3px solid #dee2e6; border-radius: 10px; font-family: monospace; font-size: 32px; color: #495057; letter-spacing: 8px; font-weight: bold; display: inline-block; min-width: 200px;">
              ${resetCode}
            </div>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            <strong>How to use this code:</strong>
          </p>
          
          <ol style="color: #666; line-height: 1.6; margin-bottom: 20px; padding-left: 20px;">
            <li>Go to the EduChain login page</li>
            <li>Click "Forgot password?"</li>
            <li>Click "I have a reset code"</li>
            <li>Enter your email and this 6-digit code</li>
            <li>Set your new password</li>
          </ol>
          
          <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 6px; padding: 15px; margin: 20px 0;">
            <p style="color: #155724; margin: 0; font-weight: bold;">⚠️ Important:</p>
            <ul style="color: #155724; margin: 10px 0 0 0; padding-left: 20px;">
              <li>This code expires in 10 minutes</li>
              <li>Never share this code with anyone</li>
              <li>If you didn't request this, your account is secure</li>
            </ul>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            If you have any questions, please contact our support team.
          </p>
          
          <p style="color: #666; line-height: 1.6; margin: 0;">
            Best regards,<br>
            The EduChain Team
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px;">
          <p>© 2024 EduChain. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `
EduChain - Password Reset Code

Hello ${userName},

We received a request to reset your password for your EduChain account. 
If you didn't make this request, you can safely ignore this email.

Your 6-Digit Reset Code: ${resetCode}

How to use this code:
1. Go to the EduChain login page
2. Click "Forgot password?"
3. Click "I have a reset code"
4. Enter your email and this 6-digit code
5. Set your new password

Important:
- This code expires in 10 minutes
- Never share this code with anyone
- If you didn't request this, your account is secure

If you have any questions, please contact our support team.

Best regards,
The EduChain Team

© 2024 EduChain. All rights reserved.
    `
  })
};

// Send email function
const sendEmail = async (to, template, data = {}) => {
  try {
    const transporter = createTransporter();
    const emailContent = emailTemplates[template](data.resetCode, data.userName);
    
    const mailOptions = {
      from: `"EduChain" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEmail,
  emailTemplates
};
