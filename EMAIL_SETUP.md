# Email Configuration Setup

## Environment Variables Required

Add the following variables to your `.env` file in the `server` folder:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

## Gmail Setup Instructions

1. **Enable 2-Step Verification** on your Gmail account:
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "Advance Salary System"
   - Click "Generate"
   - Copy the 16-character password

3. **Update .env file**:
   ```env
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # The 16-character app password
   ```

## Email Recipients

Emails will be sent to:
- admin.support@villamart.com
- accounts@villamart.in
- cfo@villamart.in

## Email Format

**Subject:** Request for Advance Salary of [Employee Name]

**Body:**
```
Dear Sir/Madam,

I am writing to request an advance for the month of [Month/Year] due to [reason].

I would like to request an advance amount of ₹[amount], which I understand will be adjusted from my upcoming salary.

Thank You
[Employee Name]

**Note: This is a system generated mail. No need to reply back.
```

## Installation

Run in the server directory:
```bash
npm install
```

This will install nodemailer and all required dependencies.

## Testing

The email service will log success/failure messages in the server console. Check the terminal for:
- ✅ Email sent successfully
- ❌ Error sending email (with error details)

## Troubleshooting

If emails are not sending:
1. Verify EMAIL_USER and EMAIL_PASSWORD in .env
2. Check Gmail App Password is correct
3. Ensure 2-Step Verification is enabled
4. Check server console for specific error messages
