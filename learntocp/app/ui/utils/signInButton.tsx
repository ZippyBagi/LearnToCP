export default function SignInButton() {
  return (
    <button
      className="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-semibold transition-all duration-150"
      style={{
        background: "rgba(124,158,248,0.1)",
        color: "var(--color-accent)",
        border: "1px solid rgba(124,158,248,0.25)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "rgba(124,158,248,0.18)";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(124,158,248,0.5)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-heading)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "rgba(124,158,248,0.1)";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(124,158,248,0.25)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--color-accent)";
      }}
    >
      Log In
    </button>
  );
}
