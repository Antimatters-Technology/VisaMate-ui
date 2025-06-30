import { NextRequest, NextResponse } from 'next/server'
import { whatsappService } from '@/libs/whatsapp'

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, sessionId } = await request.json()

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      )
    }

    // Format phone number (remove + and spaces)
    const formattedPhone = phoneNumber.replace(/\D/g, '')

    // Send welcome message with setup instructions
    const welcomeMessage = `
🎉 Welcome to VisaMate WhatsApp Upload!

📤 You can now upload documents directly here:
• Send photos/images of documents
• Send PDF files
• Add document names in captions

💬 Commands you can use:
• STATUS - Check your progress
• LIST - See required documents  
• HELP - Get assistance

🔍 Example: Send passport photo with caption "passport" for auto-categorization

Ready to upload? Send your first document! 🚀
    `.trim()

    await whatsappService.sendMessage(formattedPhone, welcomeMessage)

    // You could also store this activation in your database
    // await activateWhatsAppForSession(sessionId, formattedPhone)

    return NextResponse.json({ 
      success: true, 
      message: 'WhatsApp activated successfully' 
    })

  } catch (error) {
    console.error('WhatsApp activation error:', error)
    return NextResponse.json(
      { error: 'Failed to activate WhatsApp' },
      { status: 500 }
    )
  }
} 