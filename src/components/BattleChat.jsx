// src/components/BattleChat.jsx
import React, { useState, useEffect, useRef } from 'react';

const BattleChat = ({ playerData }) => {
  const [messages, setMessages] = useState([]);
  const [spellText, setSpellText] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(true);
  const chatBoxRef = useRef(null);
  const timerRef = useRef(null);

  // Инициализация чата
  useEffect(() => {
    addBossMessage('Ты явился... Первый ход за тобой, мерзкий человечишка.');
    startTimer();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Автоскролл
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const startTimer = () => {
    setTimeLeft(30);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setGameActive(false);
          addBossMessage('Ты тратишь моё время. И свою никчёмную жизнь. Такой бездарь мне не соперник.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const addPlayerMessage = (text) => {
    setMessages(prev => [...prev, {
      type: 'player',
      sender: playerData?.nickname || 'Вы',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  const addBossMessage = (text) => {
    setMessages(prev => [...prev, {
      type: 'boss',
      sender: 'Босс',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (spellText.trim() && gameActive) {
      addPlayerMessage(spellText);
      setSpellText('');
      
      // Сброс таймера
      clearInterval(timerRef.current);
      startTimer();
      
      // Ответ босса
      setTimeout(() => {
        addBossMessage(getRandomBossResponse());
      }, 500);
    }
  };

  const getRandomBossResponse = () => {
    const responses = [
      'Ого, цветные огоньки! В цирке выступать будешь.',
      'А... понял. Ты пытаешься меня утомить? Скукой?',
      'Твоя магия воняет людским потом. Это отвратительно.',
      'Попробуй еще раз, паразит!',
      'Жалкий человечишка!',
      'Твоя магия слаба, как ты сам!'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: '#234231',
      color: 'white',
      padding: '1rem',
      fontFamily: 'Preciosa, sans-serif'
    }}>
      {/* Заголовок чата с информацией об игроке */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        marginBottom: '0.5rem',
        padding: '0.5rem',
        backgroundColor: '#1a2f1f',
        borderRadius: '10px'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#EEFF00' }}>Чат магии</h1>
        <div style={{ fontSize: '1rem', color: '#EEFF00', marginTop: '0.2rem' }}>
          {playerData?.class?.title} | {playerData?.nickname}
        </div>
        <div style={{ fontSize: '1.2rem', marginTop: '0.2rem' }}>
          Время: <span style={{ color: timeLeft <= 5 ? 'red' : '#EEFF00' }}>
            {timeLeft}
          </span> с
        </div>
      </div>

      {/* Сообщения */}
      <div 
        ref={chatBoxRef}
        style={{ 
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '0.5rem',
          backgroundColor: '#1a2f1f',
          borderRadius: '10px',
          marginBottom: '1rem'
        }}
      >
        {messages.map((msg, index) => (
          <div 
            key={index}
            style={{
              backgroundColor: msg.type === 'boss' ? '#2a3f2a' : '#386B50',
              border: '2px solid',
              borderColor: msg.type === 'boss' ? '#460404' : '#EEFF00',
              borderRadius: '10px',
              margin: '0.5rem 0',
              padding: '8px',
              maxWidth: '90%',
              marginLeft: msg.type === 'player' ? 'auto' : '0'
            }}
          >
            <strong style={{ 
              fontSize: '1.2rem',
              color: msg.type === 'boss' ? '#ff6666' : '#EEFF00'
            }}>
              {msg.sender}
            </strong>
            <div style={{ fontSize: '1rem', marginTop: '4px' }}>{msg.text}</div>
            <div style={{ fontSize: '0.7rem', color: '#aaa', textAlign: 'right', marginTop: '4px' }}>
              {msg.time}
            </div>
          </div>
        ))}
      </div>

      {/* Форма ввода */}
      <form 
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginTop: 'auto',
          padding: '0.5rem',
          backgroundColor: '#1a2f1f',
          borderRadius: '10px'
        }}
      >
        <input
          type="text"
          value={spellText}
          onChange={(e) => setSpellText(e.target.value)}
          placeholder={gameActive ? "Введите сообщение..." : "Надежды нет...🩸"}
          disabled={!gameActive}
          style={{
            flex: 1,
            padding: '0.6rem',
            fontSize: '1rem',
            fontFamily: 'Preciosa, sans-serif',
            border: '2px solid #386B50',
            borderRadius: '8px',
            backgroundColor: !gameActive ? '#0f021e' : 'white',
            color: !gameActive ? 'red' : 'black',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          disabled={!gameActive}
          style={{
            padding: '0.6rem 1.2rem',
            fontSize: '1rem',
            backgroundColor: !gameActive ? '#0f021e' : '#EEFF00',
            color: !gameActive ? 'red' : '#234231',
            border: '2px solid #386B50',
            borderRadius: '8px',
            cursor: !gameActive ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            whiteSpace: 'nowrap'
          }}
        >
          {gameActive ? '✨ Отправить' : '💔'}
        </button>
      </form>
    </div>
  );
};

export default BattleChat;