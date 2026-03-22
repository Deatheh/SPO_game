// hooks/useWebSocket.js
import { useState, useEffect, useRef, useCallback } from 'react';

export const useWebSocket = (url) => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);

  const sendMessage = useCallback((message) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      console.log('Message sent:', message);
      return true;
    }
    console.log('WebSocket not open, readyState:', wsRef.current?.readyState);
    return false;
  }, []);

  const loadHistory = useCallback(async () => {
    try {
      console.log('Loading history from Redis...');
      const response = await fetch('http://localhost:8000/cache_message');
      console.log('History response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('History data:', data);
        
        if (data && data.arr && Array.isArray(data.arr)) {
          const historyMessages = data.arr
            .sort((a, b) => a.time - b.time)
            .map((msg) => ({
              id: msg.time,
              user: msg.author,
              text: msg.message,
              time: new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }));
          console.log('Processed history messages:', historyMessages);
          setMessages(historyMessages);
          return historyMessages;
        }
      } else {
        console.error('Failed to load history:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
      setError(error.message);
    }
    return [];
  }, []);

  useEffect(() => {
    console.log('Connecting to WebSocket:', url);
    
    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('✅ WebSocket connected successfully');
        setIsConnected(true);
        setError(null);
        loadHistory();
      };

      ws.onmessage = (event) => {
        console.log('📨 WebSocket message received:', event.data);
        try {
          const rawMessages = event.data.split('\n');
          
          rawMessages.forEach(raw => {
            if (raw.trim()) {
              const parsed = JSON.parse(raw);
              console.log('Parsed message:', parsed);
              
              const newMessage = {
                id: parsed.time,
                user: parsed.author,
                text: parsed.message,
                time: new Date(parsed.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              };
              
              setMessages(prev => {
                if (!prev.some(m => m.id === newMessage.id)) {
                  console.log('Adding new message:', newMessage);
                  return [...prev, newMessage];
                }
                return prev;
              });
            }
          });
        } catch (error) {
          console.error('Failed to parse message:', error, 'Raw data:', event.data);
        }
      };

      ws.onclose = (event) => {
        console.log('❌ WebSocket disconnected:', event.code, event.reason);
        setIsConnected(false);
      };

      ws.onerror = (error) => {
        console.error('⚠️ WebSocket error:', error);
        setError('WebSocket connection error');
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      setError(error.message);
    }

    return () => {
      console.log('Cleaning up WebSocket connection');
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [url, loadHistory]);

  return { messages, sendMessage, isConnected, error };
};