
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

  if (hasPassed) {
    return <span className="text-sm font-semibold text-red-600">Aanmelddeadline is verstreken</span>;
  }
  
  const timerComponents: string[] = [];

  if (timeLeft.days > 0) timerComponents.push(`${timeLeft.days}d`);
  if (timeLeft.hours > 0 || timeLeft.days > 0) timerComponents.push(`${timeLeft.hours}u`);
  if (timeLeft.minutes > 0 || timeLeft.hours > 0 || timeLeft.days > 0) timerComponents.push(`${timeLeft.minutes}m`);
  timerComponents.push(`${timeLeft.seconds}s`);

  return (
    <div className="flex items-center space-x-2">
       <span className="relative flex h-2 w-2">
         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
         <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
       </span>
       <span className="text-sm font-mono font-medium text-text-secondary">
         Sluit over: {timerComponents.join(' ')}
       </span>
    </div>
  );
};
