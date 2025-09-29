import React, { useState, useEffect, useRef } from "react";
import { useSound } from "../../hooks/useSound";
import "./MusicPlayer.styles.css";

interface MusicPlayerProps {
  className?: string;
}

interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ className = "" }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { sound } = useSound();

  // 5 different songs - using royalty-free music
  const songs: Song[] = [
    {
      id: "1",
      title: "Epic Battle",
      artist: "Game Music",
      url: "https://www.bensound.com/bensound-music/bensound-epic.mp3",
      duration: 180,
    },
    {
      id: "2",
      title: "Victory Theme",
      artist: "Game Music",
      url: "https://www.bensound.com/bensound-music/bensound-sunny.mp3",
      duration: 120,
    },
    {
      id: "3",
      title: "Strategic Thinking",
      artist: "Game Music",
      url: "https://www.bensound.com/bensound-music/bensound-creativeminds.mp3",
      duration: 200,
    },
    {
      id: "4",
      title: "Tension Build",
      artist: "Game Music",
      url: "https://www.bensound.com/bensound-music/bensound-tenderness.mp3",
      duration: 160,
    },
    {
      id: "5",
      title: "Final Showdown",
      artist: "Game Music",
      url: "https://www.bensound.com/bensound-music/bensound-ukulele.mp3",
      duration: 140,
    },
  ];

  const currentSong = songs[currentSongIndex];

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
      audioRef.current.loop = true;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Load new song
  useEffect(() => {
    if (audioRef.current && currentSong) {
      setIsLoading(true);
      audioRef.current.src = currentSong.url;
      audioRef.current.load();

      audioRef.current.addEventListener("canplaythrough", () => {
        setIsLoading(false);
      });

      audioRef.current.addEventListener("timeupdate", () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        }
      });

      audioRef.current.addEventListener("ended", () => {
        handleNext();
      });
    }
  }, [currentSong]);

  const handlePlayPause = async () => {
    if (!audioRef.current || !currentSong) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error playing music:", error);
    }
  };

  const handleNext = () => {
    const nextIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(nextIndex);
    if (isPlaying) {
      setTimeout(() => {
        handlePlayPause();
      }, 100);
    }
  };

  const handlePrevious = () => {
    const prevIndex =
      currentSongIndex === 0 ? songs.length - 1 : currentSongIndex - 1;
    setCurrentSongIndex(prevIndex);
    if (isPlaying) {
      setTimeout(() => {
        handlePlayPause();
      }, 100);
    }
  };

  const handleSongSelect = (index: number) => {
    setCurrentSongIndex(index);
    if (isPlaying) {
      setTimeout(() => {
        handlePlayPause();
      }, 100);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={`music-player ${className} ${isExpanded ? "expanded" : ""}`}
    >
      {/* Compact View */}
      {!isExpanded && (
        <div
          className="music-player-compact"
          onClick={() => setIsExpanded(true)}
        >
          <div className="compact-info">
            <div className="compact-song-info">
              <span className="song-title">{currentSong?.title}</span>
              <span className="song-artist">{currentSong?.artist}</span>
            </div>
            <div className="compact-controls">
              <button
                className="play-pause-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayPause();
                }}
                disabled={isLoading}
              >
                {isLoading ? "⏳" : isPlaying ? "⏸️" : "▶️"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Expanded View */}
      {isExpanded && (
        <div className="music-player-expanded">
          <div className="music-header">
            <h3>🎵 Game Music</h3>
            <button className="close-btn" onClick={() => setIsExpanded(false)}>
              ×
            </button>
          </div>

          <div className="current-song">
            <div className="song-info">
              <h4>{currentSong?.title}</h4>
              <p>{currentSong?.artist}</p>
            </div>
            <div className="song-progress">
              <span>{formatTime(currentTime)}</span>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${
                      (currentTime / (currentSong?.duration || 1)) * 100
                    }%`,
                  }}
                />
              </div>
              <span>{formatTime(currentSong?.duration || 0)}</span>
            </div>
          </div>

          <div className="music-controls">
            <button
              className="control-btn prev-btn"
              onClick={handlePrevious}
              disabled={isLoading}
            >
              ⏮️
            </button>
            <button
              className="control-btn play-pause-btn"
              onClick={handlePlayPause}
              disabled={isLoading}
            >
              {isLoading ? "⏳" : isPlaying ? "⏸️" : "▶️"}
            </button>
            <button
              className="control-btn next-btn"
              onClick={handleNext}
              disabled={isLoading}
            >
              ⏭️
            </button>
          </div>

          <div className="volume-control">
            <span>🔊</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="volume-slider"
            />
            <span>{Math.round(volume * 100)}%</span>
          </div>

          <div className="playlist">
            <h4>Playlist</h4>
            <div className="song-list">
              {songs.map((song, index) => (
                <div
                  key={song.id}
                  className={`song-item ${
                    index === currentSongIndex ? "active" : ""
                  }`}
                  onClick={() => handleSongSelect(index)}
                >
                  <div className="song-number">{index + 1}</div>
                  <div className="song-details">
                    <div className="song-name">{song.title}</div>
                    <div className="song-artist">{song.artist}</div>
                  </div>
                  <div className="song-duration">
                    {formatTime(song.duration)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
