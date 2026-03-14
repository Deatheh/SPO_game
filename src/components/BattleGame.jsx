// src/components/BattleGame.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import demaniImage from '../pic/demani.png';
import valshebniImage from '../pic/valshebni.png';
import palyankaImage from '../pic/palyanka.png';

const BattleGame = ({ onExit, playerData, roomCode }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, user: 'Босс', text: 'Ты явился... Первый ход за тобой, мерзкий человечишка.', time: '21:59' }
  ]);
  const [spellText, setSpellText] = useState('');
  const [timeLeft, setTimeLeft] = useState(30); // Устанавливаем 30 секунд
  const [gameActive, setGameActive] = useState(true); // Игра активна
  const [bossHealth, setBossHealth] = useState(100);
  const [playerHealth, setPlayerHealth] = useState(100);
  
  const chatBoxRef = useRef(null);
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  // Инициализация чата и запуск таймера
  useEffect(() => {
    // Запускаем таймер при входе в игру
    startTimer();
    
    // Фокус на поле ввода
    if (inputRef.current) {
      inputRef.current.focus();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []); // Пустой массив зависимостей - выполняется один раз при монтировании

  // Автоскролл
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const startTimer = () => {
    // Сбрасываем таймер на 30 секунд
    setTimeLeft(30);
    setGameActive(true);
    
    // Очищаем предыдущий интервал если есть
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Запускаем новый интервал
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setGameActive(false);
          addBossMessage('Ты тратишь моё время. И свою никчёмную жизнь. Такой бездарь мне не соперник.');
          addBossMessage('Надежды нет...');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const addPlayerMessage = (text) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      user: playerData?.nickname || 'выван',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  const addBossMessage = (text) => {
    setMessages(prev => [...prev, {
      id: Date.now() + 1,
      user: 'Босс',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (spellText.trim() && gameActive) {
      addPlayerMessage(spellText);
      setSpellText('');
      
      // Случайное изменение здоровья
      setBossHealth(Math.ceil(Math.random() * 100));
      setPlayerHealth(Math.ceil(Math.random() * 100));
      
      // Сброс таймера при отправке сообщения
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

  const handleExitGame = () => {
    if (onExit) {
      onExit();
    } else {
      navigate(`/lobby/${roomCode}`);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
      {/* Левая часть - боевая арена */}
      <div style={{ 
        flex: '1',
        background: 'linear-gradient(blue, green)',
        backgroundImage: `url(${palyankaImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        padding: '3rem 1rem',
        display: 'grid',
        gridTemplateRows: '1fr 1fr',
        gap: '5rem',
        position: 'relative'
      }}>
        {/* Кнопка выхода из игры */}
        <button 
          onClick={handleExitGame}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            padding: '10px 20px',
            backgroundColor: '#460404',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontFamily: 'Preciosa, sans-serif',
            fontSize: '1.2rem',
            zIndex: 10
          }}
        >
          Выйти из боя
        </button>

        {/* Информация об игроке */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: '#EEFF00',
          padding: '10px 20px',
          borderRadius: '10px',
          zIndex: 10,
          fontFamily: 'Preciosa, sans-serif',
          fontSize: '1.2rem'
        }}>
          {playerData.class?.title} | {playerData.nickname}
        </div>

        {/* Код комнаты */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '5px 15px',
          borderRadius: '20px',
          zIndex: 10,
          fontFamily: 'Preciosa, sans-serif',
          fontSize: '1rem'
        }}>
          Код: {roomCode}
        </div>

        {/* Босс */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifySelf: 'end' 
        }}>
          <progress 
            max="100" 
            value={bossHealth}
            style={{
              width: '15rem',
              height: '20px',
              transform: 'rotate(-90deg)'
            }}
          />
          <img 
            src={demaniImage}
            style={{ 
              width: '100%', 
              maxHeight: '40vh', 
              objectFit: 'contain' 
            }}
            alt="Босс"
          />
        </div>

        {/* Игрок */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifySelf: 'start' 
        }}>
          <progress 
            max="100" 
            value={playerHealth}
            style={{
              width: '15rem',
              height: '20px',
              transform: 'rotate(-90deg)'
            }}
          />
          <img 
            src={valshebniImage}
            style={{ 
              width: '100%', 
              maxHeight: '40vh', 
              objectFit: 'contain' 
            }}
            alt="Игрок"
          />
        </div>
      </div>

      {/* Правая часть - чат */}
      <div style={{ 
        flex: '1',
        backgroundColor: '#234231',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        minWidth: '500px'
      }}>
        <div className="chat-container" style={{ height: '100%' }}>
          <div className="chat-header">
            <h3 style={{ fontSize: '2rem' }}>Чат магии</h3>
            <div style={{ 
              fontSize: '1.5rem', 
              color: 'white',
              marginTop: '0.5rem',
              textAlign: 'center'
            }}>
              Время: <span style={{ color: timeLeft <= 5 ? 'red' : '#EEFF00' }}>
                {timeLeft}
              </span> с
            </div>
          </div>

          <div 
            ref={chatBoxRef}
            className="chat-messages"
            style={{ fontSize: '1.2rem' }}
          >
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`chat-message ${msg.user === playerData?.nickname ? 'own-message' : ''}`}
                style={{ fontSize: '1.2rem' }}
              >
                <div className="message-header">
                  <span className="message-user" style={{ fontSize: '1.3rem' }}>{msg.user}</span>
                  <span className="message-time" style={{ fontSize: '1rem' }}>{msg.time}</span>
                </div>
                <div className="message-text" style={{ fontSize: '1.2rem' }}>{msg.text}</div>
              </div>
            ))}
          </div>

          <form 
            onSubmit={handleSubmit}
            className="chat-input-area"
            style={{ padding: '1.5rem' }}
          >
            <input
              ref={inputRef}
              type="text"
              value={spellText}
              onChange={(e) => setSpellText(e.target.value)}
              placeholder={gameActive ? "Введите сообщение..." : "Надежды нет...🩸"}
              disabled={!gameActive}
              style={{
                fontSize: '1.2rem',
                padding: '1rem'
              }}
            />
            <button
              type="submit"
              disabled={!gameActive}
              style={{
                fontSize: '1.2rem',
                padding: '1rem 2rem'
              }}
            >
              {gameActive ? 'Отправить' : '💔'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BattleGame;