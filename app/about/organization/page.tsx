import type { Metadata } from "next";
import { AboutPageLayout } from "@/components/about-page-layout";
import { organizationContent } from "@/content/about";

type TreeNode = {
  title: string;
  children?: TreeNode[];
};

export const metadata: Metadata = {
  title: "조직도",
  description: "비영리민간단체 자람의 조직도를 소개합니다.",
};

export default function OrganizationPage() {
  return (
    <AboutPageLayout
      title={organizationContent.title}
      eyebrow={organizationContent.eyebrow}
      summary={organizationContent.summary}
      activeHref="/about/organization"
    >
      <section className="max-w-3xl">
        <h2 className="inline-flex rounded-xl bg-forest px-6 py-4 text-2xl font-bold text-white">
          {organizationContent.root}
        </h2>

        <div className="ml-5 mt-8 border-l-2 border-leaf/55 pl-8 sm:ml-8">
          <TreeList nodes={organizationContent.tree} level={0} />
        </div>
      </section>
    </AboutPageLayout>
  );
}

function TreeList({ nodes, level }: { nodes: TreeNode[]; level: number }) {
  return (
    <ul className={level === 0 ? "grid gap-8" : "mt-4 grid gap-3"}>
      {nodes.map((node) => (
        <li key={node.title} className="relative">
          <span className="absolute -left-6 top-5 h-px w-5 bg-leaf/55" aria-hidden="true" />
          <div
            className={[
              "inline-flex items-center rounded-md px-4 py-2.5",
              level === 0
                ? "bg-mint text-xl font-bold text-forest"
                : level === 1
                  ? "bg-white text-lg font-semibold text-forest"
                  : "bg-transparent px-0 text-base font-medium text-muted",
            ].join(" ")}
          >
            {node.title}
          </div>

          {node.children ? (
            <div className="ml-5 border-l border-leaf/35 pl-6">
              <TreeList nodes={node.children} level={level + 1} />
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
