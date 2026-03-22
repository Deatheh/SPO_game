// components/Chat.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import './common.css';

const Chat = ({ roomCode, currentUser = 'Игрок' }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  
  const wsUrl = `ws://${window.location.hostname}:8000/ws`;
  const { messages, sendMessage, isConnected, error } = useWebSocket(wsUrl);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && isConnected) {
      const messageToSend = {
        author: currentUser,
        message: newMessage.trim(),
        time: Date.now()
      };
      
      console.log('Sending message:', messageToSend);
      const success = sendMessage(messageToSend);
      if (success) {
        setNewMessage('');
      } else {
        console.error('Failed to send message');
      }
    } else if (!isConnected) {
      console.log('Cannot send: WebSocket not connected');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Чат комнаты {roomCode && `(Код: ${roomCode})`}</h3>
        <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? '● Подключено' : error ? '⚠️ Ошибка' : '○ Подключение...'}
        </div>
      </div>
      
      {error && (
        <div className="chat-error">
          Ошибка: {error}
        </div>
      )}
      
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="empty-chat">Нет сообщений. Напишите что-нибудь!</div>
        )}
        {messages.map(msg => (
          <div key={msg.id} className={`chat-message ${msg.user === currentUser ? 'own-message' : ''}`}>
            <div className="message-header">
              <span className="message-user">{msg.user}</span>
              <span className="message-time">{msg.time}</span>
            </div>
            <div className="message-text">{msg.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isConnected ? "Введите сообщение..." : error ? "Ошибка подключения" : "Подключение к чату..."}
          disabled={!isConnected}
        />
        <button onClick={handleSendMessage} disabled={!isConnected}>
          Отправить
        </button>
      </div>
    </div>
  );
};

export default Chat;