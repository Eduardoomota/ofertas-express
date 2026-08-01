import type { LucideIcon } from "lucide-react";
import type { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement>;

export function decorative(Icon: LucideIcon, displayName: string) {
  function DecorativeIcon(props: IconProps) {
    return <Icon aria-hidden="true" focusable="false" {...props} />;
  }
  DecorativeIcon.displayName = displayName;
  return DecorativeIcon;
}
