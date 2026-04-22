import {
  Baby,
  BookOpenText,
  Building,
  Building2,
  CalendarHeart,
  ClipboardHeart,
  FileText,
  GalleryHorizontalEnd,
  HandHeart,
  HeartHandshake,
  Leaf,
  MapPin,
  MessageCircleQuestion,
  Newspaper,
  Network,
  ShieldCheck,
  Sprout,
  UserRound,
  UsersRound,
} from "lucide-react";

export const navigation = [
  {
    label: "소개",
    href: "/about/greeting",
    feature: {
      title: "자람",
      description: "오늘보다 더 나은 내일을 위한 교육 환경을 만들고자 나아가는 자람입니다.",
      links: [
        { label: "자세히 보기", href: "/about/vision" },
        { label: "오시는 길", href: "/about/location" },
      ],
    },
    items: [
      { label: "대표 소개", href: "/about/greeting", icon: Building },
      { label: "설립취지문", href: "/about/founding", icon: FileText },
      { label: "비전과 미션", href: "/about/vision", icon: MessageCircleQuestion },
      { label: "조직도", href: "/about/organization", icon: Network },
      { label: "오시는 길", href: "/about/location", icon: MapPin },
    ],
  },
  {
    label: "소통공간",
    href: "/news/notices",
    items: [
      { label: "공지사항", href: "/news/notices", isNew: true },
      { label: "뉴스 및 소식", href: "/news/stories", isNew: true },
      { label: "갤러리", href: "/news/gallery" },
      { label: "문의게시판", href: "/news/qna" },
      { label: "자주하는 질문", href: "/news/faq" },
    ],
  },
  {
    label: "사업",
    href: "/#programs",
    items: [
      { label: "국공립 퍼스티어고운어린이집", href: "/facilities/firstier-goun", icon: Baby },
      { label: "행복자곡다함께키움센터", href: "/facilities/jagok-care", icon: UsersRound },
      { label: "국공립 판교숲길어린이집", href: "/facilities/pangyo-forest", icon: Leaf },
    ],
  },
  {
    label: "후원",
    href: "/#support",
    items: [
      { label: "일시/정기후원", href: "/support/donate", icon: CalendarHeart },
      { label: "기타후원", href: "/support/other", icon: HandHeart },
      { label: "기부금운영보고서", href: "/support/report", icon: ClipboardHeart },
    ],
  },
];

export const trustItems = [
  { label: "비영리민간단체", icon: ShieldCheck },
  { label: "국공립 어린이집 운영", icon: Baby },
  { label: "초등 돌봄 지원", icon: UsersRound },
  { label: "지역사회 협력", icon: HeartHandshake },
];

export const programCards = [
  {
    title: "위탁 사업",
    description: "국공립 보육시설과 우리동네 키움 등 공공 돌봄 현장의 안정적인 운영을 지원합니다.",
    points: ["보육/키움센터 위탁 운영", "교직원·학부모 역량 강화", "놀이 중심 컨설팅"],
    icon: Building2,
  },
  {
    title: "사회 복지 지원",
    description: "지역 복지기관과 연결해 아이와 가족에게 필요한 지원이 닿도록 협력합니다.",
    points: ["복지재단 연계", "청소년·가족 지원", "민관학 네트워크"],
    icon: HandHeart,
  },
  {
    title: "지역특화 사업",
    description: "아동 친화 환경, 숲 활동, 환경교육 등 지역의 특성을 살린 프로그램을 만듭니다.",
    points: ["아동 친화 환경 조성", "숲·환경 체험", "공익활동 지원"],
    icon: Leaf,
  },
];

export const facilities = [
  {
    name: "국공립 퍼스티어고운어린이집",
    type: "국공립 어린이집",
    location: "서울 지역 보육시설",
    summary: "안전한 일상과 놀이 중심 배움을 함께 설계하는 보육 공간입니다.",
  },
  {
    name: "행복자곡다함께키움센터",
    type: "초등 돌봄",
    location: "자곡동 지역사회",
    summary: "방과 후 아이들이 쉬고 배우며 관계를 넓히는 초등 돌봄 거점입니다.",
  },
  {
    name: "국공립 판교숲길어린이집",
    type: "국공립 어린이집",
    location: "판교 숲길 생활권",
    summary: "자연과 가까운 환경에서 아이의 호기심과 성장을 돕는 보육 공간입니다.",
  },
];

export const newsItems = [
  {
    category: "공지",
    title: "자람의 새로운 소식은 이곳에서 안내됩니다",
    date: "준비 중",
  },
  {
    category: "소식",
    title: "시설 운영과 지역사회 활동 이야기를 전합니다",
    date: "준비 중",
  },
  {
    category: "갤러리",
    title: "아이들의 배움과 돌봄 현장을 사진으로 기록합니다",
    date: "준비 중",
  },
];

export const storyItems = [
  {
    title: "아이들이 자연 속에서 배우는 하루",
    summary: "놀이와 관찰을 통해 아이들의 호기심이 자라는 활동 이야기를 전합니다.",
    date: "2026.04.01",
    image: "/images/children-growth.jpg",
  },
  {
    title: "지역사회와 함께 만드는 돌봄 네트워크",
    summary: "가족과 기관, 지역이 함께 연결되는 자람의 협력 현장을 소개합니다.",
    date: "2026.03.18",
    image: "/images/community-care.jpg",
  },
  {
    title: "교직원 역량 강화를 위한 운영 워크숍",
    summary: "돌봄의 품질을 높이기 위한 구성원 학습과 회고의 시간을 가졌습니다.",
    date: "2026.03.04",
    image: "/images/hero-sprout.jpg",
  },
  {
    title: "가정과 기관이 함께하는 성장 기록",
    summary: "아이의 생활과 배움을 함께 바라보는 소통 방식을 만들어갑니다.",
    date: "2026.02.20",
    image: "/images/hero-community.jpg",
  },
];

export const quickLinks = [
  { label: "대표 소개", href: "/about/greeting", icon: UserRound },
  { label: "운영 시설", href: "#facilities", icon: Building2 },
  { label: "자람 소식", href: "#news", icon: Newspaper },
  { label: "갤러리", href: "/news/gallery", icon: GalleryHorizontalEnd },
  { label: "후원 안내", href: "#support", icon: BookOpenText },
];

export const noticeItems = [
  { title: "2026년 자람 운영 시설 안내", writer: "관리자", date: "2026.04.10", views: 142 },
  { title: "후원금 운영보고서 공개 예정 안내", writer: "관리자", date: "2026.04.02", views: 88 },
  { title: "갤러리 사진 게시 기준 안내", writer: "관리자", date: "2026.03.25", views: 121 },
  { title: "문의게시판 이용 안내", writer: "관리자", date: "2026.03.11", views: 97 },
  { title: "개인정보 처리방침 개정 사전 안내", writer: "관리자", date: "2026.02.28", views: 76 },
  { title: "자람 홈페이지 리뉴얼 준비 안내", writer: "관리자", date: "2026.02.12", views: 165 },
];

export const galleryItems = [
  { title: "숲에서 만나는 계절", image: "/images/marquee-1.jpg" },
  { title: "함께 만드는 놀이", image: "/images/marquee-2.jpg" },
  { title: "돌봄 공간의 하루", image: "/images/marquee-3.jpg" },
  { title: "지역과 함께한 활동", image: "/images/children-growth.jpg" },
  { title: "아이들의 성장 기록", image: "/images/community-care.jpg" },
  { title: "따뜻한 배움의 순간", image: "/images/hero-care.jpg" },
];

export const contact = {
  bank: "하나은행 303-910024-16404 자람",
  address: "서울특별시",
  email: "contact@seoul-jaram.com",
  icon: Sprout,
  mapIcon: MapPin,
};
