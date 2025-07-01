import { NextRequest, NextResponse } from 'next/server'
import { whatsappService } from '@/libs/whatsapp'

// Webhook verification (GET request)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  // Verify the webhook
  if (mode === 'subscribe' && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    console.log('WhatsApp webhook verified successfully')
    return new Response(challenge, { status: 200 })
  } else {
    console.error('WhatsApp webhook verification failed')
    return new Response('Verification failed', { status: 403 })
  }
}

// Handle incoming WhatsApp messages (POST request)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('WhatsApp webhook received:', JSON.stringify(body, null, 2))

    // Process each entry
    if (body.object === 'whatsapp_business_account') {
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.field === 'messages') {
            const { messages, statuses } = change.value

            // Process incoming messages
            if (messages) {
              for (const message of messages) {
                console.log('Processing message:', message)
                await whatsappService.processIncomingMessage(message)
              }
            }

            // Process message statuses (delivered, read, etc.)
            if (statuses) {
              for (const status of statuses) {
                console.log('Message status update:', status)
                // Handle status updates if needed
              }
            }
          }
        }
      }
    }

    return NextResponse.json({ status: 'success' }, { status: 200 })
  } catch (error) {
    console.error('WhatsApp webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' }, 
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function OPTIONS() {
  return new Response('OK', {
    status: 200,
    headers: {
      'Allow': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
} 