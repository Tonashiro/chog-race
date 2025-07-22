import React from "react";
import Image from "next/image";

/**
 * Props for the Trophy component.
 */
export interface TrophyProps {
  /** Placement (1 = first, 2 = second, etc.) */
  place: number;
}

const trophyImages: Record<number, string> = {
  1: "/trophy_1.webp",
  2: "/trophy_2.webp",
  3: "/trophy_3.webp",
};

/**
 * Trophy component that displays a trophy icon for 1st, 2nd, and 3rd place.
 */
const Trophy: React.FC<TrophyProps> = ({ place }) => {
  if (place >= 1 && place <= 3) {
    return (
      <Image
        src={trophyImages[place]}
        alt={`Trophy ${place}`}
        width={72}
        height={72}
        className="object-contain drop-shadow"
        draggable={false}
      />
    );
  }
  return null;
};

export default Trophy;
