import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Clear timeout if the component is unmounted or the countdown finishes
    return () => clearTimeout(timer);
  }); // No dependency array means it runs on every render, effectively every second

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval] && interval !== 'seconds' && Object.keys(timeLeft).length <= 1) {
      // Don't add zero values unless it's the last interval (seconds)
      return;
    }

    timerComponents.push(
      <div key={interval} className="text-center bg-gray-800 p-4 rounded-lg min-w-[90px] border border-gray-700 shadow-inner">
        <span className="text-4xl md:text-5xl font-bold text-[#ffb700]">
          {String(timeLeft[interval]).padStart(2, '0')}
        </span>
        <span className="block text-sm text-gray-400 uppercase mt-1.5">{interval}</span>
      </div>
    );
  });

  return (
    <div className="flex justify-center space-x-3 md:space-x-6">
      {timerComponents.length ? (
        timerComponents
      ) : (
        <span className="text-2xl text-green-500">Nomination period has ended!</span>
      )}
    </div>
  );
};

export default CountdownTimer; 