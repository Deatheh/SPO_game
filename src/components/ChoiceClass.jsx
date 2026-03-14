// components/ChoiceClass.jsx
import React from 'react';
import './common.css';

const ChoiceClass = ({
  id,
  title,
  description,
  isSelected,
  isDisabled,
  onClick
}) => {
  const handleClick = () => {
    if (!isDisabled) onClick(id);
  };

  return (
    <div
      className={`choice-class ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
      onClick={handleClick}
    >
      <div className="class-overlay">
        <p className="class-description">{description}</p>
      </div>
      <div className="class-title-tooltip">{title}</div>
    </div>
  );
};

export default ChoiceClass;