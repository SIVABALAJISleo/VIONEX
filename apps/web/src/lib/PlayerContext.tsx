'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { VideoItem } from './data';

interface PlayerContextType {
  activeVideo: VideoItem | null;
  isPlaying: boolean;
  isMiniplayer: boolean;
  isTheaterMode: boolean;
  isAmbientMode: boolean;
  playbackSpeed: number;
  volume: number;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  showShortcutsModal: boolean;
  playVideo: (video: VideoItem) => void;
  setIsPlaying: (playing: boolean) => void;
  togglePlay: () => void;
  setIsMiniplayer: (mini: boolean) => void;
  setIsTheaterMode: (theater: boolean) => void;
  setIsAmbientMode: (ambient: boolean) => void;
  setPlaybackSpeed: (speed: number) => void;
  setVolume: (vol: number) => void;
  setIsMuted: (muted: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (dur: number) => void;
  setShowShortcutsModal: (show: boolean) => void;
  closeMiniplayer: () => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMiniplayer, setIsMiniplayer] = useState<boolean>(false);
  const [isTheaterMode, setIsTheaterMode] = useState<boolean>(false);
  const [isAmbientMode, setIsAmbientMode] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [showShortcutsModal, setShowShortcutsModal] = useState<boolean>(false);

  const playVideo = (video: VideoItem) => {
    setActiveVideo(video);
    setIsPlaying(true);
    setIsMiniplayer(false);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const closeMiniplayer = () => {
    setIsMiniplayer(false);
    setIsPlaying(false);
  };

  return (
    <PlayerContext.Provider
      value={{
        activeVideo,
        isPlaying,
        isMiniplayer,
        isTheaterMode,
        isAmbientMode,
        playbackSpeed,
        volume,
        isMuted,
        currentTime,
        duration,
        showShortcutsModal,
        playVideo,
        setIsPlaying,
        togglePlay,
        setIsMiniplayer,
        setIsTheaterMode,
        setIsAmbientMode,
        setPlaybackSpeed,
        setVolume,
        setIsMuted,
        setCurrentTime,
        setDuration,
        setShowShortcutsModal,
        closeMiniplayer
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
