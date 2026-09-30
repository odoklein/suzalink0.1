import { getContent } from "@/content";
import { ButtonLink } from "@/components/ui/Button";
import { Visual } from "@/components/ui/Media";
import { H1, Lead } from "@/components/ui/Section";

export default function NotFound() {
  const { ui } = getContent("fr");
  return (
    <section data-hero className="bg-white">
      <div className="container-site grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="num text-small font-semibold text-accent">404</p>
          <H1 className="mt-3">{ui.notFound.title}</H1>
          <Lead className="mt-6">{ui.notFound.body}</Lead>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/" size="lg">
              {ui.notFound.home}
            </ButtonLink>
            <ButtonLink href="/tarifs" size="lg" variant="secondary">
              {ui.notFound.pricing}
            </ButtonLink>
          </div>
        </div>
        <Visual id="V12" className="rounded-[28px] ring-1 ring-line" />
      </div>
    </section>
  );
}
