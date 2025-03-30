import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { environment } from '../../environments/environment';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export interface Track {
  url: string;
  title: string;
  previewImgPath: string;
  id: string;
}

export interface PlayerState {
  videoId: string | null;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  progress: number; // 0-100 percentage
  volume: number;
}

enum ApiLoadState {
  UNLOADED,
  LOADING,
  LOADED,
}

export const DEFAULT_EMPTY_TRACK: Track = {
  url: '',
  title: '',
  previewImgPath: 'assets/ui-elements/default-track-preview.svg',
  id: '',
};

@Injectable({
  providedIn: 'root',
})
export class AudioPlayerService implements OnDestroy {
  private player: any;
  private apiLoadState: ApiLoadState = ApiLoadState.UNLOADED;
  private playerReady = false;
  private currentTrack = new BehaviorSubject<Track>(DEFAULT_EMPTY_TRACK);
  private playlist: Track[] = [];
  private progressInterval: any;
  private subscriptions: Subscription[] = [];
  private playerStateUpdate$ = new Subject<Partial<PlayerState>>();
  private readonly STORAGE_KEY = 'audioPlayerPlaylist';
  // BehaviorSubject to track player state
  private playerState = new BehaviorSubject<PlayerState>({
    videoId: null,
    isPlaying: false,
    duration: 0,
    currentTime: 0,
    progress: 0,
    volume: 100,
  });

  playerState$: Observable<PlayerState> = this.playerState.asObservable();

  // Public observables that components can subscribe to
  currentTrack$ = this.currentTrack.asObservable();
  playerReady$ = new BehaviorSubject<boolean>(false);

  constructor(private zone: NgZone) {
    this.loadYouTubeApi();
    this.initThrottledUpdates();
    this.initVolume();
    this.loadPlaylistFromStorage(); // Load playlist on service initialization
  }

  private initThrottledUpdates(): void {
    // Set up throttled state updates
    this.subscriptions.push(
      this.playerStateUpdate$
        .pipe(
          throttleTime(100) // Throttle updates to 10 per second max
        )
        .subscribe((partialState) => {
          this.playerState.next({
            ...this.playerState.value,
            ...partialState,
          });
        })
    );
  }

  private initVolume(): void {
    const savedVolume = localStorage.getItem('youtubePlayerVolume');
    const volume = savedVolume ? parseInt(savedVolume, 10) : 100;

    this.playerState.next({
      ...this.playerState.value,
      volume,
    });
  }

  private loadYouTubeApi(): void {
    // Prevent multiple loads
    if (this.apiLoadState !== ApiLoadState.UNLOADED) return;
    this.apiLoadState = ApiLoadState.LOADING;

    // Create all elements first before loading API
    const container =
      document.getElementById('global-youtube-player-container') ||
      this.createPlayerContainer();

    // Create script tag for YouTube API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Set up the callback
    window.onYouTubeIframeAPIReady = () => {
      this.zone.run(() => {
        this.apiLoadState = ApiLoadState.LOADED;
        this.initPlayer();
      });
    };
  }

  private loadPlaylistFromStorage(): void {
    const savedPlaylist = localStorage.getItem(this.STORAGE_KEY);
    if (savedPlaylist) {
      try {
        this.playlist = JSON.parse(savedPlaylist);
        // fetch titles to avoid discrepancy
        this.playlist.forEach((t) => {
          this.fetchVideoTitle(t.id).then((title) => {
            t.title = title;
          });
        });
        if (this.playlist.length > 0) {
          this.currentTrack.next(this.playlist[0]); // Load first track
        }
      } catch (error) {
        console.error('Failed to load playlist from storage:', error);
      }
    }
  }

  private savePlaylistToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.playlist));
  }

  private createPlayerContainer(): HTMLElement {
    const container = document.createElement('div');
    container.id = 'global-youtube-player-container';
    container.style.position = 'absolute';
    container.style.top = '-9999px';
    container.style.left = '-9999px';

    const playerElement = document.createElement('div');
    playerElement.id = 'global-youtube-player';
    container.appendChild(playerElement);

    document.body.appendChild(container);
    return container;
  }

  private initPlayer(): void {
    if (this.apiLoadState !== ApiLoadState.LOADED || this.player) return;

    // Create a hidden player
    this.player = new window.YT.Player('global-youtube-player', {
      height: '1',
      width: '1',
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        showinfo: 0,
      },
      events: {
        onReady: this.onPlayerReady.bind(this),
        onStateChange: this.onPlayerStateChange.bind(this),
        onError: this.onPlayerError.bind(this),
      },
    });
  }

  private onPlayerReady(): void {
    this.playerReady = true;
    this.playerReady$.next(true);

    // Apply saved volume
    const volume = this.playerState.value.volume;
    this.player.setVolume(volume);

    // If we have a current track, load it
    if (this.currentTrack.value) {
      this.loadVideo(this.currentTrack.value.id);
    }
  }

  private onPlayerStateChange(event: any): void {
    this.zone.run(() => {
      const isPlaying = event.data === window.YT.PlayerState.PLAYING;

      if (isPlaying) {
        this.startProgressTracking();
      } else {
        this.stopProgressTracking();
      }

      this.playerStateUpdate$.next({
        isPlaying,
      });
    });
  }

  private onPlayerError(event: any): void {
    // console.error('YouTube player error:', event);
    this.stopProgressTracking();
    this.playerStateUpdate$.next({
      isPlaying: false,
    });
  }

  private startProgressTracking(): void {
    this.stopProgressTracking();

    // Update progress every 500ms
    this.progressInterval = setInterval(() => {
      this.zone.run(() => {
        if (
          this.player &&
          this.player.getPlayerState() === window.YT.PlayerState.PLAYING
        ) {
          const duration = this.player.getDuration() || 0;
          const currentTime = this.player.getCurrentTime() || 0;
          const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

          this.playerStateUpdate$.next({
            duration,
            currentTime,
            progress,
          });
        }
      });
    }, 500);
  }

  private stopProgressTracking(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  /**
   * Extract YouTube video ID from URL
   */
  extractVideoId(url: string): string | null {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }

  /**
   * Create Track Object on provided Youtube video URL, and add it to the playlist
   *
   * @param {string} url - URL of Youtube video to play
   * @returns {Track | null} - Created track, return null when URL invalid
   */
  addTrack(url: string): Track | null {
    const videoId = this.extractVideoId(url);

    if (!videoId) {
      console.error('Invalid YouTube URL');
      return null;
    }

    const newTrack: Track = {
      url,
      id: videoId,
      title: `YouTube Video ${videoId}`,
      previewImgPath:
        'https://img.youtube.com/vi/' + videoId + '/hqdefault.jpg',
    };

    this.fetchVideoTitle(videoId).then((title) => {
      newTrack.title = title;
    });

    this.playlist.push(newTrack);
    this.savePlaylistToStorage();

    // If this is the first track, set it as current
    if (this.playlist.length === 1) {
      this.currentTrack.next(newTrack);
      this.loadVideo(videoId);
    }

    return newTrack;
  }

  /**
   * Load the video into the player by provided Video (Track) ID
   *
   * @param {string} videoId id of the Track
   */
  private loadVideo(videoId: string): void {
    this.playerStateUpdate$.next({
      videoId,
      isPlaying: false,
      currentTime: 0,
      progress: 0,
    });

    if (!this.playerReady) {
      // If player isn't ready yet, store the track and wait for player to be ready
      const existingTrack = this.playlist.find((t) => t.id === videoId);
      if (existingTrack) {
        this.currentTrack.next(existingTrack);
      }
      return;
    }

    this.player.loadVideoById(videoId);
    this.player.stopVideo();
  }

  /**
   * Play the current video
   */
  play(): void {
    if (!this.player || !this.playerReady || !this.currentTrack.value) return;

    // Make sure the current video is loaded
    const currentId = this.currentTrack.value.id;
    const playerVideoId = this.player.getVideoData()?.video_id;

    if (playerVideoId !== currentId) {
      this.loadVideo(currentId);
      // Short delay to ensure video is loaded before playing
      setTimeout(() => {
        this.player.playVideo();
        this.updatePlayerPlayingState(true);
      }, 300);
    } else {
      this.player.playVideo();
      this.updatePlayerPlayingState(true);
    }
  }

  pause(): void {
    if (!this.player || !this.playerReady) return;
    this.player.pauseVideo();
    this.updatePlayerPlayingState(false);
  }

  stop(): void {
    if (!this.player || !this.playerReady) return;
    this.player.stopVideo();
  }

  selectTrack(track: Track): void {
    this.currentTrack.next(track);
    this.loadVideo(track.id);
  }

  removeTrackFromPlaylist(track: Track) {
    this.playlist = this.playlist.filter((t) => t.id !== track.id);
    this.savePlaylistToStorage();
  }

  getPlaylist(): Track[] {
    return [...this.playlist];
  }

  clearPlaylist(): void {
    this.playlist = [];
    this.stop();
    this.currentTrack.next(DEFAULT_EMPTY_TRACK);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Get current playback time (for progress bars)
  getCurrentTime(): number {
    if (!this.player || !this.playerReady) return 0;
    return this.player.getCurrentTime() || 0;
  }

  getCurrentState(): PlayerState {
    return this.playerState.value;
  }

  updatePlayerPlayingState(state: boolean) {
    const curState = this.getCurrentState();
    this.playerState.next({ ...curState, isPlaying: state });
  }

  // Get video duration
  getDuration(): number {
    if (!this.player || !this.playerReady) return 0;
    return this.player.getDuration() || 0;
  }

  seekTo(seconds: number): void {
    if (this.player) {
      this.player.seekTo(seconds, true);

      // Update state immediately for better UX
      const duration = this.player.getDuration() || 0;
      const progress = duration > 0 ? (seconds / duration) * 100 : 0;

      this.playerStateUpdate$.next({
        currentTime: seconds,
        progress,
      });
    }
  }

  seekToPercent(percent: number): void {
    if (this.player) {
      const duration = this.player.getDuration() || 0;
      const seconds = (percent / 100) * duration;
      this.seekTo(seconds);
    }
  }

  // Set volume (0-100)
  setVolume(volume: number): void {
    if (this.player) {
      // Volume is between 0-100
      const safeVolume = Math.max(0, Math.min(100, volume));
      this.player.setVolume(safeVolume);

      // Save to localStorage
      localStorage.setItem('youtubePlayerVolume', safeVolume.toString());

      this.playerStateUpdate$.next({
        volume: safeVolume,
      });
    }
  }

  // Optional method to get video title (requires YouTube Data API key)
  private async fetchVideoTitle(videoId: string): Promise<string> {
    try {
      if (!environment.googleMapsApiKey) {
        return `YouTube Video ${videoId}`; // Fallback if no API key
      }

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${environment.googleMapsApiKey}&part=snippet`
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.items && data.items.length > 0
        ? data.items[0]?.snippet?.title || `YouTube Video ${videoId}`
        : `YouTube Video ${videoId}`;
    } catch (error) {
      console.error('Error fetching video title:', error);
      return `YouTube Video ${videoId}`;
    }
  }

  playNext(): void {
    const currentIndex = this.playlist.findIndex(
      (track) => track.id === this.currentTrack.value?.id
    );

    if (currentIndex >= 0 && currentIndex < this.playlist.length - 1) {
      this.selectTrack(this.playlist[currentIndex + 1]);
      this.play();
    }
  }

  playPrevious(): void {
    const currentIndex = this.playlist.findIndex(
      (track) => track.id === this.currentTrack.value?.id
    );

    if (currentIndex > 0) {
      this.selectTrack(this.playlist[currentIndex - 1]);
      this.play();
    }
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  public destroy(): void {
    this.stopProgressTracking();

    // Clean up subscriptions
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];

    if (this.player) {
      this.player.destroy();
      this.player = null;
    }

    // Reset state
    this.playerReady = false;
    this.playerReady$.next(false);
  }
}
