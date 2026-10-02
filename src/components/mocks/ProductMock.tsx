import type { ComponentType } from "react";
import type { ScreenshotId } from "@/config/visuals";
import { FitBox } from "../ui/FitBox";
import { CallsMock } from "./CallsMock";
import { MOCK_H, MOCK_W } from "./kit";

/**
 * Coded stand-ins for the product screenshots, used until a real capture is
 * set in SCREENSHOTS (src/config/visuals.ts). Decorative: the frame carries the alt text.
 */
const MOCKS: Partial<Record<ScreenshotId, ComponentType>> = {
  S1: CallsMock,
};

/** The app page each screenshot shows, printed in the window's address bar. */
export const MOCK_PATH: Record<ScreenshotId, string> = {
  S1: "app.suzalink.com/appels",
  S2: "app.suzalink.com/emails/sequences",
  S3: "app.suzalink.com/rendez-vous",
  S4: "app.suzalink.com/pilotage",
  S5: "app.suzalink.com/ia/analyse",
  S6: "app.suzalink.com/portail/transports-lemaire",
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
