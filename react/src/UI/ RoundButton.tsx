import React from 'react';
import { Box } from '@mui/material';

interface RoundButtonProps {
  imageSrc: string; // URL изображения
  onClick: () => void; // Обработчик клика
  size?: number; // Размер кнопки (по умолчанию 60px)
  altText?: string; // Альтернативный текст для изображения
}

const RoundButton: React.FC<RoundButtonProps> = ({ imageSrc, onClick, size = 60, altText = 'Button Image' }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        backgroundColor: '#ffffff', // Фон кнопки
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Тень
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.1)', // Увеличение при наведении
        },
      }}
    >
      <img
        src={imageSrc}
        alt={altText}
        style={{
          width: '80%', // Изображение занимает 80% кнопки
          height: '80%',
          objectFit: 'cover', // Сохранение пропорций изображения
        }}
      />
    </Box>
  );
};

export default RoundButton;