import axios from 'axios'

interface WhatsAppMessage {
  from: string
  id: string
  timestamp: string
  type: 'text' | 'image' | 'document'
  text?: { body: string }
  image?: { id: string, mime_type: string, caption?: string }
  document?: { id: string, mime_type: string, filename: string, caption?: string }
}

interface WhatsAppWebhookBody {
  object: string
  entry: Array<{
    id: string
    changes: Array<{
      value: {
        messaging_product: string
        metadata: { display_phone_number: string, phone_number_id: string }
        messages?: WhatsAppMessage[]
        statuses?: any[]
      }
      field: string
    }>
  }>
}

export class WhatsAppService {
  private accessToken: string
  private phoneNumberId: string
  private webhookVerifyToken: string

  constructor() {
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN!
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID!
    this.webhookVerifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN!
  }

  // Download media from WhatsApp
  async downloadMedia(mediaId: string): Promise<{ buffer: Buffer, mimeType: string }> {
    try {
      // Get media URL
      const mediaResponse = await axios.get(
        `https://graph.facebook.com/v18.0/${mediaId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      )

      const mediaUrl = mediaResponse.data.url

      // Download the actual file
      const fileResponse = await axios.get(mediaUrl, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        },
        responseType: 'arraybuffer'
      })

      return {
        buffer: Buffer.from(fileResponse.data),
        mimeType: mediaResponse.data.mime_type
      }
    } catch (error) {
      console.error('Error downloading WhatsApp media:', error)
      throw error
    }
  }

  // Upload document to S3 via our existing API
  async uploadDocumentToS3(
    phoneNumber: string, 
    fileBuffer: Buffer, 
    fileName: string, 
    mimeType: string,
    documentType: string
  ): Promise<boolean> {
    try {
      // Find user session by phone number
      const sessionResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/sessions/by-phone/${phoneNumber.replace('whatsapp:', '').replace('+', '')}`
      )
      
      const sessionId = sessionResponse.data.session_id

      // Get presigned URL
      const initResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/documents/init`,
        {
          session_id: sessionId,
          file_name: fileName,
          file_size: fileBuffer.length,
          document_type: documentType
        }
      )

      const { upload_url, document_id } = initResponse.data

      // Upload to S3
      await axios.put(upload_url, fileBuffer, {
        headers: {
          'Content-Type': mimeType
        }
      })

      // Mark upload as complete
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/documents/upload-complete`,
        {
          document_id,
          session_id: sessionId,
          file_size: fileBuffer.length
        }
      )

      return true
    } catch (error) {
      console.error('Error uploading to S3:', error)
      return false
    }
  }

  // Send message to WhatsApp user
  async sendMessage(to: string, message: string): Promise<void> {
    try {
      await axios.post(
        `https://graph.facebook.com/v18.0/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: to.replace('whatsapp:', ''),
          type: 'text',
          text: { body: message }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )
    } catch (error) {
      console.error('Error sending WhatsApp message:', error)
    }
  }

  // Process incoming WhatsApp message
  async processIncomingMessage(message: WhatsAppMessage): Promise<void> {
    const phoneNumber = message.from
    
    try {
      if (message.type === 'image' && message.image) {
        await this.handleImageUpload(phoneNumber, message.image)
      } else if (message.type === 'document' && message.document) {
        await this.handleDocumentUpload(phoneNumber, message.document)
      } else if (message.type === 'text' && message.text) {
        await this.handleTextMessage(phoneNumber, message.text.body)
      }
    } catch (error) {
      console.error('Error processing WhatsApp message:', error)
      await this.sendMessage(phoneNumber, '❌ Sorry, there was an error processing your message. Please try again.')
    }
  }

  private async handleImageUpload(phoneNumber: string, image: { id: string, mime_type: string, caption?: string }) {
    try {
      const { buffer, mimeType } = await this.downloadMedia(image.id)
      
      // Generate filename
      const extension = mimeType.split('/')[1] || 'jpg'
      const fileName = `whatsapp-image-${Date.now()}.${extension}`
      
      // Determine document type from caption or default
      const documentType = this.extractDocumentType(image.caption)
      
      const uploadSuccess = await this.uploadDocumentToS3(
        phoneNumber, 
        buffer, 
        fileName, 
        mimeType, 
        documentType
      )

      if (uploadSuccess) {
        await this.sendMessage(phoneNumber, `✅ Image uploaded successfully!\n📎 File: ${fileName}\n📋 Type: ${documentType}\n\nReply with document name if this categorization is wrong.`)
      } else {
        await this.sendMessage(phoneNumber, '❌ Failed to upload image. Please try again or upload via website.')
      }
    } catch (error) {
      console.error('Error handling image upload:', error)
      await this.sendMessage(phoneNumber, '❌ Error uploading image. Please try again.')
    }
  }

  private async handleDocumentUpload(phoneNumber: string, document: { id: string, mime_type: string, filename: string, caption?: string }) {
    try {
      const { buffer, mimeType } = await this.downloadMedia(document.id)
      
      // Use original filename or generate one
      const fileName = document.filename || `whatsapp-document-${Date.now()}.pdf`
      
      // Determine document type
      const documentType = this.extractDocumentType(document.caption || document.filename)
      
      const uploadSuccess = await this.uploadDocumentToS3(
        phoneNumber, 
        buffer, 
        fileName, 
        mimeType, 
        documentType
      )

      if (uploadSuccess) {
        await this.sendMessage(phoneNumber, `✅ Document uploaded successfully!\n📎 File: ${fileName}\n📋 Type: ${documentType}\n\nReply "STATUS" to check remaining documents.`)
      } else {
        await this.sendMessage(phoneNumber, '❌ Failed to upload document. Please try again or upload via website.')
      }
    } catch (error) {
      console.error('Error handling document upload:', error)
      await this.sendMessage(phoneNumber, '❌ Error uploading document. Please try again.')
    }
  }

  private async handleTextMessage(phoneNumber: string, text: string) {
    const lowerText = text.toLowerCase()
    
    if (lowerText.includes('status') || lowerText.includes('स्थिति')) {
      await this.sendDocumentStatus(phoneNumber)
    } else if (lowerText.includes('help') || lowerText.includes('मदद')) {
      await this.sendHelpMessage(phoneNumber)
    } else if (lowerText.includes('list') || lowerText.includes('सूची')) {
      await this.sendDocumentList(phoneNumber)
    } else {
      // Default response
      await this.sendMessage(phoneNumber, 
        `📋 VisaMate Commands:\n\n` +
        `• Send STATUS - Check document status\n` +
        `• Send HELP - Get help\n` +
        `• Send LIST - See required documents\n` +
        `• Send images/PDFs - Upload documents\n\n` +
        `🌐 Website: ${process.env.NEXT_PUBLIC_APP_URL}/documents`
      )
    }
  }

  private extractDocumentType(caption?: string): string {
    if (!caption) return 'other'
    
    const text = caption.toLowerCase()
    
    // Document type mapping
    const typeMap: Record<string, string> = {
      'passport': 'passport',
      'bank': 'bank_statement',
      'statement': 'bank_statement',
      'education': 'education_certificate',
      'degree': 'education_certificate',
      'certificate': 'education_certificate',
      'ielts': 'ielts_score',
      'english': 'ielts_score',
      'photo': 'photograph',
      'picture': 'photograph',
      'medical': 'medical_exam',
      'health': 'medical_exam',
      'police': 'police_certificate',
      'clearance': 'police_certificate'
    }

    for (const [keyword, type] of Object.entries(typeMap)) {
      if (text.includes(keyword)) {
        return type
      }
    }

    return 'other'
  }

  private async sendDocumentStatus(phoneNumber: string) {
    try {
      // Implementation to fetch and send document status
      await this.sendMessage(phoneNumber, '📊 Fetching your document status...')
    } catch (error) {
      await this.sendMessage(phoneNumber, '❌ Error fetching status. Please try again.')
    }
  }

  private async sendHelpMessage(phoneNumber: string) {
    const helpMessage = `
🆘 VisaMate Help

📤 Upload Documents:
• Send photos/images directly
• Send PDF files
• Add caption with document name

💬 Commands:
• STATUS - Check progress
• LIST - Required documents
• HELP - This message

🌐 Need more help? Visit: ${process.env.NEXT_PUBLIC_APP_URL}
    `.trim()

    await this.sendMessage(phoneNumber, helpMessage)
  }

  private async sendDocumentList(phoneNumber: string) {
    const listMessage = `
📋 Required Documents:

✅ Upload these via WhatsApp:
• 📘 Passport copy
• 🏦 Bank statements (3 months)
• 🎓 Education certificates
• 📊 IELTS/English test scores
• 📷 Passport photos
• 🏥 Medical exam results
• 👮 Police clearance certificate

💡 Tip: Add document name in caption for auto-categorization!
    `.trim()

    await this.sendMessage(phoneNumber, listMessage)
  }
}

export const whatsappService = new WhatsAppService() 