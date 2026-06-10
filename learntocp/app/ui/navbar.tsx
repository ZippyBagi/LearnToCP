import AuthButton from "@/app/ui/utils/authButton";
import LanguageSelector from "@/app/ui/utils/languageSelect";
import { Menu } from "lucide-react";

export default function Navbar({
  setSideBarActiveFunction,
}: {
  setSideBarActiveFunction: () => void;
}) {
  return (
    <nav
      className="flex items-center w-full justify-between shrink-0"
      style={{
        background: "rgba(0,10,20,0.75)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(124,158,248,0.15)",
        boxShadow: "0 1px 0 rgba(124,158,248,0.08)",
        height: "52px",
      }}
    >
      <div className="flex items-center gap-1">
        <button
          onClick={setSideBarActiveFunction}
          className="group flex h-[52px] w-[52px] cursor-pointer items-center justify-center transition-colors duration-150"
          style={{ color: "rgba(200,218,240,0.55)" }}
          aria-label="Toggle sidebar"
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--color-accent)";
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(124,158,248,0.08)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "rgba(200,218,240,0.55)";
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          <Menu size={18} strokeWidth={2} />
        </button>

        <span
          className="text-sm font-bold tracking-wide select-none px-1"
          style={{
            background: "linear-gradient(90deg, #7c9ef8 0%, #a5b8fc 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          LearnToCP
        </span>
      </div>

      <div className="flex items-center gap-3 pr-4">
        <LanguageSelector />
        <AuthButton />
      </div>
    </nav>
  );
}
