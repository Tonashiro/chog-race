import React, { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "../lib/utils";

/**
 * Props for the MoveGameBar component.
 */
export interface MoveGameBarProps {
  /** Whether the bar is active */
  isActive: boolean;
  /** Called with true if user hits, false if not */
  onResult: (success: boolean) => void;
  /** Current attempt (successful hits so far) */
  attempt: number;
  /** Max successful hits needed */
  maxAttempts: number;
  /** Cursor speed in px/ms */
  speed: number;
  /** Width of the green area in px */
  targetWidth: number;
}

const BAR_WIDTH = 320;
const CURSOR_WIDTH = 6; // smaller cursor

/**
 * MoveGameBar is a fixed, mobile-friendly bar for the move game.
 */
const MoveGameBar: React.FC<MoveGameBarProps> = ({
  isActive,
  onResult,
  attempt,
  maxAttempts,
  speed,
  targetWidth,
}) => {
  const [cursorPos, setCursorPos] = useState(0);
  const [dir, setDir] = useState(1); // 1 = right, -1 = left
  const [stopping, setStopping] = useState(false); // true when waiting for result
  const [feedback, setFeedback] = useState<"none" | "success" | "fail">("none");
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; type: "success" | "fail" }>
  >([]);
  const [isCooldown, setIsCooldown] = useState(false); // Prevent spam
  const targetStart = useRef(
    Math.floor(Math.random() * (BAR_WIDTH - targetWidth))
  );
  const particleIdRef = useRef(0);
  const lastInteractionTime = useRef(0);

  // Animate cursor
  useEffect(() => {
    if (!isActive) return;

    let animationId: number;
    let lastTime = 0;

    const animate = (currentTime: number) => {
      if (lastTime === 0) lastTime = currentTime;
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      setCursorPos((pos) => {
        const moveDistance = (speed * deltaTime) / 16; // Normalize to ~60fps
        let next = pos + dir * moveDistance;

        if (next <= 0) {
          setDir(1);
          next = 0;
        } else if (next >= BAR_WIDTH - CURSOR_WIDTH) {
          setDir(-1);
          next = BAR_WIDTH - CURSOR_WIDTH;
        }

        return next;
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isActive, dir, speed]);

  // Reset on active/attempt
  useEffect(() => {
    // Throttled logging - only log every 3 seconds
    if (Date.now() % 3000 < 100) {
      console.log("🔄 MoveGameBar reset:", { isActive, attempt, targetWidth });
    }
    setCursorPos(0);
    setDir(1);
    setStopping(false);
    setFeedback("none");
    setParticles([]);
    targetStart.current = Math.floor(Math.random() * (BAR_WIDTH - targetWidth));
  }, [isActive, attempt, targetWidth]);

  // Handle Move
  const handleMove = useCallback(() => {
    // Throttled logging - only log every 1 second
    if (Date.now() % 1000 < 100) {
      console.log("🎯 MoveGameBar handleMove called:", {
        stopping,
        isCooldown,
        attempt,
      });
    }

    if (stopping || isCooldown) {
      // Throttled logging - only log every 2 seconds
      if (Date.now() % 2000 < 100) {
        console.log("❌ Move blocked:", { stopping, isCooldown });
      }
      return;
    }

    const now = Date.now();
    const timeSinceLastInteraction = now - lastInteractionTime.current;

    // Prevent spam: minimum 300ms between interactions
    if (timeSinceLastInteraction < 300) {
      // Throttled logging - only log every 2 seconds
      if (Date.now() % 2000 < 100) {
        console.log("❌ Move blocked by cooldown:", timeSinceLastInteraction);
      }
      return;
    }

    lastInteractionTime.current = now;
    setIsCooldown(true);
    setStopping(true);

    const cursorCenter = cursorPos + CURSOR_WIDTH / 2;
    const hit =
      cursorCenter >= targetStart.current &&
      cursorCenter <= targetStart.current + targetWidth;

    // Throttled logging - only log every 1 second
    if (Date.now() % 1000 < 100) {
      console.log("🎯 Move result:", {
        hit,
        cursorCenter,
        targetStart: targetStart.current,
        targetEnd: targetStart.current + targetWidth,
      });
    }

    setFeedback(hit ? "success" : "fail");

    // Add particles
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const newParticles = Array.from({ length: hit ? 8 : 6 }, (_, i) => ({
      id: particleIdRef.current++,
      x: cursorCenter,
      y: 20,
      type: hit ? ("success" as const) : ("fail" as const),
    }));
    setParticles(newParticles);

    setTimeout(
      () => {
        // Throttled logging - only log every 1 second
        if (Date.now() % 1000 < 100) {
          console.log("🎯 Calling onResult:", { hit, attempt });
        }
        onResult(hit);

        // Reset state for both success and failure
        // Throttled logging - only log every 2 seconds
        if (Date.now() % 2000 < 100) {
          console.log("🔄 Resetting MoveGameBar state");
        }
        setStopping(false);
        setFeedback("none");
        setParticles([]);

        // Only reset target position for failed hits (successful hits should keep the same target)
        if (!hit) {
          targetStart.current = Math.floor(
            Math.random() * (BAR_WIDTH - targetWidth)
          );
        }

        // Reset cooldown after a short delay
        setTimeout(() => setIsCooldown(false), 100);
      },
      hit ? 700 : 500
    );
  }, [cursorPos, onResult, targetWidth, stopping, isCooldown, attempt]);

  // Spacebar/touch support
  useEffect(() => {
    if (!isActive) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        handleMove();
      }
    };

    // Use keydown with passive: false to prevent default behavior
    window.addEventListener("keydown", onKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isActive, handleMove]);

  // Animate particles
  useEffect(() => {
    if (particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + (Math.random() - 0.5) * 4,
            y: p.y - 2,
          }))
          .filter((p) => p.y > -10)
      );
    }, 50);

    return () => clearInterval(interval);
  }, [particles]);

  if (!isActive) return null;

  return (
    <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200">
      <div className="flex flex-col items-center gap-4">
        <div className="text-lg font-bold text-gray-800">
          Move Game ({attempt}/{maxAttempts})
        </div>

        <div className="relative w-[320px] h-12 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full overflow-hidden border-2 border-gray-300">
          {/* Green target area */}
          <div
            className="absolute top-0 h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full shadow-inner"
            style={{ left: targetStart.current, width: targetWidth }}
          />

          {/* Moving cursor */}
          <div
            className={cn(
              "absolute top-0 h-full rounded-full shadow-lg",
              feedback === "success"
                ? "bg-blue-600 shadow-blue-400/50"
                : feedback === "fail"
                ? "bg-red-500 shadow-red-400/50"
                : "bg-blue-500 shadow-blue-400/30"
            )}
            style={{
              left: `${cursorPos}px`,
              width: CURSOR_WIDTH,
              transform: feedback !== "none" ? "scale(1.2)" : "scale(1)",
            }}
          />

          {/* Particles */}
          {particles.map((particle) => (
            <div
              key={particle.id}
              className={cn(
                "absolute w-2 h-2 rounded-full animate-ping",
                particle.type === "success" ? "bg-green-400" : "bg-red-400"
              )}
              style={{
                left: particle.x,
                top: particle.y,
                animationDuration: "0.6s",
              }}
            />
          ))}

          {/* Success/Fail feedback */}
          {feedback === "success" && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-green-600 text-4xl font-bold animate-bounce drop-shadow-lg">
                ✔
              </span>
            </div>
          )}
          {feedback === "fail" && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-red-500 text-4xl font-bold animate-shake drop-shadow-lg">
                ✖
              </span>
            </div>
          )}
        </div>

        <button
          className={cn(
            "px-8 py-3 text-lg font-semibold rounded-xl shadow-lg transition-all duration-200 transform active:scale-95",
            stopping || isCooldown
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white shadow-violet-500/25"
          )}
          onClick={handleMove}
          disabled={stopping || isCooldown}
        >
          {stopping ? "Stopping..." : isCooldown ? "Wait..." : "Stop"}
        </button>

        <div className="text-sm text-gray-600 text-center leading-relaxed">
          Stop the cursor inside the green area to move your horse!
          <br />
          <span className="text-xs text-gray-500">
            (Tap, press Spacebar, or click Stop)
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          20%,
          60% {
            transform: translateX(-8px);
          }
          40%,
          80% {
            transform: translateX(8px);
          }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default MoveGameBar;
