// TEMPORARY design preview of the coded product mocks. Delete before shipping.
import { ScreenshotFrame } from "@/components/ui/Media";
import type { ScreenshotId } from "@/config/visuals";

export const metadata = { robots: { index: false, follow: false } };

export default async function DevMocks({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  const ids = (id ? [id] : ["S1", "S2", "S3", "S4", "S5", "S6"]) as ScreenshotId[];
  return (
    <div className="container-site space-y-16 py-10">
      {ids.map((s) => (
        <div key={s} className="mx-auto max-w-[1200px]">
          <p className="mb-3 font-mono text-sm text-muted">{s}</p>
          <ScreenshotFrame id={s} />
        </div>
      ))}
    </div>
  );
}
