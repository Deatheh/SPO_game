// Main.jsx
import React, { useState } from 'react';
import First from '../components/first';
import ClassChoiceModal from '../components/ClassChoiceModal';
import CreateLobbyModal from '../components/CreateLobbyModal';
import Lobby from './Lobby';
import '../components/common.css';

const Main = () => {
  const [currentScreen, setCurrentScreen] = useState('main'); // 'main' или 'lobby'
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedLobby, setSelectedLobby] = useState(null);
  const [playerData, setPlayerData] = useState(null);
  const [lobbyDetails, setLobbyDetails] = useState(null); // данные созданной комнаты
  const [isHost, setIsHost] = useState(false);

  // Добавил больше лобби для демонстрации прокрутки
  const lobbies = [
    { id: 1, title: 'Вечерний матч', description: 'Играем в футбол 5х5', people: 4 },
    { id: 2, title: 'Клуб настольных игр', description: 'Ищем компанию для Манчкина', people: 3 },
    { id: 3, title: 'Новая игра', description: 'Заходим', people: 4 },
    { id: 4, title: 'Вечерний матч 2', description: 'Играем в футбол 5х5', people: 5 },
    { id: 5, title: 'Клуб настольных игр 2', description: 'Ищем компанию для Манчкина', people: 2 },
    { id: 6, title: 'Новая игра 2', description: 'Заходим', people: 6 },
    { id: 7, title: 'Вечерний матч 3', description: 'Играем в футбол 5х5', people: 3 },
    { id: 8, title: 'Клуб настольных игр 3', description: 'Ищем компанию для Манчкина', people: 4 },
  ];

  // Присоединение к существующему лобби
  const handleJoinLobby = (lobby) => {
    setSelectedLobby(lobby);
    setIsHost(false);
    setIsClassModalOpen(true);
  };

  // Создание нового лобби
  const handleCreateLobby = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateConfirm = (details) => {
    setLobbyDetails(details);
    setIsCreateModalOpen(false);
    setIsHost(true);
    setIsClassModalOpen(true); // открываем выбор класса для хоста
  };

  // Подтверждение выбора класса и ника
  const handleClassConfirm = (data) => {
    setPlayerData(data);
    setIsClassModalOpen(false);
    setCurrentScreen('lobby');
  };

  const handleExitLobby = () => {
    setCurrentScreen('main');
    setSelectedLobby(null);
    setLobbyDetails(null);
    setPlayerData(null);
    setIsHost(false);
  };

  if (currentScreen === 'lobby') {
    // Для лобби передаём данные: либо из выбранного лобби, либо из созданного
    const roomData = {
      ...(selectedLobby || lobbyDetails),
      ...playerData,
      isHost, // флаг хоста
      roomCode: selectedLobby ? `LOB-${selectedLobby.id}` : 'NEW-123', // заглушка кода
    };
    return (
      <Lobby 
        roomData={roomData}
        onExit={handleExitLobby}
      />
    );
  }

  return (
    <div className="main-container">
      <ClassChoiceModal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
        onConfirm={handleClassConfirm}
      />
      
      <CreateLobbyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateConfirm}
      />

      <div className="content">
        <h1 className="game-title">Название игры</h1>
        <h2 className="lobby-list-title">список лобби</h2>
        
        {/* Добавляем контейнер с прокруткой */}
        <div className="lobby-list-container">
          <div className="lobby-list">
            {/* Кнопка создания лобби в начале списка */}
            <button
              className="create-lobby-button-inline"
              onClick={handleCreateLobby}
            >
              + Создать новое лобби
            </button>
            
            {/* Существующие лобби */}
            {lobbies.map(lobby => (
              <First
                key={lobby.id}
                title={lobby.title}
                description={lobby.description}
                peopleCount={lobby.people}
                onJoin={() => handleJoinLobby(lobby)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;