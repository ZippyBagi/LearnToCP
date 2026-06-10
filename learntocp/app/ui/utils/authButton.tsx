"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/app/supabase/client";
import getLocale from "@/app/utils/getLocale";

export default function AuthButton() {
  const locale = getLocale();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setLoaded(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoaded(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  }

  if (!user) {
    return (
      <Link
        href={`/${locale}/login`}
        className="
          inline-flex items-center justify-center
          rounded-md px-3 py-2 text-sm font-semibold
          bg-bg-page text-text-primary
          border border-border-blue
          transition-colors duration-150
          hover:bg-bg-surface hover:inset-ring-accent-border-hover
          focus:outline-none
        "
      >
        {locale == "en" ? "Sign in" : "Prijavi se"}
      </Link>
    );
  }

  const avatarUrl = user.user_metadata?.avatar_url as string | undefined;
  const displayName =
    (user.user_metadata?.full_name as string | undefined) ?? user.email ?? "User";

  return (
    <Menu as="div" className="focus:outline-none relative inline-block">
      <MenuButton
        className="focus:outline-none flex cursor-pointer items-center rounded-full transition-all duration-150"
        style={{ border: "2px solid rgba(124,158,248,0.35)" }}
        aria-label="Account menu"
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={displayName}
            width={30}
            height={30}
            className="rounded-full focus:outline-none"
          />
        ) : (
          <span
            className="focus:outline-none flex h-[30px] w-[30px] items-center justify-center rounded-full text-sm font-bold select-none"
            style={{ background: "rgba(124,158,248,0.18)", color: "var(--color-accent)" }}
          >
            {displayName.charAt(0).toUpperCase()}
          </span>
        )}
      </MenuButton>

      <MenuItems
        transition
        anchor="bottom end"
        className="
          w-56
          rounded-md bg-bg-page overflow-hidden
          border border-border-blue
          shadow-[0_8px_32px_rgba(0,0,0,0.5)]
          transition duration-100 ease-out
          data-[closed]:scale-95 data-[closed]:opacity-0
          focus:outline-none
          [--anchor-gap:8px]
        "
      >
        <div className="border-b border-border-blue px-4 py-2.5 select-none">
          <p className="truncate text-sm font-semibold text-text-heading">{displayName}</p>
          <p className="truncate text-xs text-text-muted">{user.email}</p>
        </div>

        <MenuItem>
          {({ focus }) => (
            <button
              onClick={signOut}
              className={`
                relative flex w-full items-center gap-2 text-left px-4 py-2.5 text-sm
                text-text-primary bg-bg-page cursor-pointer
                transition-colors duration-100
                border-l-2 border-transparent
                focus:outline-none
                ${focus
                  ? "border-accent-border-hover bg-bg-surface-hover text-text-heading"
                  : "hover:border-accent-border-hover hover:bg-bg-surface-hover hover:text-text-heading"
                }
              `}
            >
              <LogOut size={15} strokeWidth={2} className="text-text-muted" />
              Sign out
            </button>
          )}
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}
