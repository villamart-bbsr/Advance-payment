import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Function to send advance salary request email
export const sendAdvanceRequestEmail = async (requestData) => {
  try {
    const { userName, amountRequested, reason, date } = requestData;
    
    // Format date to Month/Year
    const requestDate = new Date(date);
    const monthYear = requestDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    // Email content
    const subject = `Request for Advance Salary of ${userName}`;
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <p>Dear Sir/Madam,</p>
        
        <p>I am writing to request an advance for the month of <strong>${monthYear}</strong> due to <strong>${reason}</strong>.</p>
        
        <p>I would like to request an advance amount of <strong>₹${amountRequested.toLocaleString()}</strong>, which I understand will be adjusted from my upcoming salary.</p>
        
        <p>Thank You<br/>
        <strong>${userName}</strong></p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="font-size: 12px; color: #888;">
          <strong>Note:</strong> This is a system generated mail. No need to reply back.
        </p>
      </div>
    `;
    
    const textContent = `Dear Sir/Madam,

I am writing to request an advance for the month of ${monthYear} due to ${reason}.

I would like to request an advance amount of ₹${amountRequested.toLocaleString()}, which I understand will be adjusted from my upcoming salary.

Thank You
${userName}

**Note: This is a system generated mail. No need to reply back.`;
    
    // Email recipients
    const recipients = [
      'admin.support@villamart.com',
      'accounts@villamart.in',
      'cfo@villamart.in'
    ];
    
    // Send email
    const info = await transporter.sendMail({
      from: `"Advance Salary System" <${process.env.EMAIL_USER}>`,
      to: recipients.join(', '),
      subject: subject,
      text: textContent,
      html: htmlContent
    });
    
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Verify email configuration
export const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email server is ready to send emails');
    return true;
  } catch (error) {
    console.error('❌ Email server configuration error:', error);
    return false;
  }
};
