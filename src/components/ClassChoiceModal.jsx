// components/ClassChoiceModal.jsx
import React, { useState } from 'react';
import ChoiceClass from './ChoiceClass';
import './common.css';

const ClassChoiceModal = ({ isOpen, onClose, onConfirm, initialSelectedClass = null }) => {
  const [selectedClass, setSelectedClass] = useState(initialSelectedClass);
  const [nickname, setNickname] = useState('');
  const [nicknameError, setNicknameError] = useState('');

  // Данные для классов с правильным путем к изображению волшебника
  const classes = [
    { id: 1, title: 'Изобретатель', description: 'Создаст всё'},
    { id: 2, title: 'Aлхимик', description: 'Преобразует вещества'},
    { id: 3, title: 'Рассказчик', description: 'Мастер слова'},
    { id: 4, title: 'Жрец', description: 'Воскресит из мёртвых'},
  ];

  const validateNickname = (name) => {
    const regex = /^[a-zA-Zа-яА-ЯёЁ0-9_]+$/;
    if (!name.trim()) return 'Никнейм не может быть пустым';
    if (!regex.test(name)) return 'Только буквы и цифры (без пробелов и спецсимволов)';
    return '';
  };

  const handleClassClick = (id) => {
    setSelectedClass(selectedClass === id ? null : id);
  };

  const handleSubmit = () => {
    // Валидация ника
    const err = validateNickname(nickname);
    if (err) {
      setNicknameError(err);
      return;
    }

    // Проверка выбора класса
    if (!selectedClass) {
      alert('Пожалуйста, выберите класс');
      return;
    }

    // Находим выбранный класс
    const chosenClass = classes.find(c => c.id === selectedClass);
    
    // Передаём данные обратно
    onConfirm({
      nickname: nickname.trim(),
      class: chosenClass
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content class-choice-modal">
        <h2>Выберите класс</h2>
        
        <div className="nickname-input-container">
          <h3>Введите никнейм</h3>
          <input
            type="text"
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
              setNicknameError('');
            }}
            placeholder="Ваш ник"
          />
          {nicknameError && <p className="error">{nicknameError}</p>}
        </div>

        <div className={`classes-grid ${selectedClass ? 'has-selected' : ''}`}>
          {classes.map(cls => (
            <ChoiceClass
              key={cls.id}
              id={cls.id}
              title={cls.title}
              description={cls.description}
              isSelected={selectedClass === cls.id}
              isDisabled={false}
              onClick={handleClassClick}
            />
          ))}
        </div>

        <div className="modal-actions">
          <button className="modal-button cancel" onClick={onClose}>Отмена</button>
          <button className="modal-button confirm" onClick={handleSubmit}>Готово</button>
        </div>
      </div>
    </div>
  );
};

export default ClassChoiceModal;