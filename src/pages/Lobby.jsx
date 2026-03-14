// src/pages/Lobby.jsx
import React, { useState } from 'react';
import ClassChoiceModal from '../components/ClassChoiceModal';
import Chat from '../components/Chat';
import BattleGame from '../components/BattleGame'; // Импортируем полный компонент игры
import '../components/common.css';

const Lobby = ({ roomData, onExit }) => {
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [playerData, setPlayerData] = useState({
    nickname: 'выван',
    class: {
      id: 2,
      title: 'Химик',
      description: 'Повелитель кислот и реактивов',
      image: '/pic/valshebni.png'
    }
  });
  const [roomCode] = useState(roomData?.roomCode || 'LOB-1');
  const isHost = roomData?.isHost || false;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    alert('Код комнаты скопирован!');
  };

  const handleClassChange = (newClassData) => {
    setPlayerData({
      nickname: newClassData.nickname,
      class: newClassData.class
    });
    setIsClassModalOpen(false);
  };

  const handleToggleReady = () => {
    // При нажатии на готовность сразу показываем игру
    setGameStarted(true);
  };

  // Если игра началась - показываем BattleGame на весь экран
  if (gameStarted) {
    return <BattleGame 
      onExit={() => setGameStarted(false)} 
      playerData={playerData}
      roomCode={roomCode}
    />;
  }

  // Иначе показываем лобби
  return (
    <div className="lobby-screen">
      <ClassChoiceModal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
        onConfirm={handleClassChange}
        initialSelectedClass={playerData.class?.id}
      />

      {/* Левая часть */}
      <div className="lobby-left">
        <div className="lobby-header">
          <button className="header-button exit" onClick={onExit}>
            Выход
          </button>
          <button className="header-button change-class" onClick={() => setIsClassModalOpen(true)}>
            Смена класса
          </button>
          <div className="room-code" onClick={handleCopyCode}>
            <span>Код: {roomCode}</span>
            <span className="copy-icon">📋</span>
          </div>
        </div>

        {/* Отображение выбранного класса */}
        {playerData.class && (
          <div className="selected-class-display">
            <div 
              className="class-image-large"
              style={{ backgroundImage: `url(${playerData.class.image})` }}
            >
              <div className="class-overlay">
                <p className="class-description">{playerData.class.description}</p>
              </div>
            </div>
            <div className="class-info">
              <h2 className="class-title">{playerData.class.title}</h2>
              <p className="player-nickname">Игрок: {playerData.nickname}</p>
            </div>
          </div>
        )}

        {/* Кнопка готовности */}
        <button 
          className="ready-button ready" 
          onClick={handleToggleReady}
        >
          Готов ✓
        </button>
      </div>

      {/* Правая часть - чат */}
      <div className="lobby-right">
        <Chat messages={[
          { id: 1, user: 'Игрок1', text: 'Всем привет!', time: '12:34' },
          { id: 2, user: 'Игрок2', text: 'Готовы?', time: '12:35' },
        ]} />
      </div>
    </div>
  );
};

export default Lobby;