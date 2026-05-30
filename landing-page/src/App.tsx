import { useState, useEffect } from 'react';
import './index.css'; // Make sure we use index.css instead of App.css if we're replacing the whole style

function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="landing-container">
      <div className="hero-panel">
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        
        <h1 className="title">Aplikasi Pengingat Salat</h1>
        <p className="subtitle">
          Tetap terhubung dengan ibadah Anda melalui notifikasi jadwal salat yang akurat dan desain modern yang nyaman di mata. Dibuat khusus untuk Windows Anda.
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🕌</div>
            <div className="feature-title">Akurat & Terpercaya</div>
            <p style={{color: 'var(--text-secondary)', fontSize: '14px', marginTop: '10px'}}>Jadwal ditarik langsung dari sumber resmi (Kemenag).</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💻</div>
            <div className="feature-title">Notifikasi Desktop</div>
            <p style={{color: 'var(--text-secondary)', fontSize: '14px', marginTop: '10px'}}>Popup otomatis di layar komputer saat waktu salat tiba.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <div className="feature-title">Desain Elegan</div>
            <p style={{color: 'var(--text-secondary)', fontSize: '14px', marginTop: '10px'}}>Tema Islami dengan mode Terang dan Gelap.</p>
          </div>
        </div>

        <a href="/downloads/pengingat-solat.exe" className="download-btn" download>
          Download untuk Windows
        </a>
        <p style={{marginTop: '20px', color: 'var(--text-secondary)', fontSize: '12px'}}>
          *Hanya tersedia untuk Windows OS (Versi 1.0)
        </p>
      </div>
    </div>
  );
}

export default App;
