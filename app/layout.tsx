import type { Metadata } from "next";
import { GoogleTagManager } from "@next/third-parties/google";
import { Suspense } from "react";
import { NavigationProgress } from "@/components/navigation-progress";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "비영리민간단체 자람",
    template: "%s | 비영리민간단체 자람",
  },
  description:
    "비영리민간단체 자람은 어린이집과 다함께키움센터 등 아동 돌봄과 성장 관련 시설을 운영하며 지역사회와 함께합니다.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "비영리민간단체 자람",
    description: "아이와 가족, 지역사회가 함께 자라는 돌봄",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        {children}
      </body>
      {process.env.NEXT_PUBLIC_GTM_ID ? (
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
      ) : null}
    </html>
  );
}
