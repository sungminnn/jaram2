import Link from "next/link";
import { ChevronRight, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site-shell";
import { facilityNavigation, facilityPages, isFacilitySlug } from "@/content/facilities";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

function encodeStoragePath(path: string) {
  return path
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function resolveFacilityImage(src: string | undefined) {
  if (!src) {
    return undefined;
  }

  if (/^https?:\/\//i.test(src) || src.startsWith("/images/")) {
    return src;
  }

  if (!supabaseUrl) {
    return src;
  }

  return `${supabaseUrl}/storage/v1/object/public/editor-images/${encodeStoragePath(src)}`;
}

export function generateStaticParams() {
  return Object.values(facilityPages).map((facility) => ({
    slug: facility.slug,
  }));
}

export default async function FacilityPage({ params }: PageProps) {
  const { slug } = await params;

  if (!isFacilitySlug(slug)) {
    notFound();
  }

  const facility = facilityPages[slug];
  const activeHref = `/facilities/${facility.slug}`;
  const heroImage = resolveFacilityImage(facility.image);
  const galleryImages = (facility.galleryImages ?? []).map(resolveFacilityImage).filter((image): image is string => Boolean(image));

  return (
    <SiteShell>
      <section className="border-b border-forest/10 bg-mint/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-normal text-leaf">Facilities</p>
            <h1 className="mt-1 text-2xl font-bold text-forest">{facility.name}</h1>
          </div>
          <nav className="flex items-center gap-2 text-sm font-medium text-muted" aria-label="현재 위치">
            <Link href="/" className="transition hover:text-forest">
              홈
            </Link>
            <ChevronRight size={15} aria-hidden="true" />
            <span>사업</span>
            <ChevronRight size={15} aria-hidden="true" />
            <span className="font-bold text-forest">{facility.name}</span>
          </nav>
        </div>
      </section>

      <section className="reveal-section bg-cream py-12 sm:py-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-6 lg:grid-cols-[16rem_1fr] lg:px-8">
          <aside className="hidden lg:sticky lg:top-28 lg:block lg:self-start" aria-label="사업 하위 메뉴">
            <nav className="border-l border-forest/14 pl-4">
              <div className="grid gap-2">
                {facilityNavigation.map((item) => {
                  const active = item.href === activeHref;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={[
                        "focus-ring -ml-[1.0625rem] flex items-center gap-3 rounded-md py-2 pl-0 pr-3 text-sm transition",
                        active ? "font-bold text-forest" : "font-medium text-muted hover:text-forest",
                      ].join(" ")}
                    >
                      <span className={active ? "h-7 w-0.5 bg-leaf" : "h-7 w-0.5 bg-transparent"} aria-hidden="true" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </nav>
          </aside>

          <article className="reveal-card min-w-0">
            <div className="border-b border-forest/10 pb-7">
              <p className="text-sm font-bold text-leaf">{facility.type}</p>
              <h2 className="mt-3 text-3xl font-bold leading-tight text-forest sm:text-4xl">{facility.name}</h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-muted">{facility.summary}</p>
              <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-ink/80">
                <MapPin size={16} className="text-leaf" aria-hidden="true" />
                {facility.location}
              </p>
            </div>

            {heroImage ? (
              <div className="mt-8 overflow-hidden rounded-lg bg-mint/60">
                <img src={heroImage} alt="" className="block w-full object-cover" />
              </div>
            ) : null}

            <div className="mt-8">
              <h3 className="text-2xl font-bold leading-tight text-forest sm:text-3xl">{facility.headline}</h3>
              <div className="mt-8 grid gap-5 text-lg leading-9 text-ink/78">
                {facility.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-12 grid gap-8">
                {facility.points.map((point) => (
                  <section key={point.title} className="border-l-2 border-leaf pl-5">
                    <h4 className="text-xl font-bold text-forest">{point.title}</h4>
                    <p className="mt-3 text-lg leading-9 text-muted">{point.description}</p>
                  </section>
                ))}
              </div>

              <p className="mt-12 text-xl font-semibold leading-9 text-forest">{facility.closing}</p>

              {galleryImages.length ? (
                <section className="mt-14">
                  <div className={galleryImages.length === 1 ? "grid gap-5" : "grid gap-5 sm:grid-cols-2"}>
                    {galleryImages.map((image) => (
                      <div key={image} className="overflow-hidden rounded-lg bg-mint/60">
                        <img src={image} alt="" className="block w-full object-cover" />
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}
            </div>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
