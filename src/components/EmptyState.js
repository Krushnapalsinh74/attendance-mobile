import React from 'react';
import './EmptyState.css';

const EmptyState = ({ icon, text, children }) => {
  return (
    <div className="empty-state">
      {icon && <div className="empty-state-icon">{icon}</div>}
      {text && <p className="empty-state-text">{text}</p>}
      {children}
    </div>
  );
};

export default EmptyState;
