import React from "react";
import Image from "next/image";
import { RaceResult, RaceStatus } from "../types";
import Track from "./Track";

/**
 * Props for the RaceTrack component.
 */
export interface RaceTrackProps {
  /** Array of race results for each participant */
  results: RaceResult[];
  /** Current status of the race */
  status: RaceStatus;
  renderTrophy?: (participantId: string) => number | undefined;
  /** Current user ID to identify which track belongs to the current user */
  currentUserId?: string;
}

/**
 * RaceTrack component that renders all tracks and horses.
 */
const RaceTrack: React.FC<RaceTrackProps> = ({
  results,
  status,
  renderTrophy,
  currentUserId,
}) => (
  <div className="relative w-full h-full flex flex-col my-6">
    <Image
      src={"/top.webp"}
      alt="Top background"
      width={800}
      height={400}
      className="w-full h-[400px]"
      draggable={false}
    />
    {results.map((result, idx) => (
      <Track
        key={result.participant.id}
        result={result}
        status={status}
        isFirst={idx === 0}
        isLast={idx === results.length - 1}
        trophyPlace={
          renderTrophy ? renderTrophy(result.participant.id) : undefined
        }
        nickname={result.participant.name}
        isCurrentUser={currentUserId === result.participant.id}
      />
    ))}
    <Image
      src={"/bottom.webp"}
      alt="Bottom background"
      width={800}
      height={400}
      className="w-full h-full"
      draggable={false}
    />
  </div>
);

export default RaceTrack;
