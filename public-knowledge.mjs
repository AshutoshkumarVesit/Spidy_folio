// Only facts already approved for the public portfolio belong here.
// Do not import the private planning notes or the full resume into chat context.
export const facts = [
  { id: 'profile', title: 'About Ashutosh', text: 'Ashutosh Tripathi is a Computer Engineering student at VESIT, Mumbai, with expected graduation in 2027. He builds web, Android and machine learning applications with Java and Python. His portfolio focuses on clean architecture, offline support and practical AI. No professional employment or internship experience is confirmed for this portfolio.', actions: ['about', 'resume'] },
  { id: 'skills', title: 'Skills and toolkit', text: 'Java, Python, JSP/Servlets, Flask, FastAPI, Android, Firebase, WorkManager, scikit-learn, pandas, Gemini, MySQL, SQLite, DSA, REST APIs, Git, Docker, Kubernetes, OOP, DBMS, Operating Systems, Computer Networks, Figma and Canva. No proficiency percentages or certifications are claimed.', actions: ['skills', 'projects'] },
  { id: 'bookstore', title: 'E-Book Management System', text: 'A web application built for a client, using Java, JSP/Servlets, MySQL and Cloudinary. Features include cart, checkout, order tracking, email confirmations, separate customer/admin access, inventory and stock management, and a modular DAO architecture. No client name, revenue or user-count metrics are provided.', actions: ['bookstore', 'bookstore-source'] },
  { id: 'movemate', title: 'MoveMate', text: 'An Android fitness app built with Java, SQLite, Firebase Firestore and WorkManager. It supports offline run logging and cloud synchronization, distance and pace dashboards, personal bests, goals, community leaderboards and reminders. It does not have a confirmed public app-store release.', actions: ['movemate', 'movemate-source'] },
  { id: 'smartml', title: 'SmartML', text: 'An interactive Python/Flask machine learning dashboard using scikit-learn, pandas, NumPy and Plotly. It helps explore CSV datasets, visualize data, train and compare models, evaluate results and perform clustering. No performance metrics or deployment claims are provided.', actions: ['smartml', 'smartml-source'] },
  { id: 'quizcraft', title: 'QuizCraft', text: 'A Flask application using Gemini, SQLite and Whisper to turn study material into flashcards and quizzes, with feedback on answers. It supports text and PDF input, OCR and audio transcription. A project walkthrough is linked in the portfolio.', actions: ['quizcraft', 'quizcraft-source', 'quizcraft-video'] },
  { id: 'smartsurplus', title: 'SmartSurplus', text: 'A Python/FastAPI and scikit-learn prototype for predicting food surplus and matching food providers with nearby NGOs by distance, urgency and available capacity. It uses Pydantic and in-memory demo data. It is not presented as a production service or as having real NGO partnerships.', actions: ['smartsurplus', 'smartsurplus-source'] },
  { id: 'contact', title: 'Contact and links', text: 'Public contact email: ashutosh14042006@gmail.com. GitHub: AshutoshkumarVesit. LinkedIn: ashutoshkumar-tripathi. A downloadable resume is available. Current availability, salary, employment history and private personal details are not confirmed.', actions: ['contact', 'github', 'linkedin', 'resume'] },
  { id: 'game', title: 'Web Swing Challenge', text: 'An optional 30-second portfolio mini game. Hold the pointer, touch or Space to attach a web one dot ahead of the dot nearest the spider. The same dot stays connected until release; swinging uses momentum and gravity in both directions. Release to detach and fly with existing momentum, then press again to attach one dot ahead of the nearest. Dots and coins are spread across four height bands. Earn 1 point per new forward meter and 10 per unique coin. Backtracking does not repeat distance points. The HUD and result show distance and coins separately. Three hearts, drones to avoid, a pause button and a personal best stored in this browser for the current scoring system. This game is a portfolio interaction.', actions: ['game'] }
];

export const actions = {
  about: { label: 'About Ashutosh', href: '#about' },
  skills: { label: 'Explore skills', href: '#skills' },
  projects: { label: 'View projects', href: '#projects' },
  contact: { label: 'Get in touch', href: '#contact' },
  resume: { label: 'Download resume', href: 'assets/documents/Ashutosh_Tripathi_Resume.pdf', download: true },
  github: { label: 'GitHub', href: 'https://github.com/AshutoshkumarVesit/' },
  linkedin: { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ashutoshkumar-tripathi/' },
  bookstore: { label: 'View E-Book project', href: '#project-bookstore' },
  'bookstore-source': { label: 'E-Book source', href: 'https://github.com/AshutoshkumarVesit/Book_Store' },
  movemate: { label: 'View MoveMate', href: '#project-movemate' },
  'movemate-source': { label: 'MoveMate source', href: 'https://github.com/AshutoshkumarVesit/Movemate' },
  smartml: { label: 'View SmartML', href: '#smartml-title' },
  'smartml-source': { label: 'SmartML source', href: 'https://github.com/AshutoshkumarVesit/SmartML' },
  quizcraft: { label: 'View QuizCraft', href: '#quizcraft-title' },
  'quizcraft-source': { label: 'QuizCraft source', href: 'https://github.com/AshutoshkumarVesit/QuizCraft' },
  'quizcraft-video': { label: 'Watch walkthrough', href: 'https://youtu.be/U5VrUPWq-Vc' },
  smartsurplus: { label: 'View SmartSurplus', href: '#smartsurplus-title' },
  'smartsurplus-source': { label: 'SmartSurplus source', href: 'https://github.com/AshutoshkumarVesit/SmartSurplus' },
  game: { label: 'Take a swing', href: '#web-swing', game: true }
};

const snippets = {
  profile: 'Hey, I’m Spidy, Ashutosh’s portfolio guide! Ashutosh is a Computer Engineering student at VESIT, Mumbai, graduating in 2027. He builds web, Android and AI/ML projects, mainly with Java and Python.',
  skills: 'His toolkit connects Java and Android with Python, Flask, FastAPI and machine learning. He also lists MySQL, SQLite, Firebase, Git, Docker and Kubernetes. The Skills section connects these tools to actual project examples.',
  bookstore: 'The E-Book Management System is a client project built with Java, JSP/Servlets, MySQL and Cloudinary. It covers the shopping cart, checkout, order tracking, email confirmations and admin inventory tools, with a modular DAO architecture.',
  movemate: 'MoveMate is his Android fitness project. Java powers the app, SQLite handles offline run logs, Firebase Firestore syncs data, and WorkManager schedules reminders. It also includes pace, distance, goals and community leaderboards.',
  smartml: 'SmartML turns CSV data into insights. It uses Python, Flask, scikit-learn and Plotly for data exploration, visualizations, model training, comparisons, evaluation and clustering. You can explore its source below.',
  quizcraft: 'QuizCraft turns study material into flashcards and quizzes, with Gemini-powered generation and answer feedback. Its Flask app uses SQLite and Whisper, and supports PDFs, OCR and audio transcription. There’s a walkthrough too!',
  smartsurplus: 'SmartSurplus explores predicting food surplus and matching providers with nearby NGOs using distance, urgency and capacity. It’s a FastAPI/scikit-learn prototype with in-memory demo data.',
  contact: 'You can reach Ashutosh at ashutosh14042006@gmail.com, browse his GitHub or connect on LinkedIn. His resume is available to download from this portfolio.',
  game: 'Ready for a quick swing? Hold your mouse, touch or Space to attach one dot ahead of the nearest dot. Release to fly with momentum, then press again for a new web. Earn 1 point per new forward meter and 10 per coin. Coins and web dots are spread at different heights. Avoid drones; you have 30 seconds and three hearts.'
};

export const suspiciousInput = text => /(?:ignore|disregard|override).{0,50}(?:instructions|rules|prompt)|(?:system|developer)\s*(?:prompt|message)|(?:reveal|print|show|give).{0,40}(?:api.?key|secret|password)|\bjailbreak\b|\bact as\b|\bDAN\b/i.test(text);

export function savedAnswer(question, history = []) {
  const lower = question.toLowerCase();
  if (suspiciousInput(question)) return { answer: 'My web stays on Ashutosh’s public portfolio. I can explain his projects, skills or how to contact him.', sourceIds: [], actionIds: ['projects', 'contact'] };
  if (/salary|phone|address|internship|experience|years|job history|certificat|available|hiring|availability/i.test(question)) return { answer: 'That detail isn’t confirmed in the public portfolio. I can share his project work and education, or help you contact Ashutosh directly.', sourceIds: ['profile', 'contact'], actionIds: ['projects', 'contact'] };
  if (/java/.test(lower) && /project|work|built|build/.test(lower)) return { answer: 'Two Java projects to explore: the E-Book Management System uses Java with JSP/Servlets and MySQL for a client bookstore; MoveMate uses Java for an Android fitness app, with SQLite, Firebase and WorkManager.', sourceIds: ['bookstore', 'movemate'], actionIds: ['bookstore', 'movemate'] };
  const projects = ['bookstore', 'movemate', 'smartml', 'quizcraft', 'smartsurplus'];
  const findProject = text => /e.?book|book.?store|client/.test(text) ? 'bookstore' : projects.find(id => text.replace(/\s/g, '').includes(id));
  let id = findProject(lower);
  if (!id && /\b(it|that|this|its)\b/.test(lower)) {
    for (const item of [...history].reverse()) {
      id = findProject(String(item.content || '').toLowerCase());
      if (id) break;
    }
  }
  if (!id) {
    if (/contact|email|reach|linkedin|github|resume|cv/.test(lower)) id = 'contact';
    else if (/skill|tool|stack|java|python|docker|kubernetes|android/.test(lower)) id = 'skills';
    else if (/game|swing|play|control/.test(lower)) id = 'game';
    else if (/project|built|build|work/.test(lower)) return { answer: 'His projects span client web work, Android and AI: E-Book Management System, MoveMate, SmartML, QuizCraft and SmartSurplus. Pick a project and I’ll walk you through it.', sourceIds: projects, actionIds: ['projects', 'smartml', 'quizcraft'] };
    else if (/ashutosh|about|who|hello|\bhi\b|hey|education|college|student|naam|bata|kaun/.test(lower)) id = 'profile';
  }
  if (!id) return { answer: 'I’m here to guide you through Ashutosh’s portfolio. Try asking about a project, his skills, education or contact details.', sourceIds: [], actionIds: ['projects', 'skills', 'contact'] };
  return { answer: snippets[id], sourceIds: [id], actionIds: facts.find(fact => fact.id === id).actions.slice(0, 3) };
}
