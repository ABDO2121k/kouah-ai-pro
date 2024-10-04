"use client";
import React, { useState, useRef, useEffect } from 'react';

const ScrollTest = () => {
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLDivElement;
      console.log('Scroll event fired', target.scrollTop);
      setScrollY(target.scrollTop);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, background: 'rgba(255,255,255,0.8)' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, padding: '10px' }}>
        Scroll position: {scrollY}px
      </div>
      <div 
        ref={containerRef} 
        style={{ 
          height: '100%', 
          overflowY: 'scroll',
          padding: '20px',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ height: '200vh', background: 'linear-gradient(to bottom, #f0f0f0, #d0d0d0)' }}>
          Scroll me!
        </div>
      </div>
    </div>
  );
};

export default ScrollTest;