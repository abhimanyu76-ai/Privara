export default function ShieldLogo({ className = "w-8 h-8", color = "#D04A02" }: { className?: string; color?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M16 2L6 6V14C6 21 10.5 27.5 16 30C21.5 27.5 26 21 26 14V6L16 2Z"
        fill={color}
      />
      <path
        d="M16 6L10 8.5V14C10 18.5 12.5 23 16 25C19.5 23 22 18.5 22 14V8.5L16 6Z"
        fill="white"
        fillOpacity="0.3"
      />
      <path
        d="M14 16L13 17L15 19L19 13L18 12L15 16L14 16Z"
        fill="white"
        strokeWidth="1.5"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
