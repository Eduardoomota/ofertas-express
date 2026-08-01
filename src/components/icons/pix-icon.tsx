import type { IconProps } from "./decorative";

export function PixIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <rect
        x="5.6"
        y="5.6"
        width="12.8"
        height="12.8"
        rx="2.5"
        transform="rotate(45 12 12)"
      />
      <rect
        x="10"
        y="10"
        width="4"
        height="4"
        rx="1"
        transform="rotate(45 12 12)"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}
