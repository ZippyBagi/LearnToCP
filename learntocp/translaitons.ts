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