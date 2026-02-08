import React from 'react';
import { Search, X } from 'lucide-react';
import './SearchBar.css';

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Search...",
  onClear 
}) => {
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      onChange({ target: { value: '' } });
    }
  };

  return (
    <div className="search-bar">
      <Search className="search-icon" size={20} />
      <input
        type="text"
        className="search-input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {value && (
        <button 
          className="clear-button" 
          onClick={handleClear}
          aria-label="Clear search"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
