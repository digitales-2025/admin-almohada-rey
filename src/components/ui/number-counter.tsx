"use client";

import { useEffect, useRef, useState } from "react";

interface NumberCounterProps {
  value: number;
  duration?: number;
  className?: string;
  formatter?: (value: number) => string;
}

export function NumberCounter({
  value,
  duration = 2000,
  className = "",
  formatter = (val) =>
    val
      .toFixed(2)
      .replace(/\.?0+$/, "")
      .replace(".", ","),
}: NumberCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    // Reset animation when value changes
    startTimeRef.current = null;

    // Cancel any existing animation
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
    }

    // Animate the counter
    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smoother animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      // Calculate current value based on progress
      const currentValue = easeOutQuart * value;
      setDisplayValue(currentValue);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value); // Ensure we end at the exact target value
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [value, duration]);

  return <div className={className}>{formatter(displayValue)}</div>;
}
