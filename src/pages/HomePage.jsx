import { LegacySection } from '../components/LegacySection.jsx';

// Keep the original hero and team sections; remove all other homepage sections.
export default function HomePage() {
  return <LegacySection html={`
    <div id="homeView">
      <header class="site-nav" id="siteNav">
        <div class="nav-inner">
          <a href="#home" class="brand-title">Campus<span>Flow</span></a>
          <div class="nav-actions">
            <a href="#login" class="btn btn-solid">Log in</a>
          </div>
        </div>
      </header>

      <main>
        <section class="hero" id="home">
          <div class="hero-inner">
            <div class="hero-copy">
              <h1>One dashboard for everything that happens on campus.</h1>
              <p class="hero-sub">
                Attendance, timetables, fees, notices, grades and the library —
                Campus Flow gathers the paperwork of college life into a single
                place your students and faculty actually want to open.
              </p>
              <div class="hero-actions">
                <a href="#login" class="btn btn-solid btn-lg">Log in</a>
              </div>
            </div>
            <div class="hero-visual">
              <div class="module-cluster">
                <div class="module-tile tile-1"><span class="module-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span><span class="module-name">Attendance</span></div>
                <div class="module-tile tile-2"><span class="module-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg></span><span class="module-name">Timetable</span></div>
                <div class="module-tile tile-3"><span class="module-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M2 10h20"/></svg></span><span class="module-name">Fees</span></div>
                <div class="module-tile tile-4"><span class="module-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a1.99 1.99 0 0 1-3.4 0"/></svg></span><span class="module-name">Notices</span></div>
                <div class="module-tile tile-5"><span class="module-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/></svg></span><span class="module-name">Grades</span></div>
                <div class="module-tile tile-6"><span class="module-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></span><span class="module-name">Library</span></div>
              </div>
            </div>
          </div>
        </section>

        <section class="team" id="team">
          <div class="section-inner">
            <h2>Made by Code4Chill</h2>
            <p class="section-sub">A student team designing and building Campus Flow from the ground up.</p>
            <div class="team-grid">
              <div class="team-card"><div class="team-photo">IK</div><div class="team-name">Ishreen Kaur</div><div class="team-role">Code4Chill</div></div>
              <div class="team-card"><div class="team-photo">SG</div><div class="team-name">Sana Garg</div><div class="team-role">Code4Chill</div></div>
              <div class="team-card"><div class="team-photo">MM</div><div class="team-name">Manvi Malik</div><div class="team-role">Code4Chill</div></div>
              <div class="team-card"><div class="team-photo">NG</div><div class="team-name">Nancy Gupta</div><div class="team-role">Code4Chill</div></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  `} />;
}
