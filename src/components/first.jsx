// components/first.jsx
import React from 'react';
import './common.css';

const First = ({ title, description, peopleCount, onJoin }) => {
  return (
    <div className="lobby-card">
      <div className="lobby-info">
        <div className="lobby-header">
          <h3 className="lobby-title">{title}</h3>
          <span className="people-count">👥 {peopleCount}</span>
        </div>
        <p className="lobby-description">{description}</p>
      </div>
      <button className="join-button" onClick={onJoin}>
        Присоединиться
      </button>
    </div>
  );
};

export default First;