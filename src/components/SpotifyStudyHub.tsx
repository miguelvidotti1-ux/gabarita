import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  Headphones, 
  ExternalLink, 
  Volume2, 
  Volume1,
  VolumeX,
  Minus,
  Plus,
  Music, 
  Sparkles, 
  Maximize2, 
  Minimize2,
  Radio,
  Zap,
  Coffee,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  RotateCw,
  User,
  LogOut,
  Search,
  CheckCircle2,
  HelpCircle,
  Copy,
  ListMusic,
  RefreshCw,
  Mic2,
  Sliders,
  AlignLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  STUDY_TRACKS_WITH_LYRICS, 
  StudyTrackWithLyrics,
  searchTrackLyrics 
} from '../data/study_lyrics';
import { studyAudio } from '../services/studyAudioEngine';

export interface PlaylistOption {
  id: string;
  name: string;
  category: string;
  description: string;
  iconType: 'lofi' | 'classica' | 'piano' | 'ambient' | 'jazz' | 'eletronica' | 'custom';
}

export const STUDY_PLAYLISTS: PlaylistOption[] = [
  {
    id: '37i9dQZF1DWZeKCADg2G9d',
    name: 'Lo-Fi Beats',
    category: 'Lo-Fi',
    description: 'Batidas relaxantes para manter o foco',
    iconType: 'lofi'
  },
  {
    id: '37i9dQZF1DWWEJlddA8J5n',
    name: 'Música Clássica',
    category: 'Clássica',
    description: 'Composições para concentração profunda',
    iconType: 'classica'
  },
  {
    id: '37i9dQZF1DX0EDUovIMrJh',
    name: 'Piano Relaxante',
    category: 'Piano',
    description: 'Piano suave para leitura e redação',
    iconType: 'piano'
  },
  {
    id: '37i9dQZF1DX4PP3DAI2Lr3',
    name: 'Ambient',
    category: 'Ambient',
    description: 'Som ambiente para imersão total',
    iconType: 'ambient'
  },
  {
    id: '37i9dQZF1DX1tyUED9oaUy',
    name: 'Jazz para Estudar',
    category: 'Jazz',
    description: 'Jazz suave para manter o ritmo',
    iconType: 'jazz'
  },
  {
    id: '37i9dQZF1DX5Q27plkaOQk',
    name: 'Eletrônica Focus',
    category: 'Eletrônica',
    description: 'Eletrônica instrumental para alta produtividade',
    iconType: 'eletronica'
  }
];

interface SpotifyUserProfile {
  id: string;
  display_name: string;
  email?: string;
  followers?: number;
  product?: string;
  image?: string | null;
}

interface NowPlayingData {
  is_playing: boolean;
  progress_ms?: number;
  duration_ms?: number;
  track?: {
    id: string;
    name: string;
    artist: string;
    album: string;
    image: string | null;
    spotify_url: string;
  };
}

interface UserPlaylist {
  id: string;
  name: string;
  description: string;
  tracks_total: number;
  image: string | null;
  spotify_url: string;
  owner: string;
}

export interface EstiloMusicalItem {
  id: string;
  nome: string;
  descricao: string;
  icon: string;
  seeds: string[];
}

export interface EstiloTrackItem {
  id: string;
  uri: string;
  name: string;
  artist: string;
  album: string;
  duration_ms: number;
  image: string;
  preview_url: string;
}

interface SpotifyStudyHubProps {
  onToast?: (type: 'success' | 'error', message: string) => void;
  standalone?: boolean;
}

export const SpotifyStudyHub: React.FC<SpotifyStudyHubProps> = ({ onToast, standalone = false }) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistOption>(() => {
    const saved = localStorage.getItem('vesthub_spotify_playlist');
    if (saved) {
      const found = STUDY_PLAYLISTS.find(p => p.id === saved);
      if (found) return found;
    }
    return STUDY_PLAYLISTS[0];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('VestibularPro - Foco nos Estudos');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('Músicas selecionadas para foco e resolução de questões');
  
  // Spotify OAuth states
  const [isConnected, setIsConnected] = useState(false);
  const [isConfigured, setIsConfigured] = useState(true);
  const [userProfile, setUserProfile] = useState<SpotifyUserProfile | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [nowPlaying, setNowPlaying] = useState<NowPlayingData | null>(null);
  const [userPlaylists, setUserPlaylists] = useState<UserPlaylist[]>([]);
  const [activeTab, setActiveTab] = useState<'curated' | 'estilos' | 'my_playlists' | 'search'>('curated');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [callbackUri, setCallbackUri] = useState('');

  // Estilos Musicais states
  const [estilosList, setEstilosList] = useState<EstiloMusicalItem[]>([]);
  const [selectedEstiloId, setSelectedEstiloId] = useState<string>('lofi');
  const [estiloTracks, setEstiloTracks] = useState<EstiloTrackItem[]>([]);
  const [isLoadingEstilos, setIsLoadingEstilos] = useState(false);
  const [isLoadingEstiloTracks, setIsLoadingEstiloTracks] = useState(false);
  const [isCreatingEstiloPlaylist, setIsCreatingEstiloPlaylist] = useState(false);

  // Playlists do Usuário states
  const [selectedUserPlaylistId, setSelectedUserPlaylistId] = useState<string | null>(null);
  const [selectedUserPlaylistName, setSelectedUserPlaylistName] = useState<string>('');
  const [userPlaylistTracks, setUserPlaylistTracks] = useState<any[]>([]);
  const [isLoadingUserPlaylistTracks, setIsLoadingUserPlaylistTracks] = useState(false);

  // Estados para controle de volume do som (0 a 100%)
  const [volume, setVolume] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vesthub_music_volume');
      if (saved) return parseInt(saved, 10);
    }
    return 70;
  });
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(70);

  // Estados para o Player com Letra Sincronizada (Karaoke)
  const [playerMode, setPlayerMode] = useState<'lyrics' | 'spotify'>('lyrics');
  const [lyricsTrackIndex, setLyricsTrackIndex] = useState<number>(0);
  const [playbackTimeMs, setPlaybackTimeMs] = useState<number>(0);
  const [isPlayingLyrics, setIsPlayingLyrics] = useState<boolean>(false);
  const [autoScrollLyrics, setAutoScrollLyrics] = useState<boolean>(true);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  const activeLyricRef = useRef<HTMLDivElement>(null);

  // Música do Spotify atualmente sincronizada com letra
  const [spotifyCurrentTrack, setSpotifyCurrentTrack] = useState<StudyTrackWithLyrics | null>(null);
  const [isUsingSpotifyTrack, setIsUsingSpotifyTrack] = useState<boolean>(true);
  const [isFetchingSpotifyLyrics, setIsFetchingSpotifyLyrics] = useState<boolean>(false);
  const lastFetchedSpotifyTrackRef = useRef<string>('');

  const currentLyricsTrack: StudyTrackWithLyrics = (isUsingSpotifyTrack && spotifyCurrentTrack) 
    ? spotifyCurrentTrack 
    : (STUDY_TRACKS_WITH_LYRICS[lyricsTrackIndex] || STUDY_TRACKS_WITH_LYRICS[0]);

  // Helper para formatar tempo mm:ss
  const formatLyricsTime = (ms: number) => {
    const totalSecs = Math.floor(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Helper para requisições autenticadas com tokens locais e renovação automática
  const spotifyFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('spotify_access_token') : null;
    const refresh = typeof window !== 'undefined' ? localStorage.getItem('spotify_refresh_token') : null;

    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string> || {}),
    };

    if (token && token !== 'null' && token !== 'undefined') {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (refresh && refresh !== 'null' && refresh !== 'undefined') {
      headers['x-refresh-token'] = refresh;
    }

    const res = await fetch(url, { ...options, headers });

    // Atualizar token se o servidor renovou
    const newToken = res.headers.get('x-new-spotify-token');
    if (newToken && typeof window !== 'undefined') {
      localStorage.setItem('spotify_access_token', newToken);
    }

    return res;
  }, []);

  // Verificar status do Spotify no backend
  const checkSpotifyStatus = useCallback(async (explicitToken?: string) => {
    try {
      const token = explicitToken || (typeof window !== 'undefined' ? localStorage.getItem('spotify_access_token') : null);
      const refresh = typeof window !== 'undefined' ? localStorage.getItem('spotify_refresh_token') : null;

      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      if (refresh) headers['x-refresh-token'] = refresh;

      const res = await fetch('/api/spotify/status', { headers });
      if (!res.ok) return;
      const data = await res.json();
      setIsConnected(data.connected || false);
      setIsConfigured(data.configured !== false);
      if (data.redirect_uri) {
        setCallbackUri(data.redirect_uri);
      } else if (typeof window !== 'undefined') {
        setCallbackUri(`${window.location.origin}/api/spotify/callback`);
      }
      if (data.connected && data.user) {
        setUserProfile(data.user);
      } else {
        setUserProfile(null);
      }
    } catch (err) {
      console.error('Erro ao verificar status do Spotify:', err);
    }
  }, []);

  // Buscar músicas de um estilo específico
  const fetchEstiloTracks = useCallback(async (estiloId: string) => {
    setSelectedEstiloId(estiloId);
    setIsLoadingEstiloTracks(true);
    try {
      const res = await spotifyFetch(`/api/spotify/buscar-por-estilo?estilo=${encodeURIComponent(estiloId)}`);
      if (res.ok) {
        const data = await res.json();
        setEstiloTracks(data.musicas || []);
      }
    } catch (err) {
      console.warn('Erro ao carregar faixas do estilo:', err);
    } finally {
      setIsLoadingEstiloTracks(false);
    }
  }, [spotifyFetch]);

  // Carregar lista de estilos musicais pré-definidos
  const loadEstilos = useCallback(async () => {
    try {
      setIsLoadingEstilos(true);
      const res = await fetch('/api/spotify/estilos');
      if (res.ok) {
        const data = await res.json();
        const list: EstiloMusicalItem[] = data.estilos || [];
        setEstilosList(list);
        if (list.length > 0) {
          fetchEstiloTracks(list[0].id);
        }
      }
    } catch (err) {
      console.error('Erro ao carregar estilos:', err);
    } finally {
      setIsLoadingEstilos(false);
    }
  }, [fetchEstiloTracks]);

  useEffect(() => {
    // 1. Detectar tokens no hash da URL (#access_token=...&refresh_token=...) ou query param
    if (typeof window !== 'undefined') {
      if (window.location.hash && window.location.hash.includes('access_token=')) {
        const hash = window.location.hash.startsWith('#') ? window.location.hash.substring(1) : window.location.hash;
        const hashParams = new URLSearchParams(hash);
        const token = hashParams.get('access_token');
        const refresh = hashParams.get('refresh_token');
        if (token) localStorage.setItem('spotify_access_token', token);
        if (refresh) localStorage.setItem('spotify_refresh_token', refresh);
        checkSpotifyStatus(token || undefined);
        if (onToast) onToast('success', 'Spotify conectado com sucesso!');
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('spotify_connected') === 'true') {
          checkSpotifyStatus();
          if (onToast) onToast('success', 'Spotify conectado com sucesso!');
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        } else if (urlParams.get('spotify_error')) {
          const err = urlParams.get('spotify_error');
          if (onToast) onToast('error', `Erro ao autorizar Spotify: ${err}`);
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        } else {
          checkSpotifyStatus();
        }
      }
    }

    // 2. Listener para mensagens de sucesso de popup OAuth (postMessage)
    if (typeof window !== 'undefined') {
      (window as any).vestHubToast = onToast;
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SPOTIFY_AUTH_SUCCESS' || event.data?.type === 'spotify_auth_success') {
        const token = event.data.access_token || event.data.token;
        const refresh_token = event.data.refresh_token;
        if (token) localStorage.setItem('spotify_access_token', token);
        if (refresh_token) localStorage.setItem('spotify_refresh_token', refresh_token);
        checkSpotifyStatus(token);
        if (onToast) onToast('success', 'Spotify conectado com sucesso!');
        setIsConnecting(false);
      } else if (event.data?.type === 'SPOTIFY_AUTH_ERROR' || event.data?.type === 'spotify_auth_error') {
        const msg = event.data.message || event.data.error || 'Erro desconhecido';
        if (onToast) onToast('error', `Erro ao autorizar Spotify: ${msg}`);
        setIsConnecting(false);
      }
    };

    const handleExternalConnected = (e: any) => {
      const token = e?.detail?.token;
      checkSpotifyStatus(token || undefined);
    };

    window.addEventListener('message', handleMessage);
    window.addEventListener('spotify:connected', handleExternalConnected);
    loadEstilos();
    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('spotify:connected', handleExternalConnected);
    };
  }, [checkSpotifyStatus, loadEstilos, onToast]);

  // Buscar e sincronizar a letra da música que o usuário está ouvindo no Spotify
  const fetchSpotifyLyrics = useCallback(async (trackName: string, artistName: string, durationMs?: number, image?: string | null, album?: string) => {
    if (!trackName) return;
    const trackKey = `${trackName.trim().toLowerCase()}:::${(artistName || '').trim().toLowerCase()}`;
    if (lastFetchedSpotifyTrackRef.current === trackKey) return;
    lastFetchedSpotifyTrackRef.current = trackKey;

    setIsFetchingSpotifyLyrics(true);
    try {
      // 1. Verificar correspondência no acervo local de estudo
      const localMatch = searchTrackLyrics(trackName);
      if (localMatch) {
        setSpotifyCurrentTrack({
          ...localMatch,
          title: trackName,
          artist: artistName || localMatch.artist,
          album: album || localMatch.album,
          coverUrl: image || localMatch.coverUrl,
          duration_ms: durationMs || localMatch.duration_ms,
        });
        setIsUsingSpotifyTrack(true);
        setIsFetchingSpotifyLyrics(false);
        return;
      }

      // 2. Buscar letra sincronizada no endpoint /api/spotify/lyrics (LRCLib + Gemini)
      const res = await spotifyFetch(`/api/spotify/lyrics?track=${encodeURIComponent(trackName)}&artist=${encodeURIComponent(artistName || '')}&duration_ms=${durationMs || 0}`);
      if (res.ok) {
        const data = await res.json();
        if (data.lines && Array.isArray(data.lines) && data.lines.length > 0) {
          setSpotifyCurrentTrack({
            id: `spotify-live-${Date.now()}`,
            title: trackName,
            artist: artistName || 'Spotify',
            album: album || 'Tocando no Spotify',
            category: 'Ouvindo no Spotify',
            coverUrl: image || 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=500&auto=format&fit=crop&q=80',
            duration_ms: durationMs || data.duration_ms || 210000,
            themeColor: '#1DB954',
            soundType: 'lofi',
            lyrics: data.lines,
          });
          setIsUsingSpotifyTrack(true);
          if (onToast) {
            onToast('success', `Letra sincronizada: "${trackName}"`);
          }
        }
      }
    } catch (err) {
      console.warn('Erro ao carregar letra do Spotify:', err);
    } finally {
      setIsFetchingSpotifyLyrics(false);
    }
  }, [spotifyFetch, onToast]);

  // Polling em tempo real de now-playing se estiver conectado (a cada 2.5s)
  useEffect(() => {
    if (!isConnected) return;

    const fetchNowPlaying = async () => {
      try {
        const res = await spotifyFetch('/api/spotify/now-playing');
        if (res.ok) {
          const data = await res.json();
          setNowPlaying(data);

          if (data.track && data.track.name) {
            fetchSpotifyLyrics(
              data.track.name,
              data.track.artist,
              data.duration_ms,
              data.track.image,
              data.track.album
            );

            if (data.is_playing) {
              setIsPlayingLyrics(true);
              if (typeof data.progress_ms === 'number') {
                setPlaybackTimeMs(data.progress_ms);
              }
            } else {
              setIsPlayingLyrics(false);
            }
          }
        }
      } catch (e) {
        // Silencioso
      }
    };

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 2500);
    return () => clearInterval(interval);
  }, [isConnected, spotifyFetch, fetchSpotifyLyrics]);

  // Iniciar fluxo OAuth 2.0 via popup com abertura imediata para não ser bloqueado
  const handleConnectSpotify = async () => {
    setIsConnecting(true);

    const width = 560;
    const height = 720;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    // Abrir a janela imediatamente para evitar o bloqueador de pop-ups do navegador
    let authWindow: Window | null = null;
    try {
      authWindow = window.open(
        'about:blank',
        'spotify_oauth_popup',
        `width=${width},height=${height},left=${left},top=${top},status=no,toolbar=no,menubar=no`
      );
      if (authWindow?.document) {
        authWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head><title>Carregando Spotify...</title></head>
            <body style="background:#0B1120;color:#F8FAFC;font-family:-apple-system,BlinkMacSystemFont,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center;">
              <div>
                <div style="width:40px;height:40px;border:3px solid #1DB954;border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 16px;"></div>
                <h3 style="margin:0 0 6px;font-size:16px;">Conectando ao Spotify...</h3>
                <p style="margin:0;font-size:13px;color:#94A3B8;">Aguarde o redirecionamento</p>
                <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
              </div>
            </body>
          </html>
        `);
      }
    } catch (e) {
      // Ignorar caso navegador proíba criação prévia
    }

    try {
      const res = await fetch('/api/spotify/auth-url');
      if (!res.ok) {
        throw new Error('Falha ao obter URL de autorização');
      }
      const data = await res.json();
      if (!data.url) throw new Error('URL inválida');

      if (authWindow && !authWindow.closed) {
        authWindow.location.href = data.url;
      } else {
        authWindow = window.open(data.url, '_blank');
      }

      // Monitorar o fechamento da janela de popup caso postMessage seja bloqueado pelo navegador
      const popupCheckInterval = setInterval(() => {
        if (!authWindow || authWindow.closed) {
          clearInterval(popupCheckInterval);
          setIsConnecting(false);
          setTimeout(() => {
            checkSpotifyStatus();
          }, 600);
        }
      }, 1000);
    } catch (err: any) {
      if (authWindow && !authWindow.closed) {
        authWindow.close();
      }
      setIsConnecting(false);
      console.error('Erro ao conectar Spotify:', err);
      if (onToast) onToast('error', 'Verifique o Redirect URI e credenciais no Spotify Dashboard.');
      setShowConfigModal(true);
    }
  };

  // Desconectar do Spotify
  const handleDisconnect = async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('spotify_access_token');
        localStorage.removeItem('spotify_refresh_token');
      }
      await spotifyFetch('/api/spotify/logout', { method: 'POST' });
      setIsConnected(false);
      setUserProfile(null);
      setNowPlaying(null);
      setUserPlaylists([]);
      if (onToast) onToast('success', 'Spotify desconectado com sucesso.');
    } catch (err) {
      if (onToast) onToast('error', 'Erro ao desconectar do Spotify.');
    }
  };

  // Controles de reprodução remota
  const handlePlaybackControl = async (action: 'play' | 'pause' | 'next' | 'previous', uri?: string) => {
    try {
      let endpoint = `/api/spotify/${action}`;
      let method = (action === 'next' || action === 'previous') ? 'POST' : 'PUT';
      if (action === 'play' && uri) {
        endpoint += `?uri=${encodeURIComponent(uri)}`;
      }

      const res = await spotifyFetch(endpoint, { method });
      if (res.ok) {
        if (action === 'play') {
          setNowPlaying((prev) => prev ? { ...prev, is_playing: true } : { is_playing: true });
          if (onToast) onToast('success', 'Reprodução iniciada no Spotify.');
        } else if (action === 'pause') {
          setNowPlaying((prev) => prev ? { ...prev, is_playing: false } : { is_playing: false });
          if (onToast) onToast('success', 'Reprodução pausada.');
        } else if (action === 'next') {
          if (onToast) onToast('success', 'Avançando para a próxima música...');
        } else if (action === 'previous') {
          if (onToast) onToast('success', 'Retornando à música anterior...');
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        if (onToast) {
          onToast(
            'error', 
            errData.hint || errData.error || 'Abra o app Spotify em algum dispositivo para controle remoto.'
          );
        }
      }
    } catch (err) {
      if (onToast) onToast('error', 'Erro ao controlar player do Spotify.');
    }
  };

  // Carregar playlists do usuário
  const loadUserPlaylists = async () => {
    try {
      const res = await spotifyFetch('/api/spotify/playlists');
      if (res.ok) {
        const data = await res.json();
        setUserPlaylists(data.playlists || []);
      }
    } catch (err) {
      console.error('Erro ao carregar playlists:', err);
    }
  };

  // Buscar faixas ou playlists
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await spotifyFetch(`/api/spotify/search?q=${encodeURIComponent(searchQuery)}&type=track&limit=8`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.tracks || []);
      }
    } catch (err) {
      if (onToast) onToast('error', 'Erro ao pesquisar no Spotify.');
    } finally {
      setIsSearching(false);
    }
  };

  // Criar playlist de estudo na conta do usuário
  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;
    try {
      const res = await spotifyFetch('/api/spotify/create-playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newPlaylistName,
          description: newPlaylistDesc,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setShowCreateModal(false);
        if (onToast) onToast('success', `Playlist "${newPlaylistName}" criada no seu Spotify!`);
        loadUserPlaylists();
      } else {
        const err = await res.json().catch(() => ({}));
        if (onToast) onToast('error', err.error || 'Falha ao criar playlist.');
      }
    } catch (err) {
      if (onToast) onToast('error', 'Erro ao conectar com API do Spotify.');
    }
  };

  // Criar playlist com as faixas do estilo selecionado
  const handleCreateEstiloPlaylist = async () => {
    if (!estiloTracks.length) return;
    const currentEstilo = estilosList.find(e => e.id === selectedEstiloId);
    const nome = `VestHub • ${currentEstilo?.nome || 'Foco Total'}`;
    const descricao = currentEstilo?.descricao || 'Playlist gerada pelo VestHub para estudos e foco';
    const uris = estiloTracks.map(t => t.uri);

    setIsCreatingEstiloPlaylist(true);
    try {
      const res = await spotifyFetch('/api/spotify/criar-playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          descricao,
          track_uris: uris,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (onToast) onToast('success', `Playlist "${data.nome || nome}" criada com ${data.total_musicas || uris.length} músicas!`);
        loadUserPlaylists();
      } else {
        const err = await res.json().catch(() => ({}));
        if (onToast) onToast('error', err.error || 'Erro ao criar playlist do estilo.');
      }
    } catch (err) {
      if (onToast) onToast('error', 'Erro ao criar playlist.');
    } finally {
      setIsCreatingEstiloPlaylist(false);
    }
  };

  // Carregar faixas de uma playlist do usuário (incluindo playlists antigas/salvas)
  const carregarMusicasPlaylist = useCallback(async (playlistId: string, playlistName?: string) => {
    if (!playlistId) return;
    setSelectedUserPlaylistId(playlistId);
    if (playlistName) setSelectedUserPlaylistName(playlistName);
    setIsLoadingUserPlaylistTracks(true);

    try {
      const cleanId = playlistId.replace(/^spotify:playlist:/i, '').replace(/^https?:\/\/open\.spotify\.com\/playlist\//i, '').split('?')[0].trim();
      const res = await spotifyFetch(`/api/spotify/playlist-tracks?playlist_id=${encodeURIComponent(cleanId)}`);
      if (res.ok) {
        const data = await res.json();
        setUserPlaylistTracks(data.musicas || []);
        if (playlistName && onToast) {
          onToast('success', `${data.total || (data.musicas?.length || 0)} músicas carregadas de "${playlistName}"`);
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        if (onToast) onToast('error', errData.error || 'Erro ao carregar faixas da playlist.');
      }
    } catch (err) {
      console.error('Erro ao carregar faixas da playlist:', err);
      if (onToast) onToast('error', 'Erro ao carregar faixas da playlist.');
    } finally {
      setIsLoadingUserPlaylistTracks(false);
    }
  }, [spotifyFetch, onToast]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).carregarMusicasPlaylist = (id: string, name?: string) => {
        carregarMusicasPlaylist(id, name);
      };
    }
  }, [carregarMusicasPlaylist]);

  const handleSelectPlaylist = (playlist: PlaylistOption) => {
    setIsLoading(true);
    setSelectedPlaylist(playlist);
    localStorage.setItem('vesthub_spotify_playlist', playlist.id);

    // Carrega automaticamente as faixas caso seja uma playlist
    if (playlist.id) {
      carregarMusicasPlaylist(playlist.id, playlist.name);
    }

    if (onToast) {
      onToast('success', `Playlist alterada: ${playlist.name}`);
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const renderIcon = (type: PlaylistOption['iconType']) => {
    switch (type) {
      case 'lofi':
        return <Headphones size={15} />;
      case 'classica':
        return <Music size={15} />;
      case 'piano':
        return <Sparkles size={15} />;
      case 'ambient':
        return <Radio size={15} />;
      case 'jazz':
        return <Coffee size={15} />;
      case 'eletronica':
        return <Zap size={15} />;
      default:
        return <ListMusic size={15} />;
    }
  };

  // Controle de volume com suporte imediato ao sintetizador Web Audio e Spotify Connect
  const handleVolumeChange = useCallback(async (newVol: number, informSpotify = true) => {
    const clamped = Math.max(0, Math.min(100, Math.round(newVol)));
    setVolume(clamped);
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('vesthub_music_volume', clamped.toString());
    }

    // Altera som real no sintetizador do navegador
    studyAudio.setVolume(clamped);

    // Envia comando para Spotify caso conectado
    if (informSpotify && isConnected) {
      try {
        await spotifyFetch(`/api/spotify/volume?volume_percent=${clamped}`, { method: 'PUT' });
      } catch (err) {
        // Silencioso se Spotify local não estiver aberto
      }
    }
  }, [isConnected, isMuted, spotifyFetch]);

  const handleVolumeStep = (delta: number) => {
    const current = isMuted ? 0 : volume;
    const target = Math.max(0, Math.min(100, current + delta));
    handleVolumeChange(target);
    if (onToast) {
      onToast('success', `Volume do som: ${target}%`);
    }
  };

  const handleToggleMute = () => {
    if (isMuted || volume === 0) {
      const restored = previousVolume > 0 ? previousVolume : 70;
      setIsMuted(false);
      handleVolumeChange(restored);
      if (onToast) onToast('success', `Som ativado (${restored}%)`);
    } else {
      setPreviousVolume(volume);
      setIsMuted(true);
      handleVolumeChange(0);
      if (onToast) onToast('success', 'Mudo ativado');
    }
  };

  // Alternar reprodução da música com letra sincronizada
  const handleTogglePlayLyrics = () => {
    // Se estiver ouvindo pelo Spotify, controla a reprodução remota no Spotify
    if (isUsingSpotifyTrack && isConnected && nowPlaying?.track) {
      if (nowPlaying.is_playing) {
        handlePlaybackControl('pause');
        setIsPlayingLyrics(false);
      } else {
        handlePlaybackControl('play');
        setIsPlayingLyrics(true);
      }
      return;
    }

    if (isPlayingLyrics) {
      setIsPlayingLyrics(false);
      studyAudio.stopSound();
    } else {
      setIsPlayingLyrics(true);
      studyAudio.setVolume(isMuted ? 0 : volume);
      studyAudio.startSound(currentLyricsTrack.soundType);
    }
  };

  // Pular ou voltar tempo na letra sincronizada
  const handleSeekLyrics = (newTimeMs: number) => {
    const clamped = Math.max(0, Math.min(currentLyricsTrack.duration_ms, newTimeMs));
    setPlaybackTimeMs(clamped);
    if (isUsingSpotifyTrack && isConnected) {
      spotifyFetch('/api/spotify/controle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acao: 'seek', posicao_ms: clamped })
      }).catch(() => {});
    }
    if (!isPlayingLyrics) {
      if (isUsingSpotifyTrack && isConnected) {
        handlePlaybackControl('play');
      } else {
        studyAudio.setVolume(isMuted ? 0 : volume);
        studyAudio.startSound(currentLyricsTrack.soundType);
      }
      setIsPlayingLyrics(true);
    }
  };

  // Avançar ou retroceder faixa da letra
  const handleSelectLyricsTrack = (index: number) => {
    setIsUsingSpotifyTrack(false);
    const nextIdx = (index + STUDY_TRACKS_WITH_LYRICS.length) % STUDY_TRACKS_WITH_LYRICS.length;
    setLyricsTrackIndex(nextIdx);
    setPlaybackTimeMs(0);
    if (isPlayingLyrics) {
      const nextTrack = STUDY_TRACKS_WITH_LYRICS[nextIdx];
      studyAudio.startSound(nextTrack.soundType);
    }
    if (onToast) {
      onToast('success', `Música com letra: ${STUDY_TRACKS_WITH_LYRICS[nextIdx].title}`);
    }
  };

  const handleSelectSpotifyTrack = () => {
    if (nowPlaying?.track?.name) {
      setIsUsingSpotifyTrack(true);
      fetchSpotifyLyrics(
        nowPlaying.track.name,
        nowPlaying.track.artist,
        nowPlaying.duration_ms,
        nowPlaying.track.image,
        nowPlaying.track.album
      );
      if (typeof nowPlaying.progress_ms === 'number') {
        setPlaybackTimeMs(nowPlaying.progress_ms);
      }
      if (onToast) {
        onToast('success', `Sincronizando com seu Spotify: "${nowPlaying.track.name}"`);
      }
    } else {
      if (onToast) {
        onToast('error', 'Inicie uma música no seu Spotify para sincronizar a letra.');
      }
    }
  };

  // Loop de progresso de tempo da letra quando tocando
  useEffect(() => {
    if (!isPlayingLyrics) return;

    const interval = setInterval(() => {
      setPlaybackTimeMs((prev) => {
        if (prev >= currentLyricsTrack.duration_ms) {
          // Avançar para a próxima música automaticamente
          const nextIdx = (lyricsTrackIndex + 1) % STUDY_TRACKS_WITH_LYRICS.length;
          setLyricsTrackIndex(nextIdx);
          studyAudio.startSound(STUDY_TRACKS_WITH_LYRICS[nextIdx].soundType);
          return 0;
        }
        return prev + 250;
      });
    }, 250);

    return () => clearInterval(interval);
  }, [isPlayingLyrics, currentLyricsTrack, lyricsTrackIndex]);

  // Sincronizar com Spotify Now Playing caso esteja conectado e tocando
  useEffect(() => {
    if (isConnected && nowPlaying?.is_playing && typeof nowPlaying.progress_ms === 'number') {
      setPlaybackTimeMs(nowPlaying.progress_ms);
      if (nowPlaying.track?.name) {
        const found = searchTrackLyrics(nowPlaying.track.name);
        if (found) {
          const idx = STUDY_TRACKS_WITH_LYRICS.findIndex(t => t.id === found.id);
          if (idx !== -1 && idx !== lyricsTrackIndex) {
            setLyricsTrackIndex(idx);
          }
        }
      }
    }
  }, [isConnected, nowPlaying, lyricsTrackIndex]);

  // Identificar linha da letra ativa em tempo real
  const activeLineIndex = useMemo(() => {
    const lyrics = currentLyricsTrack.lyrics;
    let idx = 0;
    for (let i = 0; i < lyrics.length; i++) {
      if (playbackTimeMs >= lyrics[i].time_ms) {
        idx = i;
      } else {
        break;
      }
    }
    return idx;
  }, [currentLyricsTrack, playbackTimeMs]);

  // Auto-scroll suave da letra para a linha ativa
  useEffect(() => {
    if (autoScrollLyrics && activeLyricRef.current && lyricsContainerRef.current) {
      activeLyricRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeLineIndex, autoScrollLyrics]);

  const effectiveCallback = callbackUri || (typeof window !== 'undefined' ? `${window.location.origin}/api/spotify/callback` : '');

  return (
    <div 
      id="spotify-study-section"
      className={`rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] p-5 sm:p-6 shadow-sm transition-all duration-300 hover:border-[var(--border-color)] ${
        standalone ? 'max-w-4xl mx-auto' : ''
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#1DB954] flex items-center justify-center shadow-lg shadow-[#1DB954]/25 shrink-0">
            <svg 
              viewBox="0 0 24 24" 
              className="w-6 h-6 fill-black"
              aria-label="Spotify Logo"
            >
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.539-.9 4.561-1.021 8.52-.6 11.64 1.32.42.18.54.78.302 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 4.32-1.32 9.72-.66 13.44 1.62.381.241.54.961.301 1.201zm.122-3.44C16.021 8.46 8.82 8.28 5.16 9.42c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.301.719 1.021.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-extrabold text-[var(--text-main)] tracking-tight">
                Músicas para estudar
              </h3>
              <span id="np-badge" className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${
                isConnected ? 'bg-[#1DB954]/20 text-[#1DB954] border-[#1DB954]/30' : 'bg-[var(--bg-hover)] text-[var(--text-muted)] border-[var(--border-light)]'
              }`}>
                {isConnected ? (userProfile?.product === 'premium' ? 'Premium' : 'Conectado') : 'Spotify'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              {isConnected && userProfile
                ? `Conta vinculada: ${userProfile.display_name || userProfile.email || 'Usuário Spotify'}`
                : 'Playlists curadas e sincronização Spotify Connect para foco contínuo'}
            </p>
          </div>
        </div>

        <div id="spotify-status" className="flex items-center flex-wrap gap-2">
          {/* Status badge ou botão de autenticação */}
          {isConnected ? (
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1DB954]/10 text-[#1DB954] text-xs font-semibold border border-[#1DB954]/20 shadow-sm">
                {userProfile?.image ? (
                  <img src={userProfile.image} alt="Avatar" className="w-4 h-4 rounded-full object-cover" />
                ) : (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1DB954] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1DB954]"></span>
                  </span>
                )}
                <span className="truncate max-w-[110px]">{userProfile?.display_name || 'Spotify Ativo'}</span>
              </div>

              <button
                onClick={handleDisconnect}
                className="p-2 rounded-lg bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 border border-[var(--border-light)] transition-colors cursor-pointer text-xs flex items-center gap-1"
                title="Desconectar conta Spotify"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleConnectSpotify}
                disabled={isConnecting}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#1DB954] hover:bg-[#1ed760] text-black text-xs font-bold shadow-md shadow-[#1DB954]/20 transition-all cursor-pointer hover:scale-[1.02] disabled:opacity-50"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-black"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.539-.9 4.561-1.021 8.52-.6 11.64 1.32.42.18.54.78.302 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 4.32-1.32 9.72-.66 13.44 1.62.381.241.54.961.301 1.201zm.122-3.44C16.021 8.46 8.82 8.28 5.16 9.42c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.301.719 1.021.419 1.56-.299.421-1.02.599-1.559.3z" /></svg>
                <span>{isConnecting ? 'Conectando...' : 'Conectar Spotify'}</span>
              </button>

              <button
                onClick={() => setShowConfigModal(true)}
                className="p-2 rounded-lg bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--border-color)] border border-[var(--border-light)] transition-colors cursor-pointer"
                title="Instruções de configuração OAuth"
              >
                <HelpCircle size={15} />
              </button>
            </div>
          )}

          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 rounded-lg bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--border-color)] border border-[var(--border-light)] transition-colors cursor-pointer"
            title={isMinimized ? 'Expandir player' : 'Minimizar player'}
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Tabs de seleção quando conectado */}
      {isConnected && (
        <div className="flex items-center justify-between gap-2 border-b border-[var(--border-light)] mb-4 pb-2 text-xs">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('curated')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                activeTab === 'curated'
                  ? 'bg-[var(--bg-hover)] text-[var(--text-main)] font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Playlists Curadas
            </button>
            <button
              onClick={() => {
                setActiveTab('estilos');
                if (estilosList.length === 0) {
                  loadEstilos();
                }
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'estilos'
                  ? 'bg-[var(--bg-hover)] text-[var(--text-main)] font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <span>Estilos</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#1DB954]/20 text-[#1DB954] font-bold">10</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('my_playlists');
                loadUserPlaylists();
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                activeTab === 'my_playlists'
                  ? 'bg-[var(--bg-hover)] text-[var(--text-main)] font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Minhas Playlists
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                activeTab === 'search'
                  ? 'bg-[var(--bg-hover)] text-[var(--text-main)] font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Buscar no Spotify
            </button>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#1DB954]/10 text-[#1DB954] hover:bg-[#1DB954]/20 border border-[#1DB954]/20 transition-all font-semibold cursor-pointer"
          >
            <Plus size={13} />
            <span>Criar Playlist</span>
          </button>
        </div>
      )}

      {/* Conteúdo da Tab */}
      {activeTab === 'curated' && (
        <div id="spotify-categories" className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 custom-scrollbar">
          {STUDY_PLAYLISTS.map((item) => {
            const isActive = selectedPlaylist.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectPlaylist(item)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-[#1DB954] text-black font-bold shadow-md shadow-[#1DB954]/25 scale-[1.02]'
                    : 'bg-[var(--bg-hover)] text-[var(--text-muted)] hover:bg-[#1DB954]/10 hover:text-[#1DB954] hover:border-[#1DB954]/40 border border-[var(--border-light)]'
                }`}
              >
                {renderIcon(item.iconType)}
                <span>{item.category}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Tab: Estilos Musicais Pré-definidos */}
      {activeTab === 'estilos' && (
        <div className="space-y-3 mb-4">
          {/* Seletor horizontal de estilos */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
            {estilosList.map((estilo) => {
              const isSelected = selectedEstiloId === estilo.id;
              return (
                <button
                  key={estilo.id}
                  onClick={() => fetchEstiloTracks(estilo.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 shrink-0 ${
                    isSelected
                      ? 'bg-[#1DB954] text-black font-bold shadow-md shadow-[#1DB954]/25 scale-[1.02]'
                      : 'bg-[var(--bg-hover)] text-[var(--text-muted)] hover:bg-[#1DB954]/10 hover:text-[#1DB954] hover:border-[#1DB954]/40 border border-[var(--border-light)]'
                  }`}
                >
                  <span className="text-base">{estilo.icon}</span>
                  <span>{estilo.nome}</span>
                </button>
              );
            })}
          </div>

          {/* Banner do Estilo Atual */}
          {estilosList.find(e => e.id === selectedEstiloId) && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-light)]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{estilosList.find(e => e.id === selectedEstiloId)?.icon}</span>
                  <p className="font-bold text-xs sm:text-sm text-[var(--text-main)]">
                    {estilosList.find(e => e.id === selectedEstiloId)?.nome}
                  </p>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    ({estiloTracks.length} faixas selecionadas)
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  {estilosList.find(e => e.id === selectedEstiloId)?.descricao}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined' && (window as any).abrirCriadorPlaylist) {
                      (window as any).abrirCriadorPlaylist();
                    } else {
                      handleCreateEstiloPlaylist();
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-light)] hover:border-[#1DB954] text-[var(--text-main)] hover:text-[#1DB954] text-xs font-semibold transition-all cursor-pointer"
                  title="Abrir assistente guiado em 4 passos"
                >
                  <Sparkles size={13} />
                  <span className="hidden sm:inline">Assistente Guiado</span>
                  <span className="sm:hidden">Assistente</span>
                </button>
                <button
                  onClick={handleCreateEstiloPlaylist}
                  disabled={isCreatingEstiloPlaylist || estiloTracks.length === 0}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1DB954] text-black text-xs font-bold hover:bg-[#1ed760] transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                >
                  <Plus size={13} />
                  <span>{isCreatingEstiloPlaylist ? 'Criando...' : 'Criar Playlist'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Lista de Faixas do Estilo */}
          {isLoadingEstiloTracks ? (
            <div className="p-4 rounded-xl bg-[var(--bg-hover)] text-center text-xs text-[var(--text-muted)] border border-[var(--border-light)]">
              Carregando faixas para {estilosList.find(e => e.id === selectedEstiloId)?.nome || 'o estilo'}...
            </div>
          ) : estiloTracks.length > 0 ? (
            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1 custom-scrollbar">
              {estiloTracks.map((track, idx) => (
                <div
                  key={track.id || idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-hover)] border border-[var(--border-light)] hover:border-[#1DB954]/40 transition-all text-xs group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 text-center text-[10px] text-[var(--text-muted)] shrink-0">
                      {idx + 1}
                    </span>
                    {track.image ? (
                      <img src={track.image} alt={track.name} className="w-7 h-7 rounded object-cover shrink-0" />
                    ) : (
                      <div className="w-7 h-7 rounded bg-[var(--border-light)] flex items-center justify-center shrink-0">
                        <Music size={12} />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-[var(--text-main)] truncate">{track.name}</p>
                      <p className="text-[10px] text-[var(--text-muted)] truncate">{track.artist} • {track.album}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {track.duration_ms && (
                      <span className="text-[10px] text-[var(--text-muted)] hidden sm:inline">
                        {Math.floor(track.duration_ms / 60000)}:{String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
                      </span>
                    )}
                    <button
                      onClick={() => handlePlaybackControl('play', track.uri || `spotify:track:${track.id}`)}
                      className="p-1.5 rounded-md bg-[#1DB954]/15 hover:bg-[#1DB954] text-[#1DB954] hover:text-black transition-colors cursor-pointer"
                      title="Tocar no Spotify"
                    >
                      <Play size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[var(--bg-hover)] text-center text-xs text-[var(--text-muted)] border border-[var(--border-light)]">
              Nenhuma faixa encontrada para este estilo. Clique em outro estilo para carregar.
            </div>
          )}
        </div>
      )}

      {activeTab === 'my_playlists' && (
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-2">
            <span>Suas playlists salvas no Spotify:</span>
            <button onClick={loadUserPlaylists} className="text-[#1DB954] hover:underline flex items-center gap-1 cursor-pointer">
              <RefreshCw size={12} /> Atualizar
            </button>
          </div>
          {userPlaylists.length === 0 ? (
            <div className="p-4 rounded-xl bg-[var(--bg-hover)] text-center text-xs text-[var(--text-muted)] border border-[var(--border-light)]">
              Carregando playlists da sua conta Spotify...
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              {userPlaylists.map((pl) => (
                <div
                  key={pl.id}
                  className={`p-2 rounded-xl text-left border text-xs transition-all flex items-center justify-between gap-2 ${
                    selectedPlaylist.id === pl.id || selectedUserPlaylistId === pl.id
                      ? 'bg-[#1DB954]/15 border-[#1DB954] text-[#1DB954]'
                      : 'bg-[var(--bg-hover)] border-[var(--border-light)] text-[var(--text-main)] hover:border-[#1DB954]/40'
                  }`}
                >
                  <button
                    onClick={() => {
                      handleSelectPlaylist({
                        id: pl.id,
                        name: pl.name,
                        category: 'Minha Playlist',
                        description: `${pl.tracks_total} músicas • ${pl.owner}`,
                        iconType: 'custom'
                      });
                      carregarMusicasPlaylist(pl.id, pl.name);
                    }}
                    className="flex items-center gap-2 min-w-0 flex-1 text-left cursor-pointer"
                  >
                    {pl.image ? (
                      <img src={pl.image} alt={pl.name} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-[var(--border-light)] flex items-center justify-center shrink-0">
                        <Music size={14} />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{pl.name}</p>
                      <p className="text-[10px] text-[var(--text-muted)] truncate">{pl.tracks_total} faixas</p>
                    </div>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPlaylist({
                        id: pl.id,
                        name: pl.name,
                        category: 'Minha Playlist',
                        description: `${pl.tracks_total} músicas • ${pl.owner}`,
                        iconType: 'custom'
                      });
                      carregarMusicasPlaylist(pl.id, pl.name);
                    }}
                    className="p-1.5 rounded-lg hover:bg-[#1DB954]/20 text-[var(--text-muted)] hover:text-[#1DB954] transition-colors cursor-pointer shrink-0"
                    title="Ver músicas da playlist"
                  >
                    <ListMusic size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Banner da Playlist Selecionada e Lista de Faixas */}
          {selectedUserPlaylistId && (
            <div className="pt-2 border-t border-[var(--border-light)] space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-light)]">
                <div className="flex items-center gap-2 min-w-0">
                  <ListMusic size={16} className="text-[#1DB954] shrink-0" />
                  <div className="min-w-0">
                    <p className="font-bold text-xs sm:text-sm text-[var(--text-main)] truncate">
                      {selectedUserPlaylistName || userPlaylists.find(p => p.id === selectedUserPlaylistId)?.name || 'Playlist Selecionada'}
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)]">
                      {userPlaylistTracks.length} faixas encontradas
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      const cleanId = selectedUserPlaylistId.replace(/^spotify:playlist:/i, '').split('?')[0].trim();
                      handlePlaybackControl('play', `spotify:playlist:${cleanId}`);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1DB954] text-black text-xs font-bold hover:bg-[#1ed760] transition-colors cursor-pointer shrink-0"
                    title="Reproduzir playlist completa no Spotify"
                  >
                    <Play size={13} />
                    <span>Tocar Playlist</span>
                  </button>
                </div>
              </div>

              {/* Lista de Músicas da Playlist */}
              {isLoadingUserPlaylistTracks ? (
                <div className="p-4 rounded-xl bg-[var(--bg-hover)] text-center text-xs text-[var(--text-muted)] border border-[var(--border-light)]">
                  Carregando faixas da sua playlist no Spotify...
                </div>
              ) : userPlaylistTracks.length > 0 ? (
                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1 custom-scrollbar">
                  {userPlaylistTracks.map((track, idx) => (
                    <div
                      key={track.id || idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-hover)] border border-[var(--border-light)] hover:border-[#1DB954]/40 transition-all text-xs group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-5 text-center text-[10px] text-[var(--text-muted)] shrink-0">
                          {idx + 1}
                        </span>
                        {track.image ? (
                          <img src={track.image} alt={track.name} className="w-7 h-7 rounded object-cover shrink-0" />
                        ) : (
                          <div className="w-7 h-7 rounded bg-[var(--border-light)] flex items-center justify-center shrink-0">
                            <Music size={12} />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-[var(--text-main)] truncate">{track.name}</p>
                          <p className="text-[10px] text-[var(--text-muted)] truncate">{track.artist} • {track.album}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {track.duration_ms && (
                          <span className="text-[10px] text-[var(--text-muted)] hidden sm:inline">
                            {Math.floor(track.duration_ms / 60000)}:{String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
                          </span>
                        )}
                        <button
                          onClick={() => handlePlaybackControl('play', track.uri || `spotify:track:${track.id}`)}
                          className="p-1.5 rounded-md bg-[#1DB954]/15 hover:bg-[#1DB954] text-[#1DB954] hover:text-black transition-colors cursor-pointer"
                          title="Tocar no Spotify"
                        >
                          <Play size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-[var(--bg-hover)] text-center text-xs text-[var(--text-muted)] border border-[var(--border-light)]">
                  Nenhuma música encontrada nesta playlist.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'search' && (
        <div className="space-y-3 mb-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar música, lo-fi, artista..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-light)] text-xs text-[var(--text-main)] focus:outline-none focus:border-[#1DB954]"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-4 py-2 rounded-xl bg-[#1DB954] text-black text-xs font-bold hover:bg-[#1ed760] transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSearching ? 'Buscando...' : 'Buscar'}
            </button>
          </form>

          {searchResults.length > 0 && (
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              {searchResults.map((track) => (
                <div
                  key={track.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-hover)] border border-[var(--border-light)] hover:border-[#1DB954]/40 transition-all text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {track.image && (
                      <img src={track.image} alt={track.name} className="w-7 h-7 rounded object-cover shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-[var(--text-main)] truncate">{track.name}</p>
                      <p className="text-[10px] text-[var(--text-muted)] truncate">{track.artist} • {track.album}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handlePlaybackControl('play', `spotify:track:${track.id}`)}
                    className="p-1.5 rounded-md bg-[#1DB954]/15 hover:bg-[#1DB954] text-[#1DB954] hover:text-black transition-colors shrink-0 cursor-pointer"
                    title="Tocar agora"
                  >
                    <Play size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Retângulo Maior: Player Principal com Letra Sincronizada em Tempo Real & Controles de Som */}
      <div className="rounded-2xl overflow-hidden border border-[var(--border-light)] bg-[var(--bg-card)] shadow-lg hover:border-[#1DB954]/50 transition-all">
        {/* Barra Superior do Retângulo: Modos de Visualização & Seleção de Música */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:px-5 bg-[var(--bg-hover)] border-b border-[var(--border-light)]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPlayerMode('lyrics')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                playerMode === 'lyrics'
                  ? 'bg-[#1DB954] text-black shadow-md shadow-[#1DB954]/20'
                  : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-light)]'
              }`}
            >
              <Mic2 size={14} />
              <span>Letra Sincronizada</span>
            </button>

            <button
              onClick={() => setPlayerMode('spotify')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                playerMode === 'spotify'
                  ? 'bg-[#1DB954] text-black shadow-md shadow-[#1DB954]/20'
                  : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-light)]'
              }`}
            >
              <Music size={14} />
              <span>Player Spotify</span>
            </button>
          </div>

          {/* Seletor de faixa com letra e status */}
          <div className="flex items-center gap-2 flex-wrap">
            {playerMode === 'lyrics' && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] text-[var(--text-muted)] font-medium hidden md:inline">Música:</span>
                <select
                  value={isUsingSpotifyTrack && nowPlaying?.track?.name ? 'spotify-live' : lyricsTrackIndex}
                  onChange={(e) => {
                    if (e.target.value === 'spotify-live') {
                      handleSelectSpotifyTrack();
                    } else {
                      handleSelectLyricsTrack(parseInt(e.target.value, 10));
                    }
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] text-xs text-[var(--text-main)] font-semibold cursor-pointer focus:outline-none focus:border-[#1DB954] max-w-[220px] sm:max-w-xs truncate"
                >
                  {nowPlaying?.track?.name && (
                    <option value="spotify-live">
                      🟢 Ouvindo no Spotify: {nowPlaying.track.name}
                    </option>
                  )}
                  {STUDY_TRACKS_WITH_LYRICS.map((track, idx) => (
                    <option key={track.id} value={idx}>
                      {track.title} — {track.artist}
                    </option>
                  ))}
                </select>

                {isConnected && nowPlaying?.track?.name && (
                  <button
                    onClick={handleSelectSpotifyTrack}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      isUsingSpotifyTrack
                        ? 'bg-[#1DB954] text-black shadow-xs font-black'
                        : 'bg-[var(--bg-card)] text-[#1DB954] hover:bg-[#1DB954]/10 border border-[#1DB954]/30'
                    }`}
                    title="Exibir letra da música que você está ouvindo no Spotify agora"
                  >
                    <RefreshCw size={12} className={isFetchingSpotifyLyrics ? 'animate-spin' : ''} />
                    <span className="hidden sm:inline">
                      {isUsingSpotifyTrack ? 'Letra do Spotify (Ativa)' : 'Sincronizar Spotify'}
                    </span>
                  </button>
                )}

                <button
                  onClick={() => setAutoScrollLyrics(!autoScrollLyrics)}
                  className={`p-1.5 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                    autoScrollLyrics
                      ? 'bg-[#1DB954]/15 text-[#1DB954] border-[#1DB954]/30'
                      : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-light)]'
                  }`}
                  title={autoScrollLyrics ? 'Auto-rolagem da letra ativada' : 'Auto-rolagem desativada'}
                >
                  <AlignLeft size={13} />
                  <span className="hidden sm:inline">Auto-scroll</span>
                </button>
              </div>
            )}

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1DB954]/10 border border-[#1DB954]/30 text-[#1DB954] text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] animate-ping" />
              <span>
                {isFetchingSpotifyLyrics
                  ? 'BUSCANDO LETRA...'
                  : isUsingSpotifyTrack && nowPlaying?.is_playing
                  ? 'SPOTIFY AO VIVO'
                  : isPlayingLyrics
                  ? 'SINCRONIZADO AO VIVO'
                  : 'PAUSADO'}
              </span>
            </div>
          </div>
        </div>

        {/* Corpo do Retângulo Maior */}
        <AnimatePresence mode="wait">
          {!isMinimized && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {playerMode === 'lyrics' ? (
                /* Visualização de Letra Sincronizada (Karaoke Style) */
                <div className="relative p-4 sm:p-6 bg-gradient-to-b from-[var(--bg-card)] via-[var(--bg-hover)] to-[var(--bg-card)]">
                  {/* Banner caso o Spotify não esteja conectado */}
                  {!isConnected && (
                    <div className="mb-4 p-3 rounded-xl bg-[#1DB954]/10 border border-[#1DB954]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#1DB954] shrink-0 animate-pulse" />
                        <span className="text-[var(--text-main)] font-semibold">
                          Ouvindo música no app Spotify? Conecte sua conta para a letra acompanhar sua reprodução ao vivo!
                        </span>
                      </div>
                      <button
                        onClick={handleConnectSpotify}
                        className="px-3.5 py-1.5 rounded-lg bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold text-xs transition-all shrink-0 cursor-pointer shadow-sm"
                      >
                        Conectar Spotify
                      </button>
                    </div>
                  )}

                  {/* Cabeçalho da Faixa Selecionada */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-light)] mb-4">
                    <div className="flex items-center gap-3.5">
                      <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-md shrink-0 border border-[var(--border-light)] group">
                        <img 
                          src={currentLyricsTrack.coverUrl} 
                          alt={currentLyricsTrack.title}
                          className={`w-full h-full object-cover transition-transform duration-500 ${isPlayingLyrics ? 'scale-105' : ''}`}
                        />
                        {isPlayingLyrics && (
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#1DB954] shadow-sm animate-pulse" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base sm:text-lg font-black text-[var(--text-main)] truncate">
                            {currentLyricsTrack.title}
                          </h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider shrink-0 ${
                            isUsingSpotifyTrack
                              ? 'bg-[#1DB954] text-black shadow-xs'
                              : 'bg-[#1DB954]/15 text-[#1DB954]'
                          }`}>
                            {isUsingSpotifyTrack ? 'Ouvindo no Spotify' : 'Acervo de Estudo'}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-muted)] truncate">
                          {currentLyricsTrack.artist} • <span className="italic">{currentLyricsTrack.album}</span>
                        </p>
                        <p className="text-[11px] text-[var(--text-muted)] font-medium mt-0.5">
                          {currentLyricsTrack.category}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleSelectLyricsTrack(lyricsTrackIndex - 1)}
                        className="p-2 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--border-color)] border border-[var(--border-light)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
                        title="Música anterior com letra"
                      >
                        <SkipBack size={15} />
                      </button>
                      <button
                        onClick={() => handleSelectLyricsTrack(lyricsTrackIndex + 1)}
                        className="p-2 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--border-color)] border border-[var(--border-light)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
                        title="Próxima música com letra"
                      >
                        <SkipForward size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Área Central de Letras Sincronizadas */}
                  <div 
                    ref={lyricsContainerRef}
                    className="h-72 sm:h-80 overflow-y-auto px-2 sm:px-6 py-4 space-y-3 custom-scrollbar rounded-xl bg-black/20 dark:bg-black/35 border border-[var(--border-light)] relative scroll-smooth select-none"
                  >
                    {isFetchingSpotifyLyrics ? (
                      <div className="flex flex-col items-center justify-center h-full text-center space-y-3 py-10">
                        <div className="w-8 h-8 border-3 border-[#1DB954] border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm font-bold text-[var(--text-main)]">
                          Sincronizando letra da música que você está ouvindo no Spotify...
                        </p>
                        <p className="text-xs text-[var(--text-muted)]">
                          {nowPlaying?.track?.name} — {nowPlaying?.track?.artist}
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="text-[10px] uppercase font-bold tracking-widest text-center text-[var(--text-muted)] mb-2 opacity-60">
                          {isUsingSpotifyTrack
                            ? '— Letra sincronizada diretamente com sua reprodução no Spotify —'
                            : '— Clique em qualquer verso para pular diretamente para aquele instante da música —'}
                        </div>

                        {currentLyricsTrack.lyrics.map((line, idx) => {
                          const isActive = idx === activeLineIndex;
                          const isPast = idx < activeLineIndex;

                          return (
                            <div
                              key={`${line.time_ms}-${idx}`}
                              ref={isActive ? activeLyricRef : null}
                              onClick={() => handleSeekLyrics(line.time_ms)}
                              className={`group transition-all duration-300 rounded-xl px-4 py-2.5 cursor-pointer flex items-center justify-between gap-3 ${
                                isActive
                                  ? 'bg-[#1DB954]/20 border border-[#1DB954]/50 shadow-md shadow-[#1DB954]/10 scale-[1.01]'
                                  : isPast
                                  ? 'opacity-65 hover:opacity-100 hover:bg-white/5'
                                  : 'opacity-35 hover:opacity-85 hover:bg-white/5'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                {isActive ? (
                                  <span className="w-5 h-5 rounded-full bg-[#1DB954] text-black flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                                    <Music size={11} className="font-bold" />
                                  </span>
                                ) : (
                                  <span className="w-5 text-center text-[10px] text-[var(--text-muted)] font-mono shrink-0 opacity-40 group-hover:opacity-100">
                                    {idx + 1}
                                  </span>
                                )}
                                <p className={`leading-relaxed transition-colors ${
                                  isActive
                                    ? 'text-base sm:text-xl font-extrabold text-[#1DB954] dark:text-[#1ed760] drop-shadow-sm'
                                    : 'text-xs sm:text-sm font-semibold text-[var(--text-main)]'
                                }`}>
                                  {line.text}
                                </p>
                              </div>

                              <span className={`text-[10px] font-mono shrink-0 px-2 py-0.5 rounded ${
                                isActive 
                                  ? 'bg-[#1DB954] text-black font-extrabold'
                                  : 'text-[var(--text-muted)] group-hover:text-[var(--text-main)] bg-[var(--bg-card)]/50'
                              }`}>
                                {formatLyricsTime(line.time_ms)}
                              </span>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>

                  {/* Barra de Progresso e Scrubber da Música */}
                  <div className="mt-4 pt-3 border-t border-[var(--border-light)] space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-[var(--text-muted)]">
                      <span>{formatLyricsTime(playbackTimeMs)}</span>
                      <span className="text-[10px] font-sans font-medium text-[#1DB954]">
                        {isPlayingLyrics ? '♫ Reproduzindo som e sincronia' : 'Pausado'}
                      </span>
                      <span>{formatLyricsTime(currentLyricsTrack.duration_ms)}</span>
                    </div>

                    <input
                      type="range"
                      min={0}
                      max={currentLyricsTrack.duration_ms}
                      value={playbackTimeMs}
                      onChange={(e) => handleSeekLyrics(parseInt(e.target.value, 10))}
                      className="w-full h-2 bg-[var(--bg-hover)] rounded-lg appearance-none cursor-pointer accent-[#1DB954]"
                      title="Arraste para avançar ou retroceder a música e a letra"
                    />

                    {/* Botões Centrais de Controle da Reprodução */}
                    <div className="flex items-center justify-center gap-3 pt-1">
                      <button
                        onClick={() => handleSeekLyrics(playbackTimeMs - 5000)}
                        className="p-2 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer border border-[var(--border-light)]"
                        title="Voltar 5 segundos"
                      >
                        <RotateCcw size={16} />
                      </button>

                      <button
                        onClick={handleTogglePlayLyrics}
                        className="px-6 py-2.5 rounded-2xl bg-[#1DB954] hover:bg-[#1ed760] text-black font-extrabold text-sm shadow-md shadow-[#1DB954]/25 transition-all cursor-pointer hover:scale-105 flex items-center gap-2"
                      >
                        {isPlayingLyrics ? <Pause size={18} /> : <Play size={18} className="fill-black" />}
                        <span>{isPlayingLyrics ? 'Pausar' : 'Tocar Música'}</span>
                      </button>

                      <button
                        onClick={() => handleSeekLyrics(playbackTimeMs + 5000)}
                        className="p-2 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer border border-[var(--border-light)]"
                        title="Avançar 5 segundos"
                      >
                        <RotateCw size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Visualização do Player Spotify Incorporado */
                <div className="p-3 bg-[var(--bg-hover)]">
                  {(() => {
                    const embedId = (selectedPlaylist.id || '').replace(/^spotify:playlist:/i, '').split('?')[0].trim();
                    return (
                      <iframe
                        id="spotify-embed"
                        key={embedId}
                        className="w-full border-none block rounded-xl"
                        style={{ height: '240px' }}
                        src={`https://open.spotify.com/embed/playlist/${embedId}?utm_source=generator&theme=0`}
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        title={`Spotify Playlist - ${selectedPlaylist.name}`}
                      />
                    );
                  })()}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* SEÇÃO COMPLETA DE CONTROLE DE SOM: AUMENTAR, DIMINUIR E PRESETS */}
        <div className="p-3.5 sm:px-5 bg-[var(--bg-hover)] border-t border-[var(--border-light)] space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Controles de Aumentar / Diminuir Som */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap w-full md:w-auto">
              <span className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5 shrink-0">
                <Sliders size={14} className="text-[#1DB954]" />
                <span>Volume do Som:</span>
              </span>

              {/* Botão Mudo */}
              <button
                onClick={handleToggleMute}
                className={`p-2 rounded-xl transition-all cursor-pointer border ${
                  isMuted || volume === 0
                    ? 'bg-red-500/15 text-red-400 border-red-500/30'
                    : 'bg-[var(--bg-card)] text-[var(--text-main)] hover:bg-[#1DB954]/10 hover:text-[#1DB954] border-[var(--border-light)]'
                }`}
                title={isMuted ? 'Desmutar Som' : 'Ativar Mudo'}
              >
                {isMuted || volume === 0 ? <VolumeX size={16} /> : volume < 50 ? <Volume1 size={16} /> : <Volume2 size={16} />}
              </button>

              {/* Botão Diminuir Som */}
              <button
                onClick={() => handleVolumeStep(-10)}
                className="px-3 py-1.5 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--border-color)] text-[var(--text-main)] border border-[var(--border-light)] text-xs font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95 shadow-xs"
                title="Diminuir Som (-10%)"
              >
                <Minus size={14} className="text-red-400" />
                <span>Diminuir Som</span>
              </button>

              {/* Slider de Volume Interativo */}
              <div className="flex items-center gap-2 flex-1 min-w-[130px] max-w-[220px]">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(parseInt(e.target.value, 10))}
                  className="w-full h-2.5 bg-[var(--bg-card)] border border-[var(--border-light)] rounded-lg appearance-none cursor-pointer accent-[#1DB954]"
                  title={`Volume atual: ${isMuted ? 0 : volume}%`}
                />
                <span className="text-xs font-mono font-extrabold text-[var(--text-main)] min-w-[38px] text-right">
                  {isMuted ? '0%' : `${volume}%`}
                </span>
              </div>

              {/* Botão Aumentar Som */}
              <button
                onClick={() => handleVolumeStep(10)}
                className="px-3 py-1.5 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--border-color)] text-[var(--text-main)] border border-[var(--border-light)] text-xs font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95 shadow-xs"
                title="Aumentar Som (+10%)"
              >
                <Plus size={14} className="text-emerald-400" />
                <span>Aumentar Som</span>
              </button>
            </div>

            {/* Presets Rápidos de Volume */}
            <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
              <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider mr-1">
                Presets:
              </span>
              {[
                { label: 'Mudo', val: 0 },
                { label: '25%', val: 25 },
                { label: '50%', val: 50 },
                { label: '75%', val: 75 },
                { label: '100%', val: 100 },
              ].map((p) => {
                const isSelected = (isMuted && p.val === 0) || (!isMuted && volume === p.val);
                return (
                  <button
                    key={p.val}
                    onClick={() => handleVolumeChange(p.val)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#1DB954] text-black shadow-sm font-black'
                        : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--border-color)] border border-[var(--border-light)]'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Rodapé Informativo do Retângulo */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:px-5 bg-[var(--bg-card)] border-t border-[var(--border-light)] text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1DB954]" />
            <span className="font-medium">
              {playerMode === 'lyrics' 
                ? `Tocando "${currentLyricsTrack.title}" com letra sincronizada`
                : `Playlist ativa: ${selectedPlaylist.name}`}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isConnected && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#1DB954]/15 text-[#1DB954] font-semibold border border-[#1DB954]/20">
                Spotify Connect Pronto
              </span>
            )}
            <a
              href={`https://open.spotify.com/playlist/${selectedPlaylist.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1DB954] hover:underline"
            >
              <span>Abrir no app Spotify</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>

      {/* Modal de Configuração / Setup OAuth */}
      <AnimatePresence>
        {showConfigModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[var(--border-light)] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#1DB954]/15 text-[#1DB954] flex items-center justify-center">
                    <Sparkles size={18} />
                  </div>
                  <h3 className="text-base font-bold text-[var(--text-main)]">Configuração Spotify OAuth 2.0</h3>
                </div>
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-main)] text-sm cursor-pointer p-1"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                <p>
                  Suas credenciais (Client ID e Client Secret) já estão integradas no sistema. Para autorizar a conexão com sucesso, siga estes 2 passos no{' '}
                  <a 
                    href="https://developer.spotify.com/dashboard" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[#1DB954] font-semibold underline inline-flex items-center gap-0.5"
                  >
                    Spotify Developer Dashboard <ExternalLink size={12} />
                  </a>:
                </p>

                {/* Passo 1: Redirect URI */}
                <div className="p-3.5 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-light)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-[#1DB954]/20 text-[#1DB954] inline-flex items-center justify-center text-xs font-bold">1</span>
                      Redirect URI no Spotify Dashboard
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 font-semibold">Obrigatório</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    No seu app no Spotify Dashboard, clique em <strong>Settings</strong> e adicione esta URL exata em <strong>Redirect URIs</strong> e clique em <strong>Save</strong>:
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="px-2.5 py-1.5 rounded-lg bg-black/40 text-[#1DB954] font-mono text-xs flex-1 truncate select-all">
                      {effectiveCallback}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(effectiveCallback);
                        if (onToast) onToast('success', 'URL copiada para a área de transferência!');
                      }}
                      className="p-2 rounded-lg bg-[var(--bg-card)] hover:bg-[#1DB954] hover:text-black text-[var(--text-muted)] border border-[var(--border-light)] cursor-pointer transition-colors"
                      title="Copiar Callback URL"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>

                {/* Passo 2: Usuários de Teste */}
                <div className="p-3.5 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-light)] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-[#1DB954]/20 text-[#1DB954] inline-flex items-center justify-center text-xs font-bold">2</span>
                      Modo de Desenvolvimento do Spotify
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Se o seu app estiver em <em>Development Mode</em>, você deve fazer login com a mesma conta que criou o app no Spotify, ou ir em <strong>"User Management" / "Users and Access"</strong> e adicionar o e-mail da sua conta Spotify.
                  </p>
                </div>

                {/* Status das credenciais */}
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold text-xs">✓ Credenciais Ativas:</span>
                    <span className="font-mono text-[11px] text-emerald-300">Client ID ccd0...fe</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold">Configurado</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-2 pt-2 border-t border-[var(--border-light)]">
                <button
                  onClick={() => {
                    setShowConfigModal(false);
                    handleConnectSpotify();
                  }}
                  className="px-4 py-2 rounded-xl bg-[#1DB954] hover:bg-[#1ed760] text-black text-xs font-bold cursor-pointer transition-all shadow-md shadow-[#1DB954]/20"
                >
                  Tentar Conectar Agora
                </button>
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 rounded-xl bg-[var(--bg-hover)] hover:bg-[var(--border-color)] text-[var(--text-main)] text-xs font-semibold cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de Criar Playlist */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[var(--border-light)] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#1DB954]/15 text-[#1DB954] flex items-center justify-center">
                    <Plus size={18} />
                  </div>
                  <h3 className="text-base font-bold text-[var(--text-main)]">Nova Playlist de Estudos</h3>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-main)] text-sm cursor-pointer p-1"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div>
                  <label className="block text-[var(--text-muted)] text-xs mb-1">Nome da Playlist</label>
                  <input
                    type="text"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-light)] text-[var(--text-main)] text-xs focus:outline-none focus:border-[#1DB954]"
                    placeholder="Ex: Foco - Matemática ITA"
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-muted)] text-xs mb-1">Descrição</label>
                  <input
                    type="text"
                    value={newPlaylistDesc}
                    onChange={(e) => setNewPlaylistDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-light)] text-[var(--text-main)] text-xs focus:outline-none focus:border-[#1DB954]"
                    placeholder="Descrição da playlist"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-[var(--bg-hover)] hover:bg-[var(--border-color)] text-[var(--text-main)] text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreatePlaylist}
                  className="px-4 py-2 rounded-xl bg-[#1DB954] hover:bg-[#1ed760] text-black text-xs font-bold cursor-pointer"
                >
                  Criar no Spotify
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpotifyStudyHub;
