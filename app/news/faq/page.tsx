import { CommunityPageLayout } from "@/components/community-page-layout";
import { FaqAccordion } from "@/components/faq-accordion";
import { communityCategoryMeta, faqItems } from "@/content/community";

export default function FaqPage() {
  const meta = communityCategoryMeta.faq;

  return (
    <CommunityPageLayout title={meta.label} summary={meta.summary} activeHref="/news/faq">
      <FaqAccordion items={faqItems} />
    </CommunityPageLayout>
  );
}
