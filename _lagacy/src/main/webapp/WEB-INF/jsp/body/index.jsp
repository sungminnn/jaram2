<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="s" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="kr">
<script>

	let nowPage = "news";

	$(function () {
		//그리드 탭 클릭 시
		$(".nav-link").on('click', function () {
			let id = $(this).attr("id").replaceAll("btn-", "");
			fn_search(id, 1);
		});
	});

	/**
	 * ajax 조회
	 */
	function fn_search(page, pageNum) {
		nowPage = page;
		//조회
		let data = {
			  pageNum: pageNum
			, PAGE: page
			, SEARCH_TITLE: $("#searchTitle").val()
		};
		cfn_ajaxTransmit("/board-list-paging", data);
	}

	/**
	 * 게시글 상세보기
	 */
	function fn_goDetail(seq) {
		location.href="/board-detail?seq="+seq+"&page="+nowPage;
	}

	/**
	 * Ajax callback
	 */
	function fn_callBack(id, res, stat) {
		if (id === '/board-list-paging') {
			if (nowPage === 'news') {
				fn_setNewsTable(res.list);
				fn_setNewsPage(res.pageInfo);
			} else if (nowPage === 'notice') {
				fn_setNoticeTable(res.list);
				fn_setNoticePage(res.pageInfo);
			} else if (nowPage === 'gallery') {
				fn_setGalleryTable(res.list);
				fn_setGalleryPage(res.pageInfo);
			}
		}
	}

	/**
	 * append table row
	 * @param list
	 */
	function fn_setNewsTable(list) {
		let div = $("#div-list-news");
		div.empty();
		if (list.length !== 0) {
			list.forEach(function (el, index) {
				let subTitle = "";
				if (common.isNotEmpty(el.EDT_SUB_TITLE)) {
					subTitle = el.EDT_SUB_TITLE.substring(0, 50);
				}

				div.append('<div class="col mb-5 pointer">'
					+ '<a class="card card-ghost card-transition-zoom h-100"'
					+ '   onclick="fn_goDetail(' + el.SEQ + ');">'
					+ '<div class="card-pinned card-transition-zoom-item">'
					+ '<img class="card-img" src="' + el.MAIN_IMG_PATH + '" alt="" style="max-height:445px;">'
					+ '</div>'
					+ '<div class="card-body">'
					+ '<h4><span class="fw-medium">' + el.EDT_TITLE + '</span></h4>'
					+ '<p class="card-text">' + subTitle + '</p>'
					+ '</div>'
					+ '</a>'
					+ '</div>');
			});
		} else {
			div.append('<div class="text-center w100 content-space-b-1">등록된 데이터가 없습니다.</div>');
		}
	}

	/**
	 * append page navigation
	 * @param page
	 */
	function fn_setNewsPage(newsPageInfo) {
		let nav = $("#nav-news");
		let prePage = newsPageInfo.prePage === 0 ? 1 : newsPageInfo.prePage;
		let initPage = newsPageInfo.pageNum % 5 === 0 ? newsPageInfo.pageNum - 5 + 1 : Math.floor(newsPageInfo.pageNum / 5) * 5 + 1;
		let endPage = Math.ceil(newsPageInfo.pageNum / 5) * 5 > newsPageInfo.pages ? newsPageInfo.pages : Math.ceil(newsPageInfo.pageNum / 5) * 5;
		let nextPage = newsPageInfo.nextPage === 0 ? newsPageInfo.pages : newsPageInfo.nextPage;
		let pageList = "";
		for (let i = initPage; i <= endPage; i++) {
			let active = '';
			if (newsPageInfo.pageNum === i) {
				active = 'active';
			}
			pageList += '<li class="page-item">'
				+ '<a class="page-link pointer ' + active + '" onclick="fn_search(\'news\', ' + i + ')">' + i + '</a>'
				+ '</li>';
		}
		nav.empty();
		nav.append('<ul class="pagination justify-content-center">'
			+ '<li class="page-item">'
			+ '<a class="page-link pointer" onclick="fn_search(\'news\', ' + prePage + ')" aria-label="Previous">'
			+ '<span aria-hidden="true"><i class="bi bi-chevron-double-left"></i></span>'
			+ '<span class="visually-hidden">Previous</span>'
			+ '</a>'
			+ '</li>'
			+ pageList
			+ '<li class="page-item">'
			+ '<a class="page-link pointer" onclick="fn_search(\'news\', ' + nextPage + ')" aria-label="Next">'
			+ '<span aria-hidden="true"><i class="bi bi-chevron-double-right"></i></span>'
			+ '<span class="visually-hidden">Next</span>'
			+ '</a>'
			+ '</li>'
			+ '</ul>');
	}


	/**
	 * append table row
	 * @param list
	 */
	function fn_setNoticeTable(list) {
		let tbody = $("#notice-tbl tbody");
		tbody.empty();
		console.log(list.length);
		if (list.length === 0) {
			tbody.append('<tr><td class="text-center" colspan="4">등록된 데이터가 없습니다.</td></tr>');
		} else {
			list.forEach(function (el, index) {
				tbody.append('<tr onclick="fn_goDetail(' + el.SEQ + ');">'
					+ '<td class="text-center">' + el.RN + '</td>'
					+ '<td><a href="#" class="link-dark link-sm">' + el.EDT_TITLE + '</a></td>'
					+ '<td class="text-center">' + el.INPUT_DT + '</td>'
					+ '<td class="text-center">' + el.INPUT_NAME + '</td>'
					+ '</tr>');
			});
		}
	}

	/**
	 * append page navigation
	 * @param page
	 */
	function fn_setNoticePage(pageInfo) {
		let nav = $("#nav-page-notice");
		let prePage = pageInfo.prePage === 0 ? 1 : pageInfo.prePage;
		let initPage = pageInfo.pageNum % 5 === 0 ? pageInfo.pageNum - 5 + 1 : Math.floor(pageInfo.pageNum / 5) * 5 + 1;
		let endPage = Math.ceil(pageInfo.pageNum / 5) * 5 > pageInfo.pages ? pageInfo.pages : Math.ceil(pageInfo.pageNum / 5) * 5;
		let nextPage = pageInfo.nextPage === 0 ? pageInfo.pages : pageInfo.nextPage;
		let pageList = "";
		for (let i = initPage; i <= endPage; i++) {
			let active = '';
			if (pageInfo.pageNum === i) {
				active = 'active';
			}
			pageList += '<li class="page-item">'
				+ '<a class="page-link pointer ' + active + '" onclick="fn_search(\'notice\',' + i + ')">' + i + '</a>'
				+ '</li>';
		}
		nav.empty();
		if (pageList !== "") {
			nav.append('<ul class="pagination justify-content-center">'
				+ '<li class="page-item">'
				+ '<a class="page-link pointer" onclick="fn_search(\'notice\',' + prePage + ')" aria-label="Previous">'
				+ '<span aria-hidden="true"><i class="bi bi-chevron-double-left"></i></span>'
				+ '<span class="visually-hidden">Previous</span>'
				+ '</a>'
				+ '</li>'
				+ pageList
				+ '<li class="page-item">'
				+ '<a class="page-link pointer" onclick="fn_search(\'notice\',' + nextPage + ')" aria-label="Next">'
				+ '<span aria-hidden="true"><i class="bi bi-chevron-double-right"></i></span>'
				+ '<span class="visually-hidden">Next</span>'
				+ '</a>'
				+ '</li>'
				+ '</ul>');
		}
	}

	/**
	 * append table row
	 * @param list
	 */
	function fn_setGalleryTable(list) {
		let div = $("#div-list-gallery");
		div.empty();
		if (list.length !== 0) {
			list.forEach(function (el, index) {
				let subTitle = "";
				if (common.isNotEmpty(el.EDT_SUB_TITLE)) {
					subTitle = el.EDT_SUB_TITLE.substring(0, 50);
				}

				div.append('<div class="col mb-5 mb-md-0" onclick="fn_goDetail(' + el.SEQ + ');">'
					+ '<a class="card card-ghost card-transition-zoom h-100" >'
					+ '<div class="card-transition-zoom-item" >'
					+ '<img class="card-img" src="' + el.MAIN_IMG_PATH + '" alt="" style="max-height:300px;min-heignt:300px;">'
					+ '</div>'
					+ '<div class="card-body">'
					+ '<h4>' + el.EDT_TITLE + '</h4>'
					+ '<p class="card-text">' + subTitle + '</p>'
					+ '</div>'
					+ '</a>'
					+ '</div>');
			});
		} else {
			div.append('<div class="text-center w100 content-space-b-1">등록된 데이터가 없습니다.</div>');
		}
	}

	/**
	 * append page navigation
	 * @param page
	 */
	function fn_setGalleryPage(pageInfo) {
		let nav = $("#nav-gallery");
		let prePage = pageInfo.prePage === 0 ? 1 : pageInfo.prePage;
		let initPage = pageInfo.pageNum % 5 === 0 ? pageInfo.pageNum - 5 + 1 : Math.floor(pageInfo.pageNum / 5) * 5 + 1;
		let endPage = Math.ceil(pageInfo.pageNum / 5) * 5 > pageInfo.pages ? pageInfo.pages : Math.ceil(pageInfo.pageNum / 5) * 5;
		let nextPage = pageInfo.nextPage === 0 ? pageInfo.pages : pageInfo.nextPage;
		let pageList = "";
		for (let i = initPage; i <= endPage; i++) {
			let active = '';
			if (pageInfo.pageNum === i) {
				active = 'active';
			}
			pageList += '<li class="page-item">'
				+ '<a class="page-link pointer ' + active + '" onclick="fn_search(\'gallery\',' + i + ')">' + i + '</a>'
				+ '</li>';
		}
		nav.empty();
		if (pageList !== "") {
			nav.append('<ul class="pagination justify-content-center">'
				+ '<li class="page-item">'
				+ '<a class="page-link pointer" onclick="fn_search(\'gallery\',' + prePage + ')" aria-label="Previous">'
				+ '<span aria-hidden="true"><i class="bi bi-chevron-double-left"></i></span>'
				+ '<span class="visually-hidden">Previous</span>'
				+ '</a>'
				+ '</li>'
				+ pageList
				+ '<li class="page-item">'
				+ '<a class="page-link pointer" onclick="fn_search(\'gallery\',' + nextPage + ')" aria-label="Next">'
				+ '<span aria-hidden="true"><i class="bi bi-chevron-double-right"></i></span>'
				+ '<span class="visually-hidden">Next</span>'
				+ '</a>'
				+ '</li>'
				+ '</ul>');
		}
	}


</script>
<body>

<!-- Hero -->
<div class="position-relative content-space-t-2">
	<!-- Swiper Main Slider -->
	<div class="js-swiper-blog-modern-hero swiper swiper-equal-height">
		<div class="swiper-wrapper">
			<div class="swiper-slide bg-img-start content-space-2 content-space-t-sm-3 content-space-b-sm-4" style="background-image: url(../assets/img/1920x800/background_1.jpg);">
				<!-- Container -->
				<div class="container content-space-b-sm-2">
					<div class="row">
						<div class="col-md-9">
							<div class="mb-5">
								<h2 class="h1 text-white">사랑이 넘치는 가정, 우리 사회의 따뜻한 변화로</h2>
								<h2 class="h1 text-white">세상을 비추며 밝은 내일을 기약합니다.</h2>
							</div>
							
							<a class="btn btn-light btn-pointer" href="/page-vision-mission">자람 비전 보러가기</a>
							<br>
							<br>
							<br>
							<br>
							<br>
						</div>
						<!-- End Col -->
					</div>
					<!-- End Row -->
				</div>
				<!-- End Container -->
			</div>
			
			<div class="swiper-slide bg-img-start content-space-2 content-space-t-sm-3 content-space-b-sm-4" style="background-image: url(../assets/img/1920x1080/img6.jpg);">
				<!-- Container -->
				<div class="container content-space-b-sm-2">
					<div class="row">
						<div class="col-md-9">
							<div class="mb-5">
								<h2 class="h1 text-white">자람은 차별없이 배움의 기회를 누리고 </h2>
								<h2 class="h1 text-white">성장하는 공정한 사회를 꿈꿉니다.</h2>
							</div>
						
						</div>
						<!-- End Col -->
					</div>
					<!-- End Row -->
				</div>
				<!-- End Container -->
			</div>
			
			<div class="swiper-slide bg-img-start content-space-2 content-space-t-sm-3 content-space-b-sm-4" style="background-image: url(../assets/img/1920x1080/img3.jpg);">
				<!-- Container -->
				<div class="container content-space-b-sm-2">
					<div class="row">
						<div class="col-md-9">
							<div class="mb-5">
								<h2 class="h1 text-white">행복한 어린이가 행복한 미래를 만들어 갈 수 있도록</h2>
								<h2 class="h1 text-white">자람이 함께합니다.</h2>
							</div>
							
							<a class="btn btn-light btn-pointer" href="../blog-article.html">후원하러 가기</a>
						</div>
						<!-- End Col -->
					</div>
					<!-- End Row -->
				</div>
				<!-- End Container -->
			</div>
		</div>
		
		<!-- Swiper Pagination -->
		<div class="js-swiper-blog-modern-hero-pagination swiper-pagination swiper-pagination-light position-absolute bottom-0 start-0 end-0 mb-3 d-sm-none"></div>
	</div>
	<!-- End Swiper Main Slider -->
	
	<!-- Swiper Thumbs Slider -->
	<div class="position-sm-absolute bottom-0 start-0 end-0 zi-2 d-none d-sm-block mb-7">
		<div class="container content-space-t-1">
			<div class="js-swiper-blog-modern-hero-thumbs swiper swiper-step-pagination swiper-step-pagination-light">
				<div class="swiper-wrapper">
					<!-- Slide -->
					<div class="swiper-slide">
						<span class="swiper-step-pagination-title">행복한</span>
					</div>
					<!-- End Slide -->
					
					<!-- Slide -->
					<div class="swiper-slide">
						<span class="swiper-step-pagination-title">비영리민간단체</span>
					</div>
					<!-- End Slide -->
					
					<!-- Slide -->
					<div class="swiper-slide">
						<span class="swiper-step-pagination-title">자람</span>
					</div>
					<!-- End Slide -->
				</div>
			</div>
		</div>
	</div>
	<!-- End Swiper Thumbs Slider -->
</div>
<!-- End Hero -->


<!-- Card Grid -->
<div class="container content-space-2 content-space-lg-2">
	<!-- Heading -->
	<div class="w-lg-65 text-center mx-lg-auto mb-5 mb-sm-7">
		<h2>자람 단체 주 사업</h2>
	</div>
	<!-- End Heading -->
	
	<div class="row row-cols-1 row-cols-sm-2 row-cols-md-3">
		<div class="col mb-5 mb-md-0">
			<!-- Card -->
			<a class="card card-ghost card-transition-zoom h-100">
				<div class="card-transition-zoom-item text-center">
					<img class="card-img" src="assets/img/custom/icon1.png" alt="Image Description" >
				</div>
				
				<div class="card-body">
					<h4>위탁 사업</h4>
					<p class="card-text"><i class="bi bi-arrow-right-short"></i>우리동네 키움, 국공립 보육시설, 어르신 돌봄 위탁사업</p>
					<p class="card-text"><i class="bi bi-arrow-right-short"></i>
						교직원 및 학부모 역량 강화 지원, 교사 힐링 데이 지원
					</p>
					<p class="card-text"><i class="bi bi-arrow-right-short"></i>
						아동지원 특색 프로그램 지원, 놀이 중심 컨설팅 지원
					</p>
				</div>
			
			</a>
			<!-- End Card -->
		</div>
		<!-- End Col -->
		
		<div class="col mb-5 mb-md-0">
			<!-- Card -->
			<a class="card card-ghost card-transition-zoom h-100" >
				<div class="card-pinned card-transition-zoom-item text-center">
					<img class="card-img" src="assets/img/custom/icon2.png" alt="Image Description" >
				</div>
				
				<div class="card-body">
					<h4>사회 복지 지원</h4>
					<p class="card-text"><i class="bi bi-arrow-right-short"></i>
						서울시 공동모금회 참여, 복지재단 연계 활동
					</p>
					<p class="card-text"><i class="bi bi-arrow-right-short"></i>
						청소년 육성회 캠페인 참여, 경로당/복지관 연계</p>
					<p class="card-text"><i class="bi bi-arrow-right-short"></i>
						나눔 행사 참여, 민관 협력 및 지역 네트워크 구축
					</p>
				</div>
			</a>
			<!-- End Card -->
		</div>
		<!-- End Col -->
		
		<div class="col">
			<!-- Card -->
			<a class="card card-ghost card-transition-zoom h-100">
				<div class="card-transition-zoom-item text-center">
					<img class="card-img" src="assets/img/custom/icon3.png" alt="Image Description" >
				</div>
				
				<div class="card-body">
					<h4>지역특화 사업</h4>
					<p class="card-text"><i class="bi bi-arrow-right-short"></i>
						아동 친화 환경 조성, 우리마을 특화 사업, 숲에 놀아요
					</p>
					<p class="card-text"><i class="bi bi-arrow-right-short"></i>
						환경 교육(탄소 중립), 서남 물재생센터, 난지 자원회수시설</p>
					<p class="card-text"><i class="bi bi-arrow-right-short"></i>
						지역 행사 참여(플리마켓), 공익활동(청소년지도협의회함께)</p>
				</div>
			
			</a>
			<!-- End Card -->
		</div>
		<!-- End Col -->
	</div>
	<!-- End Row -->
</div>
<!-- End Card Grid -->

<!-- Features -->
<div class="overflow-hidden">
	<div class="container content-space-2 content-space-lg-2">
		<div class="row align-items-lg-center">
			<div class="col-lg-7 me-auto ms-lg-n10 mb-5 mb-lg-0">
				<div class="row align-items-center">
					<div class="col-4">
						<img class="img-fluid rounded-3" src="assets/img/580x480/img1.jpg" alt="Image Description">
					</div>
					<!-- End Col -->
					
					<div class="col-3">
						<img class="img-fluid rounded-3" src="assets/img/350x700/img1.jpg" alt="Image Description">
					</div>
					<!-- End Col -->
					
					<div class="col-5">
						<img class="img-fluid rounded-3" src="assets/img/400x700/img1.jpg" alt="Image Description">
					</div>
					<!-- End Col -->
				</div>
				<!-- End Row -->
			</div>
			<!-- End Col -->
			
			<div class="col-lg-5">
				<div class="mb-5">
					<h2>자람이 일하는 방법</h2>
					<p>구성원은 공동의 미션과 비전을 공유하며 함께 사회적 문제를 해결하고 있습니다.</p>
				</div>
				
				<!-- List Checked -->
				<ul class="list-checked list-checked-soft-bg-primary list-checked-lg">
					<li class="list-checked-item"><span class="fw-bold">투명한 운영</span> – 사회문제 해결, 전문성</li>
					<li class="list-checked-item">지속가능경영</li>
					<li class="list-checked-item">운영체 <span class="fw-bold">역량강화</span></li>
				</ul>
				<!-- End List Checked -->
			</div>
			<!-- End Col -->
		</div>
		<!-- End Row -->
	</div>
</div>

<!-- End Features -->

<!-- Stats -->
<div class="container content-space-2 content-space-lg-2">
	<div class="row justify-content-lg-between align-items-lg-center">
		<div class="col-lg-5 mb-9 mb-lg-0">
			<div class="mb-6">
				<h2>아이들을 위해</h2>
				<p>놀면서 배우는 우리 아이들 방과후 초등학생 돌봄서비스</p>
			</div>
			
			<!-- Blockquote -->
			<figure>
				<blockquote class="blockquote"><em>모든 어린이는 예술가다. 문제(관건)는 어린이가 성장해서도<br>그 예술성을 어떻게 지키는가이다.</em></blockquote>
				
				<figcaption class="blockquote-footer">
					<div class="d-flex align-items-center">
						<div class="flex-shrink-0">
							<img class="avatar avatar-circle" src="assets/img/160x160/picasso.png" alt="Image Description">
						</div>
						
						<div class="flex-grow-1 ms-3">
							Pablo Picasso
							<span class="blockquote-footer-source">스페인의 화가, 작가, 예술가.</span>
						</div>
					</div>
				</figcaption>
			</figure>
			<!-- End Blockquote -->
		</div>
		<!-- End Col -->
		
		<div class="col-lg-6">
			<!-- List -->
			<ul class="list-equal-height list-equal-height-2-cols">
				<li class="list-equal-height-item">
					<h4 class="display-5"><sub><i class="bi-arrow-down-short text-primary ms-n2"></i></sub>-337 개</h4>
					<p class="mb-0">서울 유아 보육시설 수</p>
				</li>
				
				<li class="list-equal-height-item">
					<h4 class="display-5"><sub><i class="bi-arrow-up-short text-primary ms-n2"></i></sub>+2만 가구</h4>
					<p class="mb-0">다문화 가구 수</p>
				</li>
				
				<li class="list-equal-height-item">
					<h4 class="display-5"><sub><i class="bi-arrow-up-short text-primary ms-n2"></i></sub>+2만 가구</h4>
					<p class="mb-0">맞벌이 부부 통계</p>
				</li>
				
				<li class="list-equal-height-item">
					<h4 class="display-5">42.6%</h4>
					<p class="mb-0">만 25~54세 여성 중 결혼, 임신·출산, 육아‧교육, 가족구성원 돌봄으로 경력단절을 경험한 여성</p>
				</li>
			</ul>
			<!-- End List -->
		</div>
		<!-- End Col -->
	</div>
	<!-- End Row -->
</div>
<!-- End Stats -->

<!-- donate section start -->
<div class="container content-space-2 content-space-lg-2">
	<!-- Subscribe -->
	<div class="container content-space-1">
		<div class="position-relative bg-soft-primary rounded-3 p-7">
			<div class="row justify-content-lg-between align-items-lg-center">
				<div class="col-lg-7 mb-3 mb-lg-0">
					<h2>아이들의 든든한 후원자가 되어주세요&nbsp;<i class="bi bi-chat-square-heart"></i></h2>
				</div>
				<!-- End Col -->
				
				<div class="col-lg-5">
					<form>
						<!-- Input Card -->
						<div class="input-card input-card-sm mb-3">
							<div class="input-card-form">
								<input type="text" class="form-control form-control-lg" id="subscribeFormEg1" value="후원계좌 : 하나은행 303-910024-16404 자람" readonly>
							</div>
							<button type="button" class="btn btn-primary btn-lg" id="heroNameAddOnEg1">후원하기</button>
						</div>
						<!-- End Input Card -->
					</form>
					
					<a class="link link-pointer" href="../page-login.html">후원 문의하기</a>
				</div>
				<!-- End Col -->
			</div>
			<!-- End Row -->
			
			<!-- SVG Shape -->
			<figure class="position-absolute top-0 end-0 zi-n1 d-none d-md-block mt-10 me-n10" style="width: 4rem;">
				<img class="img-fluid" src="../assets/svg/components/pointer-up.svg" alt="Image Description">
			</figure>
			<!-- End SVG Shape -->
			
			<!-- SVG Shape -->
			<figure class="position-absolute bottom-0 start-0 zi-n1 ms-n10 mb-n10" style="width: 15rem;">
				<img class="img-fluid" src="../assets/svg/components/curved-shape.svg" alt="Image Description">
			</figure>
			<!-- End SVG Shape -->
		</div>
	</div>
</div>
<!-- End Subscribe -->
<!-- donate section end -->

<!-- tables section start -->
<div class="container content-space-3 content-space-lg-3">
	<!-- Card -->
	<div class="card">
		<!-- Nav -->
		<ul class="nav nav-tabs" id="myTab" role="tablist">
			<li class="nav-item" role="presentation">
				<button class="nav-link active" id="btn-news" data-bs-toggle="tab" data-bs-target="#news" type="button" role="tab" aria-controls="news" aria-selected="true">뉴스 및 소식</button>
			</li>
			<li class="nav-item" role="presentation">
				<button class="nav-link" id="btn-notice" data-bs-toggle="tab" data-bs-target="#notice" type="button" role="tab" aria-controls="notice" aria-selected="false">공지사항</button>
			</li>
			<li class="nav-item" role="presentation">
				<button class="nav-link" id="btn-gallery" data-bs-toggle="tab" data-bs-target="#gallery" type="button" role="tab" aria-controls="gallery" aria-selected="false">갤러리</button>
			</li>
		</ul>
		<!-- End Nav -->
		
		
		<!-- Tab Content -->
		<div class="tab-content" id="myTabContent">
			<div class="tab-pane fade show active" id="news" role="tabpanel" aria-labelledby="news-tab">
				<!-- Table -->
				<div class="row row-cols-1 row-cols-sm-2 gx-7 content-space-t-1 mx-3" id="div-list-news">
					<c:if test="${fn:length(newsList) == 0}">
					<div class="text-center w100 content-space-b-1">등록된 데이터가 없습니다.</div>
					</c:if>
					<c:forEach items="${newsList}" var="item">
						<div class="col mb-5 pointer">
							<!-- Card -->
							<a class="card card-ghost card-transition-zoom h-100"
							   onclick="fn_goDetail('${item.SEQ}');">
								<div class="card-pinned card-transition-zoom-item">
									<img class="card-img" src="${item.MAIN_IMG_PATH}" alt="${item.EDT_TITLE}" style="max-height:445px;min-height:445px;">
								</div>
								
								<div class="card-body">
									<h4><span class="fw-medium">${item.EDT_TITLE}</span></h4>
									<c:set value="${item.EDT_SUB_TITLE}" var="subTitle"/>
									<p class="card-text"><c:out value="${fn:substring(subTitle, 0, 50) }"/></p>
								</div>
							</a>
							<!-- End Card -->
						</div>
						<!-- End Col -->
					</c:forEach>
				</div>
				<!-- End Row -->
				<!-- End Table -->
				<!-- Pagination -->
				<c:if test="${newsPageInfo.pages != 0}">
					<nav aria-label="Page navigation" id="nav-news">
						<ul class="pagination justify-content-center">
							<li class="page-item">
								<a class="page-link pointer"
								   onclick="fn_search('news', '<c:out value="${newsPageInfo.prePage == 0 ? 1 : newsPageInfo.prePage}"/>')"
								   aria-label="Previous">
									<span aria-hidden="true"><i class="bi bi-chevron-double-left"></i></span>
									<span class="visually-hidden">Previous</span>
								</a>
							</li>
							<c:set var="startPage" value="${newsPageInfo.startPage == 0 ? 1 : newsPageInfo.startPage}"/>
							<c:set var="endPage" value="${newsPageInfo.pages > 5 ? 5 : newsPageInfo.pages}"/>
							<c:set var="nextPage" value="${newsPageInfo.nextPage == 0 ? newsPageInfo.pages : newsPageInfo.nextPage}"/>
							<c:forEach var="i" begin="${startPage}" end="${endPage}">
								<li class="page-item"><a
										class="page-link pointer <c:if test="${newsPageInfo.pageNum == i}">active</c:if>"
										onclick="fn_search('news', ${i})">${i}</a></li>
							</c:forEach>
							<li class="page-item">
								<a class="page-link pointer" onclick="fn_search('news', '<c:out value="${nextPage}"/>')"
								   aria-label="Next">
									<span aria-hidden="true"><i class="bi bi-chevron-double-right"></i></span>
									<span class="visually-hidden">Next</span>
								</a>
							</li>
						</ul>
					</nav>
				</c:if>
				<!-- End Pagination -->
			</div>
			<div class="tab-pane fade overflow-auto" id="notice" role="tabpanel" aria-labelledby="notice-tab" >
				<table class="table table-nowrap table-align-middle " id="notice-tbl">
					<thead class="thead-light">
					<tr>
						<th style="width:10%;text-align: center;">No</th>
						<th style="width:65%;text-align: center;">제목</th>
						<th style="width:15%;text-align: center;">작성일</th>
						<th style="width:10%;text-align: center;">작성자</th>
					</tr>
					</thead>
					<tbody>
					</tbody>
				</table>
				<nav aria-label="Page navigation" id="nav-page-notice">
				</nav>
			</div>
			<div class="tab-pane fade" id="gallery" role="tabpanel" aria-labelledby="gallery-tab">
				<div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 content-space-t-1 mx-3" id="div-list-gallery" >
				</div>
				<nav aria-label="Page navigation" id="nav-gallery">
				</nav>
			</div>
		</div>
	
	</div>
</div>
<!-- tables section end -->

<div class="content-space-3 content-space-lg-3">
	<!-- Sliding Image -->
	<div class="sliding-img mb-3">
		<div class="sliding-img-frame-to-start" style="background-image: url(../assets/img/others/frame1.png)"></div>
	</div>
	<!-- End Sliding Image -->
	
	<!-- Sliding Image -->
	<div class="sliding-img mb-10">
		<div class="sliding-img-frame-to-start-sm" style="background-image: url(../assets/img/others/frame2.png)"></div>
	</div>
	<!-- End Sliding Image -->
</div>

<!-- ========== END MAIN CONTENT ========== -->


</body>
</html>
