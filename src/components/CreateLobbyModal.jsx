import React, { useState } from 'react';
import './common.css';

const CreateLobbyModal = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [password, setPassword] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Введите название комнаты';
    if (!description.trim()) newErrors.description = 'Введите описание';
    // пароль необязательный, но если есть, проверим?
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = () => {
    if (validate()) {
      onCreate({ title, password, description });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content create-lobby-modal">
        <div className="modal-header">
          <h2>Создание игровой сессии</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        
        <div className="form-group">
          <label>Название комнаты</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Введите название"
          />
          {errors.title && <span className="error">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label>Пароль (необязательно)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
          />
        </div>

        <div className="form-group">
          <label>Описание</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Опишите вашу комнату"
            rows="5"
          />
          {errors.description && <span className="error">{errors.description}</span>}
        </div>

        <div className="modal-actions">
          <button className="modal-button cancel" onClick={onClose}>Отмена</button>
          <button className="modal-button confirm" onClick={handleCreate}>Создать</button>
        </div>
      </div>
    </div>
  );
};

export default CreateLobbyModal;