// Public portfolio facts and a curated transcription of the supplied resume.
// Keep private planning notes, phone numbers, postal addresses and credentials out.
// Resume figures describe that document, not a continuously updated student record.
export const facts = [
  { id: 'profile', title: 'About Ashutosh', text: 'Ashutosh Tripathi (Ashutoshkumar Tripathi on his resume) is a Computer Engineering student at VESIT, Mumbai, with expected graduation in 2027. He builds web, Android and machine learning applications with Java and Python, focusing on clean architecture, offline-first design and scalable data management. His resume says he is seeking software engineering opportunities; current availability is not confirmed. He has not claimed full-time employment. Describe freelance project work, student activities and resume-listed certificates separately from employment.', actions: ['about', 'resume'] },
  { id: 'education', title: 'Resume: degree and CGPA', text: 'The supplied resume lists Vivekanand Education Society’s Institute of Technology (VESIT), Mumbai: Bachelor of Engineering (B.E.) in Computer Engineering, expected 2027. It records a CGPA of 9.42 through Semester VI. Attribute this figure to the resume; do not call it a newly verified current result. Relevant courses: Data Structures and Algorithms, Object-Oriented Programming, Operating Systems, Database Management Systems and Computer Networks.', actions: ['resume', 'about'] },
  { id: 'school', title: 'Resume: HSC and subject marks', text: 'The supplied resume lists I.D.U.B.S Junior College of Science and Commerce: Higher Secondary Certificate (12th/HSC), 89.67%, May 2023. Mathematics: 97/100; Computer Science: 197/200. No SSC/10th marks are supplied.', actions: ['resume'] },
  { id: 'activities', title: 'Resume: CSI VESIT activities', text: 'The supplied resume lists Jr. Public Relations Officer at CSI VESIT for 2024–2025. Contributions: designed multiple social media posts and helped with organization planning. This is an extracurricular/student role, not a claim of professional employment.', actions: ['resume', 'about'] },
  { id: 'certificates', title: 'Resume: certificates and recognition', text: 'The resume’s Certificates section lists Java Programming–MOOC; Winter Internship at VESIT; Frontend Developer internship at Code Alpha; and Frontend Developer of the Month at CodeAlpha (September 24, as written in the document). Report these as resume-listed entries. The resume does not supply internship durations, work responsibilities or separate certificate verification. Do not turn these entries into claims of full-time work or invent dates and duties.', actions: ['resume', 'contact'] },
  { id: 'skills', title: 'Skills and toolkit', text: 'Resume skills: Java, Python, MySQL, DSA, DBMS, REST APIs, Git/GitHub, Operating Systems, Computer Networks, Android Development, Machine Learning, Canva, Figma and AutoCAD. Additional portfolio/project tools: JSP/Servlets, Flask, FastAPI, Firebase, WorkManager, scikit-learn, pandas, Gemini, SQLite, Docker, Kubernetes and OOP. No proficiency percentages are supplied.', actions: ['skills', 'projects', 'resume'] },
  { id: 'bookstore', title: 'E-Book Management System', text: 'The resume describes a freelance project delivered for a client: a full-stack book e-commerce platform for inventory, customer transactions and admin operations. Resume stack: Java 11, JSP, Servlets, Jakarta EE, MySQL 8.0, JSTL, Bootstrap 5, Maven, Apache Tomcat, Cloudinary and JavaMail. Contributions: cart, multi-method checkout, order tracking and automated email confirmations using JavaMail; role-based customer/admin access, order fulfillment and stock monitoring; DAO persistence with optimized MySQL queries for catalog, filtering, search and transaction history; Cloudinary image storage and media delivery. No client identity, revenue, user count or measured performance figures are supplied.', actions: ['bookstore', 'bookstore-source', 'resume'] },
  { id: 'movemate', title: 'MoveMate', text: 'The resume describes an Android fitness app using Java, Android, SQLite, Firebase Firestore and MVC/MVVM. Contributions: a dual-database design for offline run logging and real-time cross-device cloud sync; dashboards for distance, pace, personal bests and goals; separation of concerns with MVC/MVVM; community leaderboard and Firebase-backed community features; Android WorkManager reminders and goal-check alerts; a weather API for pre-run weather context. The resume describes avoiding data loss in low-connectivity scenarios but supplies no measured guarantee. No public app-store release is confirmed.', actions: ['movemate', 'movemate-source', 'resume'] },
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
  education: 'According to his resume, Ashutosh is pursuing a B.E. in Computer Engineering at VESIT, Mumbai, with expected graduation in 2027. The resume records a CGPA of 9.42 through Semester VI. His coursework includes DSA, OOP, Operating Systems, DBMS and Computer Networks.',
  school: 'His resume lists HSC (12th) from I.D.U.B.S Junior College of Science and Commerce in May 2023, with 89.67%. His subject scores were Mathematics 97/100 and Computer Science 197/200. SSC/10th marks aren’t provided.',
  activities: 'His resume lists an extracurricular role as Jr. Public Relations Officer at CSI VESIT during 2024–2025. He designed social media posts and helped with organization planning.',
  certificates: 'His resume’s Certificates section lists Java Programming–MOOC, Winter Internship at VESIT, a Frontend Developer internship at Code Alpha, and Frontend Developer of the Month at CodeAlpha (September 24, as written). It doesn’t provide internship durations or detailed responsibilities.',
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
export const isGreeting = text => /^(?:(?:hi|hello|hey|hii+|yo|namaste|namaskar|thanks|thank you|shukriya|good (?:morning|afternoon|evening))(?:\s+(?:spidy|bro|there|buddy|ji))?[\s!,.?]*)$/i.test(text.trim());

// Keep routine questions within Groq's token allowance without losing the resume.
// Resolve follow-ups from the latest visitor topic, not a guessed model summary.
export function selectFacts(question, history = []) {
  const topics = text => {
    const ids = new Set();
    if (/cgpa|gpa|degree|graduat|education|college|university|semester|coursework|courses|qualification|padhai|vesit/i.test(text)) ids.add('education');
    if (/hsc|12th|twelfth|school|junior college|percentage|mathematics|computer science|subject|marks|ssc|10th/i.test(text)) ids.add('school');
    if (/csi|public relations|extracurricular|activit|social media|organization planning|leadership/i.test(text)) ids.add('activities');
    if (/certificat|internship|mooc|code\s*alpha|recognition|award|achievement/i.test(text)) ids.add('certificates');
    if (/skill|toolkit|language|docker|kubernetes|autocad|figma|canva/i.test(text)) ids.add('skills');
    if (/e.?book|book.?store|client|javamail|jakarta|tomcat|cloudinary|dao|checkout/i.test(text)) ids.add('bookstore');
    if (/move\s*mate|fitness|run logging|weather|firestore|offline|workmanager|leaderboard/i.test(text)) ids.add('movemate');
    if (/smart\s*ml|csv|clustering|plotly/i.test(text)) ids.add('smartml');
    if (/quiz\s*craft|quiz|flashcard|whisper|ocr/i.test(text)) ids.add('quizcraft');
    if (/smart\s*surplus|surplus|ngo|food/i.test(text)) ids.add('smartsurplus');
    if (/contact|email|reach|linkedin|github|phone|address|availability|salary/i.test(text)) ids.add('contact');
    if (/game|swing|spider|coins|hearts/i.test(text)) ids.add('game');
    return ids;
  };
  let selected = topics(question);
  if (/\b(it|that|this|its|they|their)\b|uska|uske/i.test(question)) {
    for (const item of [...history].reverse()) {
      if (item.role !== 'user') continue;
      const previous = topics(item.content);
      if (previous.size) { for (const id of previous) selected.add(id); break; }
    }
  }
  if (/experience|freelance|employment/i.test(question)) for (const id of ['bookstore', 'activities', 'certificates']) selected.add(id);
  if (!selected.size && /project|built|build|work/i.test(question)) for (const id of ['bookstore', 'movemate', 'smartml', 'quizcraft', 'smartsurplus']) selected.add(id);
  if (!selected.size && !isGreeting(question)) for (const id of ['education', 'school', 'skills', 'activities', 'certificates', 'bookstore', 'movemate']) selected.add(id);
  // A resume overview needs the entire professional resume, even when it also
  // asks about one area. Specific questions mentioning "resume" stay focused.
  if (/\b(summarize|summarise|overview|summary)\b/i.test(question) && /resume|\bcv\b/i.test(question)) for (const id of ['education', 'school', 'skills', 'activities', 'certificates', 'bookstore', 'movemate']) selected.add(id);
  selected.add('profile');
  return facts.filter(fact => selected.has(fact.id));
}

export function savedAnswer(question, history = []) {
  const lower = question.toLowerCase();
  if (suspiciousInput(question)) return { answer: 'My web stays on Ashutosh’s public portfolio. I can explain his projects, skills or how to contact him.', sourceIds: [], actionIds: ['projects', 'contact'] };
  if (/salary|phone|postal address|home address|job history|available|availability/i.test(question)) return { answer: 'That detail isn’t confirmed in the public portfolio. I can share his project work and education, or help you contact Ashutosh directly.', sourceIds: ['profile', 'contact'], actionIds: ['projects', 'contact'] };
  if (/internship|certificat|mooc|code\s*alpha|recognition|award|achievement|praman/i.test(question)) return { answer: snippets.certificates, sourceIds: ['certificates'], actionIds: ['resume', 'contact'] };
  if (/csi|public relations|extracurricular|social media|organization planning|college activit/i.test(question)) return { answer: snippets.activities, sourceIds: ['activities'], actionIds: ['resume', 'about'] };
  if (/hsc|12th|twelfth|junior college|i\.?d\.?u\.?b\.?s|89\.67|mathematics|computer science (?:marks|score)|subject marks|197|97\/100|ssc|10th/i.test(question)) return { answer: snippets.school, sourceIds: ['school'], actionIds: ['resume'] };
  if (/cgpa|gpa|semester|sem\s*(?:vi|6)|9\.42|degree|graduat|education|coursework|relevant courses|qualification|padhai|marks/i.test(question)) return { answer: snippets.education, sourceIds: ['education'], actionIds: ['resume', 'about'] };
  if (/experience|freelance|professional|employment/i.test(question)) return { answer: 'His resume describes the E-Book Management System as freelance work delivered for a client and lists a CSI VESIT student role. It also lists internship certificates, without detailed work histories. No full-time employment is claimed.', sourceIds: ['profile', 'bookstore', 'activities', 'certificates'], actionIds: ['resume', 'bookstore', 'contact'] };
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
