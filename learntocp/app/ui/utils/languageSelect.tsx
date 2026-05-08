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
    // 1. Set a cookie that expires in 1 year, available on all paths
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`

    // 2. Update the URL
    const segments = pathname.split('/')
    segments[1] = newLocale
    const newPath = segments.join('/')

    // 3. Navigate to the new path and refresh to apply changes globally
    router.replace(newPath)
    router.refresh() 
  }

  return (
    <Menu as="div" className="relative inline-block">
      <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-bg-page px-3 py-2 text-sm font-semibold text-text-primary inset-ring-1 inset-ring-border-blue hover:bg-bg-surface">
        {languageNames[currentLocale as keyof typeof languageNames]}
        <ChevronDownIcon
          aria-hidden="true"
          className="-mr-1 size-5 text-gray-400"
        />
      </MenuButton>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-bg-page outline-1 -outline-offset-1 outline-border-blue"
      >
        <div className="py-1">
          <MenuItem>
            <button
              onClick={() => changeLanguage('en')}
              className="block w-full text-left px-4 py-2 text-sm text-text-primary cursor-pointer"
            >
              English
            </button>
          </MenuItem>

          <MenuItem>
            <button
              onClick={() => changeLanguage('sr')}
              className="block w-full text-left px-4 py-2 text-sm text-text-primary cursor-pointer"
            >
              Srpski
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  )
}