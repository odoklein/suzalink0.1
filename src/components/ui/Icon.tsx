import {
  BarChart3,
  Building2,
  CalendarCheck,
  Check,
  Clock,
  Compass,
  Euro,
  FileText,
  Flag,
  Headset,
  Inbox,
  Keyboard,
  ListChecks,
  Lock,
  Mail,
  PanelsTopLeft,
  Phone,
  Plug,
  RefreshCw,
  Server,
  Share2,
  ShieldCheck,
  Sparkles,
  Target,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { IconName } from "@/content/types";

const ICONS: Record<IconName, LucideIcon> = {
  phone: Phone,
  mail: Mail,
  calendar: CalendarCheck,
  list: ListChecks,
  sparkles: Sparkles,
  chart: BarChart3,
  portal: PanelsTopLeft,
  shield: ShieldCheck,
  plug: Plug,
  users: Users,
  building: Building2,
  user: User,
  headset: Headset,
  server: Server,
  lock: Lock,
  file: FileText,
  euro: Euro,
  clock: Clock,
  check: Check,
  compass: Compass,
  inbox: Inbox,
  target: Target,
  flag: Flag,
  share: Share2,
  keyboard: Keyboard,
  refresh: RefreshCw,
};

export function Icon({ name, className, strokeWidth = 1.75 }: { name: IconName; className?: string; strokeWidth?: number }) {
  const Component = ICONS[name];
  return <Component aria-hidden className={className} strokeWidth={strokeWidth} />;
}

/** An icon in a soft tinted square, used on feature cards. */
export function IconTile({ name, className }: { name: IconName; className?: string }) {
  return (
    <span
      className={`inline-flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-accent-tint text-accent ring-1 ring-inset ring-accent/10 ${className ?? ""}`}
    >
      <Icon name={name} className="size-5" />
    </span>
  );
}
