# EmailJS Setup Guide for VisaMate Contact Form

This guide will help you set up EmailJS to receive real emails from your contact form.

## 🚀 Quick Setup Steps

### 1. Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### 2. Add Email Service
1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the authentication steps
5. **Save the Service ID** (you'll need this)

### 3. Create Email Template
1. Go to **Email Templates**
2. Click **Create New Template**
3. Use this template:

```html
Subject: New VisaMate Contact Form Submission - {{from_name}}

Hello VisaMate Team,

You have received a new contact form submission:

**Contact Information:**
- Name: {{from_name}}
- Email: {{from_email}}
- Phone: {{phone}}
- Preferred Contact: {{preferred_contact}}

**Visa Details:**
- Visa Type: {{visa_type}}
- Destination Country: {{country}}

**Message:**
{{message}}

---
This email was sent from the VisaMate contact form.
```

4. **Save the Template ID** (you'll need this)

### 4. Get Your Public Key
1. Go to **Account** → **API Keys**
2. Copy your **Public Key**

### 5. Update Configuration
1. Open `src/config/emailjs.ts`
2. Replace the placeholder values:

```typescript
export const emailjsConfig = {
  serviceId: 'your_service_id_here', // From step 2
  templateId: 'your_template_id_here', // From step 3
  publicKey: 'your_public_key_here', // From step 4
};
```

## 📧 Email Template Variables

The contact form sends these variables to your email template:

- `{{from_name}}` - Full name of the person
- `{{from_email}}` - Their email address
- `{{phone}}` - Phone number (or "Not provided")
- `{{visa_type}}` - Selected visa type
- `{{country}}` - Selected destination country
- `{{message}}` - Their message
- `{{preferred_contact}}` - Preferred contact method
- `{{to_name}}` - Always "VisaMate Team"

## 🔧 Testing the Setup

1. Start your development server: `npm run dev`
2. Go to `/contact`
3. Fill out the form and submit
4. Check your email inbox
5. Check browser console for success/error messages

## 💰 Pricing

- **Free Plan**: 200 emails/month
- **Paid Plans**: Starting from $15/month for more emails

## 🛠️ Troubleshooting

### Common Issues:

1. **"Service ID not found"**
   - Double-check your service ID in EmailJS dashboard
   - Make sure the service is active

2. **"Template ID not found"**
   - Verify your template ID
   - Ensure template is published

3. **"Public key invalid"**
   - Check your API key in Account settings
   - Make sure you're using the public key, not private

4. **Emails not received**
   - Check spam folder
   - Verify email service is properly connected
   - Check EmailJS dashboard for delivery status

## 🔒 Security Notes

- The public key is safe to use in frontend code
- EmailJS handles email sending securely
- No sensitive credentials are exposed to users

## 📞 Support

- EmailJS Documentation: [docs.emailjs.com](https://docs.emailjs.com/)
- EmailJS Support: [support.emailjs.com](https://support.emailjs.com/)

---

**Once configured, your contact form will send real emails to your inbox!** 🎉 