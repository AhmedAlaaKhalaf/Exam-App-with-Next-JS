'use client';

import { useEffect, useState, useRef } from 'react';
import { ChartPieDonutText } from '@/components/ui/chart-pie-donut-text';

type ExamCountdownProps = {
  durationMinutes: number;
  onTimeUp?: () => void;
};

export function ExamCountdown({ durationMinutes, onTimeUp }: ExamCountdownProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(durationMinutes * 60);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Start countdown timer
    intervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [durationMinutes, onTimeUp]);

  // Format time as MM:SS
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Calculate percentage remaining
  const totalSeconds = durationMinutes * 60;
  const percentage = (remainingSeconds / totalSeconds) * 100;

  return (
    <ChartPieDonutText 
      remainingSeconds={remainingSeconds}
      totalSeconds={totalSeconds}
      formattedTime={formattedTime}
      percentage={percentage}
    />
  );
}

