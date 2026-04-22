<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="s" uri="http://www.springframework.org/security/tags" %>

<!DOCTYPE html>
<html>
<head>
	<meta name="description" content="비영리민간단체 자람 홈페이지">
	<meta name="_csrf" content="${_csrf.token}"/>
	<meta name="_csrf_header" content="${_csrf.headerName}"/>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<!-- Favicon -->
	<link rel="icon" href="favicon.png"/>
	<link rel="shortcut icon" href="favicon.png">
	<link rel="apple-touch-icon" href="favicon.png"/>
	
	<!-- Required Meta Tags Always Come First -->
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	
	<!-- Title -->
	<title>비영리민간단체 자람</title>
	
	<!-- jquery -->
	<script src="https://code.jquery.com/jquery-3.6.0.min.js"
	        integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
	<!-- Font -->
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
	
	<!-- CSS Implementing Plugins -->
	<link rel="stylesheet" href="assets/vendor/bootstrap-icons/font/bootstrap-icons.css">
	<link rel="stylesheet" href="assets/vendor/hs-mega-menu/dist/hs-mega-menu.min.css">
	<link rel="stylesheet" href="assets/vendor/swiper/swiper-bundle.min.css">
	
	<!-- jquery confirm -->
	<link rel="stylesheet" href="assets/css/jquery-confirm.min.css">
	<script src="assets/js/jquery-confirm.min.js"></script>
	
	<!-- CSS Unify Template -->
	<link rel="stylesheet" href="assets/css/theme-temp.css">
	
	<!-- 자람 커스텀 CSS -->
	<link rel="stylesheet" href="assets/css/jaram-custom.css">
	<!-- 자람 커스텀 JS -->
	<script src="assets/js/jaram-common.js"></script>
	
	<!-- ckeditor -->
	<script src="assets/js/ckeditor.js"></script>
	<script src="assets/js/UploadAdapter.js"></script>
	
	
	<style>
		body {
			opacity: 0;
		}
	</style>
	
	<script>
		/**
		 * Ajax callback
		 */
		function fn_callBackMain(id, res, stat) {

			if (id === '/main-header') {
				//메인 헤더 소통공간 NEW 표시
				let newCnt = res.communityNew;
				//메인 헤더 소통공간 최근소식 2개 표시
				let news = res.communityNews;

				if (newCnt !== null) {
					if (newCnt.NOTICE > 0) {
						$("#header-menu-notice").append('<span class="badge text-primary">New</span>');
					}
					if (newCnt.NEWS > 0) {
						$("#header-menu-news").append('<span class="badge text-primary">New</span>');
					}
					if (newCnt.GALLERY > 0) {
						$("#header-menu-gallery").append('<span class="badge text-primary">New</span>');
					}
					if (newCnt.QNA > 0) {
						$("#header-menu-qna").append('<span class="badge text-primary">New</span>');
					}
					if (newCnt.FAQ > 0) {
						$("#header-menu-faq").append('<span class="badge text-primary">New</span>');
					}
				}

				if (news.length === 0) {
					$("#header-news").remove();
					$("#header-mega-menu-news").addClass("hs-position-right-fix");
					$(".dropdown-item::after").css("right", "-7rem");
					$("#header-news-menu").removeClass("col-lg-4").addClass("col-lg-12");
				} else if (news.length === 1) {
					$("#header-mega-menu-news").removeClass("hs-position-right-fix");
					$("#header-mega-menu-news").css("max-width", "35rem").css("right", "45%").css("left", "auto");
					$("#header-news-menu").removeClass("col-lg-4").addClass("col-lg-6");
					$("#header-news").prepend(
						'<div class="bg-light rounded-3 h-100 p-4">' +
						'<span class="d-block fs-4 fw-bold text-dark mb-3">자람의 새 소식</span>' +
						'<div class="row">' +
						'<div class="col-md-12 mb-3 mb-md-0" id="header-news-one">' +
						'<a class="d-block pointer" onclick="fn_goNews(' + news[0].SEQ + ')">' +
						'<img class="img-fluid rounded-2 mb-2" src="' + news[0].MAIN_IMG_PATH + '" alt="Image Description" style="width:300px; height:230px;">' +
						'<span class="fs-4 fw-medium text-dark text-inherit">' + news[0].EDT_TITLE + '</span>' +
						'<p class="fs-6 text-body">' + news[0].EDT_SUB_TITLE + '</p>' +
						'<span class="link link-pointer">자세히 보기</span>' +
						'</a>' +
						'</div>' +
						'</div>' +
						'</div>');
				} else {
					$("#header-news").prepend(
						'<div class="bg-light rounded-3 h-100 p-4">' +
						'<span class="d-block fs-4 fw-bold text-dark mb-3">자람의 새 소식</span>' +
						'<div class="row">' +
						'<div class="col-md-6 mb-3 mb-md-0" id="header-news-one">' +
						'<a class="d-block pointer" onclick="fn_goNews(' + news[0].SEQ + ')">' +
						'<img class="img-fluid rounded-2 mb-2" src="' + news[0].MAIN_IMG_PATH + '" alt="Image Description" style="width:300px; height:230px;">' +
						'<span class="fs-4 fw-medium text-dark text-inherit">' + news[0].EDT_TITLE + '</span>' +
						'<p class="fs-6 text-body">' + news[0].EDT_SUB_TITLE + '</p>' +
						'<span class="link link-pointer">자세히 보기</span>' +
						'</a>' +
						'</div>' +
						'<div class="col-md-6" id="header-news-two">' +
						'<a class="d-block pointer" onclick="fn_goNews(' + news[1].SEQ + ')">' +
						'<img class="img-fluid rounded-2 mb-2" src="' + news[1].MAIN_IMG_PATH + '" alt="Image Description" style="width:300px; height:230px;">' +
						'<span class="fs-4 fw-medium text-dark text-inherit">' + news[1].EDT_TITLE + '</span>' +
						'<p class="fs-6 text-body">' + news[1].EDT_SUB_TITLE + '</p>' +
						'<span class="link link-pointer">자세히 보기</span>' +
						'</a>' +
						'</div>' +
						'</div>' +
						'</div>');
				}
			}
		}

		/**
		 * 뉴스 상세보기
		 * @param seq 게시글 시퀀스
		 */
		function fn_goNews(seq) {
			location.href="/board-detail?seq="+seq+"&page=news";
		}

		$(function () {

			//메인 헤더 내용 조회
			cfn_ajaxTransmitMain("/main-header", {});

			//ajax 통신시 화면 block 처리
			$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);

			//페이지 로드 시 animate 효과
			$("body").animate({"opacity": "1"}, 500);

			//로딩 spinner
			let spinner;
			jQuery(function () {
				spinner = "<div class=\"spinner-border\" role=\"status\" style=\"top:50%;position:fixed;\" >" +
					"  <span class=\"visually-hidden\">Loading...</span>" +
					"</div>";
				jQuery(document.body).append(spinner);
				$(".spinner-border").hide();
			});

			window.onbeforeunload = function (e) {
				if (e !== null && e !== undefined) {
					$(".spinner-border").removeClass("d-none");
				}
			};
		});
	
	</script>
	
	<script src="/assets/vendor/hs-sticky-block/dist/hs-sticky-block.min.js"></script>

</head>
<body>

<tiles:insertAttribute name="header"/>
<!-- ========== MAIN CONTENT ========== -->
<main id="content" role="main">
	<tiles:insertAttribute name="view"/>
</main>
<tiles:insertAttribute name="footer"/>


<!-- ========== SECONDARY CONTENTS ========== -->
<!-- Go To -->
<a class="js-go-to go-to position-fixed" href="javascript:;" style="visibility: hidden;"
   data-hs-go-to-options='{
       "offsetTop": 700,
       "position": {
         "init": {
           "right": "2rem"
         },
         "show": {
           "bottom": "2rem"
         },
         "hide": {
           "bottom": "-2rem"
         }
       }
     }'>
	<i class="bi-chevron-up"></i>
</a>
<!-- ========== END SECONDARY CONTENTS ========== -->

<!-- JS Global Compulsory  -->
<script src="assets/vendor/bootstrap/dist/js/bootstrap.bundle.min.js"></script>

<!-- JS Implementing Plugins -->
<script src="assets/vendor/hs-header/dist/hs-header.min.js"></script>
<script src="assets/vendor/hs-mega-menu/dist/hs-mega-menu.min.js"></script>
<script src="assets/vendor/hs-go-to/dist/hs-go-to.min.js"></script>
<script src="assets/vendor/swiper/swiper-bundle.min.js"></script>

<!-- JS Unify -->
<script src="assets/js/theme.min.js"></script>

<script>
	(function () {

		// INITIALIZATION OF NAVBAR
		// =======================================================
		new HSHeader('#header').init()


		// INITIALIZATION OF MEGA MENU
		// =======================================================
		const megaMenu = new HSMegaMenu('.js-mega-menu', {
			desktop: {
				position: 'left'
			}
		})

		// INITIALIZATION OF GO TO
		// =======================================================
		new HSGoTo('.js-go-to')

		// INITIALIZATION OF SWIPER
		// =======================================================
		var sliderThumbs = new Swiper('.js-swiper-blog-modern-hero-thumbs', {
			slidesPerView: 4,
			breakpoints: {
				580: {
					slidesPerView: 3,
					spaceBetween: 30,
				},
				1024: {
					slidesPerView: 4,
					spaceBetween: 50,
				},
			},
		});

		// Blog Modern Hero
		var swiper = new Swiper('.js-swiper-blog-modern-hero', {
			effect: 'fade',
			autoplay: true,
			loop: true,
			pagination: {
				el: '.js-swiper-blog-modern-hero-pagination',
				clickable: true,
			},
			thumbs: {
				swiper: sliderThumbs
			}
		});
	})()
</script>

<!-- Jquery block UI -->
<script src="assets/js/jquery.blockUI.js"/>

</body>
</html>
