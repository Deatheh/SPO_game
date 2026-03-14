// src/pages/GamePage.jsx
import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import BattleGame from '../components/BattleGame';

const GamePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { roomCode } = useParams();
  
  // Получаем данные из state
  const { playerData, isHost } = location.state || {};

  const handleExit = () => {
    // Возвращаемся в лобби с сохранением данных игрока
    navigate(`/lobby/${roomCode}`, { 
      state: { 
        isHost,
        playerData,
        lobbyData: { roomCode }
      } 
    });
  };

  // Если нет данных игрока, показываем заглушку
  if (!playerData) {
    return <div>Ошибка: данные игрока не найдены</div>;
  }

  return (
    <BattleGame 
      onExit={handleExit}
      playerData={playerData}
      roomCode={roomCode}
    />
  );
};

export default GamePage;