import { CircleHelp, Images, MessageCircleQuestion, Newspaper, ScrollText } from "lucide-react";

export type CommunityCategory = "notices" | "stories" | "gallery" | "qna" | "faq";

export type CommunityPost = {
  id: string;
  category: Exclude<CommunityCategory, "faq">;
  title: string;
  subtitle?: string;
  author: string;
  date: string;
  views: number;
  image?: string;
  content: string[];
  files?: { name: string; size: string; url?: string }[];
  hasFiles?: boolean;
  isNew?: boolean;
};

export const communityNavigation = [
  { label: "공지사항", href: "/news/notices", category: "notices", icon: ScrollText },
  { label: "뉴스 및 소식", href: "/news/stories", category: "stories", icon: Newspaper },
  { label: "갤러리", href: "/news/gallery", category: "gallery", icon: Images },
  { label: "문의게시판", href: "/news/qna", category: "qna", icon: MessageCircleQuestion },
  { label: "자주하는 질문", href: "/news/faq", category: "faq", icon: CircleHelp },
] as const;

export const communityCategoryMeta = {
  notices: {
    label: "공지사항",
    summary: "자람의 운영 안내, 공지, 공개 자료를 확인할 수 있습니다.",
  },
  stories: {
    label: "뉴스 및 소식",
    summary: "자람의 돌봄 현장과 지역사회 활동 이야기를 전합니다.",
  },
  gallery: {
    label: "갤러리",
    summary: "아이와 가족, 지역이 함께한 순간을 사진 중심으로 기록합니다.",
  },
  qna: {
    label: "문의게시판",
    summary: "단체 운영과 후원, 시설 이용에 관한 문의를 남길 수 있는 공간입니다.",
  },
  faq: {
    label: "자주하는 질문",
    summary: "자람 홈페이지 이용과 후원, 문의에 대한 자주 묻는 질문을 정리합니다.",
  },
} satisfies Record<CommunityCategory, { label: string; summary: string }>;

export const isAdminMock = false;

export const communityPosts: CommunityPost[] = [
  {
    id: "notice-2026-04-10",
    category: "notices",
    title: "2026년 자람 운영 시설 안내",
    author: "관리자",
    date: "2026.04.10",
    views: 142,
    content: [
      "비영리민간단체 자람이 운영하는 보육 및 초등 돌봄 시설 정보를 안내드립니다.",
      "시설별 세부 운영 시간과 모집 안내는 각 기관 공지에 따라 순차적으로 업데이트될 예정입니다.",
    ],
    files: [{ name: "2026_자람_운영시설_안내.pdf", size: "228KB" }],
  },
  {
    id: "notice-2026-04-02",
    category: "notices",
    title: "후원금 운영보고서 공개 예정 안내",
    author: "관리자",
    date: "2026.04.02",
    views: 88,
    content: [
      "자람 후원금 운영 내역은 투명한 운영 원칙에 따라 홈페이지에 공개됩니다.",
      "보고서 게시 전 내부 검토와 자료 정리를 진행하고 있으며, 공개 일정은 추후 공지하겠습니다.",
    ],
  },
  {
    id: "notice-2026-03-25",
    category: "notices",
    title: "갤러리 사진 게시 기준 안내",
    author: "관리자",
    date: "2026.03.25",
    views: 121,
    content: [
      "갤러리에는 기관 활동과 지역사회 협력 현장을 중심으로 사진이 게시됩니다.",
      "아동 개인정보와 초상권 보호를 위해 식별 가능성이 높은 사진은 게시하지 않거나 별도 동의 절차를 거칩니다.",
    ],
  },
  {
    id: "notice-2026-03-11",
    category: "notices",
    title: "문의게시판 이용 안내",
    author: "관리자",
    date: "2026.03.11",
    views: 97,
    content: [
      "문의게시판은 홈페이지 개편 후 순차적으로 제공될 예정입니다.",
      "긴급한 문의는 대표 이메일 또는 각 운영 시설 연락처를 이용해주시기 바랍니다.",
    ],
  },
  {
    id: "story-2026-04-01",
    category: "stories",
    title: "아이들이 자연 속에서 배우는 하루",
    subtitle: "놀이와 관찰을 통해 호기심이 자라는 활동 이야기",
    author: "자람",
    date: "2026.04.01",
    views: 214,
    image: "/images/children-growth.jpg",
    content: [
      "자람은 아이들이 안전한 환경에서 충분히 놀고 쉬며 배울 수 있는 일상을 중요하게 생각합니다.",
      "이번 활동은 자연물을 관찰하고 친구들과 이야기를 나누며 스스로 질문을 만들어보는 시간으로 진행되었습니다.",
    ],
  },
  {
    id: "story-2026-03-18",
    category: "stories",
    title: "지역사회와 함께 만드는 돌봄 네트워크",
    subtitle: "가정, 기관, 지역이 연결되는 협력 현장",
    author: "자람",
    date: "2026.03.18",
    views: 176,
    image: "/images/community-care.jpg",
    content: [
      "아동 돌봄은 한 기관만의 일이 아니라 지역사회가 함께 살피는 공공의 과제입니다.",
      "자람은 학부모, 교직원, 지역 활동가와 협력하며 아이와 가족에게 필요한 지원이 닿도록 노력하고 있습니다.",
    ],
  },
  {
    id: "story-2026-03-04",
    category: "stories",
    title: "교직원 역량 강화를 위한 운영 워크숍",
    subtitle: "돌봄 품질을 높이기 위한 구성원 학습과 회고",
    author: "자람",
    date: "2026.03.04",
    views: 132,
    image: "/images/hero-sprout.jpg",
    content: [
      "자람은 운영 현장의 고민을 함께 나누고 해결책을 찾는 시간을 정기적으로 마련하고 있습니다.",
      "이번 워크숍에서는 안전한 돌봄 환경, 놀이 중심 운영, 보호자 소통 방식을 주제로 논의했습니다.",
    ],
  },
  {
    id: "story-2026-02-20",
    category: "stories",
    title: "가정과 기관이 함께하는 성장 기록",
    subtitle: "아이의 생활과 배움을 함께 바라보는 소통 방식",
    author: "자람",
    date: "2026.02.20",
    views: 119,
    image: "/images/hero-community.jpg",
    content: [
      "아이의 성장은 가정과 기관이 같은 방향으로 바라볼 때 더 안정적으로 이어집니다.",
      "자람은 일상 기록과 상담, 활동 공유를 통해 보호자와 기관의 신뢰를 쌓아가고 있습니다.",
    ],
  },
  {
    id: "gallery-2026-04-08",
    category: "gallery",
    title: "숲에서 만나는 계절",
    subtitle: "자연 속에서 계절의 변화를 관찰한 하루",
    author: "자람",
    date: "2026.04.08",
    views: 238,
    image: "/images/marquee-1.jpg",
    content: ["아이들이 숲길을 걸으며 봄의 색과 냄새, 바람을 느낀 활동 기록입니다."],
  },
  {
    id: "gallery-2026-03-29",
    category: "gallery",
    title: "함께 만드는 놀이",
    subtitle: "친구들과 생각을 모아 만든 협동 놀이",
    author: "자람",
    date: "2026.03.29",
    views: 197,
    image: "/images/marquee-2.jpg",
    content: ["놀이 속에서 아이들이 서로의 생각을 듣고 규칙을 만들어간 시간을 담았습니다."],
  },
  {
    id: "gallery-2026-03-15",
    category: "gallery",
    title: "돌봄 공간의 하루",
    subtitle: "안전하고 편안한 일상이 이어지는 돌봄 현장",
    author: "자람",
    date: "2026.03.15",
    views: 185,
    image: "/images/marquee-3.jpg",
    content: ["아이들이 쉬고 배우며 관계를 넓히는 돌봄 공간의 하루를 소개합니다."],
  },
  {
    id: "gallery-2026-02-26",
    category: "gallery",
    title: "지역과 함께한 활동",
    subtitle: "지역사회와 연결된 공익 활동 기록",
    author: "자람",
    date: "2026.02.26",
    views: 154,
    image: "/images/community-care.jpg",
    content: ["지역 안에서 아이와 가족을 함께 돌보는 협력 활동의 장면입니다."],
  },
  {
    id: "gallery-2026-02-12",
    category: "gallery",
    title: "아이들의 성장 기록",
    subtitle: "작은 변화가 모여 큰 성장이 되는 순간",
    author: "자람",
    date: "2026.02.12",
    views: 166,
    image: "/images/children-growth.jpg",
    content: ["아이들이 스스로 해내고 함께 배우는 순간을 기록했습니다."],
  },
  {
    id: "gallery-2026-01-30",
    category: "gallery",
    title: "따뜻한 배움의 순간",
    subtitle: "관계 안에서 자라는 배움과 돌봄",
    author: "자람",
    date: "2026.01.30",
    views: 143,
    image: "/images/hero-care.jpg",
    content: ["돌봄과 배움이 자연스럽게 이어지는 현장의 모습을 전합니다."],
  },
];

export const faqItems = [
  {
    question: "후원은 어떻게 신청하나요?",
    answer: "후원 페이지에서 일시후원과 정기후원 안내를 확인하실 수 있습니다. 결제 연동은 추후 적용 예정입니다.",
  },
  {
    question: "문의게시판은 누가 이용할 수 있나요?",
    answer: "회원 기능 전환 후 로그인 사용자 기준으로 문의 작성 기능을 제공할 예정입니다.",
  },
  {
    question: "공지, 뉴스, 갤러리 글쓰기는 누가 할 수 있나요?",
    answer: "운영자 권한을 가진 관리자만 작성할 수 있도록 인증과 권한 검사를 분리해 구현할 예정입니다.",
  },
];

export function getCommunityPosts(category: CommunityPost["category"]) {
  return communityPosts.filter((post) => post.category === category);
}

export function getCommunityPost(category: CommunityPost["category"], id: string) {
  return communityPosts.find((post) => post.category === category && post.id === id);
}

export function isPostCategory(category: string): category is CommunityPost["category"] {
  return category === "notices" || category === "stories" || category === "gallery" || category === "qna";
}
