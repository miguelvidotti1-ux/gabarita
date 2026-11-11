import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, Trophy, ChevronLeft, BookOpen, Sparkles, Check, 
  RotateCcw, RefreshCw, Star, Info, HelpCircle, Flame, Target,
  BarChart2, Trash2, ArrowLeft, CheckCircle2, AlertCircle
} from 'lucide-react';
import { levelSystem, LevelSystemStatus } from '../services/levelService';
import { missionEngine } from '../services/missionService';
import { FLASHCARDS_TRAILS, StudyTrail, Flashcard } from '../data/flashcardsData';
import { auth, db } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs, setDoc, deleteDoc, doc, writeBatch, query, where } from 'firebase/firestore';
import { FlashcardCreatorModal } from './FlashcardCreatorModal';

export default function SkillSwipe() {
  const [levelStatus, setLevelStatus] = useState<LevelSystemStatus | null>(null);
  const [activeTrail, setActiveTrail] = useState<StudyTrail | null>(null);
  const [currentCards, setCurrentCards] = useState<Flashcard[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionXpEarned, setSessionXpEarned] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCreator, setShowCreator] = useState(false);
  
  // View states: 'trails' (catalog), 'session' (studying), 'stats' (general statistics dashboard)
  const [activeView, setActiveView] = useState<'trails' | 'session' | 'stats'>('trails');

  // Category Filtering
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  
  // Session counters
  const [knownCount, setKnownCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [dupCount, setDupCount] = useState(0);
  const [sessionFilteredCount, setSessionFilteredCount] = useState(0);
  const [remainingUnseenCount, setRemainingUnseenCount] = useState(0);

  // Swipe feedback visual indicators
  const [swipeIndicator, setSwipeIndicator] = useState<'known' | 'review' | null>(null);

  // Card interactions state
  const [seenCardIds, setSeenCardIds] = useState<string[]>([]);
  const [loadingSeen, setLoadingSeen] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Listen for user auth and load seen cards from Firestore or LocalStorage
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoadingSeen(true);
      if (user) {
        try {
          const qRef = collection(db, 'users', user.uid, 'card_interactions');
          const querySnapshot = await getDocs(qRef);
          const ids: string[] = [];
          querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            if (data.status === 'seen') {
              ids.push(data.cardId);
            }
          });
          setSeenCardIds(ids);
        } catch (err) {
          console.error("Error loading card interactions from Firestore:", err);
          loadSeenFromLocalStorage();
        } finally {
          setLoadingSeen(false);
        }
      } else {
        loadSeenFromLocalStorage();
        setLoadingSeen(false);
      }
    });

    setLevelStatus(levelSystem.getStatus());

    return () => unsubscribe();
  }, []);

  const loadSeenFromLocalStorage = () => {
    try {
      const localSeen = JSON.parse(localStorage.getItem('skillswipe_seen_cards_v3') || '[]') as string[];
      setSeenCardIds(localSeen);
    } catch (err) {
      console.error("Error reading seen cards from localstorage:", err);
      setSeenCardIds([]);
    }
  };

  const refreshLevelStatus = () => {
    setLevelStatus(levelSystem.getStatus());
  };

  // Get list of all unique categories
  const categories = ['Todas', ...Array.from(new Set(FLASHCARDS_TRAILS.map(t => t.category)))];

  // ── Deduplicate cards: ensures absolute global uniqueness of cards by front_content
  const dedupeCards = (trailCards: Flashcard[], trailId: string) => {
    const seenFronts = new Set<string>();
    const unique: Flashcard[] = [];
    let dups = 0;

    const otherTrailsCards = FLASHCARDS_TRAILS
      .filter(t => t.id !== trailId)
      .flatMap(t => t.cards);

    const otherFronts = new Set<string>(
      otherTrailsCards.map(c => c.front_content.toLowerCase().trim())
    );

    for (const card of trailCards) {
      const frontKey = card.front_content.toLowerCase().trim();
      const isDuplicate = seenFronts.has(frontKey) || otherFronts.has(frontKey);

      if (isDuplicate) {
        dups++;
      } else {
        seenFronts.add(frontKey);
        unique.push(card);
      }
    }
    return { unique, dups };
  };

  const handleStartTrail = (trail: StudyTrail) => {
    setActiveTrail(trail);
    setActiveView('session');
    
    // 1. Deduplicate
    const { unique, dups } = dedupeCards(trail.cards, trail.id);
    setDupCount(dups);

    // 2. Filter out seen cards (either globally or for this trail)
    const filtered = unique.filter(card => !seenCardIds.includes(card.id));
    
    setSessionFilteredCount(unique.length - filtered.length);

    if (filtered.length === 0) {
      // 🏆 Everything has been seen! Show "Tudo visto" layout
      setCurrentCards([]);
      setCardIndex(0);
      setIsCompleted(true);
      setRemainingUnseenCount(0);
      return;
    }

    // Shuffle and pick up to 10 cards for a dynamic session
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    const sessionCards = shuffled.slice(0, 10);
    
    // Remaining count after this session
    setRemainingUnseenCount(filtered.length - sessionCards.length);

    setCurrentCards(sessionCards);
    setCardIndex(0);
    setIsFlipped(false);
    setSessionXpEarned(0);
    setKnownCount(0);
    setReviewCount(0);
    setIsCompleted(false);
    setSwipeIndicator(null);
  };

  const markCardAsSeen = async (cardId: string, trailId: string) => {
    const updatedSeen = Array.from(new Set([...seenCardIds, cardId]));
    setSeenCardIds(updatedSeen);

    if (currentUser) {
      try {
        const docRef = doc(db, 'users', currentUser.uid, 'card_interactions', cardId);
        await setDoc(docRef, {
          userId: currentUser.uid,
          cardId,
          trailId,
          status: 'seen',
          updatedAt: new Date().toISOString()
        });
      } catch (err) {
        console.error("Error saving seen card to Firestore:", err);
      }
    } else {
      try {
        localStorage.setItem('skillswipe_seen_cards_v3', JSON.stringify(updatedSeen));
      } catch (err) {
        console.error("Error saving seen card to local storage:", err);
      }
    }
  };

  const resetTrailProgress = async (trailId: string) => {
    const trail = FLASHCARDS_TRAILS.find(t => t.id === trailId);
    if (!trail) return;
    const { unique } = dedupeCards(trail.cards, trail.id);
    const trailCardIds = unique.map(c => c.id);

    const updatedSeen = seenCardIds.filter(id => !trailCardIds.includes(id));
    setSeenCardIds(updatedSeen);

    if (currentUser) {
      try {
        const qRef = collection(db, 'users', currentUser.uid, 'card_interactions');
        const q = query(qRef, where('trailId', '==', trailId));
        const querySnapshot = await getDocs(q);
        
        const batch = writeBatch(db);
        querySnapshot.forEach((docSnap) => {
          batch.delete(docSnap.ref);
        });
        await batch.commit();
      } catch (err) {
        console.error("Error resetting progress in Firestore:", err);
      }
    } else {
      try {
        localStorage.setItem('skillswipe_seen_cards_v3', JSON.stringify(updatedSeen));
      } catch (err) {
        console.error("Error resetting progress in local storage:", err);
      }
    }
  };

  const resetAllProgress = async () => {
    if (window.confirm("Deseja mesmo resetar todo o seu progresso de memorização?")) {
      setSeenCardIds([]);

      if (currentUser) {
        try {
          const qRef = collection(db, 'users', currentUser.uid, 'card_interactions');
          const querySnapshot = await getDocs(qRef);
          const batch = writeBatch(db);
          querySnapshot.forEach((docSnap) => {
            batch.delete(docSnap.ref);
          });
          await batch.commit();
        } catch (err) {
          console.error("Error resetting all progress in Firestore:", err);
        }
      } else {
        try {
          localStorage.removeItem('skillswipe_seen_cards_v3');
        } catch (err) {
          console.error("Error resetting all progress in local storage:", err);
        }
      }
    }
  };

  const handleSwipe = async (action: 'known' | 'review') => {
    if (cardIndex >= currentCards.length) return;
    
    setSwipeIndicator(action);
    const currentCard = currentCards[cardIndex];

    if (action === 'known') {
      setKnownCount(prev => prev + 1);
      
      // Mark as seen permanently in our system
      if (activeTrail) {
        await markCardAsSeen(currentCard.id, activeTrail.id);
      }

      // Award XP
      const xpAmount = 10;
      levelSystem.addXP(xpAmount, activeTrail?.category || 'Geral');
      setSessionXpEarned(prev => prev + xpAmount);
      
      // Update flashcard daily missions
      const todayMissions = missionEngine.getMissionsForToday();
      const flashcardMission = todayMissions.find(m => 
        !m.completed && 
        m.type === 'flashcards' && 
        m.topic.toLowerCase() === (activeTrail?.category || '').toLowerCase()
      );
      if (flashcardMission) {
        missionEngine.updateProgress(flashcardMission.id, 1);
      }
    } else {
      setReviewCount(prev => prev + 1);
      
      // Append to the end of cards array so they see it again later in this session (SRS fallback)
      setCurrentCards(prev => {
        const updated = [...prev];
        const cardToMove = updated[cardIndex];
        updated.push(cardToMove);
        return updated;
      });
    }

    setTimeout(() => {
      setSwipeIndicator(null);

      // Check if finished the session (or if we need to show next card)
      if (cardIndex + 1 >= currentCards.length) {
        setIsCompleted(true);
      } else {
        setCardIndex(prev => prev + 1);
        setIsFlipped(false);
      }
      refreshLevelStatus();
    }, 300);
  };

  const handleRestartTrail = () => {
    if (activeTrail) {
      handleStartTrail(activeTrail);
    }
  };

  const handleBackToTrails = () => {
    setActiveTrail(null);
    setIsCompleted(false);
    setActiveView('trails');
    refreshLevelStatus();
  };

  // Calculate Global Statistics dynamically based on deduplicated card records
  const getGlobalStats = () => {
    let grandTotal = 0;
    let grandSeen = 0;
    
    const perTrail = FLASHCARDS_TRAILS.map(trail => {
      const { unique } = dedupeCards(trail.cards, trail.id);
      const total = unique.length;
      const seen = unique.filter(card => seenCardIds.includes(card.id)).length;
      const remaining = total - seen;
      
      grandTotal += total;
      grandSeen += seen;
      
      return {
        ...trail,
        total,
        seen,
        remaining,
        percentage: total > 0 ? Math.round((seen / total) * 100) : 0
      };
    });
    
    const grandRemaining = grandTotal - grandSeen;
    const grandPercentage = grandTotal > 0 ? Math.round((grandSeen / grandTotal) * 100) : 0;
    
    return {
      grandTotal,
      grandSeen,
      grandRemaining,
      grandPercentage,
      perTrail
    };
  };

  const stats = getGlobalStats();

  const filteredTrails = selectedCategory === 'Todas'
    ? FLASHCARDS_TRAILS
    : FLASHCARDS_TRAILS.filter(t => t.category === selectedCategory);

  return (
    <div className="space-y-8 py-6">
      {/* SkillSwipe Logo Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-6 md:p-8 rounded-[2rem] border border-[var(--card-border)] shadow-sm">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            <Sparkles size={12} />
            <span>Módulo de Memorização Rápida</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] leading-tight tracking-tight">
            Skill<span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">Swipe</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-sm max-w-xl">
            Aprenda conceitos e fórmulas essenciais dos vestibulares usando flashcards inteligentes. Deslize para a direita se já sabe o assunto ou para a esquerda para revisar depois!
          </p>
        </div>
        
        {/* Buttons & Global Level widget */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {activeView === 'trails' && (
            <>
              <button
                onClick={() => setShowCreator(true)}
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-2xl transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Sparkles size={16} />
                <span>Criar Flashcards</span>
              </button>
              <button
                onClick={() => setActiveView('stats')}
                className="flex items-center justify-center gap-2 bg-indigo-550 hover:bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-2xl transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <BarChart2 size={16} />
                <span>Ver Estatísticas</span>
              </button>
            </>
          )}

          {levelStatus && (
            <div className="flex items-center gap-4 bg-[var(--card-bg)] border border-[var(--card-border)] p-4 rounded-2xl shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                <Flame size={24} className="animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Seu Status</span>
                  {levelStatus.global.streak > 0 && (
                    <span className="flex items-center gap-0.5 text-xs text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full">
                      🔥 {levelStatus.global.streak}d
                    </span>
                  )}
                </div>
                <p className="text-sm font-black text-[var(--text-primary)]">Nível {levelStatus.global.level}</p>
                <p className="text-xs text-[var(--text-secondary)] font-mono">{levelStatus.global.xp} Total XP</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeView === 'trails' && (
          /* SECTION 1: Trails Catalog */
          <motion.div
            key="catalog"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Header and Category Selector */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Selecione uma Trilha de Estudos</h2>
              
              {/* Horizontal scroll/list categories */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                        : 'bg-[var(--card-bg)] border-[var(--card-border)] text-[var(--text-secondary)] hover:border-indigo-500/30'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {loadingSeen ? (
              <div className="text-center py-24 bg-[var(--card-bg)] rounded-3xl border border-[var(--card-border)]">
                <RefreshCw size={36} className="mx-auto text-indigo-500 animate-spin mb-4" />
                <p className="text-sm font-bold text-[var(--text-secondary)]">Carregando seu progresso de memorização...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredTrails.map((trail) => {
                  // Find progress for this trail
                  const trailStat = stats.perTrail.find(t => t.id === trail.id);
                  const seenCount = trailStat?.seen || 0;
                  const totalCount = trailStat?.total || 0;
                  const isCompletedSubject = totalCount > 0 && seenCount === totalCount;
                  
                  return (
                    <motion.div
                      key={trail.id}
                      whileHover={{ y: -5 }}
                      className={`bg-[var(--card-bg)] border rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-indigo-500/30 transition-all cursor-pointer group relative overflow-hidden ${
                        isCompletedSubject ? 'border-emerald-500/20 shadow-emerald-500/5' : 'border-[var(--card-border)]'
                      }`}
                      onClick={() => handleStartTrail(trail)}
                    >
                      {/* Dominada Badge Overlay */}
                      {isCompletedSubject && (
                        <div className="absolute top-4 right-4 flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-emerald-500/20">
                          <CheckCircle2 size={12} className="fill-emerald-500/10" />
                          <span>Dominada</span>
                        </div>
                      )}

                      <div className="space-y-4">
                        {/* Trail color badge */}
                        <div className="flex items-center justify-between">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                            style={{ backgroundColor: trail.color_theme }}
                          >
                            <BookOpen size={20} />
                          </div>
                          {!isCompletedSubject && (
                            <span className="text-xs font-black font-mono text-[var(--text-secondary)]">
                              {totalCount - seenCount} novos / {totalCount} total
                            </span>
                          )}
                        </div>

                        <div className="space-y-1">
                          <h3 className="text-base font-bold text-[var(--text-primary)] group-hover:text-indigo-500 transition-colors">
                            {trail.title}
                          </h3>
                          <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: trail.color_theme }}>
                            {trail.category}
                          </p>
                        </div>

                        <p className="text-xs text-[var(--text-secondary)] line-clamp-3 leading-relaxed">
                          {trail.description}
                        </p>
                      </div>

                      {/* Progress bar inside trail card */}
                      <div className="mt-5 space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-bold text-[var(--text-secondary)]">
                          <span>Progresso</span>
                          <span>{seenCount}/{totalCount} vistos</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${isCompletedSubject ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                            style={{ width: `${totalCount > 0 ? (seenCount / totalCount) * 100 : 0}%` }}
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[var(--card-border)] mt-4 flex items-center justify-between">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Deseja mesmo resetar o progresso em ${trail.title}?`)) {
                              resetTrailProgress(trail.id);
                            }
                          }}
                          disabled={seenCount === 0}
                          className={`text-[10px] font-black uppercase tracking-wider flex items-center gap-1 hover:text-rose-500 transition-colors cursor-pointer ${
                            seenCount === 0 ? 'text-[var(--text-secondary)] opacity-30 cursor-not-allowed' : 'text-[var(--text-secondary)]'
                          }`}
                        >
                          <RotateCcw size={12} />
                          <span>Resetar</span>
                        </button>
                        
                        <span className="text-xs font-black text-indigo-500 group-hover:translate-x-1 transition-transform">
                          {isCompletedSubject ? 'Estudar de Novo' : 'Estudar'} →
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
            
            {filteredTrails.length === 0 && !loadingSeen && (
              <div className="text-center py-12 bg-[var(--card-bg)] rounded-3xl border border-[var(--card-border)]">
                <BookOpen size={40} className="mx-auto text-[var(--text-secondary)] opacity-40 mb-3" />
                <p className="text-sm font-bold text-[var(--text-secondary)]">Nenhuma trilha encontrada nessa categoria.</p>
              </div>
            )}
          </motion.div>
        )}

        {activeView === 'session' && activeTrail && (
          /* SECTION 2: Active Flashcard Swiper Session */
          <motion.div
            key="session"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-xl mx-auto space-y-6"
          >
            {/* Session Navigation & Stats */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <button 
                  onClick={handleBackToTrails}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <ChevronLeft size={16} />
                  <span>Voltar para as Trilhas</span>
                </button>

                {!isCompleted && currentCards.length > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-[var(--bg-secondary)] px-3 py-1 rounded-full border border-[var(--card-border)] text-[10px] font-black uppercase tracking-wider">
                      <span className="text-emerald-500">✅ {knownCount}</span>
                      <span className="text-rose-500">📚 {reviewCount}</span>
                    </div>

                    <div className="flex items-center gap-2 bg-[var(--bg-secondary)] px-4 py-1.5 rounded-full border border-[var(--card-border)] text-xs font-bold">
                      <span className="text-[var(--text-secondary)] font-mono">{cardIndex + 1} de {currentCards.length}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Study Progress Bar */}
              {!isCompleted && currentCards.length > 0 && (
                <div className="w-full h-2 bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${(cardIndex / currentCards.length) * 100}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              )}
            </div>

            {!isCompleted ? (
              /* CARD PLAYGROUND */
              <div className="space-y-6">
                {sessionFilteredCount > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-4 py-2.5 rounded-2xl border border-amber-500/20 text-xs font-bold justify-center"
                  >
                    <RefreshCw size={14} className="animate-spin text-amber-500" style={{ animationDuration: '6s' }} />
                    <span>Sessão Inteligente: {sessionFilteredCount} cards já estudados foram ocultados nesta sessão.</span>
                  </motion.div>
                )}

                {/* Info de cards restantes após esta sessão */}
                <div className="text-center text-xs font-bold text-[var(--text-secondary)] flex items-center justify-center gap-1.5 bg-[var(--card-bg)] border border-[var(--card-border)] py-2 px-4 rounded-xl shadow-xs">
                  <span>🔒 {remainingUnseenCount} cards novos restantes após esta sessão</span>
                </div>

                {/* 3D Flip Card Container */}
                <div className="relative w-full h-[400px] perspective-1000">
                  {/* Indicator Overlays for Left/Right swipe intent */}
                  {swipeIndicator === 'known' && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 bg-green-500/20 backdrop-blur-xs rounded-3xl z-30 flex flex-col items-center justify-center border-4 border-green-500"
                    >
                      <div className="bg-green-500 text-white p-4 rounded-full shadow-lg">
                        <Check size={40} />
                      </div>
                      <span className="text-green-600 dark:text-green-400 font-black text-xl mt-4 uppercase tracking-widest bg-white dark:bg-slate-900 px-6 py-2 rounded-2xl shadow-sm">Sei! +10 XP</span>
                    </motion.div>
                  )}

                  {swipeIndicator === 'review' && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 bg-rose-500/20 backdrop-blur-xs rounded-3xl z-30 flex flex-col items-center justify-center border-4 border-rose-500"
                    >
                      <div className="bg-rose-500 text-white p-4 rounded-full shadow-lg">
                        <RotateCcw size={40} />
                      </div>
                      <span className="text-rose-600 dark:text-rose-400 font-black text-xl mt-4 uppercase tracking-widest bg-white dark:bg-slate-900 px-6 py-2 rounded-2xl shadow-sm">Revisar Depois</span>
                    </motion.div>
                  )}

                  <motion.div
                    className="relative w-full h-full cursor-pointer select-none"
                    style={{ transformStyle: 'preserve-3d' }}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    onClick={() => setIsFlipped(!isFlipped)}
                  >
                    {/* CARD FRONT (Question) */}
                    <div 
                      className="absolute inset-0 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-8 flex flex-col justify-between shadow-md hover:shadow-xl transition-shadow backface-hidden"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-500 bg-indigo-500/10 px-3 py-1 rounded-full">
                          {currentCards[cardIndex]?.topic}
                        </span>
                        <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1 font-bold">
                          <HelpCircle size={14} className="text-indigo-400" /> Pergunta
                        </span>
                      </div>

                      <div className="flex-1 flex items-center justify-center py-6">
                        <p className="text-xl md:text-2xl font-extrabold text-[var(--text-primary)] text-center leading-relaxed">
                          {currentCards[cardIndex]?.front_content}
                        </p>
                      </div>

                      <div className="text-center text-xs text-[var(--text-secondary)] font-medium animate-pulse">
                        Toque no card para revelar a resposta 💡
                      </div>
                    </div>

                    {/* CARD BACK (Answer - Rotated by 180 degrees) */}
                    <div 
                      className="absolute inset-0 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/30 rounded-3xl p-8 flex flex-col justify-between shadow-md backface-hidden"
                      style={{ 
                        backfaceVisibility: 'hidden', 
                        transform: 'rotateY(180deg)' 
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-green-600 bg-green-500/10 px-3 py-1 rounded-full">
                          {currentCards[cardIndex]?.topic}
                        </span>
                        <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1 font-bold">
                          <Star size={14} className="text-yellow-400 fill-yellow-400" /> Resposta Explicação
                        </span>
                      </div>

                      <div className="flex-1 flex items-center justify-center py-6">
                        <p className="text-sm md:text-base text-slate-800 dark:text-slate-200 text-center leading-relaxed font-medium">
                          {currentCards[cardIndex]?.back_content}
                        </p>
                      </div>

                      <div className="text-center text-xs text-[var(--text-secondary)] font-medium">
                        Toque de novo para ver a pergunta 🔄
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* SWIPE ACTION BUTTONS */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleSwipe('review')}
                    className="flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-rose-500/10 active:scale-95 cursor-pointer"
                  >
                    <RotateCcw size={18} />
                    <span>Revisar Depois</span>
                  </button>

                  <button
                    onClick={() => handleSwipe('known')}
                    className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-emerald-500/10 active:scale-95 cursor-pointer"
                  >
                    <Check size={18} />
                    <span>Sei! (+10 XP)</span>
                  </button>
                </div>

                {/* PRO TIP BOX */}
                <div className="bg-[var(--bg-secondary)] border border-[var(--card-border)] p-4 rounded-2xl text-xs text-[var(--text-secondary)] flex items-start gap-2.5">
                  <Info size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Dica de Memorização:</strong> Ao clicar em "Revisar Depois", o card retornará ao final da fila para ser exibido novamente nesta sessão até que você o fixe.
                  </p>
                </div>
              </div>
            ) : currentCards.length === 0 ? (
              /* TUDO VISTO (All Seen / Mastered) SCREEN */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[var(--card-bg)] border border-emerald-500/20 p-8 rounded-3xl text-center space-y-6 shadow-lg shadow-emerald-500/5"
              >
                <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                  <Trophy size={40} className="animate-bounce" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-[var(--text-primary)]">🏆 Tudo visto!</h3>
                  <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto leading-relaxed">
                    Você já estudou TODOS os <strong>{stats.perTrail.find(t => t.id === activeTrail.id)?.total || activeTrail.cards.length}</strong> cards desta matéria. Nenhum card novo disponível.
                  </p>
                </div>

                <div className="bg-[var(--bg-secondary)] border border-[var(--card-border)] p-5 rounded-2xl max-w-sm mx-auto text-center space-y-2">
                  <p className="text-xs font-bold text-[var(--text-secondary)]">Deseja resetar e estudar novamente?</p>
                  <p className="text-[10px] text-[var(--text-secondary)] opacity-70">Sua pontuação de XP global será preservada.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 max-w-sm mx-auto">
                  <button
                    onClick={async () => {
                      await resetTrailProgress(activeTrail.id);
                      handleStartTrail(activeTrail);
                    }}
                    className="flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-4 rounded-xl transition-all cursor-pointer"
                  >
                    <RefreshCw size={16} />
                    <span>🔄 Resetar cards</span>
                  </button>

                  <button
                    onClick={handleBackToTrails}
                    className="flex items-center justify-center gap-2 bg-[var(--bg-secondary)] hover:bg-[var(--card-border)] border border-[var(--card-border)] text-[var(--text-primary)] font-bold py-3 px-4 rounded-xl transition-all cursor-pointer"
                  >
                    <span>Voltar</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              /* SECTION 3: SESSION COMPLETED SUMMARY */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[var(--card-bg)] border border-[var(--card-border)] p-8 rounded-3xl text-center space-y-6 shadow-lg"
              >
                <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <Trophy size={40} className="animate-bounce" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-[var(--text-primary)]">Sessão Concluída! 🎉</h3>
                  <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto">
                    Excelente trabalho! Você revisou todos os flashcards da trilha de <strong>{activeTrail.title}</strong> nesta rodada.
                  </p>
                </div>

                {/* Interactive detailed session breakdown */}
                <div className="bg-[var(--bg-secondary)] border border-[var(--card-border)] p-5 rounded-2xl max-w-sm mx-auto text-left space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)] border-b border-[var(--card-border)] pb-2 mb-1">
                    Resumo do Desempenho
                  </h4>
                  <div className="flex items-center justify-between text-sm font-bold text-[var(--text-primary)]">
                    <span className="flex items-center gap-1.5"><Check size={16} className="text-emerald-500" /> Você sabia</span>
                    <span className="font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 rounded-md">{knownCount} cards</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-bold text-[var(--text-primary)]">
                    <span className="flex items-center gap-1.5"><RotateCcw size={16} className="text-rose-500" /> Para revisar</span>
                    <span className="font-mono bg-rose-500/10 text-rose-600 dark:text-rose-400 px-2.5 py-0.5 rounded-md">{reviewCount} vezes</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-[var(--text-secondary)] border-t border-[var(--card-border)] pt-2.5">
                    <span>Cards novos restantes após esta sessão</span>
                    <span className="font-mono text-indigo-500 font-extrabold">🔒 {remainingUnseenCount}</span>
                  </div>
                  {dupCount > 0 && (
                    <div className="flex items-center justify-between text-xs font-bold text-[var(--text-secondary)] border-t border-[var(--card-border)] border-dashed pt-2">
                      <span className="flex items-center gap-1 text-amber-500 dark:text-amber-400">
                        <RefreshCw size={12} className="animate-spin" style={{ animationDuration: '4s' }} /> 
                        Duplicatas removidas
                      </span>
                      <span className="font-mono bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded text-[10px]">
                        {dupCount} cards
                      </span>
                    </div>
                  )}
                </div>

                <div className="inline-flex items-center gap-3 bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 px-6 py-3 rounded-2xl border border-indigo-500/20">
                  <Zap size={20} className="fill-indigo-500" />
                  <span className="font-extrabold text-lg">+{sessionXpEarned} XP Acumulados</span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button
                    onClick={handleRestartTrail}
                    className="flex items-center justify-center gap-2 bg-[var(--bg-secondary)] hover:bg-[var(--card-border)] border border-[var(--card-border)] text-[var(--text-primary)] font-bold py-3.5 px-4 rounded-xl transition-all cursor-pointer"
                  >
                    <RefreshCw size={16} />
                    <span>Estudar de Novo</span>
                  </button>

                  <button
                    onClick={handleBackToTrails}
                    className="flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md shadow-indigo-500/10 cursor-pointer"
                  >
                    <span>Outras Trilhas</span>
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {activeView === 'stats' && (
          /* SECTION 4: GLOBAL STATISTICS DASHBOARD SUB-VIEW */
          <motion.div
            key="stats"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6 max-w-4xl mx-auto"
          >
            {/* Header & Back Action */}
            <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-4">
              <button 
                onClick={() => setActiveView('trails')}
                className="inline-flex items-center gap-2 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                <ChevronLeft size={18} />
                <span>Voltar para as Trilhas</span>
              </button>
              
              <h2 className="text-lg font-black text-[var(--text-primary)]">Estatísticas de Memorização</h2>
            </div>

            {/* Bento Grid: Performance metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Grand percentage circle */}
              <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-4 md:col-span-1">
                <p className="text-xs font-black uppercase tracking-widest text-[var(--text-secondary)]">Domínio Geral</p>
                <div className="relative w-28 h-28 flex items-center justify-center">
                  {/* SVG circular progress */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="56" cy="56" r="48" className="stroke-slate-100 dark:stroke-slate-800 fill-none" strokeWidth="8" />
                    <circle 
                      cx="56" 
                      cy="56" 
                      r="48" 
                      className="stroke-indigo-600 fill-none transition-all duration-1000" 
                      strokeWidth="8" 
                      strokeDasharray={2 * Math.PI * 48}
                      strokeDashoffset={2 * Math.PI * 48 * (1 - stats.grandPercentage / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-2xl font-black text-[var(--text-primary)] font-mono">
                    {stats.grandPercentage}%
                  </span>
                </div>
                <p className="text-[10px] text-[var(--text-secondary)] font-medium leading-relaxed">
                  Porcentagem total dos flashcards memorizados no acervo.
                </p>
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:col-span-3">
                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-500/10 px-2.5 py-1 rounded-full">Deduplicados</span>
                    <h4 className="text-3xl font-extrabold font-mono text-[var(--text-primary)] mt-4">{stats.grandTotal}</h4>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-2">Total de cards únicos no catálogo.</p>
                </div>

                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full">Memorizados</span>
                    <h4 className="text-3xl font-extrabold font-mono text-[var(--text-primary)] mt-4">{stats.grandSeen}</h4>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-2">Cards que você já marcou como "Sei!".</p>
                </div>

                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full">Não vistos</span>
                    <h4 className="text-3xl font-extrabold font-mono text-[var(--text-primary)] mt-4">{stats.grandRemaining}</h4>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-2">Cards restantes para dominar as trilhas.</p>
                </div>
              </div>
            </div>

            {/* List and reset per trail */}
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[2rem] p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">Progresso Detalhado por Matéria</h3>
                  <p className="text-xs text-[var(--text-secondary)]">Acompanhe e gerencie seu progresso para cada trilha ativa.</p>
                </div>

                <button
                  onClick={resetAllProgress}
                  disabled={stats.grandSeen === 0}
                  className={`text-xs font-black uppercase tracking-widest flex items-center gap-1.5 px-4 py-2 border rounded-xl transition-all ${
                    stats.grandSeen === 0 
                      ? 'border-slate-100 dark:border-slate-800 text-[var(--text-secondary)] opacity-30 cursor-not-allowed'
                      : 'border-rose-500/20 text-rose-500 hover:bg-rose-500/5 cursor-pointer'
                  }`}
                >
                  <Trash2 size={14} />
                  <span>Resetar Tudo</span>
                </button>
              </div>

              <div className="divide-y divide-[var(--card-border)]">
                {stats.perTrail.map((trail) => {
                  const isFinished = trail.seen === trail.total && trail.total > 0;
                  return (
                    <div key={trail.id} className="py-6 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-3.5 h-3.5 rounded-md"
                            style={{ backgroundColor: trail.color_theme }}
                          />
                          <h4 className="text-base font-extrabold text-[var(--text-primary)]">{trail.title}</h4>
                          <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-secondary)] opacity-80 bg-[var(--bg-secondary)] px-2 py-0.5 rounded-full border border-[var(--card-border)]">
                            {trail.category}
                          </span>
                          
                          {isFinished && (
                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-0.5">
                              <CheckCircle2 size={10} className="fill-emerald-500/10" />
                              <span>100% Dominada</span>
                            </span>
                          )}
                        </div>

                        {/* Progress slider bar */}
                        <div className="space-y-1.5 max-w-xl">
                          <div className="flex items-center justify-between text-xs font-bold text-[var(--text-secondary)]">
                            <span>Percentual Concluído</span>
                            <span className="font-mono text-[var(--text-primary)]">{trail.percentage}% ({trail.seen}/{trail.total} cards)</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-300`}
                              style={{ 
                                width: `${trail.percentage}%`,
                                backgroundColor: isFinished ? '#10b981' : trail.color_theme 
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Reset per subject actions */}
                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          onClick={() => {
                            if (window.confirm(`Deseja mesmo resetar o progresso em ${trail.title}?`)) {
                              resetTrailProgress(trail.id);
                            }
                          }}
                          disabled={trail.seen === 0}
                          className={`text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1 px-4 py-2.5 rounded-xl border transition-all ${
                            trail.seen === 0
                              ? 'border-slate-100 dark:border-slate-800 text-[var(--text-secondary)] opacity-35 cursor-not-allowed'
                              : 'border-[var(--card-border)] text-rose-500 hover:border-rose-500/30 hover:bg-rose-500/5 cursor-pointer'
                          }`}
                        >
                          <RotateCcw size={14} />
                          <span>Resetar</span>
                        </button>

                        <button
                          onClick={() => handleStartTrail(trail)}
                          className="text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
                        >
                          <Target size={14} />
                          <span>Estudar</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <FlashcardCreatorModal 
        isOpen={showCreator} 
        onClose={() => setShowCreator(false)} 
        onCreated={(newCards) => {
          // Handle newly created cards, maybe add to a 'custom' category
          console.log('Created cards:', newCards);
          alert('Flashcards criados com sucesso!');
        }}
      />
    </div>
  );
}
