import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export function CursorShadow() {
  const shadowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      window.matchMedia('(hover: none) and (pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    const shadow = shadowRef.current;
    if (!shadow) return;

    let frame = 0;
    const moveShadow = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        shadow.style.transform = `translate3d(${event.clientX - 60}px, ${event.clientY - 60}px, 0)`;
        shadow.style.opacity = '1';
      });
    };
    const hideShadow = () => {
      shadow.style.opacity = '0';
    };

    window.addEventListener('pointermove', moveShadow, { passive: true });
    window.addEventListener('blur', hideShadow);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', moveShadow);
      window.removeEventListener('blur', hideShadow);
    };
  }, []);

  return createPortal(
    <div ref={shadowRef} className="global-cursor-shadow" aria-hidden="true" />,
    document.body,
  );
}
