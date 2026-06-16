export const locales = ['en', 'sr'] as const

export const languageNames = {
  en: 'English',
  sr: 'Srpski',
}

export type Locale = (typeof locales)[number]

export const loginMessages = {
  en: {
    eyebrow: 'Sign In',
    welcomePrefix: 'Welcome to',
    description:
      'Sign in to track your progress through the roadmap, lectures, and problems.',
    continueWithGoogle: 'Continue with Google',
    connecting: 'Connecting to Google…',
    privacy:
      'We only use your Google account to identify you. No emails, no spam.',
    errorGeneric: 'Sign-in failed. Please try again.',
    errorStart: 'Could not start sign-in. Please try again.',
    signInRequired: 'To access {page}, you need to sign in first.',
    pageRoadmap: 'the roadmap',
    pageProblems: 'the problems',
    pageGeneric: 'that page',
  },
  sr: {
    eyebrow: 'Prijava',
    welcomePrefix: 'Dobrodošli na',
    description:
      'Prijavite se kako bi pratili napredak na road-mapi i kako bi rešavali probleme!',
    continueWithGoogle: 'Nastavite sa Google-om',
    connecting: 'Povezivanje sa Google-om…',
    privacy:
      'Koristimo vaš Google nalog samo za identifikaciju. Nećeti dobijati mejlove, niti spam.',
    errorGeneric: 'Prijava nije uspela. Pokušajte ponovo.',
    errorStart: 'Nije moguće započeti prijavu. Pokušajte ponovo.',
    signInRequired: 'Da biste pristupili {page}, morate da se prijavite.',
    pageRoadmap: 'road-mapi',
    pageProblems: 'problemima',
    pageGeneric: 'toj stranici',
  },
} as const

export function getLoginMessages(locale: string) {
  return loginMessages[locale as Locale] ?? loginMessages.en
}

export const homeMessages = {
  en: {
    badges: ['#100%', '#FREE'],
    tagline: 'Learn To Competitively Program',
    map: {
      label: 'Map',
      title: 'Roadmap',
      description: 'A topic graph that tracks your progress node by node.',
    },
    solve: {
      label: 'Solve',
      title: 'Problems',
      description: 'A curated, difficulty-tagged practice set to grind.',
    },
    accepted: 'Accepted',
    copy: 'Copy',
  },
  sr: {
    badges: ['#100%', '#BESPLATNO'],
    tagline: 'Nauči Takmičarsko Programiranje',
    map: {
      label: 'Mapa',
      title: 'Road-mapa',
      description: 'Graf tema koji prati tvoj napredak, čvor po čvor.',
    },
    solve: {
      label: 'Rešavaj',
      title: 'Problemi',
      description: 'Pažljivo odabran skup zadataka označenih po težini.',
    },
    accepted: 'Accepted',
    copy: 'Kopiraj',
  },
} as const

export function getHomeMessages(locale: string) {
  return homeMessages[locale as Locale] ?? homeMessages.en
}

// Serbian plural selection: one / few (2–4) / many (5+), with the usual
// 11–14 teen exception.
function srPlural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few
  return many
}

interface ProblemMessages {
  // metadata
  notFound: string
  // tabs
  tabStatement: string
  tabSolution: string
  // difficulty labels (keyed by the meta value, which stays English)
  difficulty: Record<'Easy' | 'Medium' | 'Hard', string>
  problemNumber: (n: number) => string
  // meta table
  thTime: string
  thMemory: string
  thInput: string
  thOutput: string
  // statement / solution body
  noStatement: string
  editorialTitle: (title: string) => string
  noSolutionTitle: string
  noSolutionBody: string
  // reveal-solution pop-up
  revealTitle: string
  revealBody: string
  keepTrying: string
  revealConfirm: string
  // submit panel
  submitTitle: string
  pasteLabel: string
  editorPlaceholder: string
  submissionFailed: string
  networkError: string
  judgingProgress: (passed: number, total: number) => string
  verdictResult: (label: string, passed: number, total: number) => string
  verdictPlaceholder: string
  judging: string
  submit: string
  // submissions list
  submissionsTitle: string
  attemptsCount: (n: number) => string
  noSubmissions: string
  testcasesPassed: (passed: number, total: number) => string
  runtimeLabel: string
  memoryLabel: string
  viewCodeTitle: string
  codeLabel: string
  // code-viewer modal
  copy: string
  copied: string
  close: string
  submittedCodeAria: string
  // relative time
  timeAgo: (iso: string) => string
}

export const problemMessages: Record<'en' | 'sr', ProblemMessages> = {
  en: {
    notFound: 'Problem not found',
    tabStatement: 'Problem',
    tabSolution: 'Solution',
    difficulty: { Easy: 'Easy', Medium: 'Medium', Hard: 'Hard' },
    problemNumber: (n) => `Problem #${n}`,
    thTime: 'Time Limit',
    thMemory: 'Memory',
    thInput: 'Input',
    thOutput: 'Output',
    noStatement: 'No statement available.',
    editorialTitle: (title) => `Editorial — ${title}`,
    noSolutionTitle: 'No solution published yet',
    noSolutionBody:
      "The editorial for this problem hasn't been written. Check back later.",
    revealTitle: 'Reveal the solution?',
    revealBody:
      "You haven't solved this problem yet. Viewing the editorial will spoil the solution. Are you sure you want to continue?",
    keepTrying: 'Keep trying',
    revealConfirm: 'Reveal solution',
    submitTitle: 'Submit your solution',
    pasteLabel: 'Paste your code below',
    editorPlaceholder: '// Paste your full C++ solution here…',
    submissionFailed: 'Submission failed',
    networkError: 'Network error — please try again.',
    judgingProgress: (passed, total) =>
      `Judging… ${passed}/${total} testcases passed so far`,
    verdictResult: (label, passed, total) =>
      `${label} — ${passed}/${total} testcases passed`,
    verdictPlaceholder: 'Your verdict appears here after submitting.',
    judging: 'Judging…',
    submit: 'Submit',
    submissionsTitle: 'Your submissions',
    attemptsCount: (n) => `${n} ${n === 1 ? 'attempt' : 'attempts'}`,
    noSubmissions: 'No submissions yet.',
    testcasesPassed: (passed, total) =>
      `${passed} / ${total} testcases passed`,
    runtimeLabel: 'runtime',
    memoryLabel: 'memory',
    viewCodeTitle: 'View submitted code',
    codeLabel: 'Code',
    copy: 'Copy',
    copied: 'Copied!',
    close: 'Close',
    submittedCodeAria: 'Submitted code',
    timeAgo: (iso) => {
      const then = new Date(iso).getTime()
      if (Number.isNaN(then)) return ''
      const diff = Math.max(0, Date.now() - then)
      const min = Math.floor(diff / 60000)
      if (min < 1) return 'just now'
      if (min < 60) return `${min} minute${min === 1 ? '' : 's'} ago`
      const hr = Math.floor(min / 60)
      if (hr < 24) return `${hr} hour${hr === 1 ? '' : 's'} ago`
      const day = Math.floor(hr / 24)
      if (day < 30) return `${day} day${day === 1 ? '' : 's'} ago`
      return new Date(iso).toLocaleDateString('en-US')
    },
  },
  sr: {
    notFound: 'Zadatak nije pronađen',
    tabStatement: 'Problem',
    tabSolution: 'Rešenje',
    difficulty: { Easy: 'Easy', Medium: 'Medium', Hard: 'Hard' },
    problemNumber: (n) => `Zadatak #${n}`,
    thTime: 'Vreme',
    thMemory: 'Memorija',
    thInput: 'Ulaz',
    thOutput: 'Izlaz',
    noStatement: 'Iskaz nije dostupan.',
    editorialTitle: (title) => `Rešenje — ${title}`,
    noSolutionTitle: 'Rešenje još nije objavljeno',
    noSolutionBody:
      'Rešenje za ovaj zadatak još nije napisano. Navrati kasnije.',
    revealTitle: 'Otkri rešenje?',
    revealBody:
      'Još uvek niste rešili ovaj zadatak. Pregledanje rešenja će otkriti odgovor. Da li ste sigurni da želite da nastavite?',
    keepTrying: 'Nazad',
    revealConfirm: 'Otkri rešenje',
    submitTitle: 'Pošalji svoje rešenje',
    pasteLabel: 'Paste-uj svoj kod ispod',
    editorPlaceholder: '// Paste-uj svoje kompletno C++ rešenje ovde…',
    submissionFailed: 'Slanje nije uspelo',
    networkError: 'Greška u mreži — pokušaj ponovo.',
    judgingProgress: (passed, total) =>
      `Ocenjivanje… ${passed}/${total} test-primera do sada prošlo`,
    verdictResult: (label, passed, total) =>
      `${label} — ${passed}/${total} test-primera prošlo`,
    verdictPlaceholder: 'Tvoj rezultat se pojavljuje ovde nakon slanja.',
    judging: 'Ocenjivanje…',
    submit: 'Pošalji',
    submissionsTitle: 'Tvoja slanja',
    attemptsCount: (n) =>
      `${n} ${srPlural(n, 'pokušaj', 'pokušaja', 'pokušaja')}`,
    noSubmissions: 'Još nema slanja.',
    testcasesPassed: (passed, total) =>
      `${passed} / ${total} test-primera prošlo`,
    runtimeLabel: 'vreme',
    memoryLabel: 'memorija',
    viewCodeTitle: 'Pogledaj poslati kod',
    codeLabel: 'Kod',
    copy: 'Copy',
    copied: 'Copied!',
    close: 'Zatvori',
    submittedCodeAria: 'Poslati kod',
    timeAgo: (iso) => {
      const then = new Date(iso).getTime()
      if (Number.isNaN(then)) return ''
      const diff = Math.max(0, Date.now() - then)
      const min = Math.floor(diff / 60000)
      if (min < 1) return 'upravo sada'
      if (min < 60)
        return `pre ${min} ${srPlural(min, 'minut', 'minuta', 'minuta')}`
      const hr = Math.floor(min / 60)
      if (hr < 24) return `pre ${hr} ${srPlural(hr, 'sat', 'sata', 'sati')}`
      const day = Math.floor(hr / 24)
      if (day < 30) return `pre ${day} ${srPlural(day, 'dan', 'dana', 'dana')}`
      return new Date(iso).toLocaleDateString('sr-RS')
    },
  },
}

export function getProblemMessages(locale: string): ProblemMessages {
  return problemMessages[locale as Locale] ?? problemMessages.en
}