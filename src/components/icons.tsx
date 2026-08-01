import {
  ArrowLeft,
  Barcode,
  CalendarCheck,
  CircleCheck,
  CircleDollarSign,
  Clock,
  FileText,
  LogOut,
  ShoppingCart,
  Tag,
  Trash2,
  User,
  type LucideIcon,
} from "lucide-react";
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/**
 * Todos os ícones do app são decorativos (o texto/aria-label ao lado carrega
 * o significado), então saem escondidos da árvore de acessibilidade por
 * padrão — consumidores podem sobrescrever via props se precisarem.
 */
function decorative(Icon: LucideIcon, displayName: string) {
  function DecorativeIcon(props: IconProps) {
    return <Icon aria-hidden="true" focusable="false" {...props} />;
  }
  DecorativeIcon.displayName = displayName;
  return DecorativeIcon;
}

export const CartIcon = decorative(ShoppingCart, "CartIcon");
export const TrashIcon = decorative(Trash2, "TrashIcon");
export const ArrowLeftIcon = decorative(ArrowLeft, "ArrowLeftIcon");
export const FileIcon = decorative(FileText, "FileIcon");
export const TagIcon = decorative(Tag, "TagIcon");
export const ClockIcon = decorative(Clock, "ClockIcon");
export const UserIcon = decorative(User, "UserIcon");
export const LogOutIcon = decorative(LogOut, "LogOutIcon");
export const CalendarCheckIcon = decorative(CalendarCheck, "CalendarCheckIcon");
export const CoinsIcon = decorative(CircleDollarSign, "CoinsIcon");
export const CheckCircleIcon = decorative(CircleCheck, "CheckCircleIcon");
export const BoletoIcon = decorative(Barcode, "BoletoIcon");

/**
 * Pix é marca do Banco Central e não existe em bibliotecas de ícones
 * genéricas como o Lucide — aproximação custom no mesmo estilo de traço
 * (stroke 2, cantos arredondados) para não destoar dos demais.
 */
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
