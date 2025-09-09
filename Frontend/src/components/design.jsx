import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

function Eyes() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [frozen, setFrozen] = useState(false); // ✅ freeze toggle

  useEffect(() => {
    if (frozen) return; // ✅ stop updating when frozen

    const handleMouseMove = (event) => {
      setCoords({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [frozen]);

  const calcPupilPos = (eyeRef) => {
    if (!eyeRef) return { x: "50%", y: "50%" };

    const rect = eyeRef.getBoundingClientRect();
    const eyeCenterX = rect.left + rect.width / 2;
    const eyeCenterY = rect.top + rect.height / 2;

    const deltaX = coords.x - eyeCenterX;
    const deltaY = coords.y - eyeCenterY;

    const angle = Math.atan2(deltaY, deltaX);
    const radius = rect.width / 4; // limit pupil inside eye
    const pupilX = eyeCenterX + Math.cos(angle) * radius;
    const pupilY = eyeCenterY + Math.sin(angle) * radius;

    return {
      x: `${pupilX - rect.left}px`,
      y: `${pupilY - rect.top}px`,
    };
  };

  const [leftEye, setLeftEye] = useState(null);
  const [rightEye, setRightEye] = useState(null);

  return (
    <div
      className="relative w-full h-screen flex justify-center items-center bg-blue-400"
      onDoubleClick={() => setFrozen(!frozen)} // ✅ toggle freeze
    >
      <div className="flex gap-10 relative">
        {/* Left Eye */}
        <div
          ref={setLeftEye}
          className="w-40 h-40 bg-white rounded-full relative border-7 overflow-hidden"
        >
          <div
            className="w-10 h-10 bg-black rounded-full absolute"
            style={{
              left: calcPupilPos(leftEye).x,
              top: calcPupilPos(leftEye).y,
              transform: "translate(-50%, -50%)",
            }}
          />
          {/* Eyelid animation */}
          <motion.div
            className="absolute top-0 left-0 w-full h-full bg-blue-400"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: [0, 1, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatDelay: 4,
              ease: "easeInOut",
            }}
            style={{ originY: 0 }}
          />
        </div>

        {/* Right Eye */}
        <div
          ref={setRightEye}
          className="w-40 h-40 bg-white rounded-full relative overflow-hidden"
        >
          <div
            className="w-10 h-10 bg-black rounded-full absolute"
            style={{
              left: calcPupilPos(rightEye).x,
              top: calcPupilPos(rightEye).y,
              transform: "translate(-50%, -50%)",
            }}
          />
          <motion.div
            className="absolute top-0 left-0 w-full h-full bg-blue-400"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: [0, 1, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatDelay: 4,
              ease: "easeInOut",
            }}
            style={{ originY: 0 }}
          />
        </div>
      </div>
    
    </div>
  );
}

export default Eyes;
