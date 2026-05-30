import { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [theme, setTheme] = useState('light');
  const [activeTab, setActiveTab] = useState('home');
  const [streakCount, setStreakCount] = useState(5);
  const [completedPrayers, setCompletedPrayers] = useState<string[]>(['Fajr', 'Dhuhr']);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handlePrayerToggle = (prayer: string) => {
    if (completedPrayers.includes(prayer)) return; // No unchecking!
    const newCompleted = [...completedPrayers, prayer];
    setCompletedPrayers(newCompleted);
    if (newCompleted.length === 5) {
      setStreakCount(streakCount + 1);
    }
  };

  return (
    <div className="landing-layout">
      {/* Top Navbar */}
      <nav className="navbar">
        <div className="nav-brand">
          <img src="/logo.png" alt="Logo" className="nav-logo" />
          <span>Pengingat Salat</span>
        </div>
        <div className="nav-links">
          <a href="#features" className="nav-link">Fitur</a>
          <a href="#demo" className="nav-link">Demo Widget</a>
          <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <a href="/downloads/pengingat-solat.exe" className="nav-download-btn" download>
            Unduh
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-text-area">
          <span className="badge">✨ Aplikasi Desktop Versi 1.0 (Windows)</span>
          <h1 className="hero-title">
            Tetap Disiplin Ibadah di Layar Desktop Anda
          </h1>
          <p className="hero-subtitle">
            Aplikasi Islami All-in-One berdesain **Glassmorphism Premium** yang menemani produktivitas Anda. Dilengkapi widget melayang, Al-Quran murottal dengan visualizer, pelacak streak sholat, dan info cuaca real-time.
          </p>
          <div className="hero-buttons">
            <a href="/downloads/pengingat-solat.exe" className="cta-button primary" download>
              📥 Unduh untuk Windows (.exe)
            </a>
            <a href="#features" className="cta-button secondary">
              Pelajari Fitur →
            </a>
          </div>
          <span className="download-info">*Gratis, Bebas Iklan & Siap Dipasang</span>
        </div>

        {/* Dynamic App Mockup Dashboard */}
        <div className="hero-mockup-area">
          <div className="mockup-frame">
            <div className="mockup-sidebar">
              <div className="mockup-brand">
                <img src="/logo.png" alt="Logo" />
                <span>Pengingat</span>
              </div>
              <button className={activeTab === 'home' ? 'active' : ''} onClick={() => setActiveTab('home')}>
                <img src="/logo homepage navbar.png" alt="Home" /> Beranda
              </button>
              <button className={activeTab === 'quran' ? 'active' : ''} onClick={() => setActiveTab('quran')}>
                <img src="/logo alquran.png" alt="Quran" /> Al-Quran
              </button>
              <button className={activeTab === 'weather' ? 'active' : ''} onClick={() => setActiveTab('weather')}>
                <img src="/logo cuaca navbar.png" alt="Weather" /> Cuaca
              </button>
              <button className={activeTab === 'streak' ? 'active' : ''} onClick={() => setActiveTab('streak')}>
                <img src="/logo streak navbar.png" alt="Streak" /> Streak
              </button>
              <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
                <img src="/logo pengaturan navbar.png" alt="Settings" /> Setelan
              </button>
            </div>
            
            <div className="mockup-content">
              {activeTab === 'home' && (
                <div className="mockup-pane animate-fade">
                  <div className="mockup-header">
                    <img src="/logo homepage navbar.png" alt="Home" style={{width: '24px'}} />
                    <h3>Beranda</h3>
                  </div>
                  <div className="mockup-countdown-section">
                    <span style={{fontSize: '11px', opacity: 0.8, fontWeight: 600, textTransform: 'uppercase'}}>Sholat Selanjutnya: Asr</span>
                    <h4 style={{fontSize: '36px', margin: '5px 0', textShadow: '0 0 15px var(--accent-glow)'}}>01:14:24</h4>
                    <span className="mockup-loc">📍 Jakarta, Indonesia</span>
                  </div>
                  <div className="mockup-grid">
                    {['Fajr (04:35)', 'Dhuhr (11:58)', 'Asr (15:20)', 'Maghrib (17:52)', 'Isha (19:04)'].map((p, i) => (
                      <div key={i} className={`mockup-card ${i === 2 ? 'active' : ''}`}>
                        <span>{p.split(' ')[0]}</span>
                        <strong>{p.split(' ')[1]}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'quran' && (
                <div className="mockup-pane animate-fade">
                  <div className="mockup-header">
                    <img src="/logo alquran.png" alt="Quran" style={{width: '24px'}} />
                    <h3>Al-Quran Digital</h3>
                  </div>
                  <div className="mockup-quran-item">
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                      <span className="quran-num">1</span>
                      <strong style={{fontSize: '20px', fontFamily: 'serif'}}>بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</strong>
                    </div>
                    {/* Visualizer Player */}
                    <div className="mockup-custom-player">
                      <div className="mock-play-btn">⏸</div>
                      <div className="mock-progress-container">
                        <div className="mock-track"><div className="mock-fill" style={{width: '45%'}}></div></div>
                        <div className="mock-time"><span>00:03</span><span>00:07</span></div>
                      </div>
                      <div className="mock-waves">
                        <span></span><span></span><span></span><span></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'weather' && (
                <div className="mockup-pane animate-fade">
                  <div className="mockup-header">
                    <img src="/logo cuaca navbar.png" alt="Weather" style={{width: '24px'}} />
                    <h3>Cuaca Terintegrasi</h3>
                  </div>
                  <div className="mockup-weather-card">
                    <span style={{fontSize: '48px'}}>🌤️</span>
                    <div>
                      <h4 style={{fontSize: '32px', margin: 0}}>31°C</h4>
                      <p style={{fontSize: '12px', color: 'var(--accent-color)', fontWeight: 600, margin: '2px 0 0 0'}}>Cerah Berawan</p>
                    </div>
                  </div>
                  <div className="mockup-weather-stats">
                    <div><span>Kelembapan</span><strong>72%</strong></div>
                    <div><span>Angin</span><strong>12 km/h</strong></div>
                  </div>
                </div>
              )}

              {activeTab === 'streak' && (
                <div className="mockup-pane animate-fade">
                  <div className="mockup-header">
                    <img src="/logo streak navbar.png" alt="Streak" style={{width: '24px'}} />
                    <h3>Streak Sholat</h3>
                    <div style={{color: 'var(--accent-color)', fontWeight: 'bold', fontSize: '14px'}}>🔥 {streakCount} Hari</div>
                  </div>
                  <div style={{display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px'}}>
                    <div className="mock-fire-circle">🔥 {streakCount}</div>
                    <div style={{fontSize: '11px', flex: 1}}>
                      <div>Streak Terbaik: 12 Hari</div>
                      <div style={{opacity: 0.7}}>Centang setelah sholat tiba, anti-uncheck!</div>
                    </div>
                  </div>
                  <div className="mock-checklist">
                    {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map(p => {
                      const isChecked = completedPrayers.includes(p);
                      return (
                        <div 
                          key={p} 
                          className={`mock-check-item ${isChecked ? 'checked' : ''}`}
                          onClick={() => handlePrayerToggle(p)}
                          style={{ cursor: isChecked ? 'default' : 'pointer' }}
                        >
                          <div className="mock-checkbox">{isChecked && '✓'}</div>
                          <span style={{textDecoration: isChecked ? 'line-through' : 'none'}}>{p}</span>
                          <span style={{marginLeft: 'auto', fontSize: '10px', opacity: 0.7}}>
                            {isChecked ? 'Selesai' : 'Klik Centang'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="mockup-pane animate-fade">
                  <div className="mockup-header">
                    <img src="/logo pengaturan navbar.png" alt="Settings" style={{width: '24px'}} />
                    <h3>Pengaturan</h3>
                  </div>
                  <div className="mock-settings-group">
                    <label>📍 Lokasi Utama</label>
                    <div className="mock-dropdown">Jakarta, Indonesia</div>
                  </div>
                  <div className="mock-settings-group" style={{marginTop: '10px'}}>
                    <label>🖥️ Mode Widget (Always on Top)</label>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px'}}>
                      <span style={{fontSize: '10px', opacity: 0.7}}>Melayang & Kunci Jendela Close</span>
                      <div className="mock-toggle active">Aktif</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Interactive Widget Demonstration Section */}
      <section id="demo" className="widget-demo-section">
        <h2 className="section-title">Mode Widget Melayang (Anti-Close)</h2>
        <p className="section-subtitle">
          Sematkan pengingat sholat di sudut desktop Anda. Selalu di atas (Always on Top) dan terkunci aman (tidak bisa ditutup tanpa sengaja), mirip widget Rainmeter.
        </p>
        <div className="widget-demo-container">
          <div className="desktop-wallpaper">
            <div className="simulated-widget">
              <div className="widget-header">
                <img src="/logo.png" alt="logo" style={{width: '24px'}} />
                <span>Pengingat Salat</span>
                <span className="widget-lock">🔒 Lock</span>
              </div>
              <div className="widget-timer">01:14:24</div>
              <div className="widget-next">Selanjutnya: Asr (15:20)</div>
              <div className="widget-streak">Streak: 🔥 {streakCount} Hari</div>
            </div>
            <div className="desktop-icon">📁 My Computer</div>
            <div className="desktop-icon" style={{top: '100px'}}>🗑️ Recycle Bin</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <h2 className="section-title">Fitur-Fitur Premium Unggulan</h2>
        <p className="section-subtitle">
          Didesain dengan detail estetika yang premium dan arsitektur yang modern.
        </p>

        <div className="features-container">
          <div className="features-grid-large">
            <div className="feature-item">
              <img src="/logo streak navbar.png" alt="Streak Icon" />
              <h3>Streak Sholat 🔥</h3>
              <p>Mekanisme pelacak sholat harian satu arah yang mendisiplinkan ibadah Anda. Jika sholat terlewat melewati waktu sholat berikutnya, sholat akan terkunci bolong ❌ dan streak langsung kembali ke nol.</p>
            </div>
            <div className="feature-item">
              <img src="/logo cuaca navbar.png" alt="Weather Icon" />
              <h3>Prakiraan Cuaca Terintegrasi 🌤️</h3>
              <p>Menampilkan data cuaca hari ini serta prakiraan 5 hari ke depan yang disinkronkan langsung berdasarkan kota pilihan Anda menggunakan API Open-Meteo yang super akurat.</p>
            </div>
            <div className="feature-item">
              <img src="/logo alquran.png" alt="Quran Icon" />
              <h3>Al-Quran & Pemutar Murottal Premium 📖</h3>
              <p>Membaca 114 Surat Al-Quran lengkap dengan terjemahan, pemutar audio murottal yang dilengkapi bilah kemajuan (seeking), serta visualizer gelombang suara interaktif.</p>
            </div>
            <div className="feature-item">
              <img src="/logo pengaturan navbar.png" alt="Widget Icon" />
              <h3>Mode Widget Rainmeter-Style 🖥️</h3>
              <p>Jadikan aplikasi melayang permanen di atas program lain (*Always on Top*) dan aktifkan penguncian tombol close (*Anti-Close*) melalui menu pengaturan terpusat.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon-simple">🕌</div>
              <h3>Bundling Suara Adzan Lokal</h3>
              <p>Menyertakan audio adzan lokal premium (Alafasy, Al-Aqsa, H. Muammar ZA, Taha Al-Junayd) yang ter-bundle di dalam aplikasi lengkap dengan tombol Test/Hentikan adzan.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon-simple">🌐</div>
              <h3>Dukungan Lokalisasi 3 Bahasa</h3>
              <p>Aplikasi mendukung penuh Bahasa Indonesia, English, dan Bahasa Malaysia (ms) untuk memastikan kenyamanan bernavigasi sesuai preferensi lokal Anda.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 Pengingat Salat. Dibuat dengan Wails, Go, React, & Vite.</p>
      </footer>
    </div>
  );
}

export default App;
