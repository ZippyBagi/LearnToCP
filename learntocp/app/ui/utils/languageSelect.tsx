'use client'

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { usePathname, useRouter } from 'next/navigation'
import { locales, languageNames } from '@/i18n'

export default function LanguageSelector() {
  const router = useRouter()
  const pathname = usePathname()

  const currentLocale = pathname.split('/')[1] || 'en'

  function changeLanguage(newLocale: string) {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`
    const segments = pathname.split('/')
    segments[1] = newLocale
    const newPath = segments.join('/')
    router.replace(newPath)
    router.refresh()
  }

  return (
    <Menu as="div" className="relative inline-block">
      <MenuButton className="
        inline-flex w-full items-center justify-center gap-x-1.5
        rounded-md px-3 py-2 text-sm font-semibold
        bg-bg-page text-text-primary
        border border-border-blue
        transition-colors duration-150
        hover:bg-bg-surface hover:inset-ring-accent-border-hover
        focus:outline-none
      ">
        {languageNames[currentLocale as keyof typeof languageNames]}
        <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-text-muted" />
      </MenuButton>

      <MenuItems
        transition
        className="
          absolute right-0 z-10 mt-2 w-40 origin-top-right
          rounded-md bg-bg-page overflow-hidden
          border border-border-blue
          shadow-[0_8px_32px_rgba(0,0,0,0.5)]
          transition duration-100 ease-out
          data-[closed]:scale-95 data-[closed]:opacity-0
        "
      >
        {Object.entries(languageNames).map(([locale, label]) => (
          <MenuItem key={locale}>
            {({ focus }) => (
              <button
                onClick={() => changeLanguage(locale)}
                className={`
                  relative block w-full text-left px-4 py-2.5 text-sm
                  text-text-primary bg-bg-page cursor-pointer
                  transition-colors duration-100
                  border-l-2
                  focus:outline-none
                  ${currentLocale === locale
                    ? 'border-accent text-text-accent bg-bg-surface'
                    : 'border-transparent hover:border-accent-border-hover hover:bg-bg-surface-hover hover:text-text-heading'
                  }
                `}
              >
                {label}
              </button>
            )}
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  )
}