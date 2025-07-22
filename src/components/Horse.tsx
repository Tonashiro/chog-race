import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { RaceStatus } from "../types";
import { getHorseLeftPosition } from "../utils/animation";

/**
 * Props for the Horse component.
 */
export interface HorseProps {
  /** Placement of the horse (1 = first, 2 = second, etc.) */
  place: number;
  /** Logo image path for the participant */
  logo: string;
  /** Current race status */
  status: RaceStatus;
  /** Progress of the horse in the race (0 = start, 1 = finish) */
  progress: number;
  /** Nickname of the player */
  nickname?: string;
  /** Whether this is the current user's horse */
  isCurrentUser?: boolean;
}

/**
 * Horse component that animates the horse sprite and displays the participant logo.
 */
const Horse: React.FC<HorseProps> = ({
  logo,
  status,
  progress,
  nickname,
  isCurrentUser,
}) => {
  const [frame, setFrame] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Animate sprite when racing
  useEffect(() => {
    if (status === "racing") {
      intervalRef.current = setInterval(() => {
        setFrame((f) => (f + 1) % 6);
      }, 100);
    } else {
      setFrame(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status]);

  // Calculate left position based on progress
  const left = getHorseLeftPosition(progress);

  return (
    <div
      className="relative flex items-center h-28"
      style={{
        left,
        transition: "left 0.2s ease-out", // Faster transition for better visibility
      }}
    >
      {/* Nickname label */}
      {nickname && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-20">
          <div
            className={`
            px-3 py-1 rounded-full text-sm font-semibold shadow-lg border-2
            ${
              isCurrentUser
                ? "bg-blue-500 text-white border-blue-600"
                : "bg-white text-gray-800 border-gray-300"
            }
          `}
          >
            {nickname}
            {isCurrentUser && <span className="ml-1">(You)</span>}
          </div>
        </div>
      )}

      <div
        className="w-28 h-28 bg-no-repeat bg-left-bottom flex items-center justify-center"
        style={{
          backgroundImage: "url(/horse_sprite.webp)",
          backgroundPosition: `-${frame * 112}px 0`,
          backgroundSize: "672px 112px",
        }}
      >
        <Image
          src={logo}
          alt="Participant Logo"
          width={32}
          height={32}
          className="absolute left-2 top-2 rounded-full border-2 border-white bg-white shadow"
          draggable={false}
        />
      </div>
    </div>
  );
};

export default Horse;
