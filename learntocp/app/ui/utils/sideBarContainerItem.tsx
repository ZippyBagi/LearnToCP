'use client'
import { useRouter } from 'next/navigation'

type SideBarButtonInput = {
    name : string;
    href : string;
};

export default function SideBarContainerItem(input : SideBarButtonInput){

    const router = useRouter();

   return (
    <div
      className="flex items-center gap-2 px-4 py-2.5 cursor-pointer select-none transition-colors duration-150 hover:bg-white/10 group"
      onClick={() => router.push(input.href)}
    >
      <span className="w-1 h-1 rounded-full bg-[var(--color-accent)] group-hover:opacity-100 opacity-50 transition-opacity duration-150 shrink-0" />
      <span className="text-base">{input.name}</span>
    </div>
  );
}