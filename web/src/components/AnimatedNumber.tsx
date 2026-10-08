import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function AnimatedNumber({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1.2,
  className = '',
}: AnimatedNumberProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const numValue = isNaN(value) ? 0 : value;

  useEffect(() => {
    if (!spanRef.current) return;
    const target = { val: 0 };
    
    const ctx = gsap.context(() => {
      gsap.to(target, {
        val: numValue,
        duration,
        ease: 'power2.out',
        onUpdate: () => {
          if (spanRef.current) {
            const formatted = target.val.toLocaleString('en-IN', {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            });
            spanRef.current.textContent = `${prefix}${formatted}${suffix}`;
          }
        },
      });
    });

    return () => ctx.revert();
  }, [numValue, decimals, prefix, suffix, duration]);

  return (
    <span ref={spanRef} className={className}>
      {prefix}
      {numValue.toLocaleString('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

