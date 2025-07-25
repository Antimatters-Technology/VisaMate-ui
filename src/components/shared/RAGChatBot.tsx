'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/shared/Badge'
import { MessageCircle, X, Send, Bot, User, Loader2, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react'
import { useRAG } from '@/hooks/useRAG'

interface ChatMessage {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  sources?: Array<{
    id: number
    url: string
    title: string
    snippet: string
    relevance_score: number
  }>
  confidence_score?: number
  processing_time_ms?: number
}

interface RAGChatBotProps {
  className?: string
}

export function RAGChatBot({ className = '' }: RAGChatBotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your Canadian immigration assistant. I can help you with visa questions, document requirements, and application procedures. How can I assist you today?',
      timestamp: new Date(),
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline' | 'checking'>('checking')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Use RAG hook for backend integration
  const { queryRAG, checkHealth, isLoading, error, clearError } = useRAG()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Check backend connection status
  useEffect(() => {
    const checkConnection = async () => {
      try {
        await checkHealth()
        setConnectionStatus('online')
      } catch (error) {
        console.warn('RAG backend connection check failed:', error)
        setConnectionStatus('offline')
      }
    }

    if (isOpen) {
      checkConnection()
    }
  }, [isOpen, checkHealth])

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    try {
      // Clear any previous errors
      clearError()
      
      // Call RAG API using the hook
      const data = await queryRAG({
        query: userMessage.content,
        language: 'en',
        session_id: `chat_${Date.now()}`,
      })

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: data.answer,
        timestamp: new Date(),
        sources: data.sources,
        confidence_score: data.confidence_score,
        processing_time_ms: data.processing_time_ms,
      }

      setMessages(prev => [...prev, botMessage])
      setConnectionStatus('online')
    } catch (error) {
      console.error('Error calling RAG API:', error)
      setConnectionStatus('offline')
      
      // Provide helpful fallback responses based on common questions
      let fallbackContent = 'I\'m currently unable to connect to the immigration database. However, I can suggest you visit the official IRCC website at canada.ca for the most up-to-date information.'
      
      const query = userMessage.content.toLowerCase()
      if (query.includes('study permit') || query.includes('student visa')) {
        fallbackContent += '\n\nFor study permits, you typically need: letter of acceptance, proof of funds, medical exam, and police certificate. Processing time is usually 4-12 weeks.'
      } else if (query.includes('work permit') || query.includes('work visa')) {
        fallbackContent += '\n\nFor work permits, you need a job offer and LMIA in most cases. Processing times vary by program (2-12 weeks).'
      } else if (query.includes('citizenship')) {
        fallbackContent += '\n\nFor citizenship, you need permanent residency for 3+ years, language proficiency, and knowledge of Canada test.'
      } else if (query.includes('express entry')) {
        fallbackContent += '\n\nExpress Entry manages applications for Federal Skilled Worker, Canadian Experience Class, and Federal Skilled Trades programs.'
      }
      
      fallbackContent += '\n\nPlease try asking again in a moment as the connection may be restored.'
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: fallbackContent,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getConfidenceColor = (score?: number) => {
    if (!score) return 'bg-gray-100 text-gray-800'
    if (score >= 0.8) return 'bg-green-100 text-green-800'
    if (score >= 0.6) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getConfidenceText = (score?: number) => {
    if (!score) return 'Unknown'
    if (score >= 0.8) return 'High Confidence'
    if (score >= 0.6) return 'Medium Confidence'
    return 'Low Confidence'
  }

  if (!isOpen) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
          size="icon"
        >
          <MessageCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        </Button>
        <div className="absolute -top-12 right-0 bg-gray-800 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Ask immigration questions
        </div>
      </div>
    )
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <Card className="w-96 h-[600px] shadow-2xl border-2 border-blue-200 flex flex-col">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6" />
              <div>
                <CardTitle className="text-lg font-semibold">Immigration Assistant</CardTitle>
                <p className="text-blue-100 text-sm">Powered by Canadian Immigration AI</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-blue-800 h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]">
            {messages.map((message) => (
                             <div
                 key={message.id}
                 className={`flex gap-2 items-start ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
               >
                                 {message.type === 'bot' && (
                   <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                     <Bot className="w-4 h-4 text-blue-600" />
                   </div>
                 )}
                
                                 <div className={`flex-1 min-w-0 ${message.type === 'user' ? 'max-w-[280px]' : 'max-w-[300px]'}`}>
                   <div
                     className={`rounded-lg p-3 word-wrap ${
                       message.type === 'user'
                         ? 'bg-blue-600 text-white'
                         : 'bg-gray-100 text-gray-800'
                     }`}
                   >
                     <p className="text-sm break-words whitespace-pre-wrap leading-relaxed">{message.content}</p>
                   </div>
                  
                  {/* Message metadata */}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(message.timestamp)}
                    </span>
                  </div>

                  {/* Sources */}
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <p className="text-xs font-medium text-gray-600">Sources:</p>
                      {message.sources.slice(0, 3).map((source) => (
                        <div
                          key={source.id}
                          className="text-xs bg-white border rounded p-2 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start gap-2">
                            <ExternalLink className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-blue-600 hover:underline block truncate"
                              >
                                {source.title}
                              </a>
                              <p className="text-gray-600 line-clamp-2">{source.snippet}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                                 {message.type === 'user' && (
                   <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                     <User className="w-4 h-4 text-white" />
                   </div>
                 )}
              </div>
            ))}

                         {/* Typing indicator */}
             {isTyping && (
               <div className="flex gap-2 items-start justify-start mb-4">
                 <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                   <Bot className="w-4 h-4 text-blue-600" />
                 </div>
                 <div className="bg-gray-100 rounded-lg p-3">
                   <div className="flex space-x-1">
                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                   </div>
                 </div>
               </div>
             )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t p-4 bg-white">
            <div className="flex gap-2 items-end">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about Canadian immigration..."
                className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm resize-none transition-all"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 h-12 px-4 transition-all"
                size="sm"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">
                Powered by IRCC official sources
              </p>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'online' ? 'bg-green-500' :
                  connectionStatus === 'offline' ? 'bg-red-500' :
                  'bg-yellow-500 animate-pulse'
                }`}></div>
                <span className="text-xs text-gray-500 capitalize">
                  {connectionStatus === 'checking' ? 'Connecting...' : connectionStatus}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 