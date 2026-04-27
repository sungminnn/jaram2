import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUp,
  ChevronRight,
  HandHeart,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sprout,
} from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CommunityTabs } from "@/components/community-tabs";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { SupportPendingDialog } from "@/components/support-pending-dialog";
import {
  contact,
  facilities,
  programCards,
  quickLinks,
} from "@/content/home";
import { getCommunityPosts } from "@/lib/community-posts";
import { getSiteUrl, siteConfig } from "@/lib/site-config";

const siteUrl = getSiteUrl();

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: siteConfig.name,
  },
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: "/",
    type: "website",
    locale: "ko_KR",
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        alt: siteConfig.name,
      },
    ],
  },
};

const aboutValues = [
  { label: "안전한 돌봄", icon: ShieldCheck },
  { label: "함께하는 성장", icon: Sprout },
  { label: "투명한 운영", icon: HandHeart },
];

export default async function Home() {
  const [storyPosts, noticePosts, galleryPosts] = await Promise.all([
    getCommunityPosts("stories"),
    getCommunityPosts("notices"),
    getCommunityPosts("gallery"),
  ]);
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "NGO",
    "@id": `${siteUrl}/#organization`,
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteUrl,
    description: siteConfig.description,
    slogan: siteConfig.slogan,
    areaServed: "KR-11",
    telephone: siteConfig.contact.telephone,
    email: siteConfig.contact.email,
    address: {
      "@type": "PostalAddress",
      addressCountry: "KR",
      addressLocality: siteConfig.contact.addressLocality,
      streetAddress: siteConfig.contact.streetAddress,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <AnimateOnScroll />
      <SiteHeader />
      <main id="top">
        <section className="reveal-section relative overflow-hidden" aria-labelledby="home-hero-title">
          <div className="absolute inset-0">
            <div className="hero-fade-slide hero-fade-slide-1" aria-hidden="true" />
            <div className="hero-fade-slide hero-fade-slide-2" aria-hidden="true" />
            <div className="hero-fade-slide hero-fade-slide-3" aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-r from-forest/90 via-forest/66 to-forest/22" />
          </div>

          <div className="relative mx-auto flex min-h-[31rem] max-w-7xl items-center px-5 py-20 sm:px-6 lg:min-h-[34rem] lg:px-8">
            <div className="max-w-2xl">
              <p className="mb-5 inline-flex items-center gap-2 rounded-md bg-white/14 px-4 py-2 text-base font-bold text-white ring-1 ring-white/24 backdrop-blur">
                <contact.icon size={18} aria-hidden="true" />
                비영리민간단체 자람
              </p>
              <h1
                id="home-hero-title"
                className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-[3.6rem]"
              >
                아이들이 안전하게 자라고
                <br className="hidden sm:block" />
                가족이 안심하는 지역 돌봄
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white sm:text-xl">
                자람은 어린이집과 다함께키움센터를 운영하며 아이, 가족, 교사,
                지역사회가 함께 성장할 수 있는 돌봄 환경을 만듭니다.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="#about"
                  className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-white px-6 py-3.5 text-sm font-bold text-forest shadow-[0_12px_30px_rgba(31,42,36,0.16)] transition duration-200 hover:-translate-y-0.5 hover:bg-mint hover:shadow-[0_16px_36px_rgba(31,42,36,0.22)]"
                >
                  자람 소개 보기
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <Link
                  href="#facilities"
                  className="focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-white/36 bg-white/10 px-6 py-3.5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(31,42,36,0.12)] backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/22 hover:shadow-[0_16px_36px_rgba(31,42,36,0.18)]"
                >
                  운영 시설 보기
                </Link>
              </div>
            </div>
          </div>

        </section>

        <section className="reveal-section border-b border-forest/10 bg-white" aria-label="빠른 메뉴">
          <div className="mx-auto max-w-7xl px-5 py-4 sm:px-6 lg:px-8">
            <div className="-mx-5 flex snap-x gap-2 overflow-x-auto px-5 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-5 md:gap-2 md:overflow-visible md:px-0">
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="focus-ring group flex min-w-[9.5rem] snap-start items-center justify-between gap-3 rounded-md px-3 py-3 transition hover:bg-mint md:min-w-0 md:justify-start"
              >
                <span className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-md bg-mint text-leaf transition group-hover:bg-leaf group-hover:text-white">
                    <item.icon size={18} aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold text-forest md:text-base">{item.label}</span>
                </span>
                <ChevronRight className="size-4 text-leaf opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" aria-hidden="true" />
              </Link>
            ))}
            </div>
          </div>
        </section>

        <section id="about" className="reveal-section bg-cream py-24 sm:py-28" aria-labelledby="about-title">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
            <div>
              <p className="mb-3 text-sm font-bold text-leaf">ABOUT JARAM</p>
              <h2 id="about-title" className="text-3xl font-bold leading-tight text-forest sm:text-4xl">
                차별 없이 배움의 기회를 누리고 <br></br>성장하는 사회를 꿈꿉니다
              </h2>
            </div>
            <div className="grid gap-8">
              <p className="text-lg leading-8 text-ink/78">
                모든 어린이가 풍부한 교육 환경에서 자율적으로 성장하고,
                부모가 필요한 지원을 받아 가족을 건강하게 유지할 수 있는 세상을
                지향합니다.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                {aboutValues.map((item) => (
                  <div key={item.label} className="rounded-lg border border-forest/10 bg-white p-5">
                    <item.icon className="mb-4 text-leaf" size={25} aria-hidden="true" />
                    <p className="font-bold text-forest">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="programs" className="reveal-section bg-mint py-24 sm:py-28" aria-labelledby="programs-title">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="mb-3 text-sm font-bold text-leaf">PROGRAMS</p>
                <h2 id="programs-title" className="text-3xl font-bold text-forest sm:text-4xl">
                  자람의 주요 사업
                </h2>
              </div>
              <p className="max-w-xl text-base leading-7 text-muted">
                보육과 초등 돌봄 운영 경험을 바탕으로 아이와 가족, 교직원, 지역사회가
                함께 성장할 수 있는 지원 체계를 만들어갑니다.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {programCards.map((program) => (
                <article key={program.title} className="reveal-card rounded-lg border border-forest/10 bg-cream p-6 shadow-soft transition duration-300 hover:-translate-y-1">
                  <span className="mb-6 grid size-12 place-items-center rounded-md bg-leaf text-white">
                    <program.icon size={24} aria-hidden="true" />
                  </span>
                  <h3 className="text-xl font-bold text-forest">{program.title}</h3>
                  <p className="mt-3 min-h-20 text-sm leading-7 text-muted">{program.description}</p>
                  <ul className="mt-6 space-y-3">
                    {program.points.map((point) => (
                      <li key={point} className="flex gap-2 text-sm font-semibold text-ink">
                        <ChevronRight className="mt-0.5 shrink-0 text-leaf" size={17} aria-hidden="true" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="facilities" className="reveal-section bg-cream py-24 sm:py-28" aria-labelledby="facilities-title">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr]">
              <div>
                <p className="mb-3 text-sm font-bold text-leaf">FACILITIES</p>
                <h2 id="facilities-title" className="text-3xl font-bold text-forest sm:text-4xl">
                  자람이 운영하는 돌봄 공간
                </h2>
                <p className="mt-5 text-base leading-7 text-muted">
                  각 시설 페이지는 이후 관리자에서 소개글, 사진, 공지 등을 관리할 수
                  있도록 분리합니다.
                </p>
              </div>
              <div className="grid gap-5">
                {facilities.map((facility) => (
                  <Link
                    key={facility.name}
                    href={facility.href}
                    className="focus-ring reveal-card grid gap-5 rounded-lg border border-forest/10 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:shadow-soft sm:grid-cols-[11rem_1fr]"
                  >
                    <div className="relative min-h-40 overflow-hidden rounded-md bg-mint">
                      <Image
                        src={facility.image}
                        alt=""
                        fill
                        sizes="(min-width: 640px) 176px, 100vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-center sm:pl-5 lg:pl-7">
                      <p className="text-sm font-bold text-leaf">{facility.type}</p>
                      <h3 className="mt-1 text-xl font-bold text-forest">{facility.name}</h3>
                      <p className="mt-3 text-sm leading-7 text-muted">{facility.summary}</p>
                      <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-ink/80">
                        <MapPin size={16} className="text-leaf" aria-hidden="true" />
                        {facility.location}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <CommunityTabs stories={storyPosts} notices={noticePosts} gallery={galleryPosts} />

        <section id="support" className="reveal-section bg-sand py-24 sm:py-28" aria-labelledby="support-title">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-6 lg:grid-cols-[1fr_0.82fr] lg:px-8">
            <div>
              <p className="mb-3 text-sm font-bold text-leaf">SUPPORT</p>
              <h2 id="support-title" className="text-3xl font-bold text-forest sm:text-4xl">
                아이들의 든든한 후원자가 되어주세요
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-ink/76">
                후원 계좌와 문의 방법을 안내합니다.
              </p>
            </div>
            <div className="rounded-lg border border-forest/10 bg-cream p-6 shadow-soft">
              <p className="text-sm font-bold text-muted">후원계좌</p>
              <p className="mt-2 text-xl font-bold text-forest">{contact.bank}</p>
              <div className="mt-7 grid gap-3 text-sm text-muted">
                <p className="flex items-center gap-2">
                  <Phone size={17} className="text-leaf" aria-hidden="true" />
                  {contact.phone}
                </p>
                <p className="flex items-center gap-2">
                  <Mail size={17} className="text-leaf" aria-hidden="true" />
                  {contact.email}
                </p>
              </div>
              <SupportPendingDialog className="focus-ring mt-7 inline-flex w-full items-center justify-center gap-2 rounded-md bg-forest px-5 py-3 text-sm font-bold text-white transition hover:bg-leaf">
                후원 문의하기
                <ArrowRight size={17} aria-hidden="true" />
              </SupportPendingDialog>
            </div>
          </div>
        </section>

        <section className="reveal-section overflow-hidden bg-cream py-20" aria-label="자람 활동 사진">
          <div className="mx-auto mb-8 max-w-7xl px-5 sm:px-6 lg:px-8">
            <p className="text-sm font-bold text-leaf">JARAM MOMENTS</p>
            <h2 className="mt-2 text-2xl font-bold text-forest sm:text-3xl">
              돌봄과 성장의 순간들
            </h2>
          </div>
          <div className="sliding-img mb-3">
            <div className="sliding-img-frame-to-start" />
          </div>
          <div className="sliding-img">
            <div className="sliding-img-frame-to-start-sm" />
          </div>
        </section>
      </main>
      <Link
        href="#top"
        className="focus-ring fixed bottom-6 right-5 z-40 grid size-12 place-items-center rounded-full bg-forest text-white shadow-soft transition hover:-translate-y-1 hover:bg-leaf"
        aria-label="맨 위로 이동"
      >
        <ArrowUp size={22} aria-hidden="true" />
      </Link>
      <SiteFooter />
    </>
  );
}
