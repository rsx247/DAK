import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  deadline: Date;
}

const calculateTimeLeft = (deadline: Date) => {
  const difference = +new Date(deadline) - +new Date();
  let timeLeft: { [key: string]: number } = {};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
  return { difference, timeLeft };
};

const SmallClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ deadline }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(deadline).timeLeft);
  const [hasPassed, setHasPassed] = useState(calculateTimeLeft(deadline).difference <= 0);

  useEffect(() => {
    if (hasPassed) return;

    const timer = setInterval(() => {
      const { difference, timeLeft: newTimeLeft } = calculateTimeLeft(deadline);
      setTimeLeft(newTimeLeft);
      if (difference <= 0) {
        setHasPassed(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline, hasPassed]);

  if (hasPassed || Object.keys(timeLeft).length === 0) {
    return null;
  }

  let timeString = `${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`;
  if (timeLeft.days > 0) {
    timeString = `${timeLeft.days}d ${timeString}`;
  }

  return (
     <div className="flex items-center gap-1" title={`Sluit over ${timeString}`}>
       <SmallClockIcon />
       <span className="font-mono text-xs text-text-secondary/80 tracking-tight whitespace-nowrap">
         {timeString}
       </span>
    </div>
  );
};
