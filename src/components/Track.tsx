import React from "react";
import Image from "next/image";
import { RaceResult, RaceStatus } from "../types";
import Horse from "./Horse";
import Trophy from "./Trophy";

/**
 * Props for the Track component.
 */
export interface TrackProps {
  /** Race result for this track */
  result: RaceResult;
  /** Current race status */
  status: RaceStatus;
  /** Whether this is the last track (for background rendering) */
  isLast: boolean;
  /** Whether this is the first track (for background rendering) */
  isFirst: boolean;
  trophyPlace?: number;
  /** Nickname of the player */
  nickname?: string;
  /** Whether this is the current user's track */
  isCurrentUser?: boolean;
}

/**
 * Track component that renders a single race track, horse, and stats.
 */
const Track: React.FC<TrackProps> = ({ result, status, isFirst, trophyPlace, nickname, isCurrentUser }) => (
  <div className="relative w-full flex items-center h-28">
    <Image
      src={isFirst ? "/track_top.webp" : "/track.webp"}
      alt="Track background"
      width={800}
      height={112}
      className="absolute w-full h-full left-0 top-0 z-0"
      draggable={false}
    />
    <div className="relative flex items-center justify-between w-full z-10 px-2">
      <Horse
        place={result.place}
        logo={result.participant.logo}
        status={status}
        progress={result.progress}
        nickname={nickname}
        isCurrentUser={isCurrentUser}
      />
      {trophyPlace && trophyPlace <= 3 && (
        <div className="absolute right-28 top-1/2 -translate-y-1/2 z-20">
          <Trophy place={trophyPlace} />
        </div>
      )}
    </div>
  </div>
);

export default Track;
