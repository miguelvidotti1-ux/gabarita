import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Headphones, 
  ExternalLink, 
  Volume2, 
  Volume1,
  VolumeX,
  Volume,
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
  User,
  LogOut,
  Search,
  Plus,
  Minus,
  CheckCircle2,
  HelpCircle,
  Copy,
  ListMusic,
  RefreshCw,
  History,
  Clock,
  Trash2,
  RotateCcw,
  Sliders
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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

export interface HistoryTrackItem {
  id: string;
  uri?: string;
  name: string;
  artist: string;
  album?: string;
  image?: string | null;
  spotify_url?: string;
  played_at: string;
}

interface NowPlayingData {
  is_playing: boolean;
  progress_ms?: number;
  duration_ms?: number;
  volume_percent?: number | null;
  device_name?: string | null;
  track?: {
    id: string;
    uri?: string;
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
  const [activeTab, setActiveTab] = useState<'curated' | 'estilos' | 'my_playlists' | 'search' | 'history'>('curated');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [callbackUri, setCallbackUri] = useState('');

  // Histórico de músicas ouvidas anteriormente
  const [listenedHistory, setListenedHistory] = useState<HistoryTrackItem[]>(() => {
    try {
      const saved = localStorage.getItem('vesthub_spotify_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [activeTrackEmbedId, setActiveTrackEmbedId] = useState<string | null>(null);

  // Controle de Volume
  const [volume, setVolume] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('vesthub_spotify_volume');
      if (saved !== null) {
        const val = parseInt(saved, 10);
        if (!isNaN(val)) return Math.max(0, Math.min(100, val));
      }
    } catch (e) {}
    return 70;
  });
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(70);
  const volumeDebounceRef = useRef<NodeJS.Timeout | null>(null);

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

  // Função para adicionar música ao histórico de ouvidas anteriormente
  const addTrackToHistory = useCallback((track: {
    id: string;
    uri?: string;
    name: string;
    artist: string;
    album?: string;
    image?: string | null;
    spotify_url?: string;
  }) => {
    if (!track || !track.name) return;
    setListenedHistory((prev) => {
      const filtered = prev.filter(t => t.id !== track.id && t.name !== track.name);
      const updated: HistoryTrackItem[] = [
        {
          id: track.id || `track-${Date.now()}`,
          uri: track.uri || (track.id ? `spotify:track:${track.id}` : undefined),
          name: track.name,
          artist: track.artist || 'Artista Spotify',
          album: track.album || '',
          image: track.image || null,
          spotify_url: track.spotify_url || (track.id ? `https://open.spotify.com/track/${track.id}` : undefined),
          played_at: new Date().toISOString(),
        },
        ...filtered,
      ].slice(0, 50);
      try {
        localStorage.setItem('vesthub_spotify_history', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, []);

  // Polling de now-playing se estiver conectado
  useEffect(() => {
    if (!isConnected) return;

    const fetchNowPlaying = async () => {
      try {
        const res = await spotifyFetch('/api/spotify/now-playing');
        if (res.ok) {
          const data = (await res.json()) as NowPlayingData;
          setNowPlaying(data);
          if (data.track && data.track.name) {
            addTrackToHistory(data.track);
          }
          if (typeof data.volume_percent === 'number' && data.volume_percent !== null) {
            setVolume(data.volume_percent);
            if (data.volume_percent === 0) {
              setIsMuted(true);
            }
          }
        }
      } catch (e) {
        // Silencioso
      }
    };

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 10000);
    return () => clearInterval(interval);
  }, [isConnected, spotifyFetch, addTrackToHistory]);

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

  // Controles de reprodução remota (play, pause, next, previous)
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
          if (onToast) onToast('success', 'Voltando para a música anterior...');
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

  // Tocar uma faixa específica do histórico de músicas ouvidas anteriormente
  const playTrackFromHistory = useCallback((track: HistoryTrackItem, index?: number) => {
    if (typeof index === 'number') {
      setHistoryIndex(index);
    }
    const cleanTrackId = (track.id || '').replace(/^spotify:track:/i, '').split('?')[0].trim();
    if (cleanTrackId && !cleanTrackId.startsWith('track-')) {
      setActiveTrackEmbedId(cleanTrackId);
    }

    setNowPlaying({
      is_playing: true,
      track: {
        id: cleanTrackId,
        name: track.name,
        artist: track.artist,
        album: track.album || '',
        image: track.image || null,
        spotify_url: track.spotify_url || (cleanTrackId ? `https://open.spotify.com/track/${cleanTrackId}` : undefined),
      },
    });

    if (isConnected) {
      handlePlaybackControl('play', track.uri || (cleanTrackId ? `spotify:track:${cleanTrackId}` : undefined));
    }

    if (onToast) {
      onToast('success', `Voltando para "${track.name}" (${track.artist})`);
    }
  }, [isConnected, onToast]);

  // Voltar música (tenta controle remoto ou histórico de reprodução anterior)
  const handlePlayPreviousTrack = async () => {
    // 1. Se estiver conectado com dispositivo ativo, tenta enviar comando de voltar ao Spotify
    if (isConnected) {
      try {
        const res = await spotifyFetch('/api/spotify/previous', { method: 'POST' });
        if (res.ok) {
          if (onToast) onToast('success', 'Voltando para a música anterior no Spotify...');
          return;
        }
      } catch (e) {
        // Fallback para histórico se o Spotify Connect não responder
      }
    }

    // 2. Navegar sequencialmente pelo histórico de músicas já ouvidas
    if (listenedHistory.length > 0) {
      const nextIndex = (historyIndex + 1) < listenedHistory.length ? historyIndex + 1 : 0;
      const targetTrack = listenedHistory[nextIndex];
      if (targetTrack) {
        playTrackFromHistory(targetTrack, nextIndex);
        return;
      }
    }

    if (onToast) {
      onToast('error', 'Nenhuma música anterior encontrada no histórico recente.');
    }
  };

  // Controle de Volume com persistência, debounce e feedback de aumento/redução
  const handleVolumeChange = useCallback((newVol: number, showToastFeedback: boolean = false, customAction?: 'abaixado' | 'aumentado') => {
    const clamped = Math.max(0, Math.min(100, Math.round(newVol)));
    setVolume(clamped);
    if (clamped === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
    try {
      localStorage.setItem('vesthub_spotify_volume', clamped.toString());
    } catch (e) {}

    if (showToastFeedback && onToast) {
      if (clamped === 0) {
        onToast('success', 'Áudio no mudo (0%)');
      } else if (customAction === 'abaixado') {
        onToast('success', `Volume abaixado para ${clamped}%`);
      } else if (customAction === 'aumentado') {
        onToast('success', `Volume aumentado para ${clamped}%`);
      } else {
        onToast('success', `Volume ajustado para ${clamped}%`);
      }
    }

    if (volumeDebounceRef.current) {
      clearTimeout(volumeDebounceRef.current);
    }

    volumeDebounceRef.current = setTimeout(async () => {
      try {
        await spotifyFetch(`/api/spotify/volume?volume_percent=${clamped}`, { method: 'PUT' });
      } catch (e) {
        // Silencioso se não houver player remoto ativo
      }
    }, 250);
  }, [spotifyFetch, onToast]);

  const toggleMute = () => {
    if (isMuted || volume === 0) {
      const restore = prevVolume > 0 ? prevVolume : 70;
      setIsMuted(false);
      handleVolumeChange(restore, true);
      if (onToast) onToast('success', `Áudio desmutado (${restore}%)`);
    } else {
      setPrevVolume(volume);
      setIsMuted(true);
      handleVolumeChange(0, true);
    }
  };

  const stepVolume = (delta: number) => {
    const target = Math.max(0, Math.min(100, volume + delta));
    const action = delta < 0 ? 'abaixado' : 'aumentado';
    handleVolumeChange(target, true, action);
  };

  // Carregar histórico de músicas recentes da conta Spotify
  const loadRecentlyPlayedFromSpotify = async () => {
    if (!isConnected) {
      if (onToast) onToast('error', 'Conecte sua conta do Spotify para carregar o histórico remoto.');
      return;
    }
    setIsLoadingHistory(true);
    try {
      const res = await spotifyFetch('/api/spotify/recently-played?limit=25');
      if (res.ok) {
        const data = await res.json();
        if (data.tracks && Array.isArray(data.tracks)) {
          setListenedHistory((prev) => {
            const map = new Map<string, HistoryTrackItem>();
            prev.forEach(item => {
              map.set(item.id || item.name, item);
            });
            data.tracks.forEach((item: any) => {
              if (item.track && item.track.name) {
                const key = item.track.id || item.track.name;
                if (!map.has(key)) {
                  map.set(key, {
                    id: item.track.id,
                    uri: item.track.uri,
                    name: item.track.name,
                    artist: item.track.artist,
                    album: item.track.album,
                    image: item.track.image,
                    spotify_url: item.track.spotify_url,
                    played_at: item.played_at || new Date().toISOString(),
                  });
                }
              }
            });
            const merged = Array.from(map.values()).sort(
              (a, b) => new Date(b.played_at).getTime() - new Date(a.played_at).getTime()
            ).slice(0, 50);
            try {
              localStorage.setItem('vesthub_spotify_history', JSON.stringify(merged));
            } catch (e) {}
            return merged;
          });
          if (onToast) onToast('success', 'Histórico de reprodução sincronizado com o Spotify!');
        }
      }
    } catch (e) {
      if (onToast) onToast('error', 'Não foi possível sincronizar o histórico recente.');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const clearHistory = () => {
    setListenedHistory([]);
    try {
      localStorage.removeItem('vesthub_spotify_history');
    } catch (e) {}
    if (onToast) onToast('success', 'Histórico de músicas limpo.');
  };

  const removeHistoryItem = (trackId: string) => {
    setListenedHistory(prev => {
      const updated = prev.filter(t => t.id !== trackId);
      try {
        localStorage.setItem('vesthub_spotify_history', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const formatRelativeTime = (isoString?: string) => {
    if (!isoString) return 'Recentemente';
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      if (diffMs < 0) return 'Agora mesmo';
      const diffSec = Math.floor(diffMs / 1000);
      if (diffSec < 60) return 'Agora mesmo';
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `Há ${diffMin} min`;
      const diffHours = Math.floor(diffMin / 60);
      if (diffHours < 24) return `Há ${diffHours} h`;
      const diffDays = Math.floor(diffHours / 24);
      return `Há ${diffDays} d`;
    } catch {
      return 'Recentemente';
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
            <button
              onClick={() => {
                setActiveTab('history');
                if (isConnected && listenedHistory.length === 0) {
                  loadRecentlyPlayedFromSpotify();
                }
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'bg-[var(--bg-hover)] text-[var(--text-main)] font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <History size={13} className={activeTab === 'history' ? 'text-[#1DB954]' : ''} />
              <span>Já Ouvidas</span>
              {listenedHistory.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#1DB954]/20 text-[#1DB954] font-bold">
                  {listenedHistory.length}
                </span>
              )}
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
                      onClick={() => {
                        addTrackToHistory({
                          id: track.id,
                          uri: track.uri || `spotify:track:${track.id}`,
                          name: track.name,
                          artist: track.artist,
                          album: track.album,
                          image: track.image,
                          spotify_url: `https://open.spotify.com/track/${track.id}`
                        });
                        handlePlaybackControl('play', track.uri || `spotify:track:${track.id}`);
                      }}
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
                          onClick={() => {
                            addTrackToHistory({
                              id: track.id,
                              uri: track.uri || `spotify:track:${track.id}`,
                              name: track.name,
                              artist: track.artist,
                              album: track.album,
                              image: track.image,
                              spotify_url: track.spotify_url || `https://open.spotify.com/track/${track.id}`
                            });
                            handlePlaybackControl('play', track.uri || `spotify:track:${track.id}`);
                          }}
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
                    onClick={() => {
                      addTrackToHistory({
                        id: track.id,
                        uri: track.uri || `spotify:track:${track.id}`,
                        name: track.name,
                        artist: track.artist,
                        album: track.album,
                        image: track.image,
                        spotify_url: track.spotify_url || `https://open.spotify.com/track/${track.id}`
                      });
                      handlePlaybackControl('play', track.uri || `spotify:track:${track.id}`);
                    }}
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

      {activeTab === 'history' && (
        <div className="space-y-4 mb-4">
          {/* Header do Histórico */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-light)]">
            <div>
              <div className="flex items-center gap-2">
                <History className="text-[#1DB954]" size={18} />
                <h4 className="font-bold text-xs sm:text-sm text-[var(--text-main)]">
                  Músicas Ouvidas Anteriormente
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1DB954]/15 text-[#1DB954] font-bold">
                  {listenedHistory.length} {listenedHistory.length === 1 ? 'música' : 'músicas'}
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">
                Acesse e volte para qualquer faixa já ouvida durante suas sessões de estudo.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handlePlayPreviousTrack}
                disabled={listenedHistory.length === 0}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1DB954] text-black text-xs font-bold hover:bg-[#1ed760] transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
                title="Voltar para a música anterior"
              >
                <SkipBack size={13} />
                <span>Voltar Música</span>
              </button>

              {isConnected && (
                <button
                  onClick={loadRecentlyPlayedFromSpotify}
                  disabled={isLoadingHistory}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-light)] hover:border-[#1DB954] text-[var(--text-main)] hover:text-[#1DB954] text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                  title="Sincronizar histórico recente da sua conta Spotify"
                >
                  <RefreshCw size={13} className={isLoadingHistory ? 'animate-spin text-[#1DB954]' : ''} />
                  <span className="hidden sm:inline">Sincronizar</span>
                </button>
              )}

              {listenedHistory.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="p-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-light)] hover:border-red-500/40 text-[var(--text-muted)] hover:text-red-400 text-xs transition-all cursor-pointer"
                  title="Limpar histórico"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Ajuste de Volume na Sessão */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)]">
            <div className="flex items-center gap-2">
              <Sliders size={15} className="text-[#1DB954]" />
              <span className="text-xs font-bold text-[var(--text-main)]">Ajuste de Volume da Sessão:</span>
              <span className="text-xs font-mono font-bold text-[#1DB954]">{isMuted ? '0% (Mudo)' : `${volume}%`}</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Presets rápidos */}
              <div className="flex items-center gap-1 text-[10px]">
                <button
                  onClick={() => handleVolumeChange(25, true)}
                  className={`px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                    volume === 25 && !isMuted ? 'bg-[#1DB954]/20 border-[#1DB954] text-[#1DB954] font-bold' : 'border-[var(--border-light)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  25% Suave
                </button>
                <button
                  onClick={() => handleVolumeChange(50, true)}
                  className={`px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                    volume === 50 && !isMuted ? 'bg-[#1DB954]/20 border-[#1DB954] text-[#1DB954] font-bold' : 'border-[var(--border-light)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  50% Foco
                </button>
                <button
                  onClick={() => handleVolumeChange(75, true)}
                  className={`px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                    volume === 75 && !isMuted ? 'bg-[#1DB954]/20 border-[#1DB954] text-[#1DB954] font-bold' : 'border-[var(--border-light)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  75% Energia
                </button>
                <button
                  onClick={() => handleVolumeChange(100, true)}
                  className={`px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                    volume === 100 && !isMuted ? 'bg-[#1DB954]/20 border-[#1DB954] text-[#1DB954] font-bold' : 'border-[var(--border-light)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  100% Máx
                </button>
              </div>

              {/* Botões - e + com slider */}
              <div className="flex items-center gap-1 bg-[var(--bg-hover)] p-0.5 rounded-lg border border-[var(--border-light)]">
                <button
                  onClick={() => stepVolume(-10)}
                  className="p-1 rounded hover:bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
                  title="Abaixar volume (-10%)"
                >
                  <Minus size={12} />
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="w-20 h-1.5 accent-[#1DB954] bg-[var(--border-light)] rounded-lg appearance-none cursor-pointer"
                  title={`Volume: ${isMuted ? 0 : volume}%`}
                />
                <button
                  onClick={() => stepVolume(10)}
                  className="p-1 rounded hover:bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
                  title="Aumentar volume (+10%)"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
          </div>

          {/* Lista de Músicas */}
          {listenedHistory.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[var(--bg-hover)] text-center space-y-3 border border-[var(--border-light)]">
              <div className="w-12 h-12 rounded-2xl bg-[#1DB954]/15 text-[#1DB954] mx-auto flex items-center justify-center">
                <RotateCcw size={22} />
              </div>
              <div className="max-w-md mx-auto">
                <h5 className="font-bold text-sm text-[var(--text-main)]">Nenhuma música no histórico recente</h5>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Conforme você estuda e ouve playlists ou estilos sonoros, as faixas tocadas serão salvas automaticamente aqui para você voltar a qualquer momento.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('curated')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1DB954] text-black text-xs font-bold hover:bg-[#1ed760] transition-colors cursor-pointer mt-2"
              >
                <Play size={13} />
                <span>Explorar Playlists Curadas</span>
              </button>
            </div>
          ) : (
            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
              {listenedHistory.map((track, idx) => (
                <div
                  key={`${track.id}-${idx}`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-light)] hover:border-[#1DB954]/40 transition-all text-xs group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-5 text-center text-[10px] text-[var(--text-muted)] shrink-0 font-mono">
                      {idx + 1}
                    </span>
                    {track.image ? (
                      <img src={track.image} alt={track.name} className="w-9 h-9 rounded-lg object-cover shrink-0 shadow-sm" />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-[var(--border-light)] flex items-center justify-center shrink-0">
                        <Music size={14} className="text-[var(--text-muted)]" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-bold text-[var(--text-main)] truncate group-hover:text-[#1DB954] transition-colors">
                        {track.name}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)] truncate">
                        <span>{track.artist}</span>
                        {track.album && <span>• {track.album}</span>}
                        <span className="flex items-center gap-0.5 text-[9px] text-[var(--text-muted)]/70">
                          <Clock size={9} />
                          {formatRelativeTime(track.played_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        playTrackFromHistory(track, idx);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1DB954]/15 hover:bg-[#1DB954] text-[#1DB954] hover:text-black font-semibold transition-all cursor-pointer shadow-sm"
                      title="Voltar e tocar esta faixa novamente"
                    >
                      <RotateCcw size={12} />
                      <span className="text-[11px] font-bold">Voltar para esta</span>
                    </button>
                    {track.spotify_url && (
                      <a
                        href={track.spotify_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-[var(--bg-card)] hover:bg-[#1DB954] hover:text-black text-[var(--text-muted)] border border-[var(--border-light)] transition-all cursor-pointer"
                        title="Abrir no Spotify"
                      >
                        <ExternalLink size={12} />
                      </a>
                    )}
                    <button
                      onClick={() => removeHistoryItem(track.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400 transition-colors cursor-pointer"
                      title="Remover do histórico"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Spotify Player Wrapper */}
      <div className="rounded-xl overflow-hidden border border-[var(--border-light)] bg-[var(--bg-hover)] hover:border-[#1DB954]/40 transition-all shadow-md">
        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {(() => {
                const embedId = (selectedPlaylist.id || '').replace(/^spotify:playlist:/i, '').split('?')[0].trim();
                const embedSrc = activeTrackEmbedId
                  ? `https://open.spotify.com/embed/track/${activeTrackEmbedId}?utm_source=generator&theme=0`
                  : `https://open.spotify.com/embed/playlist/${embedId}?utm_source=generator&theme=0`;
                const embedKey = activeTrackEmbedId ? `track-${activeTrackEmbedId}` : `playlist-${embedId}`;
                return (
                  <iframe
                    id="spotify-embed"
                    key={embedKey}
                    className="w-full border-none block"
                    style={{ height: '152px' }}
                    src={embedSrc}
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    title={`Spotify Player - ${nowPlaying?.track?.name || selectedPlaylist.name}`}
                  />
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Now Playing Status & Controles de Reprodução e Volume */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3 sm:px-4 bg-[var(--bg-hover)] border-t border-[var(--border-light)]">
          {/* Informações da Faixa / Playlist */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-lg bg-[#1DB954]/15 flex items-center justify-center text-[#1DB954] shrink-0 border border-[#1DB954]/20 relative overflow-hidden">
              {nowPlaying?.track?.image ? (
                <img src={nowPlaying.track.image} alt="Capa" className="w-full h-full rounded-lg object-cover" />
              ) : (
                <Headphones size={20} className={isLoading ? 'animate-pulse' : ''} />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs sm:text-sm font-bold text-[var(--text-main)] truncate flex items-center gap-2">
                <span id="np-track">{nowPlaying?.track?.name || selectedPlaylist.name}</span>
                <span className="text-[10px] text-[var(--text-muted)] font-normal hidden sm:inline">
                  • {nowPlaying?.track?.artist || selectedPlaylist.category}
                </span>
                {activeTrackEmbedId && (
                  <button
                    onClick={() => {
                      setActiveTrackEmbedId(null);
                      if (onToast) onToast('success', 'Retomando playlist padrão.');
                    }}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-[#1DB954]/15 hover:bg-[#1DB954]/25 text-[#1DB954] font-bold cursor-pointer shrink-0 transition-colors border border-[#1DB954]/30"
                    title="Voltar para a playlist completa"
                  >
                    Voltar p/ Playlist
                  </button>
                )}
              </div>
              <p id="np-desc" className="text-[11px] text-[var(--text-muted)] truncate">
                {nowPlaying?.track?.album || selectedPlaylist.description}
              </p>
            </div>
          </div>

          {/* Controles de Reprodução + Ajuste de Volume */}
          <div className="flex items-center justify-between lg:justify-end gap-2 sm:gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
            {/* Controles de Reprodução (Voltar Música, Play/Pause, Próxima, Já Ouvidas) */}
            <div className="flex items-center gap-1 bg-[var(--bg-card)] p-1 rounded-xl border border-[var(--border-light)] shadow-sm">
              {/* Botão VOLTAR MÚSICA JÁ OUVIDA ANTERIORMENTE */}
              <button
                onClick={handlePlayPreviousTrack}
                disabled={listenedHistory.length === 0 && !isConnected}
                className="p-1.5 rounded-lg text-[var(--text-main)] hover:text-[#1DB954] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group relative"
                title={listenedHistory.length > 0 ? "Voltar para música ouvida anteriormente" : "Voltar música anterior"}
              >
                <SkipBack size={15} />
              </button>

              {/* Botão Play / Pause */}
              {nowPlaying?.is_playing ? (
                <button
                  onClick={() => handlePlaybackControl('pause')}
                  className="p-1.5 rounded-lg text-[var(--text-main)] hover:text-[#1DB954] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
                  title="Pausar reprodução"
                >
                  <Pause size={15} />
                </button>
              ) : (
                <button
                  onClick={() => {
                    const cleanId = (selectedPlaylist.id || '').replace(/^spotify:playlist:/i, '').split('?')[0].trim();
                    const targetUri = cleanId ? `spotify:playlist:${cleanId}` : undefined;
                    handlePlaybackControl('play', targetUri);
                  }}
                  className="p-1.5 rounded-lg text-[var(--text-main)] hover:text-[#1DB954] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
                  title="Reproduzir"
                >
                  <Play size={15} />
                </button>
              )}

              {/* Botão Próxima Música */}
              <button
                onClick={() => handlePlaybackControl('next')}
                className="p-1.5 rounded-lg text-[var(--text-main)] hover:text-[#1DB954] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
                title="Próxima música"
              >
                <SkipForward size={15} />
              </button>

              {/* Atalho para Músicas Já Ouvidas */}
              <button
                onClick={() => {
                  setActiveTab('history');
                  if (isConnected && listenedHistory.length === 0) {
                    loadRecentlyPlayedFromSpotify();
                  }
                }}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                  activeTab === 'history' 
                    ? 'text-[#1DB954] bg-[#1DB954]/15' 
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
                }`}
                title="Ver histórico de músicas já ouvidas"
              >
                <History size={14} />
                {listenedHistory.length > 0 && (
                  <span className="text-[10px] font-bold text-[#1DB954]">{listenedHistory.length}</span>
                )}
              </button>
            </div>

            {/* CONTROLE DE VOLUME (Abaixar, Slider, Aumentar, Mudo) */}
            <div className="flex items-center gap-1 sm:gap-1.5 bg-[var(--bg-card)] px-2 py-1 rounded-xl border border-[var(--border-light)] shadow-sm">
              {/* Botão Mutar/Desmutar */}
              <button
                onClick={toggleMute}
                className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
                title={isMuted || volume === 0 ? 'Desmutar áudio' : 'Mutar áudio'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX size={15} className="text-amber-400" />
                ) : volume < 50 ? (
                  <Volume1 size={15} className="text-[#1DB954]" />
                ) : (
                  <Volume2 size={15} className="text-[#1DB954]" />
                )}
              </button>

              {/* Botão Abaixar Volume */}
              <button
                onClick={() => stepVolume(-10)}
                className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
                title="Abaixar volume (-10%)"
              >
                <Minus size={13} />
              </button>

              {/* Slider de Volume */}
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-16 sm:w-20 md:w-24 h-1.5 accent-[#1DB954] bg-[var(--border-light)] rounded-lg appearance-none cursor-pointer"
                title={`Volume: ${isMuted ? 0 : volume}%`}
              />

              {/* Botão Aumentar Volume */}
              <button
                onClick={() => stepVolume(10)}
                className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
                title="Aumentar volume (+10%)"
              >
                <Plus size={13} />
              </button>

              {/* Porcentagem */}
              <span className="text-[10px] sm:text-[11px] font-mono font-bold text-[#1DB954] w-7 sm:w-8 text-right select-none">
                {isMuted ? '0%' : `${volume}%`}
              </span>
            </div>

            {/* Status Badge */}
            <span 
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md transition-all hidden xl:inline-block ${
                isLoading 
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse'
                  : 'bg-[#1DB954]/15 text-[#1DB954] border border-[#1DB954]/30'
              }`}
            >
              {isLoading ? '...' : (nowPlaying?.is_playing ? 'Tocando' : 'Pronto')}
            </span>

            {/* Link Externo Spotify */}
            <a
              href={nowPlaying?.track?.spotify_url || `https://open.spotify.com/playlist/${selectedPlaylist.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-[var(--bg-card)] hover:bg-[#1DB954] hover:text-black text-[var(--text-muted)] border border-[var(--border-light)] transition-all cursor-pointer group shrink-0"
              title="Abrir no Spotify"
            >
              <ExternalLink size={14} className="group-hover:scale-110 transition-transform" />
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
