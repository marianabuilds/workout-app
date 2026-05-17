import { useState, useEffect, useRef } from 'react';

export function useRestTimer(defaultSeconds = 90) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) { setRunning(false); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, timeLeft]);

  function start(seconds = defaultSeconds) {
    setTimeLeft(seconds);
    setRunning(true);
  }

  function stop() {
    setRunning(false);
    setTimeLeft(null);
    clearInterval(intervalRef.current);
  }

  function addTime(seconds) {
    setTimeLeft((t) => (t || 0) + seconds);
  }

  return { timeLeft, running, start, stop, addTime };
}
