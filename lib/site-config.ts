export function getSiteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!value) {
    return "https://seoul-jaram.com";
  }

  return value.replace(/\/+$/, "");
}

export const siteConfig = {
  name: "비영리민간단체 자람",
  shortName: "자람",
  description:
    "비영리민간단체 자람은 어린이집과 다함께키움센터 등 아동 돌봄과 성장 관련 시설을 운영하며 지역사회와 함께합니다.",
  slogan: "아이와 가족, 지역사회가 함께 자라는 돌봄",
  keywords: [
    "비영리민간단체 자람",
    "자람",
    "서울 자람",
    "아동 돌봄",
    "어린이집",
    "다함께키움센터",
    "지역사회 돌봄",
    "비영리 단체",
  ],
  contact: {
    telephone: "02-3411-2555",
    email: "k0421jm@naver.com",
    addressLocality: "서울특별시 강남구",
    streetAddress: "일원로 5길 29",
  },
} as const;
