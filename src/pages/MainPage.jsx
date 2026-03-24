// src/pages/MainPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateLobbyModal from '../components/CreateLobbyModal';
import ClassChoiceModal from '../components/ClassChoiceModal'; // Добавляем импорт
import '../components/common.css';

const MainPage = () => {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [selectedLobby, setSelectedLobby] = useState(null);
  const [isHost, setIsHost] = useState(false);
  
  // Моковые данные для лобби
  const [lobbies, setLobbies] = useState([
    { 
      id: 1, 
      name: 'Комната 1', 
      description: 'Битва магов', 
      players: 2, 
      maxPlayers: 4,
      roomCode: 'ABC-123'
    },
    { 
      id: 2, 
      name: 'Комната 2', 
      description: 'Тренировочный бой', 
      players: 1, 
      maxPlayers: 2,
      roomCode: 'XYZ-789'
    },
  ]);

  const handleCreateLobby = (lobbyData) => {
    const newLobby = {
      id: Date.now(),
      ...lobbyData,
      players: 1,
      maxPlayers: 4,
      roomCode: Math.random().toString(36).substring(2, 8).toUpperCase()
    };
    setLobbies([...lobbies, newLobby]);
    setIsCreateModalOpen(false);
    
    // Открываем модалку выбора класса для хоста
    setSelectedLobby(newLobby);
    setIsHost(true);
    setIsClassModalOpen(true);
  };

  const handleJoinLobby = (lobby) => {
    // Открываем модалку выбора класса для игрока
    setSelectedLobby(lobby);
    setIsHost(false);
    setIsClassModalOpen(true);
  };

  const handleClassConfirm = (playerData) => {
    // После выбора класса переходим в лобби
    setIsClassModalOpen(false);
    navigate(`/lobby/${selectedLobby.roomCode}`, { 
      state: { 
        isHost: isHost,
        lobbyData: selectedLobby,
        playerData: playerData // Передаем данные игрока
      } 
    });
  };

  return (
    <div className="main-container">
      <CreateLobbyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateLobby}
      />
      
      <ClassChoiceModal
        isOpen={isClassModalOpen}
        onClose={() => {
          setIsClassModalOpen(false);
          setSelectedLobby(null);
          setIsHost(false);
        }}
        onConfirm={handleClassConfirm}
      />

      <div className="content">
        <h1 className="game-title">Project Spell</h1>
        
        <h2 className="lobby-list-title">Доступные игровые сессии</h2>
        
        <div className="lobby-list-container">
          <div className="lobby-list">
            {/* Кнопка создания лобби в списке */}
            <button 
              className="create-lobby-button-inline"
              onClick={() => setIsCreateModalOpen(true)}
            >
              + Создать новую игровую сессию
            </button>

            {/* Список лобби */}
            {lobbies.map(lobby => (
              <div key={lobby.id} className="lobby-card">
                <div className="lobby-info">
                  <div className="lobby-header">
                    <h3 className="lobby-title">{lobby.name}</h3>
                    <span className="people-count">
                      {lobby.players}/{lobby.maxPlayers}
                    </span>
                  </div>
                  <p className="lobby-description">{lobby.description}</p>
                  <p style={{ color: '#666', marginTop: '0.5rem' }}>
                    Код: {lobby.roomCode}
                  </p>
                </div>
                <button 
                  className="join-button"
                  onClick={() => handleJoinLobby(lobby)}
                >
                  Присоединиться
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;