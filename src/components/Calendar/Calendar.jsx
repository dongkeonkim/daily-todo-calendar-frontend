import React from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

// Generate contributions data for one year
const generateContributions = () => {
  const contributions = [];
  const totalDays = 365;

  // Generate random contributions for each day in the year
  for (let day = 0; day < totalDays; day++) {
    const contributionsCount = Math.floor(Math.random() * 10); // Random number of contributions (up to 10)
    contributions.push(contributionsCount);
  }

  return contributions;
};

const contributions = generateContributions();

const cellSize = '14px'; // Set the size of each cell

const dayStyle = {
  width: cellSize,
  height: cellSize,
  border: '1px solid #e1e4e8',
  backgroundColor: '#ebedf0',
  justifySelf: 'center', // Center horizontally
  alignSelf: 'center', // Center vertically
  cursor: 'pointer', // Add cursor pointer when hovering
};

const contributionStyle = {
  backgroundColor: '#c6e48b',
};

const Calendar = () => {
  const totalTasks = 100;
  const completedTasks = 20;
  const progressPercentage = (completedTasks / totalTasks) * 100;

  return (
    <>
      <div className='flex justify-center space-x-2 py-2'>
        <button className='text-base p-1 rounded-sm border'>2023</button>
        <button className='text-base p-1 rounded-sm border bg-black text-white'>
          2024
        </button>
        <button className='text-sm p-1 rounded-sm border'>NONE</button>
      </div>

      <div className='flex justify-center p-1'>
        <div className='w-full max-w-lg bg-white'>
          <div className='relative bg-black rounded-full h-4 mb-2'>
            <div
              className='absolute top-0 left-0 bg-green-500 h-4 rounded-full'
              style={{ width: `${progressPercentage}%` }}
            ></div>
            <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center'>
              <span className='text-white font-semibold text-sm'>
                {completedTasks}/{totalTasks}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(52, ${cellSize})`,
          gridAutoRows: cellSize,
          gap: '5px',
          width: '80%',
          margin: '0 auto',
          paddingBottom: '5px',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {Array.from({ length: 7 }).map((_, dayIndex) =>
          Array.from({ length: 52 }).map((_, weekIndex) => {
            const index = dayIndex * 52 + weekIndex;
            const contribution = contributions[index];
            return (
              <div
                key={index}
                style={{
                  ...dayStyle,
                  ...(contribution > 0 && contributionStyle),
                }}
                data-tooltip-id={`tooltip-${index}`}
                data-tooltip-content={`Contributions: ${contribution}`}
              />
            );
          })
        )}
        {contributions.map((_, index) => (
          <Tooltip id={`tooltip-${index}`} place='top' effect='solid' />
        ))}
      </div>
    </>
  );
};

export default Calendar;
