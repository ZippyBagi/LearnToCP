'use client'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'


export default function LanguageSelector() {

  const [selected, setSelected] = useState("English");

  function ChangeLanguage(newLanguage:string){
    setSelected(newLanguage)
  }

  return (
    <Menu as="div" className="relative inline-block">
      <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-bg-page px-3 py-2 text-sm font-semibold text-text-primary inset-ring-1 inset-ring-border-blue hover:bg-bg-surface">
        {selected}
        <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
      </MenuButton>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-bg-page outline-1 -outline-offset-1 outline-border-blue transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
      >
        <div className="py-1">
          <MenuItem>
            <a
              className="block px-4 py-2 text-sm text-text-primary data-focus:bg-bg-code data-focus:text-text-heading data-focus:outline-hidden cursor-pointer"
              onClick={() => {ChangeLanguage("English")}}
            >
              English
            </a>
          </MenuItem>
          <MenuItem>
            <a
              className="block px-4 py-2 text-sm text-text-primary data-focus:bg-bg-code data-focus:text-text-heading data-focus:outline-hidden cursor-pointer"
              onClick={() => {ChangeLanguage("Srpski")}}
            >
              Srpski
            </a>
          </MenuItem>
          
        </div>
      </MenuItems>
    </Menu>
  )
}