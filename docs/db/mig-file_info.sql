-- FILE_INFO legacy migration -> jaram.file_info
-- Generated from legacy INSERT statements
-- Mapping:
--   EDT_SEQ numeric -> post_id
--   EDT_SEQ non-numeric -> post_id = NULL
--   COMMENT_SEQ -> comment_id
--   ORG_FILE_NAME -> original_file_name
--   SAVE_FILE_NAME -> stored_file_name
--   INPUT_DT -> created_at
--   INPUT_ID -> created_by

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  null,
  null,
  '73485861b98f3c3799979e7257b2fda6.png',
  'ae8bd0f610f24608a965fb1e35ee86e3.png',
  137947,
  '2023-10-31 10:27:23.000',
  'anonymousUser'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  185,
  null,
  '336a9a8e03ceb719d11be5927cbc5ea5.png',
  '9092f6f66044411e8e6acc1768fdbda7.png',
  70021,
  '2023-10-31 13:16:23.000',
  'anonymousUser'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  187,
  null,
  'img5.jpg',
  'ef84b7ea09f04166bd0f392462324534.jpg',
  259033,
  '2023-10-31 14:51:58.000',
  'anonymousUser'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  192,
  null,
  '336a9a8e03ceb719d11be5927cbc5ea5.png',
  'd35632d71cc14c7ab96ee04b46cf24a9.png',
  70021,
  '2023-11-01 14:01:23.000',
  'anonymousUser'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  192,
  null,
  'img11.jpg',
  '384e3ecac5c6444abcbca5b363cbb09f.jpg',
  195805,
  '2023-11-01 14:01:23.000',
  'anonymousUser'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  201,
  null,
  'img4.jpg',
  'd45ea66d23a44c1290685714234a231a.jpg',
  232467,
  '2023-11-01 16:01:08.000',
  'io1027@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  202,
  null,
  'img4.jpg',
  '513c618c9f614d368367ce58e4c50335.jpg',
  232467,
  '2023-11-10 09:07:12.000',
  'anonymousUser'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  203,
  null,
  'img5.jpg',
  'ed2bbfc3bf7f4862ad81fd100c3e0dee.jpg',
  259033,
  '2023-11-10 09:08:09.000',
  'io1027@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  224,
  null,
  '로봇코딩부스.jpg',
  '6380d644d3e840f3b047a620ee14d283.jpg',
  591707,
  '2023-11-15 08:04:03.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  229,
  null,
  '수능3.jpg',
  '0a761edf2f4f49378f2e2d62cc048a70.jpg',
  463658,
  '2023-11-16 10:32:13.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  229,
  null,
  '수능응원1.jpg',
  '314f5b4d539e4440abb1ce757c82835d.jpg',
  3373504,
  '2023-11-16 10:32:13.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  285,
  null,
  '2024 비영리 민간 단체 자람 임시 이사회 회의록-최종.hwp',
  '46244249c2d2472f8570428c84bb2821.hwp',
  2061824,
  '2024-03-30 15:56:16.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  286,
  null,
  '2024 비영리 민간 단체 자람 임시 이사회 회의록-최종.hwp',
  '62c03557ebc9415885191eddc9b7c301.hwp',
  2061824,
  '2024-03-30 15:56:31.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  288,
  null,
  '이사사회총회.jpg',
  'd7b3d3749bd24694b2f512b3592b1f62.jpg',
  363358,
  '2024-03-31 14:39:52.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  289,
  null,
  '고운교사교육자료.jpg',
  '803fa6456d8b4a7f8d2023b9c8130298.jpg',
  659295,
  '2024-03-31 14:59:11.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  305,
  null,
  'KakaoTalk_20240521_140646361.jpg',
  '29be8520137a4bb3988da2a12e905971.jpg',
  458166,
  '2024-05-24 09:32:22.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  305,
  null,
  'KakaoTalk_20240521_140646361_01.jpg',
  '977ecf623dd8423798dff2f5727de279.jpg',
  513880,
  '2024-05-24 09:32:22.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  307,
  null,
  '마포지키미.jpg',
  '946c1e76e69f4982a214c7149f59373b.jpg',
  256486,
  '2024-05-24 09:49:29.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  308,
  null,
  'KakaoTalk_20240611_153404533_02.jpg',
  'dee2c67944a941f1a6efefb338de18e7.jpg',
  722640,
  '2024-06-14 10:11:17.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  309,
  null,
  'KakaoTalk_20240611_153404533_03.jpg',
  '7b934a2c70bd4e38a1f9311a6e444317.jpg',
  594344,
  '2024-06-14 10:14:31.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  308,
  null,
  'KakaoTalk_20240611_163420712_06.jpg',
  '1fb4b597c4424faaa768d8c46e659f36.jpg',
  2194264,
  '2024-06-19 09:29:35.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  314,
  null,
  '2024 자람 민간단체 이사회 공고.hwp',
  '0d8f65ddd61e42fabccdc6691b853c0b.hwp',
  522240,
  '2024-07-13 07:47:27.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  315,
  null,
  '수서역세권다함께키움센터 모집 공고안 (1).hwpx',
  '32040876f1e74b7a827cda33628f761b.hwpx',
  93800,
  '2024-07-13 07:50:01.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  315,
  null,
  '수서역세권다함께키움센터 위탁운영 사업 신청서 (1).hwpx',
  '1f231b76dfdd432dbc09da911bbcac18.hwpx',
  103201,
  '2024-07-13 07:50:01.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  315,
  null,
  '[서식2] 서약서 및 확약서 등_별도제출분 (1).hwpx',
  'faefea759a984cac81a99b07760194b9.hwpx',
  77057,
  '2024-07-13 07:50:01.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  316,
  null,
  '자람이사회의록_20240719 (9).pdf',
  '66d809f572754d9c9a5abb2e553f17ff.pdf',
  9207008,
  '2024-07-19 11:21:50.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  324,
  null,
  '자람 긴급 이사회pdf.pdf',
  'd870ddcf59574ca7b0e735fa89f44fd7.pdf',
  3006825,
  '2024-08-14 21:31:48.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  326,
  null,
  '강남 9호점 수서역세권다함께키움센터(가칭)  채용 공고문.hwp',
  '888502d6ee3d483fb55c5f908c4796a9.hwp',
  109568,
  '2024-08-14 21:40:37.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  327,
  null,
  'KakaoTalk_20240814_225618338_02.jpg',
  '0f1b7ff532644f5c8d876e50823c6ebd.jpg',
  238711,
  '2024-08-16 07:18:10.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  329,
  null,
  '강남 9호점 행복자곡다함께키움센터  채용 공고문 (1).hwp',
  'a2a085c3b6e74c428a5778f9a293410e.hwp',
  89088,
  '2024-09-09 15:46:30.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  330,
  null,
  'KakaoTalk_20240909_074802745_05.jpg',
  '8026d4f8ecf44154bec10ae47739d721.jpg',
  801582,
  '2024-09-15 16:44:05.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  333,
  null,
  '주방_20240903_175959313_01.jpg',
  '24bdbc3b27ec4a8686abfde7aff6e531.jpg',
  410670,
  '2024-10-05 07:40:37.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  337,
  null,
  'KakaoTalk_20241101_065840565_03.jpg',
  'f5d422733379479aa8b6807d8ddb68f9.jpg',
  550006,
  '2024-11-06 10:30:32.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  339,
  null,
  'KakaoTalk_20241106_112501988.jpg',
  '826dc3ac95b4468db88bf4ad6e0f5afd.jpg',
  3057045,
  '2024-11-06 11:33:53.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  339,
  null,
  'KakaoTalk_20241106_112501988_01.jpg',
  '19d137f6ed6e40f9b871f755a4b946aa.jpg',
  2771990,
  '2024-11-06 11:33:53.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  339,
  null,
  'KakaoTalk_20241106_112501988_02.jpg',
  '5fd872bf11b744219606b6cc7b809b67.jpg',
  3075102,
  '2024-11-06 11:33:53.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  340,
  null,
  'KakaoTalk_20241106_112501988_01.jpg',
  '93b2aa89580c42f3ab5b4cf2ef186e9e.jpg',
  2771990,
  '2024-11-06 11:36:42.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  340,
  null,
  'KakaoTalk_20241106_112501988_02.jpg',
  'bfba43f8afff43e9a70a2abd77cedda4.jpg',
  3075102,
  '2024-11-06 11:36:42.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  360,
  null,
  '77c25729-a129-4962-bcd5-31b9d104d975.jpg',
  'adc8d98860c14a35bc1aa2d01a9caba6.jpg',
  594344,
  '2024-11-25 09:46:15.000',
  'io1027@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  365,
  null,
  'a36ddf45-92c6-49aa-bd17-b8cef6221feb.png',
  '78f9fb9cc1a944bc968e172ca7f4b463.png',
  2678020,
  '2024-11-25 10:05:49.000',
  'io1027@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  372,
  null,
  '2024 자람 민간단체 이사회 공고12월7일.hwp',
  '82e6c50ea18d42718ada5980f55428d7.hwp',
  76288,
  '2024-11-25 19:33:44.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  373,
  null,
  '2024 자람 민간단체 이사회 공고-1.hwp',
  '02c4fd3ceba54af5a65cf171e906e2b1.hwp',
  67584,
  '2024-12-06 06:51:23.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  378,
  null,
  '공익활동2025.zip',
  'd52f247980794f7084236ed3ade05df3.zip',
  3652187,
  '2025-02-03 17:22:48.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  379,
  null,
  '키움자곡 2월.xlsx',
  'aa41433806c2403f8c567871b1b83171.xlsx',
  90559,
  '2025-02-03 17:29:20.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  379,
  null,
  '강남9호점 우리동네키움센터 2월 가정통신문_ - 복사본.hwp',
  '90bfbf11b7e142899a700e08f10c6aa9.hwp',
  261632,
  '2025-02-03 17:29:20.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  380,
  null,
  '디아크리온 아침돌봄.hwpx',
  'e0fe34aef73c468fbab753c3346091f6.hwpx',
  1015819,
  '2025-02-13 09:17:45.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  381,
  null,
  '강남 9호점 아침돌봄행복자곡다함께키움센터  채용 공고문.hwp-1.hwp',
  '6d003946c9604eabb6ffdb73321f5011.hwp',
  103936,
  '2025-02-16 07:40:11.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  382,
  null,
  '추가 아침돌봄행복자곡다함께키움센터  채용 공고문.hwp-1 (1).hwp',
  '3f91cc62c4674ff4ac87ffcf87657022.hwp',
  185344,
  '2025-03-29 06:51:28.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  383,
  null,
  '2025 자람 민간단체 이사회 공고-1.hwp',
  '20d29982c4e8499fac6c29de2a8f4812.hwp',
  129024,
  '2025-05-21 06:25:04.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  384,
  null,
  '2025 자람 민간단체 이사회 공고-1.hwp',
  '86c4785d5e574c159ce42cfbfcbab1f4.hwp',
  59904,
  '2025-05-21 09:37:43.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  386,
  null,
  '2025년 6월 정기돌봄 교육계획안.hwp',
  'fc0fa2634bdb402b92697d047589cbaa.hwp',
  306688,
  '2025-06-04 11:00:02.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  387,
  null,
  '성남시비영리 민간 단체 자람 이사회 결의서.hwp',
  'bd5e7bd361014cff963faf845a3e5355.hwp',
  31744,
  '2025-06-04 11:09:48.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  390,
  null,
  '봉은초등학교_20250622_100803650_09.jpg',
  '5dbb4d4e14aa4db5a7c703de1e825411.jpg',
  5803551,
  '2025-06-24 11:47:49.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  390,
  null,
  '배치도20250622_112926875_02.jpg',
  'ac0661941c054de69785eab2d6fe43f6.jpg',
  55803,
  '2025-06-24 11:47:49.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  390,
  null,
  '공원_20250622_100803650_03.jpg',
  '55a796c3c5964aa586816c371e45189e.jpg',
  5913738,
  '2025-06-24 11:47:49.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  392,
  null,
  '2025년 탄천주민협의회 일원1동 맞춤형 주민복지사업 배분신청-에코 크리에이티브 페스타 수정.hwp',
  '74c05f3957e14a6b8f82aea7a0936285.hwp',
  115200,
  '2025-07-15 09:53:49.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  397,
  null,
  '자람비영리어린이집원장모집++채용+공고문.hwp-1.hwp',
  'c8c156d466fc425aac6feed64ec6984f.hwp',
  69632,
  '2025-09-01 13:48:15.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  398,
  null,
  '2025 자람 민간단체 이사회 공고-1.hwp',
  'f5f4883845fe43b3a04ef216682a3013.hwp',
  58368,
  '2025-09-03 15:10:20.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  400,
  null,
  '10이사회결의서.pdf',
  '07a3435d83804dc99c2c683b5f05d8a7.pdf',
  615775,
  '2025-09-16 10:29:42.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  400,
  null,
  '11이사회회의록.pdf',
  '81aa17cea8b0403fb257df1dad4aba47.pdf',
  1150022,
  '2025-09-16 10:29:42.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  406,
  null,
  '발표연습1_20251022_135646556_01.jpg',
  '4f04d9f2d57c4f78a18d87bdc3a53c8c.jpg',
  3120083,
  '2025-10-22 13:54:34.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  406,
  null,
  '발표연습220251022_135646556_02.jpg',
  '59440ce0a14846bebe95af6ff2d7369b.jpg',
  3552559,
  '2025-10-22 13:54:34.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  408,
  null,
  '2025년업무협약3.jpg',
  '7c96db0b43a4447e9942ccf1e79cbd6a.jpg',
  485637,
  '2025-11-07 11:55:03.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  408,
  null,
  '2025년업무협약 (2).jpg',
  '4b7739959a904b0da69c926fd906dba3.jpg',
  295367,
  '2025-11-07 11:55:03.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  413,
  null,
  '비영리자람총회공고_20251114_115250121_01.jpg',
  '8fa0959d3b854bcbb00991e0ff98d848.jpg',
  228676,
  '2025-11-17 15:09:14.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  417,
  null,
  'KakaoTalk_20251115_111240233_25.jpg',
  '6d20d806a12d484fb0538223cd22fac0.jpg',
  3433183,
  '2025-11-18 14:02:49.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  417,
  null,
  'KakaoTalk_20251115_111240233_29.jpg',
  '06558d483ddb4da9bacbf4d6a563ee03.jpg',
  3690074,
  '2025-11-18 14:02:49.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  427,
  null,
  '2025년 자람총회 회의록.pdf',
  '4b059cee9e8448c5af29fb11257fb1ef.pdf',
  952503,
  '2025-12-08 12:48:11.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  428,
  null,
  '2025 자람 민간단체 이사회 공고-12.hwp',
  'e11deb45c70940688fd8cfb5fa1dee85.hwp',
  59392,
  '2025-12-12 12:00:55.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  429,
  null,
  '2025년자람 6차이사회  개최공고.hwp',
  'c4e18ed20132490588d4ecca86038d3b.hwp',
  241152,
  '2025-12-21 19:09:17.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  433,
  null,
  '강남9호점아침돌봄교사모집.hwp',
  'c8e0179393864cfaaf462a07061efece.hwp',
  185344,
  '2025-12-26 13:29:45.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  436,
  null,
  '2026년자람 이사회  개최공고.hwp',
  'd71ac77f64f1452ebc3d18c6eeebdb42.hwp',
  274432,
  '2026-01-07 16:31:24.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  439,
  null,
  '2026년 비영리민간단체 자람 정기 이사회 개최.pdf',
  '4d9ee44c4102435d857efd2099854242.pdf',
  1803534,
  '2026-03-06 06:05:18.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  441,
  null,
  '2026년 비영리 민간 단체 자람 이사회 회의록.pdf',
  '47652780bde548938a5b4c94eac38933.pdf',
  1051771,
  '2026-03-27 09:38:40.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  442,
  null,
  '2025년 결산총괄표 (1)_1.png',
  'e1281d0e818a49df813fedc537233d91.png',
  264309,
  '2026-03-27 09:44:17.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  443,
  null,
  '이사회사진_20260313_114158815_03.jpg',
  '52695ff4d4e1448ea4208f8f1d36f32a.jpg',
  3900482,
  '2026-03-27 09:46:47.000',
  'k0421jm@naver.com'
);

insert into jaram.file_info (
  post_id,
  comment_id,
  original_file_name,
  stored_file_name,
  file_size,
  created_at,
  created_by
) values (
  446,
  null,
  '202 자람 민간단체 이사회 공고-2차.hwp',
  '35a880d3ffb14fd2926fd17709ee2700.hwp',
  62976,
  '2026-04-20 16:07:49.000',
  'k0421jm@naver.com'
);

-- Non-numeric EDT_SEQ values mapped to NULL post_id:
--   legacy SEQ 9: EDT_SEQ=vJpr6ho7hLn29ORHrF434w==
