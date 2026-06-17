import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Flame, Trophy, Target, Play, BookOpen, TrendingUp, CalendarDays,
  BrainCircuit, ChevronRight, Sparkles, Gift, Medal, Star, Lock,
  CheckCircle2, CalendarCheck, Check, ArrowLeft, Volume2, RotateCw, Loader2,
  Headphones, Keyboard, EyeOff, Eye, WholeWord, Heart, Sun, Moon, CloudMoon,
  Cookie, ScanSearch, Settings, X
} from 'lucide-react';

// --- KẾT NỐI SUPABASE BẰNG FETCH NATIVE (Kháng lỗi biên dịch Vercel) ---
const supabaseUrl = 'https://nrqivqjmnodoyjvppcxh.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ycWl2cWptbm9kb3lqdnBwY3hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyOTA3NjIsImV4cCI6MjA5Njg2Njc2Mn0.alMJZ2BmSk5schZ0G65vgz3Fi0vK7ZHIh-LOI4huEmI';

const supabase = {
  from: (table) => ({
    select: (columns = '*') => {
      let url = `${supabaseUrl}/rest/v1/${table}?select=${columns}`;
      let isSingle = false;
      let orderCol = null;
      let limitCount = null;
      let eqFilters = [];

      const executor = async () => {
        if (orderCol) url += `&order=${orderCol}`;
        if (limitCount) url += `&limit=${limitCount}`;
        eqFilters.forEach(f => url += `&${f.col}=eq.${f.val}`);
        try {
          const res = await fetch(url, { headers: { 'apikey': supabaseAnonKey, 'Authorization': `Bearer ${supabaseAnonKey}` } });
          if (!res.ok) {
             const err = await res.json().catch(() => ({}));
             throw err;
          }
          let data = await res.json();
          if (isSingle) {
            if (data.length === 0) throw { code: 'PGRST116' };
            data = data[0];
          }
          return { data, error: null };
        } catch (error) { return { data: null, error }; }
      };

      const queryObj = {
        order: (col) => { orderCol = col; return queryObj; },
        eq: (col, val) => { eqFilters.push({col, val}); return queryObj; },
        limit: (num) => { limitCount = num; return queryObj; },
        single: () => { isSingle = true; return queryObj; },
        then: (resolve, reject) => executor().then(resolve).catch(reject)
      };
      return queryObj;
    },
    insert: async (payload) => {
      try {
        const res = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
          method: 'POST',
          headers: { 'apikey': supabaseAnonKey, 'Authorization': `Bearer ${supabaseAnonKey}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
          body: JSON.stringify(Array.isArray(payload) ? payload : [payload])
        });
        if (!res.ok) throw await res.json();
        return { data: true, error: null };
      } catch(error) { return { data: null, error }; }
    },
    update: (payload) => {
      const queryObj = {
        eq: async (col, val) => {
          try {
            const res = await fetch(`${supabaseUrl}/rest/v1/${table}?${col}=eq.${val}`, {
              method: 'PATCH',
              headers: { 'apikey': supabaseAnonKey, 'Authorization': `Bearer ${supabaseAnonKey}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
              body: JSON.stringify(payload)
            });
            if (!res.ok) throw await res.json();
            return { data: true, error: null };
          } catch(error) { return { data: null, error }; }
        }
      };
      return queryObj;
    },
    upsert: async (payload, options = {}) => {
      try {
        let url = `${supabaseUrl}/rest/v1/${table}`;
        if (options.onConflict) url += `?on_conflict=${options.onConflict}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 
            'apikey': supabaseAnonKey, 
            'Authorization': `Bearer ${supabaseAnonKey}`, 
            'Content-Type': 'application/json', 
            'Prefer': 'return=minimal, resolution=merge-duplicates' 
          },
          body: JSON.stringify(Array.isArray(payload) ? payload : [payload])
        });
        if (!res.ok) throw await res.json();
        return { data: true, error: null };
      } catch(error) { return { data: null, error }; }
    }
  })
};

const GROUP_COLORS = [
  'bg-pink-100 text-pink-600 dark:bg-white/10 dark:text-white',
  'bg-rose-100 text-rose-600 dark:bg-white/10 dark:text-white',
  'bg-fuchsia-100 text-fuchsia-600 dark:bg-white/10 dark:text-white',
  'bg-purple-100 text-purple-600 dark:bg-white/10 dark:text-white'
];

const PINYIN_KEYS = [
  ['ā', 'á', 'ǎ', 'à'],
  ['ē', 'é', 'ě', 'è'],
  ['ī', 'í', 'ǐ', 'ì'],
  ['ō', 'ó', 'ǒ', 'ò'],
  ['ū', 'ú', 'ǔ', 'ù'],
  ['ǖ', 'ǘ', 'ǚ', 'ǜ']
];

const StarryNightBackground = React.memo(() => {
  const starsSmall = useMemo(() => Array.from({ length: 150 }).map(() => `${Math.random() * 100}vw ${Math.random() * 100}vh rgba(255,255,255,${Math.random()})`).join(', '), []);
  const starsMedium = useMemo(() => Array.from({ length: 50 }).map(() => `${Math.random() * 100}vw ${Math.random() * 100}vh rgba(255,255,255,${Math.random() * 0.8})`).join(', '), []);
  const starsLarge = useMemo(() => Array.from({ length: 15 }).map(() => `${Math.random() * 100}vw ${Math.random() * 100}vh rgba(255,255,255,${Math.random() * 0.6})`).join(', '), []);

  return (
    <div className="fixed inset-0 z-0 hidden dark:block overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050B14] via-[#131A33] to-[#2B1736]"></div>
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-fuchsia-900/40 to-transparent"></div>
      <style dangerouslySetInnerHTML={{__html: `
        .star-layer-1 { width: 1px; height: 1px; background: transparent; box-shadow: ${starsSmall}; }
        .star-layer-2 { width: 2px; height: 2px; background: transparent; box-shadow: ${starsMedium}; }
        .star-layer-3 { width: 3px; height: 3px; background: transparent; box-shadow: ${starsLarge}; border-radius: 50%; }
        .twinkling { animation: twinkle 4s infinite ease-in-out alternate; }
        .shooting-star { position: absolute; width: 150px; height: 1px; background: linear-gradient(90deg, white, transparent); animation: shoot 8s infinite linear; opacity: 0; transform: rotate(-45deg); box-shadow: 0 0 10px white; }
        .shake-animation { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes twinkle { 0% { opacity: 0.3; } 100% { opacity: 1; box-shadow: 0 0 15px white; } }
        @keyframes shoot { 0% { transform: translate(0, 0) rotate(-45deg); opacity: 1; } 10% { transform: translate(-400px, 400px) rotate(-45deg); opacity: 0; } 100% { opacity: 0; } }
        @keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }
      `}} />
      <div className="absolute inset-0"><div className="star-layer-1"></div></div>
      <div className="absolute inset-0 twinkling"><div className="star-layer-2"></div></div>
      <div className="absolute inset-0 twinkling" style={{ animationDelay: '1s' }}><div className="star-layer-3"></div></div>
      <div className="shooting-star top-[5%] right-[10%]" style={{ animationDelay: '2s' }}></div>
      <div className="shooting-star top-[20%] right-[30%]" style={{ animationDelay: '7s' }}></div>
      
      <div className="absolute bottom-0 w-full text-[#03060E] fill-current">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 sm:h-24 md:h-32 opacity-90">
          <path d="M0,120 L0,80 L15,95 L25,60 L35,85 L50,40 L65,90 L75,70 L90,105 L105,50 L120,85 L135,45 L150,90 L165,65 L180,100 L195,55 L210,80 L225,40 L240,85 L255,60 L270,95 L285,45 L300,80 L315,50 L330,90 L345,65 L360,100 L375,55 L390,85 L405,40 L420,90 L435,70 L450,105 L465,50 L480,85 L495,45 L510,90 L525,65 L540,100 L555,55 L570,80 L585,40 L600,85 L615,60 L630,95 L645,45 L660,80 L675,50 L690,90 L705,65 L720,100 L735,55 L750,85 L765,40 L780,90 L795,70 L810,105 L825,50 L840,85 L855,45 L870,90 L885,65 L900,100 L915,55 L930,80 L945,40 L960,85 L975,60 L990,95 L1005,45 L1020,80 L1035,50 L1050,90 L1065,65 L1080,100 L1095,55 L1110,85 L1125,40 L1140,90 L1155,70 L1170,105 L1185,50 L1200,80 L1200,120 Z" />
        </svg>
      </div>
    </div>
  );
});

const MorningAuraBackground = React.memo(() => {
  return (
    <div className="fixed inset-0 z-0 block dark:hidden overflow-hidden pointer-events-none bg-[#FFF9FB]">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-1 { 0% { transform: translate(0, 0) scale(1); } 50% { transform: translate(5%, 10%) scale(1.1); } 100% { transform: translate(0, 0) scale(1); } }
        @keyframes float-2 { 0% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-5%, 15%) scale(1.05); } 100% { transform: translate(0, 0) scale(1); } }
        @keyframes float-3 { 0% { transform: translate(0, 0) scale(1); } 50% { transform: translate(10%, -10%) scale(1.15); } 100% { transform: translate(0, 0) scale(1); } }
      `}} />
      <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(#ec4899 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-pink-300/40 rounded-full blur-[100px] mix-blend-multiply" style={{ animation: 'float-1 20s infinite ease-in-out' }}></div>
      <div className="absolute top-[30%] right-[-20%] w-[60vw] h-[60vw] bg-rose-200/40 rounded-full blur-[120px] mix-blend-multiply" style={{ animation: 'float-2 25s infinite ease-in-out' }}></div>
      <div className="absolute bottom-[-20%] left-[10%] w-[70vw] h-[70vw] bg-fuchsia-200/30 rounded-full blur-[150px] mix-blend-multiply" style={{ animation: 'float-3 22s infinite ease-in-out' }}></div>
    </div>
  );
});

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [isInitializing, setIsInitializing] = useState(true); 
  const [toastMessage, setToastMessage] = useState(null);

  const [userId] = useState(() => {
    let id = localStorage.getItem('na_hsk_device_id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('na_hsk_device_id', id);
    }
    return id;
  });
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('na_hsk_theme');
      if (saved) return saved === 'dark';
      return false; 
    }
    return false;
  });

  const [autoFlipDelay, setAutoFlipDelay] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedDelay = localStorage.getItem('na_hsk_flip_delay');
      return savedDelay ? parseInt(savedDelay) : 1500;
    }
    return 1500;
  });

  const [audioSpeed, setAudioSpeed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('na_hsk_audio_speed');
      return saved ? parseFloat(saved) : 0.85;
    }
    return 0.85;
  });

  const [dailyGoal, setDailyGoal] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('na_hsk_daily_goal');
      return saved ? parseInt(saved) : 50;
    }
    return 50;
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('na_hsk_flip_delay', autoFlipDelay);
  }, [autoFlipDelay]);

  useEffect(() => {
    localStorage.setItem('na_hsk_audio_speed', audioSpeed);
  }, [audioSpeed]);

  useEffect(() => {
    localStorage.setItem('na_hsk_daily_goal', dailyGoal);
  }, [dailyGoal]);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('na_hsk_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('na_hsk_theme', 'light');
    }
  }, [isDarkMode]);

  const [stats, setStats] = useState({
    streakDays: 0, totalStudied: 0, totalMastered: 0, dailyGoalProgress: 0, 
    dailyGoalTotal: 50, reviewsToday: 0, petLevel: 1, petExp: 0, petFood: 0, lastCheckin: null 
  });

  const [alphabetGroups, setAlphabetGroups] = useState([]);
  const activeGroup = alphabetGroups.find(g => g.active) || alphabetGroups[0];
  const [sessionProgressUpdates, setSessionProgressUpdates] = useState([]);
  
  const [allVocabulary, setAllVocabulary] = useState([]);
  const [userProgressMap, setUserProgressMap] = useState({});

  useEffect(() => {
    async function bootApp() {
      setIsInitializing(true);
      
      let fetchedGroups = [];
      let fetchedVocab = [];
      let fetchedProgress = {};
      let fetchedStats = null;

      try {
        const { data, error } = await supabase.from('alphabet_groups').select('*').order('id');
        if (!error && data && data.length > 0) fetchedGroups = data;
      } catch (e) { console.error("Lỗi tải Nhóm từ:", e); }

      try {
        const { data, error } = await supabase.from('vocabulary').select('*');
        if (!error && data) fetchedVocab = data;
      } catch (e) { console.error("Lỗi tải Từ vựng:", e); }

      try {
        const { data, error } = await supabase.from('user_progress').select('*').eq('user_id', userId);
        if (!error && data) {
          const pList = Array.isArray(data) ? data : [data];
          pList.forEach(p => { fetchedProgress[p.word_id] = p; });
        }
      } catch (e) { console.error("Lỗi tải Tiến độ:", e); }

      try {
        const { data, error } = await supabase.from('user_stats').select('*').eq('user_id', userId).single();
        if (data) fetchedStats = data;
        
        if (error && error.code === 'PGRST116') {
           await supabase.from('user_stats').upsert([{ user_id: userId }]);
        }
      } catch (e) { console.error("Lỗi tải Thống kê:", e); }

      if (fetchedGroups.length === 0) {
        console.warn("Kích hoạt Dữ liệu dự phòng do Database trống hoặc bị chặn RLS.");
        fetchedGroups = [
          { id: 1, name: 'Nhóm A - F', total: 50, learned: 0, active: true },
          { id: 2, name: 'Nhóm G - M', total: 50, learned: 0, active: false },
          { id: 3, name: 'Nhóm N - S', total: 50, learned: 0, active: false },
          { id: 4, name: 'Nhóm T - Z', total: 50, learned: 0, active: false }
        ];
      }

      setAllVocabulary(fetchedVocab);
      setUserProgressMap(fetchedProgress);

      const groupTotals = {};
      const groupLearnedCount = {};
      fetchedVocab.forEach(v => { 
        groupTotals[v.group_id] = (groupTotals[v.group_id] || 0) + 1; 
        if (fetchedProgress[v.id]) {
          groupLearnedCount[v.group_id] = (groupLearnedCount[v.group_id] || 0) + 1;
        }
      });

      const processedGroups = fetchedGroups.map((g, index) => ({ 
        ...g, 
        color: GROUP_COLORS[index % GROUP_COLORS.length],
        active: index === 0,
        total: dailyGoal, 
        learned: groupLearnedCount[g.id] || 0
      }));
      setAlphabetGroups(processedGroups);

      const now = new Date().getTime();
      let reviewCount = 0;
      fetchedVocab.forEach(word => {
        const prog = fetchedProgress[word.id];
        if (prog && new Date(prog.next_review_date).getTime() <= now) {
          reviewCount++;
        }
      });

      if (fetchedStats) {
        setStats({
          streakDays: fetchedStats.streak_days || 0, 
          totalStudied: Object.keys(fetchedProgress).length, 
          totalMastered: fetchedStats.words_learned || 0, 
          dailyGoalProgress: 0, 
          dailyGoalTotal: dailyGoal, 
          reviewsToday: reviewCount, 
          petLevel: fetchedStats.pet_level || 1, 
          petExp: fetchedStats.pet_exp || 0, 
          petFood: fetchedStats.pet_food || 0, 
          lastCheckin: fetchedStats.last_checkin_date 
        });
      } else {
        setStats(prev => ({ ...prev, reviewsToday: reviewCount, totalStudied: Object.keys(fetchedProgress).length, dailyGoalTotal: dailyGoal }));
      }

      setIsInitializing(false); 
    }
    
    bootApp();
  }, [userId]);

  useEffect(() => {
    if (isInitializing || allVocabulary.length === 0) return;

    const now = new Date().getTime();
    let reviewCount = 0;
    const groupLearnedCount = {};

    allVocabulary.forEach(word => {
      const prog = userProgressMap[word.id];
      if (prog) {
        groupLearnedCount[word.group_id] = (groupLearnedCount[word.group_id] || 0) + 1;
        const reviewTime = new Date(prog.next_review_date).getTime();
        if (reviewTime <= now) {
          reviewCount++;
        }
      }
    });

    setStats(prev => ({ 
      ...prev, 
      reviewsToday: reviewCount,
      totalStudied: Object.keys(userProgressMap).length,
      dailyGoalTotal: dailyGoal
    }));

    setAlphabetGroups(prevGroups => prevGroups.map(g => ({
      ...g,
      total: dailyGoal, 
      learned: groupLearnedCount[g.id] || 0
    })));
  }, [userProgressMap, allVocabulary, isInitializing, dailyGoal]);

  const syncStatsToCloud = async (newStats, progressBatch = []) => {
    try {
      await supabase.from('user_stats').update({
        streak_days: newStats.streakDays, 
        last_checkin_date: newStats.lastCheckin, 
        pet_level: newStats.petLevel,
        pet_exp: newStats.petExp, 
        pet_food: newStats.petFood, 
        words_learned: newStats.totalMastered
      }).eq('user_id', userId);

      if (progressBatch.length > 0) {
        const finalUpdatesMap = new Map();
        progressBatch.forEach(p => {
            const { is_requeued, ...cleanRecord } = p; 
            finalUpdatesMap.set(cleanRecord.word_id, cleanRecord);
        });
        const finalBatch = Array.from(finalUpdatesMap.values());
        
        await supabase.from('user_progress').upsert(finalBatch, { onConflict: 'user_id,word_id' });

        setUserProgressMap(prev => {
          const nextMap = { ...prev };
          finalBatch.forEach(record => {
            nextMap[record.word_id] = record;
          });
          return nextMap;
        });
      }
    } catch (error) {
      console.error("Lỗi đồng bộ Đám mây:", error);
    }
  };

  const hasCheckedIn = stats.lastCheckin === new Date().toISOString().split('T')[0];

  const [petMood, setPetMood] = useState('normal'); 
  const getPetAvatar = () => {
    if (petMood === 'eating') return '🥟';
    if (petMood === 'happy') return '✨🐶✨';
    if (stats.petLevel === 1) return '🥚'; 
    if (stats.petLevel === 2) return '🐣'; 
    if (stats.petLevel >= 3 && stats.petLevel < 5) return '🐶'; 
    return '🦊'; 
  };

  const handleFeedPet = () => {
    if (stats.petFood > 0) {
      setPetMood('eating');
      setTimeout(() => setPetMood('happy'), 800);
      setTimeout(() => setPetMood('normal'), 2000);

      setStats(prev => {
        let newExp = prev.petExp + 25; 
        let newLevel = prev.petLevel;
        if (newExp >= 100) { newLevel += 1; newExp = newExp - 100; }
        const today = new Date().toISOString().split('T')[0];
        const isNewCheckin = prev.lastCheckin !== today;

        const updatedStats = {
          ...prev, petFood: prev.petFood - 1, petExp: newExp, petLevel: newLevel,
          streakDays: isNewCheckin ? prev.streakDays + 1 : prev.streakDays, lastCheckin: today
        };
        syncStatsToCloud(updatedStats); 
        return updatedStats;
      });
    }
  };

  const [learningMode, setLearningMode] = useState('standard'); 
  const [hidePinyin, setHidePinyin] = useState(false);
  
  const [typingInput, setTypingInput] = useState('');
  const [typingResult, setTypingResult] = useState(null); 
  const [mistakeCount, setMistakeCount] = useState(0); 
  const [hasTypingMistake, setHasTypingMistake] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false); 

  const [quizOptions, setQuizOptions] = useState([]);
  const [selectedQuizOption, setSelectedQuizOption] = useState(null);

  const [flashcards, setFlashcards] = useState([]);
  const [isLoading, setIsLoading] = useState(false); 
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionMastered, setSessionMastered] = useState(0); 

  const inputRef = useRef(null);
  const voicesRef = useRef([]); 

  const REWARDS = [
    { id: 1, title: 'Na siêu chăm chỉ', condition: 'Đạt chuỗi 7 ngày học', rewardItem: 'Ly Trà sữa 🧋', target: 7, current: stats.streakDays, icon: Heart, color: 'text-pink-500 dark:text-white', bgColor: 'bg-pink-100 dark:bg-white/10' },
    { id: 2, title: 'Bảo bối trưởng thành', condition: 'Pet đạt cấp 5', rewardItem: 'Mở khóa Cáo Tiên 🦊', target: 5, current: stats.petLevel, icon: Sparkles, color: 'text-purple-500 dark:text-white', bgColor: 'bg-purple-100 dark:bg-white/10' },
    { id: 3, title: 'Cao thủ Hán tự', condition: 'Thuộc 100 từ mới', rewardItem: 'Xem phim rạp 🎬', target: 100, current: stats.totalMastered, icon: Star, color: 'text-rose-500 dark:text-white', bgColor: 'bg-rose-100 dark:bg-white/10' },
  ];

  // ==========================================
  // ĐẠI PHẪU TỐI THƯỢNG: ĐỒNG BỘ ÂM THANH CHỐNG CÂM ĐIẾC
  // ==========================================
  const playAudio = (text) => {
    if (!window.speechSynthesis) return;

    // CHỈ DỌN DẸP KHI CÓ TIẾNG ĐANG PHÁT - Nếu rỗng mà gọi cancel() sẽ làm đóng băng Chrome
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel(); 
    }

    // ĐỒNG BỘ 100%: Xóa vĩnh viễn setTimeout để không làm mất token User Gesture của iOS/Chrome
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN'; 
      utterance.rate = audioSpeed; 

      // Ưu tiên load giọng từ cache
      let zhVoice = voicesRef.current.find(voice => voice.lang === 'zh-CN' || voice.lang.includes('zh') || voice.lang.includes('Han'));
      
      // Fallback: Quét trực tiếp nếu cache rỗng
      if (!zhVoice) {
         const currentVoices = window.speechSynthesis.getVoices();
         zhVoice = currentVoices.find(voice => voice.lang === 'zh-CN' || voice.lang.includes('zh') || voice.lang.includes('Han'));
      }

      if (zhVoice) {
        utterance.voice = zhVoice;
      }

      // THỰC THI CHUẨN ĐỒNG BỘ TỨC THỜI
      window.speechSynthesis.speak(utterance);

    } catch (err) {
      console.error("Lỗi SpeechSynthesis:", err);
    }
  };

  // Pre-load giọng nói ngay từ đầu để không bị độ trễ
  useEffect(() => {
    const loadVoices = () => {
      if ('speechSynthesis' in window) {
        voicesRef.current = window.speechSynthesis.getVoices();
      }
    };
    
    loadVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const generateQuizOptions = (correctIndex, cardsList) => {
    if (cardsList.length < 4) return [];
    let options = [cardsList[correctIndex]];
    let availableIndexes = cardsList.map((_, i) => i).filter(i => i !== correctIndex);
    
    for (let i = availableIndexes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availableIndexes[i], availableIndexes[j]] = [availableIndexes[j], availableIndexes[i]];
    }
    for (let i = 0; i < 3; i++) {
      options.push(cardsList[availableIndexes[i]]);
    }
    return options.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    if (currentScreen === 'flashcard' && !isFlipped && flashcards.length > 0) {
      if ((learningMode === 'typing' || learningMode === 'listening') && inputRef.current && !showKeyboard) {
        inputRef.current.focus();
      }
      if (learningMode === 'visual') {
        setQuizOptions(generateQuizOptions(currentCardIndex, flashcards));
        setSelectedQuizOption(null);
      }
    }
  }, [currentCardIndex, currentScreen, isFlipped, flashcards, learningMode, showKeyboard]);

  const handleSelectGroup = (groupId) => {
    setAlphabetGroups(prev => prev.map(g => ({ ...g, active: g.id === groupId })));
  };

  const startSession = (isReviewOnly = false) => {
    setIsLoading(true);
    const now = new Date().getTime();
    let reviewCards = [];
    let newCards = [];

    const sourceVocab = isReviewOnly ? allVocabulary : allVocabulary.filter(w => w.group_id === activeGroup?.id);

    sourceVocab.forEach(word => {
      const prog = userProgressMap[word.id];
      if (prog) {
        const reviewTime = new Date(prog.next_review_date).getTime();
        if (reviewTime <= now) {
          reviewCards.push({ ...word, interval: prog.interval, ease_factor: prog.ease_factor, is_review: true });
        }
      } else {
        if (!isReviewOnly) {
          newCards.push({ ...word, interval: 0, ease_factor: 2.5, is_review: false });
        }
      }
    });

    reviewCards = reviewCards.sort(() => Math.random() - 0.5);
    newCards = newCards.sort(() => Math.random() - 0.5);

    let sessionCards = [];
    if (isReviewOnly) {
        sessionCards = reviewCards.slice(0, 15);
    } else {
        sessionCards = [...reviewCards, ...newCards].slice(0, 15);
    }

    if (sessionCards.length === 0) {
        setIsLoading(false);
        setToastMessage(isReviewOnly 
            ? "Tuyệt vời! Na đã ôn tập xong tất cả từ vựng hôm nay. 🎉" 
            : "Na đã học hết 100% từ vựng của nhóm này rồi. Hãy chọn nhóm khác nhé! ✨");
        setTimeout(() => setToastMessage(null), 4000);
        return; 
    }

    setFlashcards(sessionCards);
    setCurrentScreen('flashcard');
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setSessionMastered(0);
    setTypingInput('');
    setTypingResult(null);
    setMistakeCount(0);
    setHasTypingMistake(false);
    setSessionProgressUpdates([]); 
    setSelectedQuizOption(null);
    setIsLoading(false);

    // Kích hoạt cổng âm thanh đồng bộ: Phát thẳng từ đầu tiên để lách luật
    if (learningMode === 'standard' || learningMode === 'listening') {
       playAudio(sessionCards[0].word);
    }
  };

  const handleStartLearning = () => {
    if (allVocabulary.length === 0) {
       setFlashcards([
         { id: 998, word: "请", pronunciation: "qǐng", meaning: "Mời, xin hãy", example_sentence: "请进。", example_translation: "Mời vào.", interval: 0, ease_factor: 2.5 },
         { id: 999, word: "等", pronunciation: "děng", meaning: "Đợi", example_sentence: "请等一下。", example_translation: "Xin đợi một chút.", interval: 0, ease_factor: 2.5 }
       ]);
       setCurrentScreen('flashcard');
       if (learningMode === 'standard' || learningMode === 'listening') playAudio("请"); // Test đồng bộ
       return;
    }
    if (stats.reviewsToday > 100) return; 
    startSession(false);
  };

  const handleStartReview = () => {
    if (stats.reviewsToday === 0) return;
    startSession(true);
  };

  const handleEval = (gradeCode) => {
    const card = flashcards[currentCardIndex];
    
    // GỌI PHÁT ÂM ĐỒNG BỘ TRỰC TIẾP TRONG EVENT NHẤP CHUỘT
    if (currentCardIndex < flashcards.length - 1 && learningMode === 'standard') {
       playAudio(flashcards[currentCardIndex + 1].word);
    }

    let currentInterval = card.interval || 0;
    let currentEase = card.ease_factor || 2.5;
    let newInterval = currentInterval;
    let newEase = currentEase;

    if (gradeCode === 0) { 
      newInterval = 0;
      newEase = Math.max(1.3, currentEase - 0.2);
    } else if (gradeCode === 1) { 
      newInterval = currentInterval === 0 ? 1 : Math.round(currentInterval * 1.2);
      newEase = Math.max(1.3, currentEase - 0.15);
    } else if (gradeCode === 2) { 
      newInterval = currentInterval === 0 ? 1 : (currentInterval === 1 ? 6 : Math.round(currentInterval * currentEase));
    } else if (gradeCode === 3) { 
      newInterval = currentInterval === 0 ? 4 : Math.round(currentInterval * currentEase * 1.3);
      newEase = currentEase + 0.15;
    }

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + newInterval);

    const progressRecord = {
      user_id: userId,
      word_id: card.id,
      status: newInterval > 21 ? 'graduated' : (newInterval > 0 ? 'learning' : 'new'),
      next_review_date: nextReview.toISOString(),
      interval: newInterval,
      ease_factor: newEase,
      is_requeued: card.is_requeued 
    };

    const updatedProgressBatch = [...sessionProgressUpdates, progressRecord];
    setSessionProgressUpdates(updatedProgressBatch);

    const newMasteredCount = sessionMastered + (gradeCode >= 2 ? 1 : 0);
    let newFood = stats.petFood;
    if (gradeCode >= 2 && newMasteredCount % 3 === 0) { 
      newFood += 1;
    }

    if (currentCardIndex < flashcards.length - 1) {
      setSessionMastered(newMasteredCount);
      setStats(prev => ({ ...prev, petFood: newFood }));
      setCurrentCardIndex(prev => prev + 1);
      
      setIsFlipped(false);
      setTypingInput('');
      setTypingResult(null);
      setMistakeCount(0);
      setHasTypingMistake(false);
      setSelectedQuizOption(null);
      setShowKeyboard(false); 
    } else {
      setStats(prev => {
        const updatedStats = { 
          ...prev, petFood: newFood, totalStudied: prev.totalStudied + flashcards.length,
          totalMastered: prev.totalMastered + newMasteredCount, reviewsToday: Math.max(0, prev.reviewsToday - flashcards.length) 
        };
        syncStatsToCloud(updatedStats, updatedProgressBatch); 
        return updatedStats;
      });
      setCurrentScreen('summary');
    }
  };

  const flipCard = () => {
    if (!isFlipped) {
      playAudio(flashcards[currentCardIndex].word); 
      setIsFlipped(true);
    }
  };

  const normalizePinyin = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s/g, '');
  };

  const handleTypingSubmit = () => {
    if (!typingInput) return;
    const card = flashcards[currentCardIndex];
    playAudio(card.word); // ĐỒNG BỘ 

    const isExactMatch = typingInput.toLowerCase().replace(/\s/g, '') === card.pronunciation.toLowerCase().replace(/\s/g, '') || typingInput === card.word;
    const isTonelessMatch = normalizePinyin(typingInput) === normalizePinyin(card.pronunciation);
    const isCorrect = isExactMatch || isTonelessMatch;
    
    if (isCorrect) {
      setTypingResult('correct');
      setIsFlipped(true);
      setTimeout(() => {
        handleEval((hasTypingMistake || !isExactMatch) ? 1 : 2); 
      }, autoFlipDelay); 
    } else {
      const newMistakes = mistakeCount + 1;
      setMistakeCount(newMistakes);
      
      if (newMistakes >= 3) {
        setTypingResult('failed');
        setIsFlipped(true);
        setFlashcards(prev => [...prev, { ...card, is_requeued: true }]);
      } else {
        setHasTypingMistake(true);
        setTypingInput('');
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    }
  };

  const handleVisualSelect = (optId) => {
    playAudio(flashcards[currentCardIndex].word); // ĐỒNG BỘ
    setSelectedQuizOption(optId);
    const isCorrect = optId === flashcards[currentCardIndex].id;
    setIsFlipped(true);

    setTimeout(() => {
      handleEval(isCorrect ? 2 : 0);
    }, autoFlipDelay);
  };

  const insertPinyinChar = (char) => {
    setTypingInput(prev => prev + char);
    if (inputRef.current) inputRef.current.focus();
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#FFF9FB] dark:bg-[#050B14] flex flex-col items-center justify-center p-4 text-center">
        <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 text-pink-500 animate-spin mb-4" />
        <p className="text-pink-500 font-bold text-base sm:text-lg animate-pulse">Đang kết nối Đám mây Supabase...</p>
      </div>
    );
  }

  // ==========================================
  // RENDER: MÀN HÌNH FLASHCARD
  // ==========================================
  if (currentScreen === 'flashcard') {
    if (flashcards.length === 0) return <div className="dark:bg-[#050B14] dark:text-white min-h-screen z-10 relative flex items-center justify-center p-4">Không có dữ liệu!</div>;
    const card = flashcards[currentCardIndex];
    const progressPercent = ((currentCardIndex) / flashcards.length) * 100;

    const isAutoGradeMode = learningMode === 'typing' || learningMode === 'visual' || learningMode === 'listening';
    const showEvalButtons = isFlipped && (learningMode === 'standard' || typingResult === 'failed');

    return (
      <div className={`${isDarkMode ? 'dark' : ''}`}>
        <div className="min-h-screen bg-transparent flex flex-col font-sans relative transition-colors duration-500">
          <StarryNightBackground />
          <MorningAuraBackground />
          
          <div className="relative z-10 px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between text-slate-600 dark:text-white">
            <button onClick={() => setCurrentScreen('dashboard')} className="p-1.5 sm:p-2 hover:bg-white/50 dark:hover:bg-white/10 rounded-full transition"><ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" /></button>
            <div className="flex-1 mx-2 sm:mx-4">
              <div className="h-1.5 sm:h-2 bg-white/50 dark:bg-black/40 border border-white/20 dark:border-white/10 rounded-full overflow-hidden backdrop-blur-sm shadow-inner">
                <div className="h-full bg-gradient-to-r from-pink-400 to-rose-400 dark:from-white/40 dark:to-white/80 transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>
            
            <div className="flex items-center gap-1 bg-white/60 dark:bg-black/40 px-2 py-1 rounded-full shadow-sm border border-white/40 dark:border-white/10 backdrop-blur-sm">
              <span className="text-xs">🥟</span>
              <span className="text-xs font-bold text-pink-600 dark:text-white">{stats.petFood}</span>
            </div>
          </div>

          <div className="relative z-10 flex-1 flex flex-col justify-center px-4 pb-6 sm:pb-10 perspective-1000">
            <div 
              onClick={() => (!showEvalButtons && learningMode === 'standard' && !isFlipped) && flipCard()} 
              className={`relative w-full max-w-md mx-auto h-[60vh] min-h-[420px] max-h-[550px] sm:h-[65vh] sm:min-h-[480px] ${(!isAutoGradeMode && !isFlipped) ? 'cursor-pointer' : ''}`}
              style={{ perspective: '1000px' }}
            >
              <div className="w-full h-full absolute transition-all duration-700 ease-in-out" style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                
                {/* MẶT TRƯỚC */}
                <div className="absolute w-full h-full bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(244,114,182,0.15)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] p-5 sm:p-8 flex flex-col items-center justify-start sm:justify-center border border-white/60 dark:border-white/10 overflow-y-auto hide-scrollbar" style={{ backfaceVisibility: 'hidden' }}>
                  
                  {learningMode === 'visual' ? (
                    <div className="flex flex-col items-center text-center w-full h-full justify-center my-auto">
                      <div className="flex flex-col items-center w-full shrink-0">
                        <button onClick={(e) => { e.stopPropagation(); playAudio(card.word); }} className="mb-3 sm:mb-4 p-2 sm:p-3 bg-pink-100/50 dark:bg-white/10 text-pink-500 dark:text-white rounded-full hover:bg-pink-200/50 transition-transform shadow-inner">
                          <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white text-center mb-1 leading-tight">{card.meaning}</h2>
                        <p className="text-lg sm:text-xl text-pink-500 dark:text-white/80 font-medium">{card.pronunciation}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full mt-4 sm:mt-6 shrink-0 pb-2">
                        {quizOptions.map((opt, idx) => {
                          let btnClass = "bg-white/50 dark:bg-black/20 border-white/60 dark:border-white/10 text-slate-700 dark:text-white hover:bg-pink-50 dark:hover:bg-white/10";
                          return (
                            <button 
                              key={idx}
                              onClick={(e) => { e.stopPropagation(); handleVisualSelect(opt.id); }}
                              className={`text-2xl sm:text-3xl md:text-4xl font-bold py-5 sm:py-6 md:py-8 rounded-2xl border-2 transition-all backdrop-blur-sm shadow-sm active:scale-95 ${btnClass}`}
                            >
                              {opt.word}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (learningMode === 'typing' || learningMode === 'listening') ? (
                    <div className="flex flex-col items-center text-center w-full h-full justify-center relative pt-8 pb-4 my-auto">
                      
                      {/* Nút bật/tắt bàn phím Pinyin */}
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowKeyboard(!showKeyboard); }} 
                        className={`absolute top-0 right-0 p-1.5 sm:p-2 rounded-lg sm:rounded-xl border transition-all z-20 ${showKeyboard ? 'bg-pink-400 border-pink-500 text-white shadow-inner' : 'bg-white/50 dark:bg-white/10 border-white/60 dark:border-white/20 text-slate-500 dark:text-white/60 hover:bg-white/80 dark:hover:bg-white/20'}`}
                        title="Bàn phím Pinyin có dấu"
                      >
                        <Keyboard className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>

                      {learningMode === 'typing' && (
                        <h2 className={`text-2xl sm:text-3xl md:text-4xl font-black text-slate-800 dark:text-white leading-tight mt-4 transition-all shrink-0 ${showKeyboard ? 'mb-2' : 'mb-6 sm:mb-8'}`}>{card.meaning}</h2>
                      )}
                      {learningMode === 'listening' && (
                        <button onClick={(e) => { e.stopPropagation(); playAudio(card.word); }} className={`p-4 sm:p-6 md:p-8 bg-pink-100/50 dark:bg-white/10 text-pink-500 dark:text-white rounded-full hover:scale-110 transition-transform shadow-inner animate-pulse shrink-0 ${showKeyboard ? 'mb-2' : 'mb-4 sm:mb-6'}`}>
                          <Headphones className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16" />
                        </button>
                      )}
                      
                      <div className="w-full flex flex-col gap-2 sm:gap-3 shrink-0" onClick={e => e.stopPropagation()}>
                        <input 
                          ref={inputRef}
                          type="text" 
                          placeholder={hasTypingMistake ? `Gợi ý Pinyin: ${card.pronunciation}` : "Nhập Pinyin (hỗ trợ không dấu) hoặc Hán tự"}
                          className={`w-full bg-white/50 dark:bg-black/20 border-2 focus:outline-none transition-colors text-center text-base sm:text-lg md:text-xl font-medium rounded-xl px-3 py-3 sm:px-4 sm:py-4 text-slate-700 dark:text-white ${hasTypingMistake ? 'border-rose-400 dark:border-rose-500 placeholder-rose-400/70 dark:placeholder-rose-300/70 shake-animation bg-rose-50/50 dark:bg-rose-900/20' : 'border-white/60 focus:border-pink-400 dark:border-white/20 placeholder-slate-400 dark:placeholder-white/40'}`}
                          value={typingInput}
                          onChange={(e) => {
                            setTypingInput(e.target.value);
                            if (hasTypingMistake) setHasTypingMistake(false);
                          }}
                          onKeyDown={(e) => { if(e.key === 'Enter') handleTypingSubmit(); }}
                        />

                        {/* BÀN PHÍM PINYIN ẢO */}
                        {showKeyboard && (
                          <div className="w-full bg-white/80 dark:bg-black/40 backdrop-blur-md p-2 sm:p-3 rounded-xl border border-white/60 dark:border-white/10 shadow-lg flex flex-col gap-1 sm:gap-1.5">
                            <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 dark:text-white/50 text-left uppercase tracking-wider pl-1">Pinyin có dấu</p>
                            <div className="flex flex-col gap-1 sm:gap-1.5">
                              {PINYIN_KEYS.map((row, rIdx) => (
                                <div key={rIdx} className="flex justify-center gap-1 sm:gap-1.5">
                                  {row.map((char, cIdx) => (
                                    <button 
                                      key={cIdx} 
                                      onClick={() => insertPinyinChar(char)}
                                      className="flex-1 py-1.5 sm:py-2 bg-white dark:bg-white/10 border border-slate-200 dark:border-white/5 rounded-md sm:rounded-lg shadow-sm text-base sm:text-lg font-medium text-slate-700 dark:text-white hover:bg-pink-50 dark:hover:bg-white/20 active:scale-95 transition-all"
                                    >
                                      {char}
                                    </button>
                                  ))}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <button onClick={handleTypingSubmit} className="w-full mt-1 bg-gradient-to-r from-pink-400 to-rose-400 dark:bg-none dark:bg-white/20 text-white font-bold py-2.5 sm:py-3.5 rounded-xl shadow-md active:scale-95 transition-all text-sm sm:text-base">
                          Kiểm tra ({3 - mistakeCount} lần thử)
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="my-auto flex flex-col items-center">
                      <button onClick={(e) => { e.stopPropagation(); playAudio(card.word); }} className="mb-4 sm:mb-6 p-3 sm:p-4 bg-pink-100/50 dark:bg-white/10 text-pink-500 dark:text-white rounded-full hover:scale-110 transition-transform shadow-inner border border-white/50 dark:border-none">
                        <Volume2 className="w-6 h-6 sm:w-8 sm:h-8" />
                      </button>
                      <h2 className="text-5xl sm:text-6xl md:text-7xl font-black text-slate-800 dark:text-white text-center mb-2 sm:mb-3 dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] drop-shadow-sm leading-tight">{card.word}</h2>
                      {hidePinyin ? (
                        <p className="text-lg sm:text-xl text-slate-400 dark:text-white/40 font-medium tracking-widest">***</p>
                      ) : (
                        <p className="text-xl sm:text-2xl text-pink-500 dark:text-white/80 font-medium">{card.pronunciation}</p>
                      )}
                    </div>
                  )}
                  {(!showEvalButtons && learningMode === 'standard') && (
                    <div className="absolute bottom-4 sm:bottom-8 text-pink-400 dark:text-white/50 flex items-center gap-1.5 sm:gap-2 animate-bounce">
                      <RotateCw className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base font-semibold">Chạm để lật thẻ</span>
                    </div>
                  )}
                </div>

                {/* MẶT SAU (KẾT QUẢ) */}
                <div className="absolute w-full h-full bg-white/70 dark:bg-white/[0.05] backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(244,114,182,0.15)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] p-5 sm:p-8 flex flex-col border border-white/60 dark:border-white/10 overflow-y-auto hide-scrollbar" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>

                  <div className="flex justify-between items-start mb-3 sm:mb-4 border-b border-pink-100/50 dark:border-white/10 pb-2 sm:pb-3 shrink-0">
                    <div>
                      <h2 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white mb-0.5 sm:mb-1 drop-shadow-sm">{card.word}</h2>
                      <p className="text-base sm:text-lg text-pink-500 dark:text-white/80">{card.pronunciation}</p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); playAudio(card.word); }} className="p-2 sm:p-3 bg-pink-100/50 dark:bg-white/10 rounded-full text-pink-500 dark:text-white hover:bg-pink-200/50 transition-colors border border-white/50 dark:border-none">
                      <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </div>
                  <div className="flex-1 shrink-0 pb-4">
                    <div className="mb-4 sm:mb-5">
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-rose-500 dark:text-white/50 mb-1 block">Ý Nghĩa</span>
                      <p className="text-xl sm:text-2xl font-bold text-slate-700 dark:text-white leading-tight">{card.meaning}</p>
                      
                      {/* Phản hồi Auto-grade */}
                      {(learningMode === 'typing' || learningMode === 'listening') && typingResult && (
                        <div className={`mt-3 sm:mt-4 p-3 sm:p-4 rounded-xl border-2 backdrop-blur-sm ${typingResult === 'correct' ? 'bg-emerald-100/80 border-emerald-400 text-emerald-800 dark:bg-emerald-900/40 dark:border-emerald-500/50 dark:text-emerald-300' : 'bg-rose-100/80 border-rose-400 text-rose-800 dark:bg-rose-900/40 dark:border-rose-500/50 dark:text-rose-300'}`}>
                          <span className="text-[9px] sm:text-[10px] uppercase font-bold block mb-1">Thành tích của Na:</span>
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            {typingResult === 'correct' ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <Flame className="w-4 h-4 sm:w-5 sm:h-5" />}
                            <span className="font-bold text-base sm:text-lg">{typingInput || 'Bỏ cuộc'}</span>
                          </div>
                          <p className="text-xs sm:text-sm font-medium mt-1 opacity-80 leading-snug">
                            {typingResult === 'failed' ? 'Sai 3 lần rồi! Từ này đã bị tống xuống cuối bài học. Nhớ kỹ nhé!' : (mistakeCount > 0 ? `Gõ không dấu / Phải gõ lại. Tự lật sau ${autoFlipDelay/1000}s...` : `Tuyệt cú mèo! Tự lật sau ${autoFlipDelay/1000}s...`)}
                          </p>
                        </div>
                      )}

                      {/* Phản hồi Auto-grade cho Visual */}
                      {learningMode === 'visual' && selectedQuizOption !== null && (
                        <div className={`mt-3 sm:mt-4 p-3 sm:p-4 rounded-xl border-2 backdrop-blur-sm ${selectedQuizOption === card.id ? 'bg-emerald-100/80 border-emerald-400 text-emerald-800 dark:bg-emerald-900/40 dark:border-emerald-500/50 dark:text-emerald-300' : 'bg-rose-100/80 border-rose-400 text-rose-800 dark:bg-rose-900/40 dark:border-rose-500/50 dark:text-rose-300'}`}>
                          <span className="text-[9px] sm:text-[10px] uppercase font-bold block mb-1">Na đã chọn chữ này:</span>
                          <span className="font-bold text-2xl sm:text-3xl block mb-1">
                            {quizOptions.find(o => o.id === selectedQuizOption)?.word || '???'}
                          </span>
                          <p className="text-xs sm:text-sm font-medium mt-1 opacity-80 leading-snug">
                            {selectedQuizOption === card.id ? `✅ Chính xác tuyệt đối! Tự lật sau ${autoFlipDelay/1000}s...` : '❌ Sai mất rồi! Chữ Hán nhìn rất giống nhau. Tự phạt bên dưới!'}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="bg-white/50 dark:bg-none dark:bg-black/20 p-3 sm:p-4 rounded-xl border border-white/60 dark:border-white/10 relative backdrop-blur-sm shadow-sm dark:shadow-none">
                      <button onClick={(e) => { e.stopPropagation(); playAudio(card.example_sentence); }} className="absolute right-2 top-2 p-1.5 bg-white/80 dark:bg-white/10 shadow-sm rounded-md text-pink-500 dark:text-white/80">
                        <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-pink-500 dark:text-white/50 mb-1.5 sm:mb-2 block">Ví dụ (例句)</span>
                      <p className="text-slate-800 dark:text-white/90 font-medium mb-1.5 sm:mb-2 pr-5 sm:pr-6 leading-relaxed text-base sm:text-lg">{card.example_sentence}</p>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-white/60 italic border-t border-pink-200/30 dark:border-white/10 pt-1.5 sm:pt-2 leading-relaxed">{card.example_translation}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CHỈ HIỂN THỊ NÚT ĐÁNH GIÁ KHI HỌC TIÊU CHUẨN HOẶC BỊ PHẠT DO SAI */}
          {showEvalButtons && (
            <div className={`relative z-10 px-3 sm:px-4 pb-6 sm:pb-8 max-w-md mx-auto w-full transition-opacity duration-300 ${isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                <button onClick={(e) => { e.stopPropagation(); handleEval(0); }} className="bg-slate-500/80 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 hover:bg-slate-600 dark:hover:bg-white/10 text-white rounded-xl py-2.5 sm:py-3 flex flex-col items-center shadow-md active:translate-y-1 transition-all">
                  <span className="text-[9px] sm:text-[10px] text-slate-200 dark:text-white/50 font-semibold mb-0.5 sm:mb-1">Quên</span>
                  <span className="font-bold text-xs sm:text-sm">Lại</span>
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleEval(1); }} className="bg-amber-400/80 dark:bg-amber-500/20 backdrop-blur-md border border-white/20 dark:border-amber-400/30 hover:bg-amber-500 dark:hover:bg-amber-500/40 text-white rounded-xl py-2.5 sm:py-3 flex flex-col items-center shadow-md active:translate-y-1 transition-all">
                  <span className="text-[9px] sm:text-[10px] text-amber-100 dark:text-amber-200 font-semibold mb-0.5 sm:mb-1">Hơi quen</span>
                  <span className="font-bold text-xs sm:text-sm">Khó</span>
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleEval(2); }} className="bg-pink-400/80 dark:bg-white/20 backdrop-blur-md border border-white/20 dark:border-white/30 hover:bg-pink-500 dark:hover:bg-white/30 text-white rounded-xl py-2.5 sm:py-3 flex flex-col items-center shadow-md active:translate-y-1 transition-all">
                  <span className="text-[9px] sm:text-[10px] text-pink-100 dark:text-white/80 font-semibold mb-0.5 sm:mb-1">Nhớ</span>
                  <span className="font-bold text-xs sm:text-sm">Tốt</span>
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleEval(3); }} className="bg-emerald-400/80 dark:bg-green-500/20 backdrop-blur-md border border-white/20 dark:border-green-400/30 hover:bg-emerald-500 dark:hover:bg-green-500/40 text-white rounded-xl py-2.5 sm:py-3 flex flex-col items-center shadow-md active:translate-y-1 transition-all">
                  <span className="text-[9px] sm:text-[10px] text-emerald-100 dark:text-green-200 font-semibold mb-0.5 sm:mb-1">Quá dễ</span>
                  <span className="font-bold text-xs sm:text-sm">Dễ</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: MÀN HÌNH TỔNG KẾT
  // ==========================================
  if (currentScreen === 'summary') {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
        <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-4 relative transition-colors duration-500">
          <StarryNightBackground />
          <MorningAuraBackground />
          <div className="relative z-10 flex flex-col items-center bg-white/40 dark:bg-transparent backdrop-blur-md p-6 sm:p-10 rounded-3xl border border-white/50 dark:border-none shadow-xl dark:shadow-none w-full max-w-sm sm:max-w-md text-center">
            <div className="relative">
              <Trophy className="w-20 h-20 sm:w-24 sm:h-24 text-pink-500 dark:text-yellow-400 mb-4 sm:mb-6 animate-bounce relative z-10 dark:drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]" />
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500 absolute -top-2 -right-4 animate-pulse" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white mb-2">Giỏi quá Na ơi! 🎉</h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-white/80 mb-6 sm:mb-8">Tiến độ hôm nay đã được Na lưu an toàn lên Đám mây rồi!</p>
            <button onClick={() => setCurrentScreen('dashboard')} className="w-full sm:w-auto bg-gradient-to-r from-pink-400 to-rose-400 dark:bg-none dark:bg-white/10 dark:backdrop-blur-md dark:border dark:border-white/20 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg shadow-xl shadow-pink-200 dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:opacity-90 dark:hover:bg-white/20 active:scale-95 transition-all">
              Về cho Pet ăn thôi
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: DASHBOARD CHÍNH
  // ==========================================
  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-transparent font-sans text-slate-800 dark:text-slate-200 pb-16 sm:pb-24 transition-colors duration-500 relative">
        <StarryNightBackground />
        <MorningAuraBackground />
        
        {/* HIỂN THỊ THÔNG BÁO TOAST THÔNG MINH */}
        {toastMessage && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-slate-800 dark:bg-pink-500 text-white px-6 py-3 rounded-full shadow-2xl animate-bounce text-sm font-bold text-center w-max max-w-[90vw] border border-white/20">
            {toastMessage}
          </div>
        )}

        {/* MODAL CÀI ĐẶT ĐƯỢC MỞ RỘNG */}
        {isSettingsOpen && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#131A33] rounded-3xl p-5 sm:p-6 w-full max-w-xs sm:max-w-sm shadow-2xl border border-white/50 dark:border-white/10 relative transform transition-all max-h-[90vh] overflow-y-auto hide-scrollbar">
              <button onClick={() => setIsSettingsOpen(false)} className="absolute top-3 sm:top-4 right-3 sm:right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors p-2">
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mb-4 sm:mb-6 flex items-center gap-2 sticky top-0 bg-white dark:bg-[#131A33] z-10 py-2">
                <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500" /> Cài đặt Học tập
              </h2>
              
              <div className="space-y-5 sm:space-y-6">
                {/* 1. THỜI GIAN LẬT THẺ */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-600 dark:text-white/80 mb-2 sm:mb-3">Thời gian lật thẻ (sau khi đúng)</label>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {[1000, 1500, 2500, 4000].map(delay => (
                      <button 
                        key={delay}
                        onClick={() => setAutoFlipDelay(delay)}
                        className={`py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold border-2 transition-all ${autoFlipDelay === delay ? 'bg-pink-100 border-pink-500 text-pink-600 dark:bg-pink-500/20 dark:border-pink-400 dark:text-white' : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-white/5 dark:border-white/10 dark:text-white/50 hover:border-pink-300'}`}
                      >
                        {delay / 1000} giây
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. TỐC ĐỘ AUDIO */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-600 dark:text-white/80 mb-2 sm:mb-3">Tốc độ đọc phát âm (Audio)</label>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {[{label: 'Chậm', val: 0.6}, {label: 'Chuẩn', val: 0.85}, {label: 'Nhanh', val: 1.2}].map(spd => (
                      <button 
                        key={spd.val}
                        onClick={() => {
                          setAudioSpeed(spd.val);
                          if(window.speechSynthesis){
                            window.speechSynthesis.cancel();
                            const u = new SpeechSynthesisUtterance('你好，我学汉语');
                            u.lang='zh-CN'; u.rate=spd.val;
                            window.speechSynthesis.speak(u);
                          }
                        }}
                        className={`py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold border-2 transition-all ${audioSpeed === spd.val ? 'bg-indigo-100 border-indigo-500 text-indigo-600 dark:bg-indigo-500/20 dark:border-indigo-400 dark:text-white' : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-white/5 dark:border-white/10 dark:text-white/50 hover:border-indigo-300'}`}
                      >
                        {spd.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. MỤC TIÊU HỌC TẬP */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-600 dark:text-white/80 mb-2 sm:mb-3">Mục tiêu học từ vựng (Nhóm)</label>
                  <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                    {[15, 30, 50, 100].map(goal => (
                      <button 
                        key={goal}
                        onClick={() => setDailyGoal(goal)}
                        className={`py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold border-2 transition-all ${dailyGoal === goal ? 'bg-emerald-100 border-emerald-500 text-emerald-600 dark:bg-emerald-500/20 dark:border-emerald-400 dark:text-white' : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-white/5 dark:border-white/10 dark:text-white/50 hover:border-emerald-300'}`}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                  <p className="text-[9px] sm:text-[10px] text-slate-400 dark:text-white/40 mt-2 sm:mt-3 text-center leading-relaxed">Giao diện sẽ hiển thị tiến độ phân số dựa trên mục tiêu này.</p>
                </div>
              </div>

              <button onClick={() => setIsSettingsOpen(false)} className="w-full mt-6 py-3 sm:py-4 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-xl font-bold text-sm sm:text-base shadow-lg active:scale-95 transition-transform">
                Lưu & Đóng
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="relative z-50 bg-white/50 dark:bg-white/[0.02] backdrop-blur-xl sticky top-0 border-b border-white/50 dark:border-white/10 px-3 sm:px-4 py-3 sm:py-4 flex justify-between items-center transition-all shadow-sm dark:shadow-none">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-pink-400 to-rose-400 dark:from-white/20 dark:to-white/5 p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-sm shadow-pink-200 dark:shadow-none dark:border dark:border-white/10">
              <Heart className="w-4 h-4 sm:w-5 sm:h-6 text-white fill-white" />
            </div>
            <span className="font-extrabold text-base sm:text-lg md:text-xl text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-500 dark:text-white dark:bg-none tracking-tight drop-shadow-sm">Na HSK3</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-3">
            <button 
              onClick={() => setIsSettingsOpen(true)} 
              className="p-1.5 sm:p-2 rounded-full bg-white/60 dark:bg-white/10 text-slate-500 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-white/20 transition-colors border border-white/50 dark:border-white/10 shadow-sm backdrop-blur-md"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className="p-1.5 sm:p-2 rounded-full bg-white/60 dark:bg-white/10 text-pink-500 dark:text-yellow-300 hover:bg-white/80 dark:hover:bg-white/20 transition-colors border border-white/50 dark:border-white/10 shadow-sm backdrop-blur-md"
            >
              {isDarkMode ? <CloudMoon className="w-4 h-4 sm:w-5 sm:h-5" /> : <Sun className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            <div className="flex items-center gap-1 sm:gap-1.5 bg-white/60 dark:bg-white/10 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/50 dark:border-white/10 transition-all duration-500 shadow-sm">
              <Flame className={`w-3 h-3 sm:w-4 sm:h-5 ${hasCheckedIn ? 'text-rose-500 fill-rose-500 animate-pulse' : 'text-pink-400 dark:text-orange-400 fill-pink-400 dark:fill-orange-400'}`} />
              <span className="font-bold text-xs sm:text-sm md:text-base text-pink-600 dark:text-white">{stats.streakDays}</span>
            </div>
          </div>
        </header>

        {/* THÔNG BÁO LƯU Ý CHO NGƯỜI DÙNG IPHONE */}
        <div className="max-w-2xl mx-auto px-3 mt-3">
          <div className="bg-pink-50/80 dark:bg-pink-950/20 border border-pink-100 dark:border-pink-900/30 rounded-xl p-3 text-xs text-pink-700 dark:text-pink-300 flex items-center gap-2">
            <span>💡</span>
            <p className="leading-relaxed">
              <strong>Lưu ý cho iPhone:</strong> Đảm bảo bạn <strong>không gạt nút Im lặng vật lý</strong> ở sườn máy (Silent Switch) về màu cam để trình duyệt được phép phát âm thanh nhé!
            </p>
          </div>
        </div>

        <main className="relative z-10 max-w-2xl mx-auto px-3 sm:px-4 mt-1 sm:mt-2 space-y-4 sm:space-y-6 md:space-y-8">
          
          <div className="bg-white/40 dark:bg-white/5 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-sm shadow-pink-100/30 dark:shadow-none border border-white/50 dark:border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-pink-300/20 dark:bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <div className="flex items-center gap-2">
                <span className="bg-white/60 dark:bg-white/20 text-pink-600 dark:text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg border border-white/50 dark:border-white/10 shadow-sm">Cấp {stats.petLevel}</span>
                <h3 className="font-bold text-sm sm:text-base text-slate-700 dark:text-white drop-shadow-sm">Góc Bảo Bối</h3>
              </div>
              <div className="flex gap-2">
                <div className="bg-white/60 dark:bg-black/40 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-inner border border-white/50 dark:border-white/10 flex items-center gap-1 sm:gap-1.5">
                  <span className="text-xs sm:text-sm">🥟</span>
                  <span className="font-bold text-pink-600 dark:text-white text-xs sm:text-sm">{stats.petFood}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="relative shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-white/50 dark:bg-black/30 backdrop-blur-md rounded-full shadow-inner border-2 border-white dark:border-white/10 flex items-center justify-center text-4xl sm:text-5xl md:text-6xl overflow-hidden transition-transform duration-300">
                  <div className={`transition-transform duration-300 ${petMood === 'happy' ? 'scale-125 -translate-y-2' : ''}`}>{getPetAvatar()}</div>
                </div>
                {petMood === 'eating' && <div className="absolute top-0 right-0 animate-ping text-lg sm:text-xl">✨</div>}
                {!hasCheckedIn && petMood === 'normal' && <div className="absolute -bottom-1.5 sm:-bottom-2 -right-1.5 sm:-right-2 bg-white/80 dark:bg-black/60 backdrop-blur-sm text-pink-500 dark:text-white text-[8px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border border-white/50 dark:border-white/20 shadow-sm animate-bounce">Đói quá! 😿</div>}
              </div>

              <div className="flex-1 ml-3 sm:ml-4 md:ml-6 flex flex-col justify-center min-w-0">
                <button onClick={handleFeedPet} disabled={stats.petFood === 0} className={`w-full py-2.5 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm md:text-base flex items-center justify-center gap-1.5 sm:gap-2 transition-all shadow-md border ${stats.petFood > 0 ? 'bg-gradient-to-r from-pink-400 to-rose-400 dark:from-white/20 dark:to-white/10 dark:backdrop-blur-md text-white hover:opacity-90 active:scale-95 border-white/50 dark:border-white/20 cursor-pointer' : 'bg-white/40 dark:bg-white/5 text-slate-400 dark:text-white/40 border-white/50 dark:border-white/5 cursor-not-allowed'}`}>
                  <Cookie className={`w-4 h-4 sm:w-5 sm:h-5 ${stats.petFood > 0 ? 'fill-current' : ''}`} />
                  <span className="truncate">{stats.petFood > 0 ? 'Cho ăn ngay' : 'Hết Bánh Bao'}</span>
                </button>
                <div className="mt-2 sm:mt-3">
                  <div className="flex justify-between text-[9px] sm:text-[10px] md:text-xs font-bold text-slate-500 dark:text-white/50 mb-1 px-1">
                    <span>EXP</span><span>{stats.petExp} / 100</span>
                  </div>
                  <div className="w-full bg-white/50 dark:bg-black/40 rounded-full h-1.5 sm:h-2 shadow-inner border border-white/30 dark:border-white/5">
                    <div className="bg-pink-400 dark:bg-white/70 h-1.5 sm:h-2 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(244,114,182,0.5)] dark:shadow-[0_0_8px_rgba(255,255,255,0.3)]" style={{ width: `${stats.petExp}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
            <div className="bg-gradient-to-br from-rose-400/90 to-orange-400/90 dark:from-rose-600/80 dark:to-orange-600/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-lg shadow-rose-200/50 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] text-white relative overflow-hidden border border-white/50 dark:border-white/10">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 sm:-mr-10 sm:-mt-10 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white opacity-20 blur-xl sm:blur-2xl pointer-events-none"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="flex justify-between items-start mb-1.5 sm:mb-2">
                    <span className="bg-white/30 dark:bg-black/20 backdrop-blur-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] md:text-xs font-bold tracking-wider uppercase inline-flex items-center gap-1 border border-white/30 dark:border-white/10">
                      <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Ưu tiên 1
                    </span>
                    {stats.reviewsToday > 100 && (
                      <span className="bg-red-500/90 dark:bg-red-500/80 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[9px] sm:text-[10px] font-bold animate-pulse shadow-sm border border-red-300/50">Quá tải!</span>
                    )}
                  </div>
                  <div className="mt-1.5 sm:mt-2 mb-3 sm:mb-4">
                    <h2 className="text-3xl sm:text-4xl font-extrabold mb-0.5 sm:mb-1 drop-shadow-md leading-none">{stats.reviewsToday} Từ</h2>
                    <p className="text-rose-100 dark:text-white/80 text-xs sm:text-sm font-medium leading-snug">sắp quên cần ôn lại ngay</p>
                  </div>
                </div>
                <button 
                  onClick={handleStartReview}
                  disabled={stats.reviewsToday === 0}
                  className="w-full bg-white/90 dark:bg-white/10 dark:backdrop-blur-md text-rose-600 dark:text-white font-bold py-3 sm:py-4 rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-white dark:hover:bg-white/20 transition-all active:scale-95 shadow-md disabled:opacity-50 border border-white/50 dark:border-white/20 dark:shadow-none mt-1 sm:mt-2 text-sm sm:text-base"
                >
                  <BrainCircuit className="w-4 h-4 sm:w-5 sm:h-5 dark:text-white" />
                  {stats.reviewsToday === 0 ? 'Đã ôn xong!' : 'ÔN TẬP NGAY'}
                </button>
              </div>
            </div>

            <div className={`rounded-2xl sm:rounded-3xl p-4 sm:p-5 relative overflow-hidden transition-all duration-300 ${
              stats.reviewsToday > 100 
                ? 'bg-white/30 dark:bg-white/5 backdrop-blur-md border border-white/50 dark:border-white/10 shadow-sm opacity-80' 
                : 'bg-white/40 dark:bg-white/10 backdrop-blur-xl border border-white/60 dark:border-white/20 shadow-md sm:shadow-lg shadow-pink-100/50 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]'
            }`}>
              <div className="relative z-10 flex flex-col h-full justify-between text-slate-800 dark:text-white">
                <div>
                  <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] md:text-xs font-bold tracking-wider uppercase inline-block mb-1.5 sm:mb-2 border ${
                    stats.reviewsToday > 100 
                      ? 'bg-white/40 dark:bg-black/30 text-slate-500 dark:text-white/40 border-white/50 dark:border-white/5' 
                      : 'bg-white/60 dark:bg-white/10 backdrop-blur-sm text-pink-600 dark:text-white/90 border-white/50 dark:border-white/20'
                  }`}>
                    Bước 2: Học ({activeGroup?.name?.split(' ')[1] || '...'})
                  </span>
                  <div className="mt-1.5 sm:mt-2 mb-3 sm:mb-4">
                    <h2 className={`text-3xl sm:text-4xl font-extrabold mb-0.5 sm:mb-1 drop-shadow-sm leading-none ${stats.reviewsToday > 100 ? 'text-slate-400 dark:text-white/30' : 'text-slate-800 dark:text-white'}`}>
                      {isLoading ? '...' : flashcards.length} <span className="text-base sm:text-lg font-medium opacity-80">/ {dailyGoal}</span>
                    </h2>
                    <p className={`text-xs sm:text-sm font-medium leading-snug ${stats.reviewsToday > 100 ? 'text-slate-400 dark:text-white/30' : 'text-pink-600 dark:text-white/70'}`}>
                      từ mới phiên tiếp theo
                    </p>
                  </div>
                </div>

                {stats.reviewsToday > 100 ? (
                  <button disabled className="w-full bg-white/50 dark:bg-black/20 text-slate-400 dark:text-white/30 font-bold py-3 sm:py-4 rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 cursor-not-allowed border border-white/50 dark:border-white/5 mt-1 sm:mt-2 text-sm sm:text-base">
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5" /> Hãy ôn tập trước!
                  </button>
                ) : (
                  <button 
                    onClick={handleStartLearning}
                    disabled={isLoading}
                    className="w-full bg-white/80 dark:bg-[#0B1021]/40 dark:backdrop-blur-md text-pink-600 dark:text-white font-bold py-3 sm:py-4 rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-white dark:hover:bg-[#0B1021]/60 transition-all active:scale-95 shadow-md disabled:opacity-70 border border-white dark:border-white/10 dark:shadow-none mt-1 sm:mt-2 text-sm sm:text-base"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-pink-500 dark:text-white" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-pink-500 dark:fill-white" />}
                    {isLoading ? 'Đang chuẩn bị...' : 'BẮT ĐẦU HỌC'}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white/60 dark:bg-white/5 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm shadow-pink-100/30 dark:shadow-none border border-white/50 dark:border-white/10">
            <h3 className="font-bold text-base sm:text-lg flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 text-slate-700 dark:text-white">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500 dark:text-white/80" /> Chế độ học
            </h3>
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mb-3 sm:mb-4">
              <button onClick={() => setLearningMode('standard')} className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl border flex flex-col items-center justify-center gap-1 sm:gap-2 transition-all backdrop-blur-sm ${learningMode === 'standard' ? 'bg-white/80 dark:bg-white/20 border-pink-300 dark:border-white/30 text-pink-600 dark:text-white shadow-sm ring-1 ring-pink-300 dark:ring-white/30' : 'bg-white/40 dark:bg-black/20 border-white/50 dark:border-white/5 text-slate-500 dark:text-white/50 hover:bg-white/60 dark:hover:bg-white/10'}`}>
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-center">Tiêu chuẩn</span>
              </button>
              <button onClick={() => setLearningMode('listening')} className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl border flex flex-col items-center justify-center gap-1 sm:gap-2 transition-all backdrop-blur-sm ${learningMode === 'listening' ? 'bg-white/80 dark:bg-white/20 border-pink-300 dark:border-white/30 text-pink-600 dark:text-white shadow-sm ring-1 ring-pink-300 dark:ring-white/30' : 'bg-white/40 dark:bg-black/20 border-white/50 dark:border-white/5 text-slate-500 dark:text-white/50 hover:bg-white/60 dark:hover:bg-white/10'}`}>
                <Headphones className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-center">Nghe</span>
              </button>
              <button onClick={() => setLearningMode('typing')} className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl border flex flex-col items-center justify-center gap-1 sm:gap-2 transition-all backdrop-blur-sm ${learningMode === 'typing' ? 'bg-white/80 dark:bg-white/20 border-pink-300 dark:border-white/30 text-pink-600 dark:text-white shadow-sm ring-1 ring-pink-300 dark:ring-white/30' : 'bg-white/40 dark:bg-black/20 border-white/50 dark:border-white/5 text-slate-500 dark:text-white/50 hover:bg-white/60 dark:hover:bg-white/10'}`}>
                <Keyboard className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-center">Gõ</span>
              </button>
              <button onClick={() => setLearningMode('visual')} className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl border flex flex-col items-center justify-center gap-1 sm:gap-2 transition-all backdrop-blur-sm ${learningMode === 'visual' ? 'bg-white/80 dark:bg-white/20 border-pink-300 dark:border-white/30 text-pink-600 dark:text-white shadow-sm ring-1 ring-pink-300 dark:ring-white/30' : 'bg-white/40 dark:bg-black/20 border-white/50 dark:border-white/5 text-slate-500 dark:text-white/50 hover:bg-white/60 dark:hover:bg-white/10'}`}>
                <ScanSearch className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-center">Mắt</span>
              </button>
            </div>
            <div className="flex items-center justify-between p-2.5 sm:p-3 bg-white/40 dark:bg-black/30 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/50 dark:border-white/5 shadow-inner dark:shadow-none">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className={`p-1.5 sm:p-2 rounded-md sm:rounded-lg transition-colors border border-white/50 dark:border-none ${hidePinyin ? 'bg-pink-400 dark:bg-white/20 text-white shadow-sm dark:shadow-[0_0_10px_rgba(255,255,255,0.1)]' : 'bg-white/80 dark:bg-black/50 text-pink-400 dark:text-white/50'}`}>
                  {hidePinyin ? <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" /> : <Eye className="w-3 h-3 sm:w-4 sm:h-4" />}
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-white">Mù chữ (Ẩn Pinyin)</p>
                  <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-white/50">Giúp quen mặt Hán tự</p>
                </div>
              </div>
              <button onClick={() => setHidePinyin(!hidePinyin)} className={`w-10 sm:w-12 h-5 sm:h-6 rounded-full transition-colors relative flex items-center shadow-inner ${hidePinyin ? 'bg-pink-400 dark:bg-white/40' : 'bg-white/60 dark:bg-black/50'}`}>
                <div className={`w-3.5 sm:w-4 h-3.5 sm:h-4 bg-white rounded-full shadow-sm transition-transform absolute ${hidePinyin ? 'translate-x-6 sm:translate-x-7' : 'translate-x-0.5 sm:translate-x-1'}`}></div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md p-2.5 sm:p-3 rounded-xl sm:rounded-2xl shadow-sm shadow-pink-100/30 dark:shadow-none border border-white/50 dark:border-white/10 flex flex-col items-center text-center">
              <span className="text-xl sm:text-2xl font-bold text-slate-700 dark:text-white">{stats.totalStudied}</span>
              <span className="text-[9px] sm:text-[10px] text-slate-600 dark:text-white/60 font-medium">Từ đã lật</span>
            </div>
            <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md p-2.5 sm:p-3 rounded-xl sm:rounded-2xl shadow-sm shadow-pink-100/30 dark:shadow-none border border-white/50 dark:border-white/10 flex flex-col items-center text-center">
              <span className="text-xl sm:text-2xl font-bold text-pink-600 dark:text-white">{stats.totalMastered}</span>
              <span className="text-[9px] sm:text-[10px] text-slate-600 dark:text-white/60 font-medium">Từ đã thuộc</span>
            </div>
            <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md p-2.5 sm:p-3 rounded-xl sm:rounded-2xl shadow-sm shadow-pink-100/30 dark:shadow-none border border-white/50 dark:border-white/10 flex flex-col items-center text-center">
              <span className="text-xl sm:text-2xl font-bold text-rose-500 dark:text-white">{stats.totalStudied === 0 ? 0 : Math.round((stats.totalMastered / stats.totalStudied) * 100)}%</span>
              <span className="text-[9px] sm:text-[10px] text-slate-600 dark:text-white/60 font-medium">Độ nhớ bài</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="font-bold text-base sm:text-lg flex items-center gap-1.5 sm:gap-2 text-slate-700 dark:text-white">
                <WholeWord className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500 dark:text-white/80" /> Các nhóm từ vựng
              </h3>
            </div>
            <div className="space-y-2.5 sm:space-y-3">
              {alphabetGroups.map(group => {
                const isCompleted = group.learned >= group.total && group.total > 0;
                const progressPercent = group.total > 0 ? Math.min((group.learned / group.total) * 100, 100) : 0;
                return (
                  <div key={group.id} onClick={() => handleSelectGroup(group.id)} className={`bg-white/60 dark:bg-white/5 backdrop-blur-md p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all cursor-pointer active:scale-[0.98] ${group.active ? 'border-pink-300 dark:border-white/30 shadow-md shadow-pink-200/50 dark:shadow-[0_0_15px_rgba(255,255,255,0.05)] ring-2 ring-pink-100 dark:ring-white/10 transform scale-[1.02]' : 'border-white/50 dark:border-transparent hover:border-pink-200 dark:hover:border-white/20 hover:bg-white/80'}`}>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl shrink-0 transition-colors border border-white/50 dark:border-none ${isCompleted ? 'bg-pink-100 dark:bg-green-500/20 text-pink-600 dark:text-green-400' : 'bg-white/60 dark:bg-white/10 text-pink-400 dark:text-white/70'}`}>
                        {isCompleted ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <WholeWord className="w-4 h-4 sm:w-5 sm:h-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1 sm:mb-1.5">
                          <h4 className="font-bold text-xs sm:text-sm md:text-base text-slate-800 dark:text-white flex items-center gap-1.5 sm:gap-2 truncate pr-2">
                            {group.name}
                            {group.active && <span className="shrink-0 text-[8px] sm:text-[9px] md:text-[10px] font-bold bg-pink-100 dark:bg-white/20 text-pink-600 dark:text-white px-1.5 py-0.5 rounded-full uppercase tracking-wider border border-white/50 dark:border-white/20 shadow-sm dark:shadow-none">Đang chọn</span>}
                          </h4>
                          <span className="text-[10px] sm:text-[11px] md:text-xs font-bold text-slate-500 dark:text-white/60 shrink-0">{group.learned}/{group.total}</span>
                        </div>
                        <div className="w-full bg-white/50 dark:bg-black/40 rounded-full h-1.5 sm:h-2 shadow-inner dark:shadow-none">
                          <div className={`h-1.5 sm:h-2 rounded-full transition-all duration-1000 ${isCompleted ? 'bg-pink-500 dark:bg-green-400' : 'bg-gradient-to-r from-pink-300 to-pink-400 dark:bg-white/60'}`} style={{ width: `${progressPercent}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pb-4 sm:pb-8">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="font-bold text-base sm:text-lg flex items-center gap-1.5 sm:gap-2 text-slate-700 dark:text-white">
                <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500 dark:text-white/80" /> Góc tự thưởng
              </h3>
            </div>
            <div className="space-y-2.5 sm:space-y-3">
              {REWARDS.map(reward => {
                const isCompleted = reward.current >= reward.target;
                const progressPercent = Math.min((reward.current / reward.target) * 100, 100);
                const Icon = reward.icon;
                return (
                  <div key={reward.id} className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all backdrop-blur-md ${isCompleted ? 'bg-white/80 dark:bg-white/10 border-pink-300 dark:border-white/30 shadow-md dark:shadow-[0_0_15px_rgba(255,255,255,0.05)]' : 'bg-white/40 dark:bg-white/5 border-white/50 dark:border-white/10 opacity-80'}`}>
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl shrink-0 transition-colors border border-white/50 dark:border-none ${isCompleted ? reward.bgColor : 'bg-white/60 dark:bg-black/20'}`}>
                        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${isCompleted ? reward.color : 'text-slate-400 dark:text-white/30'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5 sm:mb-1">
                          <h4 className={`font-bold text-sm sm:text-base ${isCompleted ? 'text-slate-800 dark:text-white' : 'text-slate-600 dark:text-white/50'}`}>
                            {reward.title}
                          </h4>
                          {isCompleted ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 dark:text-green-400 shrink-0" /> : <Lock className="w-3 h-3 sm:w-4 h-4 text-slate-400 dark:text-white/30 shrink-0 mt-0.5" />}
                        </div>
                        <p className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-white/60 mb-1.5 sm:mb-2">{reward.condition}</p>
                        <div className={`inline-block px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg text-[10px] sm:text-sm font-semibold mb-2 sm:mb-3 border ${isCompleted ? 'bg-white/90 dark:bg-black/30 text-pink-600 dark:text-white border-pink-100 dark:border-white/10 shadow-sm' : 'bg-white/40 dark:bg-black/20 text-slate-500 dark:text-white/50 border-white/50 dark:border-white/5'}`}>
                          🎁 {reward.rewardItem}
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="flex-1 bg-white/50 dark:bg-black/40 rounded-full h-1.5 sm:h-2 shadow-inner dark:shadow-none">
                            <div className={`h-1.5 sm:h-2 rounded-full transition-all duration-1000 ${isCompleted ? 'bg-pink-500 dark:bg-green-400' : 'bg-gradient-to-r from-pink-300 to-pink-400 dark:bg-white/60'}`} style={{ width: `${progressPercent}%` }}></div>
                          </div>
                          <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-white/50 shrink-0 w-8 sm:w-12 text-right">
                            {reward.current}/{reward.target}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}