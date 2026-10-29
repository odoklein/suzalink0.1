import type { ComponentType } from "react";
import type { ScreenshotId } from "@/config/visuals";
import { FitBox } from "../ui/FitBox";
import { AiMock } from "./AiMock";
import { BookingMock } from "./BookingMock";
import { CallsMock } from "./CallsMock";
import { EmailsMock } from "./EmailsMock";
import { PortalMock } from "./PortalMock";
import { TeamMock } from "./TeamMock";
import { MOCK_H, MOCK_W } from "./kit";

/**
 * Coded stand-ins for the product screenshots, used until a real capture is
 * set in SCREENSHOTS (src/config/visuals.ts). Decorative: the frame carries the alt text.
 */
const MOCKS: Partial<Record<ScreenshotId, ComponentType>> = {
  S1: CallsMock,
  S2: EmailsMock,
  S3: BookingMock,
  S4: TeamMock,
  S5: AiMock,
  S6: PortalMock,
};

/** The app page each screenshot shows, printed in the window's address bar. */
export const MOCK_PATH: Record<ScreenshotId, string> = {
  S1: "app.suzalink.com/sdr/action",
  S2: "app.suzalink.com/sdr/emails",
  S3: "app.suzalink.com/sdr/calendar",
  S4: "app.suzalink.com/manager/analytics",
  S5: "app.suzalink.com/manager/analyse-ia",
  S6: "app.suzalink.com/client/portal",
};

export function hasMock(id: ScreenshotId): boolean {
  return Boolean(MOCKS[id]);
}

export function ProductMock({ id }: { id: ScreenshotId }) {
  const Mock = MOCKS[id];
  if (!Mock) return null;
  return (
    <FitBox designWidth={MOCK_W} designHeight={MOCK_H}>
      <Mock />
    </FitBox>
  );
}
