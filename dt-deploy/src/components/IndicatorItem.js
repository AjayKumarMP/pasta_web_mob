import React from 'react';

const IndicatorItem = ({ index, selection }) => {
  return (
    <>
      {index === selection && (
        <svg xmlns='http://www.w3.org/2000/svg' width='35.477' height='68.299' viewBox='0 0 35.477 68.299'>
          <defs>
            <filter id='Rectangle_133' x='0' y='0' width='35.477' height='68.299' filterUnits='userSpaceOnUse'>
              <feOffset input='SourceAlpha' />
              <feGaussianBlur stdDeviation='3' result='blur' />
              <feFlood floodOpacity='0.251' />
              <feComposite operator='in' in2='blur' />
              <feComposite in='SourceGraphic' />
            </filter>
          </defs>
          <g transform='matrix(1, 0, 0, 1, 0, 0)' filter='url(#Rectangle_133)'>
            <rect
              id='Rectangle_133-2'
              data-name='Rectangle 133'
              width='17.477'
              height='50.299'
              rx='8.739'
              transform='translate(9 9)'
            />
          </g>
        </svg>
      )}
      {index > selection && (
        <svg xmlns='http://www.w3.org/2000/svg' width='35.477' height='35.477' viewBox='0 0 35.477 35.477'>
          <defs>
            <filter id='Ellipse_48' x='0' y='0' width='35.477' height='35.477' filterUnits='userSpaceOnUse'>
              <feOffset input='SourceAlpha' />
              <feGaussianBlur stdDeviation='3' result='blur' />
              <feFlood floodOpacity='0.251' />
              <feComposite operator='in' in2='blur' />
              <feComposite in='SourceGraphic' />
            </filter>
          </defs>
          <g transform='matrix(1, 0, 0, 1, 0, 0)' filter='url(#Ellipse_48)'>
            <circle
              id='Ellipse_48-2'
              data-name='Ellipse 48'
              cx='8.739'
              cy='8.739'
              r='8.739'
              transform='translate(26.48 26.48) rotate(180)'
              opacity='0.2'
            />
          </g>
        </svg>
      )}
      {index < selection && (
        <svg xmlns='http://www.w3.org/2000/svg' width='35.477' height='35.477' viewBox='0 0 35.477 35.477'>
          <defs>
            <filter id='Ellipse_11' x='0' y='0' width='35.477' height='35.477' filterUnits='userSpaceOnUse'>
              <feOffset input='SourceAlpha' />
              <feGaussianBlur stdDeviation='3' result='blur' />
              <feFlood floodOpacity='0.251' />
              <feComposite operator='in' in2='blur' />
              <feComposite in='SourceGraphic' />
            </filter>
          </defs>
          <g transform='matrix(1, 0, 0, 1, 0, 0)' filter='url(#Ellipse_11)'>
            <circle
              id='Ellipse_11-2'
              data-name='Ellipse 11'
              cx='8.739'
              cy='8.739'
              r='8.739'
              transform='translate(26.48 26.48) rotate(180)'
              opacity='0.87'
            />
          </g>
        </svg>
      )}
    </>
  );
};

export default IndicatorItem;
