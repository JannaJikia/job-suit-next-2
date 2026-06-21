type Props = { className?: string };

/** JobSuit brand mark — emerald shield with a collar + tie. */
export function Logo({ className = "h-9 w-9" }: Props) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label="JobSuit"
      fill="none"
      stroke="#4FB877"
      strokeWidth={4.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M37,29 L83,29 Q87,29 87,33 L87,62 C87,81 74,94 60,102 C46,94 33,81 33,62 L33,33 Q33,29 37,29 Z" />
      <path d="M45,45 L60,58 L75,45" />
      <path d="M54,45 L60,39 L66,45" />
      <path d="M55,58 L65,58 L63,64 L67,86 L60,95 L53,86 L57,64 Z" />
    </svg>
  );
}
