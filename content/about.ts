import {
  Building,
  FileText,
  MapPin,
  MessageCircleQuestion,
  Network,
} from "lucide-react";

export const aboutNavigation = [
  { label: "대표 소개", href: "/about/greeting", icon: Building },
  { label: "설립취지문", href: "/about/founding", icon: FileText },
  { label: "비전과 미션", href: "/about/vision", icon: MessageCircleQuestion },
  { label: "조직도", href: "/about/organization", icon: Network },
  { label: "오시는 길", href: "/about/location", icon: MapPin },
];

export const greetingContent = {
  eyebrow: "GREETING",
  title: "대표 소개",
  headline: "비영리 민간 단체 자람 입니다.",
  body: [
    "자람은 104명의 회원님들의 생각을 함께 모아서 설립한 단체 입니다.",
    "자람은 다음과 같은 목표를 실천 하고 자 합니다.",
  ],
  goals: [
    {
      title: "안심하고 맡길 보육 환경 조성과 초등 돌봄의 사각지대 해소",
      description:
        "학부모, 교사, 원장, 지역 인사, 마을 활동가, 전문가의 구성으로 안심하고 맡길 보육 환경, 사회적 경력 단절의 위기를 극복하도록 돕고, 함께 운영하는 국공립 직장 보육시설, 초등 돌봄의 위탁 사업을 지원합니다.",
    },
    {
      title: "민·관 협력형 자람 프로그램 개발",
      description: "지역맞춤 연계와 공익활동 지원사업을 통해 지역사회와 함께 성장하는 돌봄 프로그램을 만들어갑니다.",
    },
  ],
  closing:
    "제 임기동안 회원님들과 함께, 회원님들의 소중한 꿈을 이루어 가는 민간단체 자람이 되도록 하겠습니다.",
  signature: "비영리민간단체 자람 대표",
};

export const foundingContent = {
  eyebrow: "FOUNDING",
  title: "설립취지문",
  summary: "보육 현장에서 시작한 경험을 바탕으로 지역사회와 함께 성장하는 비영리민간단체 자람의 설립 배경입니다.",
  headline: "비영리민간단체 자람 연혁보고",
  history: [
    {
      year: "1994",
      title: "보육현장과 연계한 지역활동 시작",
      description: "보육 현장을 기반으로 지역사회와 연결되는 활동을 시작하며 단체의 기반을 다졌습니다.",
    },
    {
      year: "2004",
      title: "임의단체 활동 확대",
      description: "공익활동, 주민참여예산, 환경학교 활동을 시작하며 본격적인 활동 기반을 마련했습니다.",
    },
    {
      year: "2023",
      title: "비영리민간단체 자람 등록",
      description: "서울시 영유아담당관에 비영리민간단체 자람으로 등록했습니다.",
    },
    {
      year: "2023",
      title: "구립 퍼스티어고운어린이집 위탁계약",
      description: "강남구청과 구립 퍼스티어고운어린이집 위탁계약을 체결했습니다.",
    },
    {
      year: "2024",
      title: "강남 9호점 수서역세권 다함께키움센터 위탁 체결",
      description: "초등 돌봄 영역으로 운영 기반을 확장했습니다.",
    },
    {
      year: "2025",
      title: "성남시 국공립 판교숲길어린이집 위탁 선정",
      description: "국공립 어린이집 운영 경험을 확장하며 보육 현장 지원을 이어갑니다.",
    },
  ],
  purpose: [
    "30여년간의 보육 현장 경험을 토대로 향후 보육 현장의 후배들에게 든든한 울타리로서 지원하는 위탁 사업을 수행합니다.",
    "104명의 회원이 함께 각자의 재능을 기부하고 참여합니다.",
    "놀이와 쉼이 있는 돌봄, 우리동네 키움센터 운영을 지원합니다.",
    "사회복지원 사업과 서울시 지역 특화 사업을 발굴하고 재능 기부를 이어갑니다.",
  ],
  quote:
    "사려 깊고 헌신하는 작은 시민 집단이 세상을 바꿀 수 있다는 것을 믿어 의심치 않습니다. 시민이야말로 지금까지 세상을 바꿔온 유일한 존재입니다.",
  quoteAuthor: "Margaret Mead",
  quoteMeta: "미국 문화 인류학자",
};

export const visionMissionContent = {
  eyebrow: "VISION & MISSION",
  title: "비전과 미션",
  summary: "모든 어린이가 풍부한 교육 환경에서 자율적으로 성장하고, 가족이 건강하게 유지될 수 있는 세상을 추구합니다.",
  vision: {
    headline: "어린이와 가족이 희망과 기회로 가득찬 미래를 만들 수 있도록 지원합니다.",
    points: [
      "안심하고 맡길 보육환경 조성과 초등 돌봄의 사각지대 해소",
      "민간 협력형 자람 프로그램 개발",
      "지역 맞춤 연계와 공익활동 지원사업 확대",
    ],
  },
  missionIntro:
    "아이 키우기 좋은 서울의 보육목표에 맞춰 보육의 공공성 제고, 수요 맞춤형 보육의 질 개선, 교직원 노동 환경권 보장, 건강하고 안전한 보육환경 조성을 위해 현장과 함께합니다.",
  missions: [
    {
      title: "국공립어린이집 위탁",
      items: ["보육/우리동네키움 위탁", "교사 역량 강화 지원", "교직원 힐링데이 지원", "학부모 역량 강화 지원", "아동지원 특색 프로그램", "놀이 중심 컨설팅 지원", "맞춤형 보육 지원"],
    },
    {
      title: "지역특화사업",
      items: ["아동 친화 환경 조성 지원", "우리마을 특화 사업", "대모산·양재천 숲 활동", "개포동 해설 및 환경체험활동", "제로웨이스트와 자원순환", "플리마켓·홍보·업사이클링", "공익활동 지원"],
    },
    {
      title: "사회 복지사업 지원",
      items: ["강남복지재단 연계", "청소년과 함께하는 활동", "경로당·복지관 연계", "민·관·학 협력 및 지역사회 네트워크 구축"],
    },
  ],
};

export const organizationContent = {
  eyebrow: "ORGANIZATION",
  title: "조직도",
  summary: "자람의 운영 구조와 협력 체계를 확인할 수 있습니다.",
  image: "/images/jaram-organization.png",
  root: "비영리민간단체 자람",
  tree: [
    {
      title: "이사회",
      children: [
        { title: "이사" },
        { title: "실행위원회" },
        {
          title: "분과별 조직",
          children: [
            { title: "위탁사업 : 보육 / 키움 / 돌봄" },
            { title: "사회복지지원 : 후원 / 나눔 / 목적사업" },
            { title: "교육 및 교구대여와 판매" },
          ],
        },
      ],
    },
    {
      title: "단체의 목적 사업",
      children: [{ title: "회원 : 104명" }],
    },
  ],
};
