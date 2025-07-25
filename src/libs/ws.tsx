'use client'

import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import ReconnectingWebSocket from 'reconnecting-websocket'

interface WSMessage {
  type: string
  payload: any
  timestamp: string
}

interface WSContextType {
  ws: ReconnectingWebSocket | null
  isConnected: boolean
  sendMessage: (message: WSMessage) => void
  subscribe: (type: string, handler: (payload: any) => void) => () => void
}

const WSContext = createContext<WSContextType | null>(null)

interface WSProviderProps {
  children: React.ReactNode
}

export function WSProvider({ children }: WSProviderProps) {
  const [isConnected, setIsConnected] = useState(false)
  const wsRef = useRef<ReconnectingWebSocket | null>(null)
  const subscribersRef = useRef<Map<string, Set<(payload: any) => void>>>(new Map())

  useEffect(() => {
    // Skip WebSocket connection for Phase 1 - only needed for real-time features
    const ENABLE_WEBSOCKET = process.env.NEXT_PUBLIC_ENABLE_WEBSOCKET === 'true'
    
    if (!ENABLE_WEBSOCKET) {
      console.log('WebSocket disabled - Enable with NEXT_PUBLIC_ENABLE_WEBSOCKET=true')
      return
    }
    
    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws'
    
    const ws = new ReconnectingWebSocket(WS_URL, [], {
      maxReconnectionDelay: 10000,
      minReconnectionDelay: 1000,
      reconnectionDelayGrowFactor: 1.3,
      maxRetries: 10,
    })

    ws.addEventListener('open', () => {
      console.log('WebSocket connected')
      setIsConnected(true)
    })

    ws.addEventListener('close', () => {
      console.log('WebSocket disconnected')
      setIsConnected(false)
    })

    ws.addEventListener('message', (event) => {
      try {
        const message: WSMessage = JSON.parse(event.data)
        const subscribers = subscribersRef.current.get(message.type)
        
        if (subscribers) {
          subscribers.forEach(handler => {
            try {
              handler(message.payload)
            } catch (error) {
              console.error('Error handling WebSocket message:', error)
            }
          })
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    })

    wsRef.current = ws

    return () => {
      ws.close()
    }
  }, [])

  const sendMessage = (message: WSMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket is not connected')
    }
  }

  const subscribe = (type: string, handler: (payload: any) => void) => {
    if (!subscribersRef.current.has(type)) {
      subscribersRef.current.set(type, new Set())
    }
    
    subscribersRef.current.get(type)!.add(handler)
    
    // Return unsubscribe function
    return () => {
      const typeSubscribers = subscribersRef.current.get(type)
      if (typeSubscribers) {
        typeSubscribers.delete(handler)
        if (typeSubscribers.size === 0) {
          subscribersRef.current.delete(type)
        }
      }
    }
  }

  const value: WSContextType = {
    ws: wsRef.current,
    isConnected,
    sendMessage,
    subscribe
  }

  return (
    <WSContext.Provider value={value}>
      {children}
    </WSContext.Provider>
  )
}

export function useWS() {
  const context = useContext(WSContext)
  if (!context) {
    throw new Error('useWS must be used within a WSProvider')
  }
  return context
} 