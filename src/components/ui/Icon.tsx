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
import { HUE, type Hue } from "@/config/hues";
import type { IconName } from "@/content/types";
import { cn } from "@/lib/cn";

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

/** An icon in a soft tinted square, used on feature cards. `hue` picks its colour from the sky palette. */
export function IconTile({ name, className, hue = "accent" }: { name: IconName; className?: string; hue?: Hue }) {
  const h = HUE[hue];
  return (
    <span
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center rounded-[12px] shadow-[inset_0_1px_0_rgb(255_255_255/0.8),0_6px_14px_-8px_currentColor] ring-1 ring-inset",
        h.soft,
        h.text,
        h.ring,
        className,
      )}
    >
      <Icon name={name} className="size-5" />
    </span>
  );
}
