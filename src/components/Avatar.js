import React from 'react';
import PropTypes from 'prop-types';
import './Avatar.css';

/**
 * Avatar component that displays user image or initials fallback
 * @param {string} src - Image URL
 * @param {string} name - User's full name (used for initials)
 * @param {string} size - Avatar size: 'small', 'medium', 'large'
 * @param {string} alt - Alt text for image
 */
const Avatar = ({ src, name = '', size = 'medium', alt = 'User avatar' }) => {
  const [imageError, setImageError] = React.useState(false);

  // Extract initials from name
  const getInitials = (fullName) => {
    if (!fullName) return '?';
    
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  // Generate consistent color based on name
  const getAvatarColor = (fullName) => {
    if (!fullName) return '#6c757d';
    
    const colors = [
      '#007bff', '#6610f2', '#6f42c1', '#e83e8c',
      '#dc3545', '#fd7e14', '#ffc107', '#28a745',
      '#20c997', '#17a2b8', '#6c757d', '#343a40'
    ];
    
    let hash = 0;
    for (let i = 0; i < fullName.length; i++) {
      hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const initials = getInitials(name);
  const backgroundColor = getAvatarColor(name);
  const showInitials = !src || imageError;

  return (
    <div 
      className={`avatar avatar--${size}`}
      style={showInitials ? { backgroundColor } : {}}
    >
      {showInitials ? (
        <span className="avatar__initials">{initials}</span>
      ) : (
        <img
          src={src}
          alt={alt}
          className="avatar__image"
          onError={handleImageError}
        />
      )}
    </div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  alt: PropTypes.string
};

export default Avatar;
