export const facilityPages = {
  "firstier-goun": {
    slug: "firstier-goun",
    name: "국공립 퍼스티어고운어린이집",
    type: "국공립 어린이집",
    location: "강남구 개포동",
    summary: "안전한 일상과 놀이 중심 배움을 함께 설계하는 보육 공간입니다.",
    headline: "아이의 하루가 반짝이는 따뜻한 공간",
    image: undefined,
    galleryImages: [],
    intro: [
      "퍼스티어고운어린이집은 아이들이 편안하게 머물고 즐겁게 배우는 국공립 어린이집입니다.",
      "하루의 흐름 안에서 놀이와 생활, 배움이 자연스럽게 이어지도록 차분하게 살핍니다.",
    ],
    points: [
      {
        title: "즐겁게 배우는 아이",
        description: "아이 스스로 보고 만지고 표현하면서 호기심을 넓혀갈 수 있도록 돕습니다.",
      },
      {
        title: "따뜻하게 머무는 공간",
        description: "안전과 위생, 정서까지 함께 살피며 아이가 안심하고 지낼 수 있는 환경을 만듭니다.",
      },
      {
        title: "함께 자라는 공동체",
        description: "가정과 어린이집이 같은 방향을 바라보며 아이의 성장을 함께 이어갑니다.",
      },
    ],
    closing: "아이와 가족이 믿고 머물 수 있는 편안한 보육 공간을 만들어갑니다.",
  },
  "jagok-care": {
    slug: "jagok-care",
    name: "행복자곡다함께키움센터",
    type: "초등 돌봄",
    location: "강남구 자곡동",
    summary: "방과 후 아이들이 쉬고 배우며 관계를 넓히는 초등 돌봄 거점입니다.",
    headline: "방과 후 쉼과 놀이가 이어지는 우리동네 돌봄 거점",
    image: "/images/biz-2.jpg",
    galleryImages: ["ckeditor/upload/2026/04/10/148375c9-9144-49bc-9f23-54a6b0328c15.jpg"],
    intro: [
      "행복자곡다함께키움센터는 방과 후 아이들이 편안하게 쉬고 놀 수 있는 생활형 돌봄 공간입니다."
    ],
    points: [
      {
        title: "쉼이 있는 방과 후",
        description: "학교를 마친 아이들이 긴장을 풀고 편안하게 쉴 수 있는 시간을 만듭니다.",
      },
      {
        title: "놀이와 관계의 확장",
        description: "또래와 어울리고 함께 규칙을 만들며 관계를 넓혀가는 경험을 돕습니다.",
      },
      {
        title: "가까운 생활권 돌봄",
        description: "생활권 안에서 가정과 지역을 잇는 가까운 돌봄 거점이 되도록 운영합니다.",
      },
    ],
    closing: "아이들이 방과 후 시간을 편안하고 건강하게 보낼 수 있는 공간을 지향합니다.",
  },
  "pangyo-forest": {
    slug: "pangyo-forest",
    name: "국공립 판교숲길어린이집",
    type: "국공립 어린이집",
    location: "분당구 대장동",
    summary: "자연과 가까운 환경에서 아이의 호기심과 성장을 돕는 보육 공간입니다.",
    headline: "자연과 가까운 일상 속에서 자라는 호기심과 감수성",
    image: "/images/biz-3.jpg",
    galleryImages: [
      "ckeditor/upload/2026/04/10/ab7d8d50-f2c6-4114-b4ca-b5454fc078b5.png",
    ],
    intro: [
      "판교숲길어린이집은 자연과 가까운 환경 안에서 아이들이 편안하게 생활하고 배우는 국공립 어린이집입니다.",
      "일상 속에서 보고 느끼고 움직이는 경험이 자연스럽게 이어지도록 공간과 흐름을 살핍니다.",
    ],
    points: [
      {
        title: "자연과 이어지는 배움",
        description: "계절의 변화와 주변 환경을 가까이에서 느끼며 관찰력과 감수성을 키웁니다.",
      },
      {
        title: "안정적인 생활 리듬",
        description: "하루의 흐름 안에서 편안하고 안정된 생활 경험이 이어지도록 돕습니다.",
      },
      {
        title: "아이 중심의 성장 환경",
        description: "아이 한 명 한 명의 속도와 표현 방식을 존중하며 스스로 해보는 경험을 응원합니다.",
      },
    ],
    closing: "자연과 생활, 놀이와 배움이 부드럽게 이어지는 공간을 만들어갑니다.",
  },
} as const;

export type FacilitySlug = keyof typeof facilityPages;

export const facilityNavigation = Object.values(facilityPages).map((facility) => ({
  label: facility.name,
  href: `/facilities/${facility.slug}`,
}));

export function isFacilitySlug(value: string): value is FacilitySlug {
  return value in facilityPages;
}
