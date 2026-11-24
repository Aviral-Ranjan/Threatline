import { useEffect, useMemo, useState } from 'react';
import {
  Search, Scale, Sparkles, ShieldCheck, ArrowUpRight, ArrowRight,
  ChevronDown, Menu, X, Sun, Moon, Database, CircleAlert,
  ExternalLink, CheckCircle2, Clock3, Filter,
  Bookmark, CalendarDays, FileSearch, Landmark
} from 'lucide-react';

const navItems = [
  ['Incidents', 'home'], ['Law Explorer', 'countries'], ['Compare', 'compare'],
  ['Legislative Tracker', 'legislation'], ['AI & Cybercrime', 'ai']
];

const incidentTopics = ['All signals', 'Ransomware', 'Fraud', 'AI & deepfakes', 'Law enforcement', 'Data breach', 'Cybersecurity'];

const incidentReports = [
  {
    id: 'cross-border-ransomware',
    category: 'Ransomware',
    date: 'Nov 24, 2026',
    source: 'Threatline Desk',
    title: 'When ransomware crosses borders, which laws apply?',
    summary: 'A practical briefing on jurisdiction, incident reporting, evidence preservation and cooperation between investigators.',
    link: 'https://www.justice.gov/criminal/criminal-ccips',
    image: true
  },
  {
    id: 'fraud-evidence',
    category: 'Fraud',
    date: 'Nov 21, 2026',
    source: 'U.S. Department of Justice',
    title: 'Following the money in online fraud investigations',
    summary: 'How investigators and prosecutors approach digital records, payment trails and cross-border evidence.',
    link: 'https://www.justice.gov/criminal/criminal-fraud'
  },
  {
    id: 'international-cooperation',
    category: 'Law enforcement',
    date: 'Nov 19, 2026',
    source: 'Council of Europe',
    title: 'Cross-border evidence requests: a guide to the legal pathways',
    summary: 'An overview of cooperation mechanisms used to preserve and obtain electronic evidence.',
    link: 'https://www.coe.int/en/web/cybercrime'
  },
  {
    id: 'deepfake-impersonation',
    category: 'AI & deepfakes',
    date: 'Nov 17, 2026',
    source: 'Federal Trade Commission',
    title: 'Deepfake impersonation and the laws already on the books',
    summary: 'A look at how existing fraud, identity and privacy rules may apply to synthetic voice and video scams.',
    link: 'https://www.ftc.gov/business-guidance/blog/2024/02/fighting-back-against-harmful-voice-cloning'
  },
  {
    id: 'data-breach-notice',
    category: 'Data breach',
    date: 'Nov 14, 2026',
    source: 'Information Commissioner’s Office',
    title: 'A data breach happens. What are an organization’s next steps?',
    summary: 'A concise guide to breach assessment, notification duties and preserving a clear audit trail.',
    link: 'https://ico.org.uk/for-organisations/report-a-breach/'
  },
  {
    id: 'cybersecurity-basics',
    category: 'Cybersecurity',
    date: 'Nov 10, 2026',
    source: 'Cybersecurity and Infrastructure Security Agency',
    title: 'Incident response starts before an incident',
    summary: 'Preparation and reporting guidance for organizations strengthening their response plans.',
    link: 'https://www.cisa.gov/topics/cyber-threats-and-advisories'
  }
];

function App() {
  const [page, setPage] = useState('home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const [query, setQuery] = useState('');
  const [incidentTopic, setIncidentTopic] = useState('All signals');
  const [savedReports, setSavedReports] = useState([]);
  const [savedOnly, setSavedOnly] = useState(false);
  const [crimes, setCrimes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState(['IN', 'US', 'GB']);
  const [comparison, setComparison] = useState([]);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  }, [dark]);

  useEffect(() => {
    fetch('/api/countries').then(r => r.json()).then(setCountries);
    fetch('/api/crimes').then(r => r.json()).then(setCrimes);
    fetch('/api/proposals').then(r => r.json()).then(setProposals);
  }, []);

  useEffect(() => {
    fetch(`/api/compare?countries=${selectedCountries.join(',')}&crime=unauthorized-access`)
      .then(r => r.json()).then(setComparison);
  }, [selectedCountries]);

  const crimeResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? crimes.filter(c => `${c.name} ${c.category} ${c.definition}`.toLowerCase().includes(q)) : crimes;
  }, [query, crimes]);

  const filteredReports = useMemo(() => {
    const q = query.trim().toLowerCase();
    return incidentReports.filter(report =>
      (incidentTopic === 'All signals' || report.category === incidentTopic) &&
      (!savedOnly || savedReports.includes(report.id)) &&
      (!q || `${report.title} ${report.summary} ${report.category} ${report.source}`.toLowerCase().includes(q))
    );
  }, [incidentTopic, query, savedOnly, savedReports]);

  function navigate(next) {
    setPage(next);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function toggleCountry(code) {
    setSelectedCountries(prev => prev.includes(code)
      ? (prev.length > 2 ? prev.filter(c => c !== code) : prev)
      : (prev.length < 4 ? [...prev, code] : prev));
  }

  function toggleSaved(id) {
    setSavedReports(previous => previous.includes(id)
      ? previous.filter(reportId => reportId !== id)
      : [...previous, id]);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => navigate('home')} aria-label="Threatline home">
          <span className="brand-mark"><ShieldCheck size={19} /></span>
          <span>THREATLINE</span>
        </button>

        <nav className={mobileOpen ? 'nav open' : 'nav'} aria-label="Main navigation">
          {navItems.map(([label, key]) => (
            <button key={key} className={page === key ? 'active' : ''} onClick={() => navigate(key)}>
              {label}
            </button>
          ))}
        </nav>

        <div className="header-actions">
          <button className="icon-button desktop-icon" onClick={() => document.getElementById('incident-search')?.focus()} aria-label="Search threat briefings">
            <Search size={18} />
          </button>
          <button className="icon-button desktop-icon" onClick={() => { setSavedOnly(true); document.getElementById('incident-feed')?.scrollIntoView({ behavior: 'smooth' }); }} aria-label={`Open saved reports: ${savedReports.length}`}>
            <Bookmark size={17} />
            {savedReports.length > 0 && <span className="saved-count">{savedReports.length}</span>}
          </button>
          <button className="icon-button" onClick={() => setDark(v => !v)} aria-label="Toggle theme">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="menu-button" onClick={() => setMobileOpen(v => !v)} aria-label="Menu">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <main>
        {page === 'home' && (
          <>
            <section className="hero">
              <div className="hero-title">
                <span className="hero-eyebrow">CYBERSECURITY INTELLIGENCE · GLOBAL LAW</span>
                <h1>Cybercrime, decoded.</h1>
                <p>Follow the threats shaping our digital world—and the laws written to confront them.</p>
              </div>
              <form className="incident-search" onSubmit={e => { e.preventDefault(); document.getElementById('incident-feed')?.scrollIntoView({ behavior: 'smooth' }); }}>
                <label htmlFor="incident-search">Search threat briefings</label>
                <div className="search-controls">
                  <div className="search-input-wrap"><Search size={18} /><input id="incident-search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search ransomware, deepfakes, data breaches..." /></div>
                  <button type="submit">Search</button>
                </div>
              </form>
              <div className="topic-bar" role="group" aria-label="Filter by incident topic">
                {incidentTopics.map(topic => (
                  <button key={topic} className={incidentTopic === topic ? 'selected' : ''} onClick={() => setIncidentTopic(topic)}>{topic}</button>
                ))}
              </div>
              <div className="featured-layout">
                <article className="feature-report">
                  <div className="feature-copy">
                    <div className="report-meta"><span>{incidentReports[0].category}</span><time>{incidentReports[0].date}</time><span>{incidentReports[0].source}</span></div>
                    <h2>{incidentReports[0].title}</h2>
                    <p>{incidentReports[0].summary}</p>
                    <a className="read-brief" href={incidentReports[0].link} target="_blank" rel="noreferrer">Read the briefing <ArrowRight size={16} /></a>
                  </div>
                  <a className="feature-image" href={incidentReports[0].link} target="_blank" rel="noreferrer" aria-label="Open official cybercrime resources">
                    <span>THREAT FILE 01</span>
                    <span className="image-caption">Illustration · Threatline</span>
                  </a>
                </article>
                <aside className="dispatches">
                  <h2>From the desk</h2>
                  {incidentReports.slice(1, 4).map(report => (
                    <article className="dispatch-card" key={report.id}>
                      <div className="report-meta"><span>{report.category}</span><time>{report.date}</time></div>
                      <h3><a href={report.link} target="_blank" rel="noreferrer">{report.title}</a></h3>
                      <p>{report.source}</p>
                    </article>
                  ))}
                  <a className="more-link" href="#incident-feed">Explore the threat feed <ArrowRight size={15} /></a>
                </aside>
              </div>
            </section>

            <section className="content-section report-research-layout" id="incident-feed">
              <div className="report-feed">
                <div className="feed-heading">
                  <div><span className="section-kicker">FIELD NOTES</span><h2>{savedOnly ? 'Saved signals' : 'The threat feed'}</h2></div>
                  <div className="feed-filter"><Filter size={16} /><input aria-label="Filter listed reports" value={query} onChange={e => setQuery(e.target.value)} placeholder="Filter reports..." /></div>
                </div>
                {savedOnly && <button className="feed-mode" onClick={() => setSavedOnly(false)}>Show all reports <ArrowRight size={14} /></button>}
                <div className="feed-list">
                  {filteredReports.length ? filteredReports.map(report => (
                    <article className="feed-report" key={report.id}>
                      <div className="feed-date"><CalendarDays size={17} /><span>{report.date}</span></div>
                      <div className="feed-copy">
                        <div className="report-meta"><span>{report.category}</span><span>{report.source}</span></div>
                        <h3><a href={report.link} target="_blank" rel="noreferrer">{report.title}</a></h3>
                        <p>{report.summary}</p>
                        <a className="read-brief" href={report.link} target="_blank" rel="noreferrer">Read brief <ArrowRight size={14} /></a>
                      </div>
                      <button className={`save-report ${savedReports.includes(report.id) ? 'saved' : ''}`} onClick={() => toggleSaved(report.id)} aria-label={`${savedReports.includes(report.id) ? 'Remove bookmark for' : 'Bookmark'} ${report.title}`}>
                        <Bookmark size={18} fill={savedReports.includes(report.id) ? 'currentColor' : 'none'} />
                      </button>
                    </article>
                  )) : <p className="empty-feed">No reports match those filters. Try another topic or search.</p>}
                </div>
                <p className="editorial-note">Editorial research briefs; consult linked official sources for primary information.</p>
              </div>
              <aside className="legal-research">
                <h2>Explore the law</h2>
                <button onClick={() => navigate('countries')}><Landmark size={20} /><span><b>Law Explorer</b><small>Legislation across jurisdictions</small></span><ArrowUpRight size={16} /></button>
                <button onClick={() => navigate('compare')}><Scale size={20} /><span><b>Compare penalties</b><small>Read statutes side by side</small></span><ArrowUpRight size={16} /></button>
                <button onClick={() => navigate('legislation')}><Clock3 size={20} /><span><b>Legislative Tracker</b><small>Proposals and commencement dates</small></span><ArrowUpRight size={16} /></button>
                <button onClick={() => navigate('crimes')}><FileSearch size={20} /><span><b>Offence directory</b><small>Browse cybercrime topics</small></span><ArrowUpRight size={16} /></button>
              </aside>
            </section>
          </>
        )}

        {page === 'crimes' && (
          <PageHeader kicker="OFFENCE DIRECTORY" title="Cybercrime knowledge base" copy="Search documented offences and trace the legal frameworks that govern them." />
        )}
        {(page === 'crimes' || page === 'ai') && (
          <section className="directory content-section">
            <div className="directory-tools">
              <div className="global-search inline">
                <Search size={19} />
                <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Filter offences..." />
              </div>
              <button className="filter-button"><Filter size={17} /> All categories <ChevronDown size={15} /></button>
            </div>
            <div className="crime-grid">
              {(page === 'ai' ? crimes.filter(c => c.ai) : crimeResults).map((crime, index) => (
                <article className="crime-card" key={crime.id}>
                  <div className="card-top">
                    <span className={`crime-icon icon-${index % 4}`}><Database size={20} /></span>
                    {crime.ai && <span className="ai-tag"><Sparkles size={12} /> AI-related</span>}
                  </div>
                  <h3>{crime.name}</h3>
                  <p>{crime.definition}</p>
                  <div className="source-line"><CheckCircle2 size={14} /> Verified {crime.verified}</div>
                </article>
              ))}
            </div>
          </section>
        )}

        {page === 'countries' && (
          <>
            <PageHeader kicker="JURISDICTION INDEX" title="Countries & cyber law" copy="Explore governing statutes, enforcement authorities and official sources." />
            <section className="content-section country-grid">
              {countries.map(country => (
                <article className="country-card" key={country.code}>
                  <div className="country-heading"><span className="large-flag">{country.flag}</span><span className="status-dot" /></div>
                  <h3>{country.name}</h3>
                  <p>{country.law}</p>
                  <dl>
                    <div><dt>Authority</dt><dd>{country.authority}</dd></div>
                    <div><dt>Status</dt><dd>Enforceable</dd></div>
                  </dl>
                  <a href={country.source} target="_blank" rel="noreferrer">Official source <ExternalLink size={14} /></a>
                </article>
              ))}
            </section>
          </>
        )}

        {page === 'compare' && (
          <>
            <PageHeader kicker="COMPARATIVE ANALYSIS" title="Compare cyber law frameworks" copy="Compare primary statutes for unauthorized computer access across selected jurisdictions." />
            <section className="content-section comparison-section">
              <div className="country-picker">
                {countries.map(c => (
                  <button key={c.code} className={selectedCountries.includes(c.code) ? 'selected' : ''} onClick={() => toggleCountry(c.code)}>
                    <span>{c.flag}</span>{c.name}{selectedCountries.includes(c.code) && <CheckCircle2 size={15} />}
                  </button>
                ))}
              </div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Jurisdiction</th><th>Primary provision</th><th>Penalty exposure</th><th>Explicitly covered</th></tr></thead>
                  <tbody>
                    {comparison.map(row => (
                      <tr key={row.code}>
                        <td><span className="table-country">{row.flag} {row.name}</span><small>{row.law}</small></td>
                        <td>{row.provision}</td>
                        <td><span className="penalty">{row.penalty}</span></td>
                        <td><span className={row.explicit ? 'yes' : 'verify'}>{row.explicit ? 'Yes' : 'Verify'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="method-note">
                <CircleAlert size={18} />
                <div><b>Strictness comparison methodology</b><p>No automatic score is assigned. “Strictness” reflects the availability of explicit offences and maximum sentence exposure, not enforcement effectiveness. Jurisdictions vary in sentencing guidelines and procedure. Verify the current primary statute.</p></div>
              </div>
            </section>
          </>
        )}

        {page === 'legislation' && (
          <>
            <PageHeader kicker="LEGISLATIVE MONITOR" title="Proposed & pending legislation" copy="Separate drafts, commenced laws and enforceable legislation." />
            <section className="content-section legislation-list">
              {proposals.map(item => (
                <article className="legislation-card" key={item.title}>
                  <div className={`legislation-status ${item.statusKey}`}><Clock3 size={14} /> {item.status}</div>
                  <div className="legislation-main">
                    <span className="jurisdiction">{item.jurisdiction}</span>
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                  </div>
                  <div className="legislation-meta"><span>Last update</span><b>{item.date}</b><a href={item.source} target="_blank" rel="noreferrer">Official reference <ExternalLink size={14} /></a></div>
                </article>
              ))}
            </section>
          </>
        )}

      </main>

      <footer>
        <div className="footer-brand"><ShieldCheck size={18} /><b>THREATLINE</b></div>
        <p>Educational and research platform. Not a substitute for professional legal advice.</p>
        <button onClick={() => navigate('home')}>Sources & methodology <ArrowUpRight size={14} /></button>
      </footer>
    </div>
  );
}

function PageHeader({ kicker, title, copy }) {
  return (
    <section className="page-header">
      <div className="eyebrow"><span /> {kicker}</div>
      <h1>{title}</h1>
      <p>{copy}</p>
    </section>
  );
}

export default App;
