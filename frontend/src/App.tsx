import { useState, useEffect, useRef } from 'react';
import './App.css';
import { GetPrayerTimes, SendNotification, GetQuranSurahs, GetQuranSurah } from '../wailsjs/go/main/App';
import { main } from '../wailsjs/go/models';

const translations = {
  id: {
    home: "Beranda",
    quran: "Al-Quran",
    settings: "Pengaturan",
    city: "Kota",
    country: "Negara",
    update: "Perbarui",
    next: "Selanjutnya",
    loading: "Memuat...",
    selectSurah: "Pilih Surat",
    surahDetail: "Detail Surat",
    lang: "Bahasa",
    adhanSound: "Suara Adzan",
    save: "Simpan",
    prayerTimeMsg: "Saatnya menunaikan ibadah sholat",
    forRegion: "untuk wilayah",
    andAround: "dan sekitarnya",
    selectCity: "Pilih Kota/Wilayah",
    testAudio: "Test Audio",
    stopAudio: "Hentikan Adzan",
    streak: "Streak Harian",
    currentStreak: "Streak Saat Ini",
    bestStreak: "Streak Terbaik",
    streakLocked: "Belum masuk waktu",
    streakCompleted: "Semua Shalat Selesai!",
  },
  en: {
    home: "Home",
    quran: "Quran",
    settings: "Settings",
    city: "City",
    country: "Country",
    update: "Update",
    next: "Next",
    loading: "Loading...",
    selectSurah: "Select Surah",
    surahDetail: "Surah Details",
    lang: "Language",
    adhanSound: "Adhan Sound",
    save: "Save",
    prayerTimeMsg: "It is time for the prayer of",
    forRegion: "for the region of",
    andAround: "and surrounding areas",
    selectCity: "Select City/Region",
    testAudio: "Test Audio",
    stopAudio: "Stop Adhan",
    streak: "Daily Streak",
    currentStreak: "Current Streak",
    bestStreak: "Best Streak",
    streakLocked: "Not time yet",
    streakCompleted: "All Prayers Completed!",
  },
  ms: {
    home: "Laman Utama",
    quran: "Al-Quran",
    settings: "Tetapan",
    city: "Bandar",
    country: "Negara",
    update: "Kemas Kini",
    next: "Seterusnya",
    loading: "Memuatkan...",
    selectSurah: "Pilih Surah",
    surahDetail: "Butiran Surah",
    lang: "Bahasa",
    adhanSound: "Bunyi Azan",
    save: "Simpan",
    prayerTimeMsg: "Telah masuk waktu solat",
    forRegion: "bagi kawasan",
    andAround: "dan sekitarnya",
    selectCity: "Pilih Bandar/Kawasan",
    testAudio: "Uji Audio",
    stopAudio: "Hentikan Azan",
    streak: "Streak Harian",
    currentStreak: "Streak Semasa",
    bestStreak: "Streak Terbaik",
    streakLocked: "Belum masuk waktu",
    streakCompleted: "Semua Solat Selesai!",
  }
};

const adhanSources = [
  { value: '/adzan/ATHAN-ALAFASY.mp3', label: 'Adzan Alafasy (Lokal)' },
  { value: '/adzan/AL-AQSA.mp3', label: 'Adzan Al-Aqsa (Lokal)' },
  { value: "/adzan/AZAN par Salmân Al-'Utaybi (سلمان العتيبي).mp3", label: "Adzan Salman Al-Utaybi (Lokal)" },
  { value: '/adzan/Adzan H. Muammar ZA.mp3', label: 'Adzan H. Muammar ZA (Lokal)' },
  { value: '/adzan/Adzan-muhammad-taha-al-junayd.mp3', label: 'Adzan Taha Al-Junayd (Lokal)' },
  { value: 'https://cdn.islamic.network/quran/audio/surah/ar.alafasy/1.mp3', label: 'Makkah (Online)' },
  { value: 'https://cdn.islamic.network/quran/audio/surah/ar.alafasy/2.mp3', label: 'Madinah (Online)' }
];

const availableLocations = [
  { value: 'Jakarta,Indonesia', label: 'Jakarta, Indonesia' },
  { value: 'Bandung,Indonesia', label: 'Bandung, Indonesia' },
  { value: 'Surabaya,Indonesia', label: 'Surabaya, Indonesia' },
  { value: 'Medan,Indonesia', label: 'Medan, Indonesia' },
  { value: 'Makassar,Indonesia', label: 'Makassar, Indonesia' },
  { value: 'Makkah,Saudi Arabia', label: 'Makkah, Arab Saudi' },
  { value: 'Madinah,Saudi Arabia', label: 'Madinah, Arab Saudi' },
  { value: 'Kuala Lumpur,Malaysia', label: 'Kuala Lumpur, Malaysia' },
  { value: 'Singapore,Singapore', label: 'Singapura' },
  { value: 'London,United Kingdom', label: 'London, UK' },
  { value: 'New York,United States', label: 'New York, USA' },
  { value: 'Tokyo,Japan', label: 'Tokyo, Jepang' }
];

const langOptions = [
  { value: 'id', label: 'Bahasa Indonesia' },
  { value: 'en', label: 'English' },
  { value: 'ms', label: 'Bahasa Malaysia' }
];

function AnimatedDropdown({ value, options, onChange, style }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt: any) => opt.value === value) || options[0];

  return (
    <div className="custom-dropdown-container" ref={dropdownRef} style={style}>
      <button 
        className="custom-dropdown-button" 
        onClick={() => setIsOpen(!isOpen)}
        style={{borderColor: isOpen ? 'var(--accent-color)' : ''}}
      >
        <span>{selectedOption?.label}</span>
        <span style={{transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s'}}>▼</span>
      </button>
      <div className={`custom-dropdown-menu ${isOpen ? 'open' : ''}`}>
        {options.map((opt: any) => (
          <div 
            key={opt.value} 
            className="custom-dropdown-item"
            onClick={() => {
              onChange(opt.value);
              setIsOpen(false);
            }}
          >
            {opt.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function AyahAudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, [src]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      const audios = document.querySelectorAll('audio');
      audios.forEach(aud => {
        if (aud !== audioRef.current) {
          aud.pause();
        }
      });
      audioRef.current.play().catch(e => console.error(e));
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current || duration === 0) return;
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    audioRef.current.currentTime = percentage * duration;
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`custom-ayah-player ${isPlaying ? 'active' : ''}`}>
      <audio ref={audioRef} src={src} preload="none" />
      
      <button onClick={togglePlay} className="custom-play-btn" aria-label={isPlaying ? "Pause" : "Play"}>
        {isPlaying ? (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={{ marginLeft: '2px' }}>
            <path d="M8 5v14l11-7z"/>
          </svg>
        )}
      </button>

      <div className="custom-player-progress-container">
        <div 
          className="custom-player-progress-bar-track" 
          ref={progressRef}
          onClick={handleProgressBarClick}
        >
          <div 
            className="custom-player-progress-bar-fill" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="custom-player-time-display">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration || 0)}</span>
        </div>
      </div>

      {isPlaying && (
        <div className="custom-player-waves">
          <span className="wave-bar bar-1"></span>
          <span className="wave-bar bar-2"></span>
          <span className="wave-bar bar-3"></span>
          <span className="wave-bar bar-4"></span>
        </div>
      )}
    </div>
  );
}

function App() {
  const [view, setView] = useState('home');
  const [lang, setLang] = useState<'id' | 'en' | 'ms'>('id');
  const [theme, setTheme] = useState('light');
  const [searchQuery, setSearchQuery] = useState('');
  const [city, setCity] = useState('Jakarta');
  const [country, setCountry] = useState('Indonesia');
  const [adhanSrc, setAdhanSrc] = useState(adhanSources[0].value);
  const [isTestingAdhan, setIsTestingAdhan] = useState(false);
  const [streak, setStreak] = useState<{
    currentStreak: number;
    bestStreak: number;
    lastCheckedDate: string;
    completedPrayers: string[];
  }>(() => {
    const saved = localStorage.getItem('adhan_streak_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      currentStreak: 0,
      bestStreak: 0,
      lastCheckedDate: '',
      completedPrayers: []
    };
  });
  
  const [timings, setTimings] = useState<Record<string, string>>({});
  const [nextPrayer, setNextPrayer] = useState<{name: string, time: string, diffStr: string} | null>(null);
  const [error, setError] = useState('');
  
  const [surahs, setSurahs] = useState<main.Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<main.SurahDetail | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const t = translations[lang];

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const fetchTimings = async () => {
    try {
      const result = await GetPrayerTimes(city, country);
      setTimings(result.timings);
      setError('');
    } catch (err: any) {
      setError(String(err));
    }
  };

  useEffect(() => {
    fetchTimings();
  }, [city, country]); 

  const loadSurahs = async () => {
    if (surahs.length > 0) return;
    try {
      const s = await GetQuranSurahs();
      setSurahs(s);
    } catch(err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const todayStr = (() => {
      const d = new Date();
      const year = d.getFullYear();
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    })();

    setStreak(prev => {
      if (!prev.lastCheckedDate) {
        const newStreak = {
          ...prev,
          lastCheckedDate: todayStr,
          completedPrayers: []
        };
        localStorage.setItem('adhan_streak_data', JSON.stringify(newStreak));
        return newStreak;
      }

      if (prev.lastCheckedDate !== todayStr) {
        const d1 = new Date(prev.lastCheckedDate);
        const d2 = new Date(todayStr);
        const diffTime = Math.abs(d2.getTime() - d1.getTime());
        const daysDiff = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let newCurrentStreak = prev.currentStreak;
        const yesterdayCompletedAll = prev.completedPrayers.length === 5;

        if (daysDiff === 1) {
          if (!yesterdayCompletedAll) {
            newCurrentStreak = 0;
          }
        } else if (daysDiff > 1) {
          newCurrentStreak = 0;
        }

        const newStreak = {
          currentStreak: newCurrentStreak,
          bestStreak: prev.bestStreak,
          lastCheckedDate: todayStr,
          completedPrayers: []
        };
        localStorage.setItem('adhan_streak_data', JSON.stringify(newStreak));
        return newStreak;
      }

      return prev;
    });
  }, [view]);

  const togglePrayerCompleted = (prayer: string) => {
    setStreak(prev => {
      let newCompleted = [...prev.completedPrayers];
      if (newCompleted.includes(prayer)) {
        newCompleted = newCompleted.filter(p => p !== prayer);
      } else {
        newCompleted.push(prayer);
      }

      const completedAllNow = newCompleted.length === 5;
      const completedAllBefore = prev.completedPrayers.length === 5;

      let newCurrent = prev.currentStreak;
      let newBest = prev.bestStreak;

      if (completedAllNow && !completedAllBefore) {
        newCurrent += 1;
        if (newCurrent > newBest) {
          newBest = newCurrent;
        }
      } else if (!completedAllNow && completedAllBefore) {
        newCurrent = Math.max(0, newCurrent - 1);
      }

      const updated = {
        ...prev,
        completedPrayers: newCompleted,
        currentStreak: newCurrent,
        bestStreak: newBest
      };
      localStorage.setItem('adhan_streak_data', JSON.stringify(updated));
      return updated;
    });
  };

  const openSurah = async (number: number) => {
    try {
      const detail = await GetQuranSurah(number);
      setSelectedSurah(detail);
      setView('quran-detail');
    } catch(err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadSurahs();
  }, []);

  useEffect(() => {
    if (Object.keys(timings).length === 0) return;

    const interval = setInterval(() => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentSeconds = now.getSeconds();
      const currentTotalSeconds = currentHours * 3600 + currentMinutes * 60 + currentSeconds;

      const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
      let foundNext = false;

      for (let p of prayerOrder) {
        if (!timings[p]) continue;
        const [pHours, pMinutes] = timings[p].split(':').map(Number);
        const pTotalSeconds = pHours * 3600 + pMinutes * 60;
        
        if (pTotalSeconds > currentTotalSeconds) {
          foundNext = true;
          const diff = pTotalSeconds - currentTotalSeconds;
          
          if (diff === 0) {
            SendNotification(`Waktunya ${p}!`, `${t.prayerTimeMsg} ${p} ${t.forRegion} ${city} ${t.andAround}.`);
            if (audioRef.current) {
              audioRef.current.play().catch(e => console.error("Audio play failed:", e));
            }
          }

          const h = Math.floor(diff / 3600);
          const m = Math.floor((diff % 3600) / 60);
          const s = diff % 60;
          setNextPrayer({
            name: p,
            time: timings[p],
            diffStr: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
          });
          break;
        }
      }

      if (!foundNext && timings['Fajr']) {
        const [pHours, pMinutes] = timings['Fajr'].split(':').map(Number);
        const pTotalSeconds = (pHours + 24) * 3600 + pMinutes * 60;
        const diff = pTotalSeconds - currentTotalSeconds;
        const h = Math.floor(diff / 3600);
        const m = Math.floor((diff % 3600) / 60);
        const s = diff % 60;
        setNextPrayer({
          name: 'Fajr',
          time: timings['Fajr'],
          diffStr: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timings, city, lang, adhanSrc]);

  const renderAyahText = (ayah: any, surahNumber: number) => {
    let text = ayah.text;
    if (ayah.numberInSurah === 1 && surahNumber !== 1 && surahNumber !== 9) {
      text = text.replace("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", "").replace("بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ", "").trim();
    }
    return text;
  };

  return (
    <div id="app" className="app-layout">
      <audio 
        ref={audioRef} 
        src={adhanSrc} 
        preload="auto" 
        onPlay={() => setIsTestingAdhan(true)}
        onPause={() => setIsTestingAdhan(false)}
        onEnded={() => setIsTestingAdhan(false)}
      />
      
      <nav className="sidebar">
        <div className="sidebar-brand">
          🌙 <br /> Pengingat
        </div>
        <button className={view === 'home' ? 'active' : ''} onClick={() => setView('home')}>🏠 {t.home}</button>
        <button className={view === 'quran' || view === 'quran-detail' ? 'active' : ''} onClick={() => setView('quran')}>📖 {t.quran}</button>
        <button className={view === 'streak' ? 'active' : ''} onClick={() => setView('streak')}>🔥 {t.streak}</button>
        <button className={view === 'settings' ? 'active' : ''} onClick={() => setView('settings')}>⚙️ {t.settings}</button>
        
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme" style={{marginTop: 'auto', marginBottom: '20px'}}>
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
      </nav>

      <main className="main-area">
        {view === 'home' && (
          <div className="glass-panel">
            <header className="header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
              <h1 style={{ margin: '0 auto' }}>{t.home}</h1>
            </header>

            {error && <div className="error">{error}</div>}

            <div className="main-content">
              <div className="countdown-section">
                <h2>{t.next}: {nextPrayer ? nextPrayer.name : t.loading}</h2>
                <div className="countdown-timer">
                  {nextPrayer ? nextPrayer.diffStr : '--:--:--'}
                </div>
                <p className="next-time" style={{ marginBottom: '20px' }}>{nextPrayer ? nextPrayer.time : ''}</p>
                
                <div className="location-selector" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginBottom: '30px'}}>
                  <label style={{color: 'var(--text-secondary)', fontWeight: 600}}>{t.selectCity}:</label>
                  <AnimatedDropdown 
                    options={availableLocations}
                    value={`${city},${country}`}
                    onChange={(val: string) => {
                      const [c, ctry] = val.split(',');
                      setCity(c);
                      setCountry(ctry);
                    }}
                    style={{maxWidth: '300px'}}
                  />
                </div>
              </div>

              <div className="timings-grid">
                {['Imsak', 'Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Sunset', 'Maghrib', 'Isha'].map((p) => (
                  <div key={p} className={`timing-card ${nextPrayer?.name === p ? 'active' : ''}`}>
                    <span className="timing-name">{p}</span>
                    <span className="timing-time">{timings[p] || '--:--'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === 'quran' && (
          <div className="glass-panel full-height" style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ marginBottom: '15px' }}>{t.quran}</h1>
            
            <div className="search-container">
              <input 
                type="text" 
                className="custom-search-input" 
                placeholder={lang === 'id' ? "Cari Surat (contoh: Al-Baqarah, Yasin)..." : "Search Surah (e.g., Al-Baqarah, Yaseen)..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="surah-list" style={{ flex: 1, overflowY: 'auto', paddingRight: '5px' }}>
              {surahs.filter(s => 
                s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                s.englishName.toLowerCase().includes(searchQuery.toLowerCase())
              ).map(s => (
                <div key={s.number} className="surah-item" onClick={() => openSurah(s.number)}>
                  <div className="surah-number">{s.number}</div>
                  <div className="surah-names">
                    <strong>{s.englishName}</strong>
                    <span>{s.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'quran-detail' && selectedSurah && (
          <div className="glass-panel full-height">
            <header className="header">
               <button onClick={() => setView('quran')} className="back-btn">← Back</button>
               <h1>{selectedSurah.name} ({selectedSurah.englishName})</h1>
               <div style={{width: '60px'}}></div>
            </header>
            
            <div className="ayah-list">
              {selectedSurah.number !== 1 && selectedSurah.number !== 9 && (
                <div className="ayah-item bismillah-header" style={{textAlign: 'center', backgroundColor: 'transparent', border: 'none'}}>
                  <h2 className="ayah-text" dir="rtl" style={{fontSize: '32px', marginBottom: '15px'}}>بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</h2>
                  <AyahAudioPlayer src="https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3" />
                </div>
              )}

              {selectedSurah.ayahs.map((ayah: any) => {
                return (
                  <div key={ayah.numberInSurah} className="ayah-item">
                    <div className="ayah-top">
                      <span className="ayah-number">{ayah.numberInSurah}</span>
                      <p className="ayah-text" dir="rtl">{renderAyahText(ayah, selectedSurah.number)}</p>
                    </div>
                     <AyahAudioPlayer src={ayah.audio} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {view === 'settings' && (
          <div className="glass-panel">
            <h1>{t.settings}</h1>
            <div className="settings-form">
              <div className="form-group" style={{alignItems: 'flex-start'}}>
                <label style={{marginBottom: '5px'}}>{t.lang}</label>
                <AnimatedDropdown 
                  options={langOptions}
                  value={lang}
                  onChange={(val: 'id'|'en') => setLang(val)}
                  style={{maxWidth: '300px'}}
                />
              </div>
              <div className="form-group" style={{alignItems: 'flex-start', marginTop: '15px'}}>
                <label style={{marginBottom: '5px'}}>{t.adhanSound}</label>
                <div style={{display: 'flex', gap: '10px', width: '100%'}}>
                  <AnimatedDropdown 
                    options={adhanSources}
                    value={adhanSrc}
                    onChange={(val: string) => setAdhanSrc(val)}
                    style={{maxWidth: '300px', flex: 1}}
                  />
                  <button onClick={() => {
                      if(audioRef.current) {
                        if (isTestingAdhan) {
                          audioRef.current.pause();
                          audioRef.current.currentTime = 0;
                        } else {
                          audioRef.current.currentTime = 0;
                          audioRef.current.play().catch(e => console.error("Audio play failed:", e));
                        }
                      }
                    }} 
                    className={`test-btn ${isTestingAdhan ? 'stop' : ''}`}
                  >
                    {isTestingAdhan ? t.stopAudio : t.testAudio}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'streak' && (
          <div className="glass-panel">
            <header className="header">
              <h1>{t.streak}</h1>
              <div style={{color: 'var(--accent-color)', fontWeight: 'bold'}}>🔥 {streak.currentStreak} {lang === 'en' ? 'Days' : 'Hari'}</div>
            </header>

            <div className="streak-dashboard" style={{display: 'flex', gap: '30px', alignItems: 'center', margin: '10px 0'}}>
              <div className="streak-fire-circle" style={{
                width: '120px', 
                height: '120px', 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 10px 25px rgba(239, 68, 68, 0.4)',
                color: 'white'
              }}>
                <span style={{fontSize: '32px'}}>🔥</span>
                <strong style={{fontSize: '20px', marginTop: '2px'}}>{streak.currentStreak}</strong>
                <span style={{fontSize: '10px', textTransform: 'uppercase'}}>{lang === 'en' ? 'Days' : 'Hari'}</span>
              </div>
              <div className="streak-stats" style={{display: 'flex', flexDirection: 'column', gap: '8px', flex: 1}}>
                <div style={{background: 'var(--active-card)', padding: '12px 15px', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between'}}>
                  <span style={{fontWeight: 600, color: 'var(--text-secondary)'}}>{t.currentStreak}</span>
                  <strong style={{color: 'var(--accent-color)'}}>{streak.currentStreak} {lang === 'en' ? 'Days' : 'Hari'}</strong>
                </div>
                <div style={{background: 'var(--active-card)', padding: '12px 15px', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between'}}>
                  <span style={{fontWeight: 600, color: 'var(--text-secondary)'}}>{t.bestStreak}</span>
                  <strong style={{color: 'var(--gold-accent)'}}>{streak.bestStreak} {lang === 'en' ? 'Days' : 'Hari'}</strong>
                </div>
              </div>
            </div>

            <div className="streak-checklist-container">
              <h2 style={{fontSize: '18px', marginBottom: '15px', color: 'var(--text-primary)'}}>{lang === 'en' ? "Today's Prayer Checklist" : lang === 'ms' ? "Senarai Solat Hari Ini" : "Daftar Sholat Hari Ini"}</h2>
              <div className="streak-checklist" style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map(prayer => {
                  const pTime = timings[prayer] || '--:--';
                  
                  let isUnlocked = false;
                  if (timings[prayer]) {
                    const [pHour, pMinute] = timings[prayer].split(':').map(Number);
                    const now = new Date();
                    const curHour = now.getHours();
                    const curMin = now.getMinutes();
                    isUnlocked = curHour > pHour || (curHour === pHour && curMin >= pMinute);
                  }

                  const isChecked = streak.completedPrayers.includes(prayer);

                  return (
                    <div 
                      key={prayer} 
                      className={`streak-prayer-item ${isChecked ? 'completed' : ''} ${!isUnlocked ? 'locked' : ''}`}
                      onClick={() => isUnlocked && togglePrayerCompleted(prayer)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 20px',
                        borderRadius: '16px',
                        border: '1px solid var(--glass-border)',
                        background: isChecked ? 'var(--accent-glow)' : 'var(--active-card)',
                        cursor: isUnlocked ? 'pointer' : 'not-allowed',
                        opacity: isUnlocked ? 1 : 0.6,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                        <div className="streak-checkbox" style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '8px',
                          border: `2px solid ${isChecked ? 'var(--accent-color)' : 'var(--text-secondary)'}`,
                          background: isChecked ? 'var(--accent-color)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          transition: 'all 0.2s'
                        }}>
                          {isChecked && '✓'}
                        </div>
                        <span style={{fontWeight: 700, color: 'var(--text-primary)'}}>{prayer}</span>
                      </div>
                      <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <span style={{color: 'var(--text-secondary)', fontWeight: 600}}>{pTime}</span>
                        {!isUnlocked && (
                          <span style={{
                            fontSize: '11px', 
                            background: 'rgba(255,0,0,0.1)', 
                            color: '#ef4444', 
                            padding: '4px 8px', 
                            borderRadius: '6px',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            🔒 {t.streakLocked}
                          </span>
                        )}
                        {isUnlocked && !isChecked && (
                          <span style={{
                            fontSize: '11px', 
                            background: 'var(--accent-glow)', 
                            color: 'var(--accent-color)', 
                            padding: '4px 8px', 
                            borderRadius: '6px',
                            fontWeight: 600
                          }}>
                            {lang === 'en' ? 'Available' : 'Siap Dicatat'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {streak.completedPrayers.length === 5 && (
              <div className="streak-completed-banner" style={{
                background: 'linear-gradient(135deg, var(--accent-color), var(--gold-accent))',
                borderRadius: '16px',
                padding: '20px',
                textAlign: 'center',
                color: 'white',
                marginTop: '10px',
                boxShadow: '0 10px 20px var(--accent-glow)',
                animation: 'fadeIn 0.5s ease-out'
              }}>
                <h3 style={{margin: 0, fontSize: '20px'}}>🌟 {t.streakCompleted} 🌟</h3>
                <p style={{margin: '5px 0 0 0', opacity: 0.9, fontSize: '14px'}}>
                  {lang === 'en' 
                    ? 'Amazing dedication! Keep maintaining your streak tomorrow.' 
                    : lang === 'ms' 
                    ? 'Dedikasi luar biasa! Teruskan mengekalkan streak anda esok.' 
                    : 'Dedikasi luar biasa! Teruskan menjaga streak Anda besok.'}
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
