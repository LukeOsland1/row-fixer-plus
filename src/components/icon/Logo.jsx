export default function Logo() {
  return (
    <svg width="24" height="24" aria-hidden="true" viewBox="0 0 64 64">
      <rect width="64" height="64" rx="15" fill="var(--control)" />
      <rect
        x="12"
        y="14"
        width="17"
        height="15"
        rx="3"
        fill="var(--control-text)"
      />
      <rect x="35" y="14" width="17" height="15" rx="3" fill="var(--accent)" />
      <rect
        x="12"
        y="35"
        width="17"
        height="15"
        rx="3"
        fill="var(--control-text)"
      />
      <rect
        x="35"
        y="35"
        width="17"
        height="15"
        rx="3"
        fill="var(--control-text)"
      />
    </svg>
  );
}
