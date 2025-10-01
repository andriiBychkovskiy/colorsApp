import React from 'react';

interface SectorButtonProps {
  colors: string[]; // Массив цветов
  size?: number; // Размер кнопки (по умолчанию 100px)
  onClick?: () => void; // Обработчик клика по кнопке
}

const SectorButton: React.FC<SectorButtonProps> = ({ colors, size = 100, onClick }) => {
  const radius = size / 2;
  const center = size / 2;
  const anglePerColor = 360 / colors.length;

  const createSectorPath = (startAngle: number, endAngle: number) => {
    const radians = (angle: number) => (Math.PI / 180) * angle;

    const x1 = center + radius * Math.cos(radians(startAngle));
    const y1 = center + radius * Math.sin(radians(startAngle));
    const x2 = center + radius * Math.cos(radians(endAngle));
    const y2 = center + radius * Math.sin(radians(endAngle));

    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  return (
    <div
      onClick={onClick}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'inline-block',
        position: 'relative',
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {colors.map((color, index) => {
          const startAngle = index * anglePerColor;
          const endAngle = startAngle + anglePerColor;

          return (
            <path
              key={index}
              d={createSectorPath(startAngle, endAngle)}
              fill={color}
              stroke="#fff" // Белая граница между секторами
              strokeWidth="1"
            />
          );
        })}
      </svg>
    </div>
  );
};

export default SectorButton;