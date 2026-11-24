import express from 'express';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const allowedOrigins = new Set(
  (process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean)
);
const trustedProxyHops = process.env.TRUST_PROXY_HOPS;

if (trustedProxyHops !== undefined) {
  const hopCount = Number(trustedProxyHops);
  if (!Number.isInteger(hopCount) || hopCount < 1) {
    throw new Error('TRUST_PROXY_HOPS must be a positive integer.');
  }
  app.set('trust proxy', hopCount);
}

app.use(cors({
  origin: (origin, callback) => callback(null, !origin || allowedOrigins.has(origin))
}));

const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => res.status(429).json({ error: 'Too many API requests. Try again later.' })
});
app.use('/api', apiRateLimit);
app.use(express.json({ limit: '128kb' }));

const countries = [
  { code: 'IN', name: 'India', flag: '🇮🇳', law: 'Information Technology Act, 2000', authority: 'Indian Cyber Crime Coordination Centre', enforceable: true, strictness: 'High', verified: '2026-10-18', source: 'https://www.indiacode.nic.in/handle/123456789/13116' },
  { code: 'US', name: 'United States', flag: '🇺🇸', law: 'Computer Fraud and Abuse Act', authority: 'Federal Bureau of Investigation', enforceable: true, strictness: 'High', verified: '2026-10-18', source: 'https://www.justice.gov/criminal/criminal-ccips/computer-fraud-and-abuse-act' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', law: 'Computer Misuse Act 1990', authority: 'National Crime Agency', enforceable: true, strictness: 'High', verified: '2026-10-18', source: 'https://www.legislation.gov.uk/ukpga/1990/18/contents' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', law: 'Computer Misuse Act 1993', authority: 'Singapore Police Force — CCB', enforceable: true, strictness: 'Very high', verified: '2026-10-18', source: 'https://sso.agc.gov.sg/Act/CMA1993' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', law: 'Cybercrime Act 2001', authority: 'Australian Federal Police', enforceable: true, strictness: 'High', verified: '2026-10-18', source: 'https://www.legislation.gov.au/C2001A00734/latest/text' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', law: 'Criminal Code, Part IV/VIII', authority: 'Royal Canadian Mounted Police', enforceable: true, strictness: 'High', verified: '2026-10-18', source: 'https://laws-lois.justice.gc.ca/eng/acts/C-46/' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', law: 'German Criminal Code, §§202a–202d', authority: 'Bundeskriminalamt', enforceable: true, strictness: 'High', verified: '2026-10-18', source: 'https://www.gesetze-im-internet.de/stgb/' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', law: 'Unauthorized Computer Access Act', authority: 'National Police Agency', enforceable: true, strictness: 'Moderate', verified: '2026-10-18', source: 'https://www.npa.go.jp/english/index.html' }
];

const crimes = [
  { id: 'unauthorized-access', name: 'Unauthorized access / hacking', category: 'Access offences', severity: 'High', icon: 'Terminal', definition: 'Intentionally accessing a computer system, device or network without authorization or exceeding lawful access.', ai: false, countries: ['IN','US','GB','SG','AU','CA','DE','JP'], verified: '2026-10-18' },
  { id: 'phishing', name: 'Phishing & online fraud', category: 'Fraud', severity: 'High', icon: 'Fish', definition: 'Deceiving people to disclose credentials, money or sensitive information through fraudulent digital communications.', ai: true, countries: ['IN','US','GB','SG','AU','CA','DE','JP'], verified: '2026-10-18' },
  { id: 'identity-theft', name: 'Identity theft & impersonation', category: 'Identity', severity: 'High', icon: 'Fingerprint', definition: 'Fraudulently obtaining or using another person’s identity, credentials or personal data.', ai: true, countries: ['IN','US','GB','SG','AU','CA','DE','JP'], verified: '2026-10-18' },
  { id: 'ransomware', name: 'Ransomware & malware', category: 'Malicious software', severity: 'Critical', icon: 'ShieldAlert', definition: 'Deploying malicious code to disrupt, encrypt, steal from or demand payment from a victim.', ai: false, countries: ['IN','US','GB','SG','AU','CA','DE','JP'], verified: '2026-10-18' },
  { id: 'cyberstalking', name: 'Cyberstalking & harassment', category: 'Online harm', severity: 'High', icon: 'MessageCircleWarning', definition: 'Repeated or threatening digital conduct intended to cause fear, distress or unwanted contact.', ai: true, countries: ['IN','US','GB','SG','AU','CA','DE','JP'], verified: '2026-10-18' },
  { id: 'data-breach', name: 'Data breach & theft', category: 'Data offences', severity: 'Critical', icon: 'Database', definition: 'Unauthorized acquisition, disclosure or exposure of protected or confidential information.', ai: true, countries: ['IN','US','GB','SG','AU','CA','DE','JP'], verified: '2026-10-18' },
  { id: 'ddos', name: 'Denial-of-service attacks', category: 'Network offences', severity: 'High', icon: 'CloudOff', definition: 'Overwhelming or disrupting an information system to make services unavailable to users.', ai: true, countries: ['US','GB','SG','AU','CA','DE','IN'], verified: '2026-10-18' },
  { id: 'deepfake-fraud', name: 'Deepfake-based fraud', category: 'AI-related crimes', severity: 'Critical', icon: 'ScanFace', definition: 'Using synthetic media, voice cloning or generated identities to impersonate, deceive or defraud.', ai: true, countries: ['IN','US','GB','SG','AU','CA','DE','JP'], verified: '2026-10-18' },
  { id: 'cyberterrorism', name: 'Cyberterrorism', category: 'National security', severity: 'Critical', icon: 'Radiation', definition: 'Cyber operations intended to intimidate, coerce or seriously disrupt critical systems or national security.', ai: false, countries: ['IN','US','GB','SG','AU','CA','DE'], verified: '2026-10-18' },
  { id: 'ipr-theft', name: 'Intellectual property theft', category: 'Property offences', severity: 'Moderate', icon: 'Copyright', definition: 'Unauthorized copying, distribution or exploitation of protected creative, technical or commercial material.', ai: true, countries: ['US','GB','SG','AU','CA','DE','JP'], verified: '2026-10-18' },
  { id: 'child-abuse', name: 'Child exploitation & online abuse', category: 'Online safety', severity: 'Critical', icon: 'ShieldCheck', definition: 'Creating, possessing or distributing abusive child sexual material or grooming children online.', ai: true, countries: ['IN','US','GB','SG','AU','CA','DE','JP'], verified: '2026-10-18' }
];

const provisions = {
  'unauthorized-access': {
    IN: { provision: 'IT Act 2000 §§43, 66; BNS 2023 §329 (where applicable)', penalty: 'Up to 3 years and/or fines', explicit: true },
    US: { provision: '18 U.S.C. §1030', penalty: 'Up to 10 years; up to 20 years for aggravating conduct', explicit: true },
    GB: { provision: 'Computer Misuse Act 1990 §§1–3', penalty: 'Up to 10–14 years for serious offences', explicit: true },
    SG: { provision: 'Computer Misuse Act §§3, 5, 8', penalty: 'Up to 2–10 years and/or fines', explicit: true },
    AU: { provision: 'Criminal Code Act 1995 §§476.2, 478.1', penalty: 'Up to 2–10 years depending on conduct', explicit: true },
    CA: { provision: 'Criminal Code §§342.1, 430(1.1)', penalty: 'Hybrid or indictable; up to 10 years', explicit: true }
  }
};

const proposals = [
  { title: 'Digital Personal Data Protection Rules', jurisdiction: 'India', status: 'Awaiting implementation', statusKey: 'awaiting', date: '2025-01-03', summary: 'Rules supporting the Digital Personal Data Protection Act framework.', source: 'https://www.meity.gov.in/data-protection-framework' },
  { title: 'Online Safety Amendment Bill', jurisdiction: 'Australia', status: 'Proposed / parliamentary consideration', statusKey: 'proposed', date: '2025-11-12', summary: 'A proposed response to emerging harmful and synthetic content online.', source: 'https://www.aph.gov.au/Parliamentary_Business/Bills_Legislation' },
  { title: 'Cyber Resilience Act', jurisdiction: 'European Union', status: 'Enacted; phased application', statusKey: 'enacted', date: '2024-10-23', summary: 'EU framework for cybersecurity requirements of digital products.', source: 'https://eur-lex.europa.eu/eli/reg/2024/2847/oj' }
];

app.get('/api/countries', (_req, res) => res.json(countries));
app.get('/api/crimes', (req, res) => {
  const q = String(req.query.q || '').toLowerCase();
  res.json(crimes.filter(c => !q || `${c.name} ${c.category} ${c.definition}`.toLowerCase().includes(q)));
});
app.get('/api/crimes/:id', (req, res) => {
  const crime = crimes.find(c => c.id === req.params.id);
  if (!crime) return res.status(404).json({ error: 'Crime not found' });
  res.json({ ...crime, sources: countries.filter(c => crime.countries.includes(c.code)).map(c => ({ country: c.name, source: c.source })) });
});
app.get('/api/compare', (req, res) => {
  const codes = String(req.query.countries || '').split(',').filter(Boolean);
  const crimeId = String(req.query.crime || 'unauthorized-access');
  const rows = codes.map(code => {
    const country = countries.find(c => c.code === code);
    const provision = provisions[crimeId]?.[code] || {
      provision: 'Primary statute available in country database',
      penalty: 'Jurisdiction-specific; verify current statutory text',
      explicit: crimeId === 'unauthorized-access'
    };
    return { ...country, ...provision };
  });
  res.json(rows);
});
app.get('/api/proposals', (_req, res) => res.json(proposals));
app.use('/api', (_req, res) => res.status(404).json({ error: 'API endpoint not found.' }));

app.use((error, _req, res, next) => {
  if (error && error.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Request body is too large.' });
  }
  if (error instanceof SyntaxError && Object.prototype.hasOwnProperty.call(error, 'body')) {
    return res.status(400).json({ error: 'Request body must be valid JSON.' });
  }
  return next(error);
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, '..', 'dist');
app.use(express.static(dist));
app.use((_req, res) => res.sendFile(path.join(dist, 'index.html')));

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`CyberLex API and app listening on port ${port}`));
