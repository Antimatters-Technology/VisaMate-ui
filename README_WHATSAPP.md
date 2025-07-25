# WhatsApp Document Upload Integration

This guide will help you set up WhatsApp Business API to allow users to upload documents directly via WhatsApp.

## 🚀 Quick Start

### 1. Prerequisites
- Meta Business Account
- WhatsApp Business API access
- Verified phone number for WhatsApp Business

### 2. Environment Variables
Add these to your `.env.local` file:

```env
# WhatsApp Business API Configuration
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token_here
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_custom_verify_token_here
NEXT_PUBLIC_WHATSAPP_NUMBER=+1234567890
```

### 3. Meta Business Setup

1. **Go to Meta Business** (https://business.facebook.com/)
2. **Add WhatsApp Product** to your app
3. **Get Access Token**:
   - Go to System Users → Add System User
   - Generate permanent access token with `whatsapp_business_messaging` permission
4. **Get Phone Number ID**:
   - Go to WhatsApp → API Setup
   - Copy the Phone Number ID

### 4. Webhook Configuration

1. **Set Webhook URL**: `https://yourdomain.com/api/webhooks/whatsapp`
2. **Verify Token**: Use any custom string (set in WHATSAPP_WEBHOOK_VERIFY_TOKEN)
3. **Subscribe to Fields**: 
   - `messages`
   - `message_deliveries`

## 📱 How It Works

### Document Upload Flow:
1. User sends image/PDF to WhatsApp Business number
2. Webhook receives the message → `/api/webhooks/whatsapp`
3. Download media from WhatsApp servers
4. Extract document type from caption (AI categorization)
5. Upload to S3 using existing presigned URL system
6. Update document status in database
7. Send confirmation message to user

### Supported Commands:
- **STATUS** / **स्थिति** - Check document upload progress
- **HELP** / **मदद** - Get help instructions
- **LIST** / **सूची** - Show required documents
- **Send Images/PDFs** - Upload documents

### Auto-Categorization:
Users can add captions to automatically categorize documents:
- "passport" → passport
- "bank statement" → bank_statement  
- "education certificate" → education_certificate
- "ielts" → ielts_score
- etc.

## 🔧 Technical Implementation

### Key Files:
- `src/libs/whatsapp.ts` - WhatsApp service class
- `src/app/api/webhooks/whatsapp/route.ts` - Webhook handler
- `src/features/whatsapp/WhatsAppSetup.tsx` - UI component
- `src/app/api/whatsapp/activate/route.ts` - Activation endpoint

### Process Flow:
```javascript
// 1. Receive webhook
POST /api/webhooks/whatsapp

// 2. Download media from WhatsApp
const media = await whatsappService.downloadMedia(mediaId)

// 3. Upload to S3 via existing API
const uploadSuccess = await whatsappService.uploadDocumentToS3(
  phoneNumber, buffer, fileName, mimeType, documentType
)

// 4. Send confirmation
await whatsappService.sendMessage(phoneNumber, confirmationMessage)
```

## 🌍 Multilingual Support

### Supported Languages:
- **English** - Default
- **Hindi** - हिंदी  
- **Punjabi** - ਪੰਜਾਬੀ
- **Gujarati** - ગુજરાતી

### Message Templates:
```javascript
const messages = {
  hindi: {
    uploadSuccess: `✅ दस्तावेज़ सफलतापूर्वक अपलोड हो गया!\n📎 फ़ाइल: {fileName}\n📋 प्रकार: {documentType}`,
    help: `🆘 VisaMate सहायता\n\n📤 दस्तावेज़ अपलोड करें:\n• फोटो/इमेज भेजें\n• PDF फ़ाइलें भेजें`
  }
  // ... other languages
}
```

## 🚨 Important Notes

### Security:
- Never expose access tokens in frontend code
- Use webhook verification tokens
- Validate all incoming messages
- Rate limit API calls

### Rate Limits:
- WhatsApp API has rate limits (varies by plan)
- Meta Business API: 1000 calls/hour (default)
- Implement queuing for high volume

### File Size Limits:
- WhatsApp media: 16MB max
- S3 uploads: Configure based on your limits
- Consider compression for large images

## 🧪 Testing

### Using WhatsApp Test Numbers:
1. Add test phone numbers in Meta Business
2. Send test messages to webhook URL
3. Use ngrok for local testing: `ngrok http 3002`

### Test Commands:
```
Send to WhatsApp:
- "STATUS" → Check document status
- "HELP" → Get help message  
- "LIST" → Required documents list
- Send image with caption "passport" → Upload passport
```

## 🔥 Advanced Features

### Planned Enhancements:
- [ ] Voice message support in regional languages
- [ ] Document quality validation
- [ ] Auto-OCR text extraction
- [ ] Smart reminders based on missing docs
- [ ] Group messaging for family applications
- [ ] Integration with calendar for appointments

### Performance Optimizations:
- [ ] Async processing queue (Redis/Bull)
- [ ] Media caching
- [ ] Database connection pooling
- [ ] Error retry mechanisms

## 📞 Support

For WhatsApp Business API issues:
1. Check Meta Business Manager logs
2. Verify webhook endpoint is accessible
3. Test with WhatsApp API testing tools
4. Review rate limiting and quotas

Common Issues:
- **Webhook not receiving**: Check URL accessibility
- **Media download fails**: Verify access token permissions
- **Upload fails**: Check S3 credentials and presigned URLs
- **Messages not sending**: Verify phone number verification status 