"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

export default function ScrambleText({ 
  text, 
  className = "", 
  delay = 0,
  duration = 0.8
}: { 
  text: string, 
  className?: string,
  delay?: number,
  duration?: number
}) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let frameId: number;

    let loopInterval: NodeJS.Timeout;

    const startAnimation = () => {
      let iteration = 0;
      const totalFrames = (duration * 60);

      const animate = () => {
        setDisplayText(
          text
            .split("")
            .map((char, index) => {
              if (char === " ") return " ";
              if (index < iteration) {
                return text[index];
              }
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join("")
        );

        if (iteration < text.length) {
          iteration += text.length / (totalFrames / 3);
          frameId = requestAnimationFrame(animate);
        } else {
          setDisplayText(text);
        }
      };

      animate();
    };

    timeout = setTimeout(() => {
      startAnimation();
      loopInterval = setInterval(startAnimation, 10000); // Re-scramble every 10 seconds
    }, delay * 1000);

    return () => {
      clearTimeout(timeout);
      clearInterval(loopInterval);
      cancelAnimationFrame(frameId);
    };
  }, [text, delay, duration]);

  return (
    <motion.span 
      className={className}
      whileHover={{ 
        scale: 1.05,
        color: "var(--accent)",
        textShadow: "4px 4px 0px rgba(0,0,0,1)",
        transition: { duration: 0.2 }
      }}
    >
      {displayText || text.replace(/./g, "\u00A0")}
    </motion.span>
  );
}
