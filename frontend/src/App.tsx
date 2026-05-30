import { useState, useEffect, useRef } from 'react';
import './App.css';
import { GetPrayerTimes, SendNotification, GetQuranSurahs, GetQuranSurah, SetWidgetMode } from '../wailsjs/go/main/App';
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
    streak: "Streak Sholat",
    currentStreak: "Streak Saat Ini",
    bestStreak: "Streak Terbaik",
    streakLocked: "Belum masuk waktu",
    streakCompleted: "Semua Shalat Selesai!",
    streakMissed: "Terlewat / Bolong",
    weather: "Cuaca",
    todayWeather: "Cuaca Hari Ini",
    forecast: "Ramalan Cuaca Harian",
    feelsLike: "Terasa Seperti",
    humidity: "Kelembaban",
    precipitation: "Curah Hujan",
    windSpeed: "Kecepatan Angin",
    widgetMode: "Mode Widget (Selalu di Atas & Kunci Jendela)",
    widgetModeDesc: "Membuat aplikasi selalu di atas (Always on Top) dan mencegah penutupan jendela (seperti Rainmeter).",
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
    streak: "Prayer Streak",
    currentStreak: "Current Streak",
    bestStreak: "Best Streak",
    streakLocked: "Not time yet",
    streakCompleted: "All Prayers Completed!",
    streakMissed: "Missed",
    weather: "Weather",
    todayWeather: "Today's Weather",
    forecast: "Daily Weather Forecast",
    feelsLike: "Feels Like",
    humidity: "Humidity",
    precipitation: "Precipitation",
    windSpeed: "Wind Speed",
    widgetMode: "Widget Mode (Always on Top & Lock Window)",
    widgetModeDesc: "Keep the window always on top and prevent closing (similar to Rainmeter widgets).",
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
    streak: "Streak Solat",
    currentStreak: "Streak Semasa",
    bestStreak: "Streak Terbaik",
    streakLocked: "Belum masuk waktu",
    streakCompleted: "Semua Solat Selesai!",
    streakMissed: "Terlepas / Terlewat",
    weather: "Cuaca",
    todayWeather: "Cuaca Hari Ini",
    forecast: "Ramalan Cuaca Harian",
    feelsLike: "Terasa Seperti",
    humidity: "Kelembapan",
    precipitation: "Taburan Hujan",
    windSpeed: "Kelajuan Angin",
    widgetMode: "Mod Widget (Selalu di Atas & Kunci Tetingkap)",
    widgetModeDesc: "Memastikan tetingkap sentiasa di atas dan menghalang aplikasi daripada ditutup (seperti Rainmeter).",
  }
};

const getWeatherInfo = (code: number, lang: 'id' | 'en' | 'ms') => {
  const mapping: Record<number, { icon: string, desc: Record<string, string> }> = {
    0: { icon: '☀️', desc: { id: 'Cerah', en: 'Clear Sky', ms: 'Cerah' } },
    1: { icon: '🌤️', desc: { id: 'Cerah Berawan', en: 'Mainly Clear', ms: 'Cerah Berawan' } },
    2: { icon: '⛅', desc: { id: 'Berawan Sebagian', en: 'Partly Cloudy', ms: 'Berawan Sebahagian' } },
    3: { icon: '☁️', desc: { id: 'Mendung', en: 'Overcast', ms: 'Mendung' } },
    45: { icon: '🌫️', desc: { id: 'Kabut', en: 'Fog', ms: 'Kabus' } },
    48: { icon: '🌫️', desc: { id: 'Kabut Berembun', en: 'Depositing Rime Fog', ms: 'Kabus Berembun' } },
    51: { icon: '🌧️', desc: { id: 'Gerimis Ringan', en: 'Light Drizzle', ms: 'Gerimis Ringan' } },
    53: { icon: '🌧️', desc: { id: 'Gerimis Sedang', en: 'Moderate Drizzle', ms: 'Gerimis Sederhana' } },
    55: { icon: '🌧️', desc: { id: 'Gerimis Lebat', en: 'Dense Drizzle', ms: 'Gerimis Lebat' } },
    61: { icon: '🌧️', desc: { id: 'Hujan Ringan', en: 'Slight Rain', ms: 'Hujan Hanyut' } },
    63: { icon: '🌧️', desc: { id: 'Hujan Sedang', en: 'Moderate Rain', ms: 'Hujan Sederhana' } },
    65: { icon: '🌧️', desc: { id: 'Hujan Lebat', en: 'Heavy Rain', ms: 'Hujan Lebat' } },
    80: { icon: '🌦️', desc: { id: 'Hujan Rintik', en: 'Slight Rain Showers', ms: 'Hujan Rintik' } },
    81: { icon: '🌦️', desc: { id: 'Hujan Rintik Sedang', en: 'Moderate Rain Showers', ms: 'Hujan Rintik Sederhana' } },
    82: { icon: '⛈️', desc: { id: 'Hujan Rintik Lebat', en: 'Violent Rain Showers', ms: 'Hujan Rintik Lebat' } },
    95: { icon: '⛈️', desc: { id: 'Badai Petir', en: 'Thunderstorm', ms: 'Ribut Petir' } },
  };

  return mapping[code] || { icon: '☁️', desc: { id: 'Berawan', en: 'Cloudy', ms: 'Berawan' } };
};

const adhanSources = [
  { value: '/adzan/ATHAN-ALAFASY.mp3', label: 'Adzan Alafasy (Lokal)' },
  { value: '/adzan/AL-AQSA.mp3', label: 'Adzan Al-Aqsa (Lokal)' },
  { value: '/adzan/azan-salman-al-utaybi.mp3', label: 'Adzan Salman Al-Utaybi (Lokal)' },
  { value: '/adzan/adzan-h-muammar-za.mp3', label: 'Adzan H. Muammar ZA (Lokal)' },
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
  
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [widgetMode, setWidgetModeState] = useState(() => {
    const saved = localStorage.getItem('adhan_widget_mode');
    return saved === 'true';
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

  useEffect(() => {
    try {
      SetWidgetMode(widgetMode);
      localStorage.setItem('adhan_widget_mode', String(widgetMode));
    } catch (e) {
      console.error("Failed to set widget mode:", e);
    }
  }, [widgetMode]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const fetchTimings = async () => {
    try {
      const result = await GetPrayerTimes(city, country);
      setTimings(result.timings);
      setLatitude(result.latitude);
      setLongitude(result.longitude);
      setError('');
    } catch (err: any) {
      setError(String(err));
    }
  };

  useEffect(() => {
    fetchTimings();
  }, [city, country]); 

  useEffect(() => {
    if (latitude === null || longitude === null) return;
    
    const fetchWeather = async () => {
      setWeatherLoading(true);
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
        const data = await res.json();
        setWeatherData(data);
      } catch (e) {
        console.error("Failed to fetch weather:", e);
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchWeather();
  }, [latitude, longitude]); 

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
      if (prev.completedPrayers.includes(prayer)) {
        return prev;
      }

      const newCompleted = [...prev.completedPrayers, prayer];
      const completedAllNow = newCompleted.length === 5;
      const completedAllBefore = prev.completedPrayers.length === 5;

      let newCurrent = prev.currentStreak;
      let newBest = prev.bestStreak;

      if (completedAllNow && !completedAllBefore) {
        newCurrent += 1;
        if (newCurrent > newBest) {
          newBest = newCurrent;
        }
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

  useEffect(() => {
    if (Object.keys(timings).length === 0) return;

    const checkMissedPrayers = () => {
      const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
      let hasMissed = false;

      const now = new Date();
      const curHour = now.getHours();
      const curMin = now.getMinutes();

      for (let i = 0; i < 4; i++) {
        const prayer = prayerOrder[i];
        if (streak.completedPrayers.includes(prayer)) continue;

        const pTime = timings[prayer];
        if (!pTime) continue;

        const nextPrayer = prayerOrder[i + 1];
        const nextTime = timings[nextPrayer];
        if (!nextTime) continue;

        const [npHour, npMinute] = nextTime.split(':').map(Number);
        const isNextPassed = curHour > npHour || (curHour === npHour && curMin >= npMinute);

        if (isNextPassed) {
          hasMissed = true;
          break;
        }
      }

      if (hasMissed && streak.currentStreak > 0) {
        setStreak(prev => {
          const updated = {
            ...prev,
            currentStreak: 0
          };
          localStorage.setItem('adhan_streak_data', JSON.stringify(updated));
          return updated;
        });
      }
    };

    checkMissedPrayers();
    const interval = setInterval(checkMissedPrayers, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [timings, streak.completedPrayers, streak.currentStreak, view]);

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
        <div className="sidebar-brand" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
          <img src="/logo.png" alt="Logo" style={{ width: '70px', height: '70px', objectFit: 'contain', borderRadius: '14px' }} />
          <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent-color)' }}>Pengingat</span>
        </div>
        <button className={view === 'home' ? 'active' : ''} onClick={() => setView('home')}>
          <img src="/logo homepage navbar.png" alt="Home" style={{ width: '22px', height: '22px', objectFit: 'contain' }} /> 
          {t.home}
        </button>
        <button className={view === 'quran' || view === 'quran-detail' ? 'active' : ''} onClick={() => setView('quran')}>
          <img src="/logo alquran.png" alt="Quran" style={{ width: '22px', height: '22px', objectFit: 'contain' }} /> 
          {t.quran}
        </button>
        <button className={view === 'weather' ? 'active' : ''} onClick={() => setView('weather')}>
          <img src="/logo cuaca navbar.png" alt="Weather" style={{ width: '22px', height: '22px', objectFit: 'contain' }} /> 
          {t.weather}
        </button>
        <button className={view === 'streak' ? 'active' : ''} onClick={() => setView('streak')}>
          <img src="/logo streak navbar.png" alt="Streak" style={{ width: '22px', height: '22px', objectFit: 'contain' }} /> 
          {t.streak}
        </button>
        <button className={view === 'settings' ? 'active' : ''} onClick={() => setView('settings')}>
          <img src="/logo pengaturan navbar.png" alt="Settings" style={{ width: '22px', height: '22px', objectFit: 'contain' }} /> 
          {t.settings}
        </button>
        
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme" style={{marginTop: 'auto', marginBottom: '20px'}}>
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
      </nav>

      <main className="main-area">
        {view === 'home' && (
          <div className="glass-panel">
            <header className="header" style={{ borderBottom: 'none', paddingBottom: 0, justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src="/logo homepage navbar.png" alt="Home" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
                <h1 style={{ margin: 0 }}>{t.home}</h1>
              </div>
            </header>

            {error && <div className="error">{error}</div>}

            <div className="main-content">
              <div className="countdown-section">
                <h2>{t.next}: {nextPrayer ? nextPrayer.name : t.loading}</h2>
                <div className="countdown-timer">
                  {nextPrayer ? nextPrayer.diffStr : '--:--:--'}
                </div>
                <p className="next-time" style={{ marginBottom: '20px' }}>{nextPrayer ? nextPrayer.time : ''}</p>
                
                <div className="location-display" style={{color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '25px', fontSize: '15px'}}>
                  📍 {city}, {country}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
              <img src="/logo alquran.png" alt="Quran" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
              <h1 style={{ margin: 0 }}>{t.quran}</h1>
            </div>
            
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
              <img src="/logo pengaturan navbar.png" alt="Settings" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
              <h1 style={{ margin: 0 }}>{t.settings}</h1>
            </div>
            <div className="settings-form">
              <div className="form-group" style={{alignItems: 'flex-start', marginBottom: '15px'}}>
                <label style={{marginBottom: '5px'}}>{t.selectCity}</label>
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
              <div className="form-group" style={{alignItems: 'flex-start', marginTop: '20px', borderTop: '1px solid var(--glass-border)', paddingTop: '20px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                  <div>
                    <label style={{fontWeight: 700, display: 'block', color: 'var(--text-primary)', marginBottom: '4px'}}>{t.widgetMode}</label>
                    <span style={{fontSize: '12px', color: 'var(--text-secondary)'}}>{t.widgetModeDesc}</span>
                  </div>
                  <button 
                    onClick={() => setWidgetModeState(!widgetMode)}
                    style={{
                      background: widgetMode ? 'var(--accent-color)' : 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '20px',
                      padding: '8px 16px',
                      color: widgetMode ? 'white' : 'var(--text-primary)',
                      fontFamily: 'inherit',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: widgetMode ? '0 0 10px var(--accent-glow)' : 'none'
                    }}
                  >
                    {widgetMode ? (lang === 'en' ? 'Active' : 'Aktif') : (lang === 'en' ? 'Inactive' : 'Nonaktif')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'streak' && (
          <div className="glass-panel">
            <header className="header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src="/logo streak navbar.png" alt="Streak" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
                <h1 style={{ margin: 0 }}>{t.streak}</h1>
              </div>
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
                  const isChecked = streak.completedPrayers.includes(prayer);
                  
                  let isUnlocked = false;
                  let isMissed = false;
                  if (timings[prayer]) {
                    const [pHour, pMinute] = timings[prayer].split(':').map(Number);
                    const now = new Date();
                    const curHour = now.getHours();
                    const curMin = now.getMinutes();
                    isUnlocked = curHour > pHour || (curHour === pHour && curMin >= pMinute);

                    if (!isChecked && isUnlocked) {
                      const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
                      const curIdx = prayerOrder.indexOf(prayer);
                      if (curIdx < 4) {
                        const nextPrayer = prayerOrder[curIdx + 1];
                        const nextTime = timings[nextPrayer];
                        if (nextTime) {
                          const [npHour, npMinute] = nextTime.split(':').map(Number);
                          const isNextPassed = curHour > npHour || (curHour === npHour && curMin >= npMinute);
                          if (isNextPassed) {
                            isMissed = true;
                          }
                        }
                      }
                    }
                  }

                  const handleItemClick = () => {
                    if (isMissed || isChecked || !isUnlocked) return;
                    togglePrayerCompleted(prayer);
                  };

                  return (
                    <div 
                      key={prayer} 
                      className={`streak-prayer-item ${isChecked ? 'completed' : ''} ${isMissed ? 'missed' : ''} ${!isUnlocked ? 'locked' : ''}`}
                      onClick={handleItemClick}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 20px',
                        borderRadius: '16px',
                        border: '1px solid var(--glass-border)',
                        borderColor: isChecked 
                          ? 'var(--accent-color)' 
                          : isMissed 
                          ? 'rgba(239, 68, 68, 0.4)' 
                          : 'var(--glass-border)',
                        background: isChecked 
                          ? 'var(--accent-glow)' 
                          : isMissed 
                          ? 'rgba(239, 68, 68, 0.05)' 
                          : 'var(--active-card)',
                        cursor: isChecked 
                          ? 'default' 
                          : isMissed 
                          ? 'not-allowed' 
                          : isUnlocked 
                          ? 'pointer' 
                          : 'not-allowed',
                        opacity: isChecked || isUnlocked ? 1 : 0.6,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                        <div className="streak-checkbox" style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '8px',
                          border: `2px solid ${
                            isChecked 
                              ? 'var(--accent-color)' 
                              : isMissed 
                              ? '#ef4444' 
                              : 'var(--text-secondary)'
                          }`,
                          background: isChecked 
                            ? 'var(--accent-color)' 
                            : isMissed 
                            ? 'rgba(239, 68, 68, 0.1)' 
                            : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isChecked ? 'white' : '#ef4444',
                          fontWeight: 'bold',
                          transition: 'all 0.2s'
                        }}>
                          {isChecked && '✓'}
                          {isMissed && '✗'}
                        </div>
                        <span style={{
                          fontWeight: 700, 
                          color: isMissed ? 'var(--text-secondary)' : 'var(--text-primary)',
                          textDecoration: isChecked ? 'line-through' : 'none',
                          opacity: isMissed ? 0.7 : 1
                        }}>
                          {prayer}
                        </span>
                      </div>
                      <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <span style={{color: 'var(--text-secondary)', fontWeight: 600}}>{pTime}</span>
                        {!isUnlocked && (
                          <span style={{
                            fontSize: '11px', 
                            background: 'rgba(255,0,0,0.05)', 
                            color: 'var(--text-secondary)', 
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
                        {isMissed && (
                          <span style={{
                            fontSize: '11px', 
                            background: 'rgba(239, 68, 68, 0.1)', 
                            color: '#ef4444', 
                            padding: '4px 8px', 
                            borderRadius: '6px',
                            fontWeight: 600
                          }}>
                            ❌ {t.streakMissed}
                          </span>
                        )}
                        {isUnlocked && !isChecked && !isMissed && (
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

        {view === 'weather' && (
          <div className="glass-panel">
            <header className="header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src="/logo cuaca navbar.png" alt="Weather" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
                <h1 style={{ margin: 0 }}>{t.weather}</h1>
              </div>
              <div style={{color: 'var(--accent-color)', fontWeight: 'bold'}}>📍 {city}, {country}</div>
            </header>

            {weatherLoading ? (
              <div className="loading" style={{textAlign: 'center', padding: '40px'}}>{t.loading}</div>
            ) : weatherData && weatherData.current ? (() => {
              const current = weatherData.current;
              const daily = weatherData.daily;
              const curWeather = getWeatherInfo(current.weather_code, lang);

              return (
                <div className="weather-content" style={{display: 'flex', flexDirection: 'column', gap: '30px'}}>
                  <div className="today-weather-card" style={{
                    background: 'var(--active-card)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '20px',
                    padding: '30px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '15px',
                    textAlign: 'center',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
                  }}>
                    <span style={{fontSize: '80px', lineHeight: 1, filter: 'drop-shadow(0 0 15px var(--accent-glow))'}}>{curWeather.icon}</span>
                    <div>
                      <h2 style={{fontSize: '48px', fontWeight: 700, margin: 0, color: 'var(--text-primary)'}}>{Math.round(current.temperature_2m)}°C</h2>
                      <p style={{fontSize: '18px', fontWeight: 600, margin: '5px 0 0 0', color: 'var(--accent-color)'}}>{curWeather.desc[lang] || curWeather.desc['id']}</p>
                    </div>

                    <div className="weather-sub-stats" style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                      gap: '15px',
                      width: '100%',
                      marginTop: '15px',
                      borderTop: '1px solid var(--glass-border)',
                      paddingTop: '20px'
                    }}>
                      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'}}>
                        <span style={{fontSize: '12px', color: 'var(--text-secondary)'}}>{t.feelsLike}</span>
                        <strong style={{fontSize: '16px', color: 'var(--text-primary)'}}>{Math.round(current.apparent_temperature)}°C</strong>
                      </div>
                      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'}}>
                        <span style={{fontSize: '12px', color: 'var(--text-secondary)'}}>{t.humidity}</span>
                        <strong style={{fontSize: '16px', color: 'var(--text-primary)'}}>{current.relative_humidity_2m}%</strong>
                      </div>
                      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'}}>
                        <span style={{fontSize: '12px', color: 'var(--text-secondary)'}}>{t.precipitation}</span>
                        <strong style={{fontSize: '16px', color: 'var(--text-primary)'}}>{current.precipitation} mm</strong>
                      </div>
                      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'}}>
                        <span style={{fontSize: '12px', color: 'var(--text-secondary)'}}>{t.windSpeed}</span>
                        <strong style={{fontSize: '16px', color: 'var(--text-primary)'}}>{current.wind_speed_10m} km/h</strong>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 style={{fontSize: '18px', color: 'var(--text-primary)', marginBottom: '15px'}}>{t.forecast}</h3>
                    <div className="forecast-grid" style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                      gap: '12px'
                    }}>
                      {daily.time.slice(1, 6).map((timeStr: string, idx: number) => {
                        const dayCode = daily.weather_code[idx + 1];
                        const dayWeather = getWeatherInfo(dayCode, lang);
                        const dayName = new Date(timeStr).toLocaleDateString(lang === 'ms' ? 'ms-MY' : lang === 'en' ? 'en-US' : 'id-ID', { weekday: 'long' });

                        return (
                          <div 
                            key={timeStr} 
                            style={{
                              background: 'var(--active-card)',
                              border: '1px solid var(--glass-border)',
                              borderRadius: '16px',
                              padding: '15px 10px',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '8px',
                              textAlign: 'center',
                              transition: 'transform 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                          >
                            <span style={{fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)'}}>{dayName}</span>
                            <span style={{fontSize: '36px', lineHeight: 1}}>{dayWeather.icon}</span>
                            <span style={{fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)'}}>
                              {Math.round(daily.temperature_2m_max[idx + 1])}° / {Math.round(daily.temperature_2m_min[idx + 1])}°
                            </span>
                            <span style={{fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 500, lineHeight: 1.2}}>
                              {dayWeather.desc[lang] || dayWeather.desc['id']}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })() : (
              <div style={{textAlign: 'center', padding: '40px', color: 'var(--text-secondary)'}}>Failed to load weather data</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
