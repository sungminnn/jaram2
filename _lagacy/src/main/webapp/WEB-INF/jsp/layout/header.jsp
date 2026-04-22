<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="s" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<script>
	$(function () {

		let loginError = "${error}";
		if (loginError === "true") {
			$("#staticBackdrop .modal-body").load("/page-login");
			$("#staticBackdrop").modal('show');
		}
	});

	/**
	 * 로그인 모달 팝업 오픈
	 */
	function fn_openLoginModal() {
		$("#staticBackdrop .modal-body").load("/page-login");
	}


</script>
<body>
<!-- ========== HEADER ========== -->
<header id="header" class="navbar navbar-expand-lg navbar-end navbar-light navbar-absolute-top navbar-show-hide"
        data-hs-header-options='{
            "fixMoment": 0,
            "fixEffect": "slide"
          }'>
	<div class="container">
		<nav class="js-mega-menu navbar-nav-wrap">
			<!-- Default Logo -->
			<a class="navbar-brand" href="/" aria-label="Unify">
				<img class="navbar-brand-logo" src="assets/svg/logos/jaram-logo.png" alt="Image Description">
			</a>
			<!-- End Default Logo -->
			
			<!-- Toggler -->
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
			        aria-controls="navbarNavDropdown" aria-expanded="false"
			        aria-label="Toggle navigation">
          <span class="navbar-toggler-default">
            <i class="bi-list"></i>
          </span>
				<span class="navbar-toggler-toggled">
            <i class="bi-x"></i>
          </span>
			</button>
			<!-- End Toggler -->
			
			<!-- Collapse -->
			<div class="collapse navbar-collapse" id="navbarNavDropdown">
				<div class="navbar-absolute-top-scroller">
					<ul class="navbar-nav nav-pills">
						<!-- Landings -->
						<li class="hs-has-mega-menu nav-item" style="padding-top: 0.3rem;"
						    data-hs-mega-menu-item-options='{
                    "desktop": {
                      "maxWidth": "40rem"
                    }
                  }'>
							<a id="landingsMegaMenu" class="hs-mega-menu-invoker nav-link dropdown-toggle "
							   aria-current="page" href="#" role="button" aria-expanded="false">소개</a>
							
							<!-- Mega Menu -->
							<div class="hs-mega-menu dropdown-menu" aria-labelledby="landingsMegaMenu"
							     style="min-width: 25rem;">
								<!-- Main Content -->
								<div class="row">
									<div class="col-lg d-none d-lg-block">
										<div class="d-flex align-items-start flex-column bg-light rounded-3 h-100 p-4">
											<span class="fs-3 fw-bold d-block">자람</span>
											<p class="text-body">오늘보다 더 나은 내일을 위한 <br>교육 환경을 만들고자 나아가는 자람입니다.</p>
											<div class="mt-auto">
												<p class="mb-1"><a class="link link-dark link-pointer"
												                   href="/page-vision-mission">자세히 보기</a></p>
												<p class="mb-1"><a class="link link-dark link-pointer"
												                   href="/page-location">오시는 길</a></p>
											</div>
										</div>
									</div>
									
									<div class="col-sm">
										<div class="navbar-dropdown-menu-inner">
											<span class="dropdown-header">소개</span>
											<a class="dropdown-item active" href="/ceo"><i class="bi-building me-2"></i>대표 소개</a>
											<a class="dropdown-item " href="/page-purpose-of-esta"><i class="bi-briefcase me-2"></i> 설립취지문</a>
											<a class="dropdown-item " href="/page-vision-mission"><i class="bi-chat-right-dots me-2"></i> 비전과 미션</a>
											<a class="dropdown-item " href="/page-organization"><i class="bi-tropical-storm me-2"></i>조직도</a>
											<a class="dropdown-item " href="/page-location"><i class="bi-gear me-2"></i>오시는 길</a>
										</div>
									</div>
								</div>
								<!-- End Main Content -->
							</div>
							<!-- End Mega Menu -->
						</li>
						<!-- End Landings -->
						
						<!-- Blog -->
						<li class="hs-has-mega-menu nav-item" style="padding-top: 0.3rem;"
						    data-hs-mega-menu-item-options='{
                    "desktop": {
                      "maxWidth": "50rem"
                    }
                  }'>
							<a id="blogMegaMenu" class="hs-mega-menu-invoker nav-link dropdown-toggle " href="#"
							   role="button" aria-expanded="false">소통공간</a>
							
							<!-- Mega Menu -->
							<div class="hs-mega-menu dropdown-menu" id="header-mega-menu-news" aria-labelledby="blogMegaMenu" style="min-width: 12rem;">
								<!-- Main Content -->
								<div class="row">
									<div class="col-lg d-none d-lg-block" id="header-news"></div>
									<div class="col-lg-4" id="header-news-menu">
										<div class="navbar-dropdown-menu-inner">
											<span class="dropdown-header">소통공간</span>
											<a class="dropdown-item" id="header-menu-notice" href="/board?page=notice">공지사항</a>
											<a class="dropdown-item" id="header-menu-news" href="/board?page=news">뉴스 및 소식</a>
											<a class="dropdown-item" id="header-menu-gallery" href="/board?page=gallery">갤러리</a>
											<a class="dropdown-item" id="header-menu-qna" href="/board?page=qna">문의게시판</a>
											<a class="dropdown-item" id="header-menu-faq" href="/board?page=faq">자주하는 질문</a>
										</div>
									</div>
								</div>
								<!-- End Main Content -->
							</div>
							<!-- End Mega Menu -->
						</li>
						<!-- End Blog -->
						
						<!-- Pages -->
						<li class="hs-has-mega-menu nav-item" style="padding-top: 0.3rem;">
							<a id="pagesMegaMenu" class="hs-mega-menu-invoker nav-link dropdown-toggle " href="#"
							   role="button" aria-expanded="false">사업</a>
							
							<!-- Mega Menu -->
							<div class="hs-mega-menu hs-position-right-fix dropdown-menu"
							     aria-labelledby="pagesMegaMenu">
								<!-- Main Content -->
								<div class="navbar-dropdown-menu-inner">
<%--									<span class="dropdown-header">사업분야</span>--%>
<%--									<a class="dropdown-item " href="page-about-1.html">위탁 사업</a>--%>
<%--									<a class="dropdown-item " href="page-customer-stories.html">사회 복지 지원</a>--%>
<%--									<a class="dropdown-item " href="page-customer-story.html">지역 특화 사업</a>--%>
									<span class="dropdown-header">시설운영</span>
									<a class="dropdown-item " href="/biz?page=biz-1">국공립 퍼스티어고운어린이집</a>
									<a class="dropdown-item " href="/biz?page=biz-2">행복자곡다함께키움센터</a>
									<a class="dropdown-item " href="/biz?page=biz-3">국공립 판교숲길어린이집</a>
								</div>
								<!-- End Main Content -->
							</div>
							<!-- End Mega Menu -->
						</li>
						<!-- End Pages -->
						
						<!-- Docs -->
						<li class="hs-has-mega-menu nav-item" style="padding-top: 0.3rem;"
						    data-hs-mega-menu-item-options='{
                    "desktop": {
                      "maxWidth": "20rem"
                    }
                  }'>
							<a id="docsMegaMenu" class="hs-mega-menu-invoker nav-link dropdown-toggle " href="#"
							   role="button" aria-expanded="false">후원</a>
							
							<!-- Mega Menu -->
							<div class="hs-mega-menu hs-position-right-fix dropdown-menu" aria-labelledby="docsMegaMenu"
							     style="min-width: 20rem;">
								<!-- Link -->
								<a class="navbar-dropdown-menu-media-link" href="/page-donate">
									<div class="d-flex">
										<div class="flex-shrink-0">
											<i class="bi-calendar-heart fs-2 text-dark"></i>
										</div>
										
										<div class="flex-grow-1 ms-3">
											<span class="navbar-dropdown-menu-media-title">일시/정기후원 <span
													class="badge badge-sm bg-primary rounded-pill ms-1">기부</span></span>
											<p class="navbar-dropdown-menu-media-desc">후원을 통해 아이들의 든든한 서포터즈가
												되어주세요.</p>
										</div>
									</div>
								</a>
								<!-- End Link -->
								
								<div class="dropdown-divider"></div>
								
								<!-- Link -->
								<a class="navbar-dropdown-menu-media-link" href="portfolio-modern.html">
									<div class="d-flex">
										<div class="flex-shrink-0">
											<i class="bi-box2-heart fs-2 text-dark"></i>
										</div>
										
										<div class="flex-grow-1 ms-3">
											<span class="navbar-dropdown-menu-media-title">기타후원<span
													class="badge badge-sm bg-primary rounded-pill ms-1">기부</span></span>
											<p class="navbar-dropdown-menu-media-desc">아이들을 위한 따뜻한 나눔을 일시후원으로 첫 발을
												내딛어주세요.</p>
										</div>
									</div>
								</a>
								<!-- End Link -->
								
								<div class="dropdown-divider"></div>
								
								<!-- Link -->
								<a class="navbar-dropdown-menu-media-link" href="portfolio-modern.html">
									<div class="d-flex">
										<div class="flex-shrink-0">
											<i class="bi-clipboard2-heart fs-2 text-dark"></i>
										</div>
										
										<div class="flex-grow-1 ms-3">
											<span class="navbar-dropdown-menu-media-title">기부금운영보고서</span>
											<p class="navbar-dropdown-menu-media-desc">후원 성과 보고서</p>
										</div>
									</div>
								</a>
								<!-- End Link -->
							</div>
							<!-- End Mega Menu -->
						</li>
						<!-- End Docs -->
						
						<!-- Log in -->
						<li class="nav-item ms-lg-auto">
							<s:authorize access="isAuthenticated()">
						<li class="nav-item px-2" style="padding-top: 0.3rem;"><s:authentication property='principal.user.username'/>&nbsp;님 안녕하세요.
						</li>
						<form action="/logout" method="post">
							<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}">
							<input type="submit" id="logoutBtn" class="btn btn-ghost-dark me-2" value="로그아웃"
							       style="padding-top: 1rem;">
						</form>
						</s:authorize>
						
						<!-- 미인증 -->
						<s:authorize access="isAnonymous()">
							<li class="nav-item">
								<!-- Button trigger modal -->
								<a class="btn btn-ghost-dark me-2 me-lg-0" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="fn_openLoginModal();">로그인</a>
									<%--								<a class="btn btn-ghost-dark me-2 me-lg-0" href="/page-login">로그인</a>--%>
								<a class="btn btn-dark d-lg-inline-block" href="/page-signup">회원가입</a>
							</li>
							<!-- End Sign up -->
						</s:authorize>
					</ul>
				</div>
			</div>
			<!-- End Collapse -->
		</nav>
	</div>
</header>
<!-- ========== END HEADER ========== -->
<div class="modal fade" id="staticBackdrop" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div class="modal-body">
			</div>
		</div>
	</div>
</div>
</body>
