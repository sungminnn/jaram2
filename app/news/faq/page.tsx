import { HelpCircle } from "lucide-react";
import { CommunityPageLayout } from "@/components/community-page-layout";
import { communityCategoryMeta, faqItems } from "@/content/community";

export default function FaqPage() {
  const meta = communityCategoryMeta.faq;

  return (
    <CommunityPageLayout title={meta.label} summary={meta.summary} activeHref="/news/faq">
      <div className="space-y-4">
        {faqItems.map((item) => (
          <details key={item.question} className="group rounded-lg bg-white p-6 shadow-[0_14px_42px_rgba(47,80,61,0.07)]">
            <summary className="flex cursor-pointer list-none items-center gap-3 text-lg font-bold text-forest marker:hidden">
              <HelpCircle size={20} className="text-leaf" aria-hidden="true" />
              {item.question}
            </summary>
            <p className="mt-4 pl-8 text-base leading-7 text-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </CommunityPageLayout>
  );
}
