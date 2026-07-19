import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const MagneticCursor: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Magnetic elements hover checking
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('.magnetic') || 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('a') || 
        target.closest('button')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY, isVisible]);

  // Magnetic effect for .magnetic elements
  useEffect(() => {
    const magneticElements = document.querySelectorAll('.magnetic');
    
    const handleMagneticMove = (e: MouseEvent, el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      
      // Pull element towards cursor slightly
      el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    };

    const handleMagneticLeave = (el: HTMLElement) => {
      el.style.transform = 'translate(0px, 0px)';
    };

    const listeners: Array<{ el: HTMLElement; move: (e: MouseEvent) => void; leave: () => void }> = [];

    magneticElements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.transition = 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)';
      
      const moveHandler = (e: MouseEvent) => handleMagneticMove(e, htmlEl);
      const leaveHandler = () => handleMagneticLeave(htmlEl);

      htmlEl.addEventListener('mousemove', moveHandler);
      htmlEl.addEventListener('mouseleave', leaveHandler);
      
      listeners.push({ el: htmlEl, move: moveHandler, leave: leaveHandler });
    });

    return () => {
      listeners.forEach(({ el, move, leave }) => {
        el.removeEventListener('mousemove', move);
        el.removeEventListener('mouseleave', leave);
      });
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      ref={cursorRef}
      className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] hidden md:block"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        background: isHovered 
          ? 'radial-gradient(circle, rgba(254,249,240,0.2) 0%, rgba(212,114,10,0.6) 80%)' 
          : 'radial-gradient(circle, rgba(212,114,10,0.8) 0%, rgba(200,93,47,0.4) 80%)',
        boxShadow: isHovered 
          ? '0 0 20px rgba(212,114,10,0.6)' 
          : '0 0 10px rgba(212,114,10,0.3)',
        scale: isHovered ? 1.8 : 1,
        border: isHovered ? '1px solid rgba(254,249,240,0.4)' : '1px solid rgba(212,114,10,0.2)',
      }}
      animate={{
        scale: isHovered ? 1.8 : 1,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    />
  );
};

export default MagneticCursor;
