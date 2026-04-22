<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="s" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="en">
<head>
	<script>
		let pageNum = "1";
		$(function () {
			pageNum = "${pageNum}"
			fn_search(pageNum);
		});

		/**
		 * 게시글 상세보기
		 */
		function fn_goDetail(seq) {
			location.href="/board-detail?seq="+seq+"&page=news&pageNum="+pageNum;
		}

		/**
		 * 게시글쓰기
		 */
		function fn_goWrite() {
			location.href="/admin/page-board-write?page=news";
		}

		/**
		 * ajax 조회
		 */
		function fn_search(pageNum) {
			//조회
			let data = {
				pageNum: pageNum
				, PAGE: 'news'
				, SEARCH_TITLE: $("#searchTitle").val()
			};
			cfn_ajaxTransmit("/board-list-paging", data);
		}

		/**
		 * Ajax callback
		 */
		function fn_callBack(id, res, stat) {
			if (id === '/board-list-paging') {
				fn_setTable(res.list);
				fn_setPage(res.pageInfo);
			}
		}

		/**
		 * append table row
		 * @param list
		 */
		function fn_setTable(list) {
			let div = $("#div-list");
			div.empty();
			if (list.length !== 0) {
				list.forEach(function (el, index) {
					let subTitle = "";
                    if( common.isNotEmpty(el.EDT_SUB_TITLE) ){
		                subTitle = el.EDT_SUB_TITLE.substring(0, 50);
	                }

					div.append('<div class="col mb-5 pointer">' 
						+ '<a class="card card-ghost card-transition-zoom h-100"'
						+ '   onclick="fn_goDetail('+el.SEQ+');">'
						+ '<div class="card-pinned card-transition-zoom-item">'
						+ '<img class="card-img" src="'+el.MAIN_IMG_PATH+'" alt="" style="max-height:445px;min-height:445px;">'
						+ '</div>'
						+ '<div class="card-body">'
						+ '<h4><span class="fw-medium">'+el.EDT_TITLE+'</span></h4>'
						+ '<p class="card-text">'+subTitle+'</p>'
						+ '</div>'
						+ '</a>'
						+ '</div>');
				});
			}
		}

		/**
		 * append page navigation
		 * @param page
		 */
		function fn_setPage(pageInfo) {
			pageNum = pageInfo.pageNum;
			let nav = $("#nav-page");
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
					+ '<a class="page-link pointer ' + active + '" onclick="fn_search(' + i + ')">' + i + '</a>'
					+ '</li>';
			}
			nav.empty();
			nav.append('<ul class="pagination justify-content-center">'
				+ '<li class="page-item">'
				+ '<a class="page-link pointer" onclick="fn_search(' + prePage + ')" aria-label="Previous">'
				+ '<span aria-hidden="true"><i class="bi bi-chevron-double-left"></i></span>'
				+ '<span class="visually-hidden">Previous</span>'
				+ '</a>'
				+ '</li>'
				+ pageList
				+ '<li class="page-item">'
				+ '<a class="page-link pointer" onclick="fn_search(' + nextPage + ')" aria-label="Next">'
				+ '<span aria-hidden="true"><i class="bi bi-chevron-double-right"></i></span>'
				+ '<span class="visually-hidden">Next</span>'
				+ '</a>'
				+ '</li>'
				+ '</ul>');
		}

		/**
		 * 게시판 이동
		 * @param page
		 */
		function go_page(page){
			location.href = "/board?page="+page+"&pageNum=1";
		}
	</script>
</head>
<body>

<div class="container content-space-3 content-space-lg-3">
	<div class="row">
		<div id="stickyBlockStartPointEg2" class="col-md-3 col-lg-2 mb-3 mb-md-0">
			<!-- Navbar -->
			<div class="navbar-expand-md">
				<!-- Navbar Toggle -->
				<div class="d-grid">
					<button type="button" class="navbar-toggler btn btn-white mb-3" data-bs-toggle="collapse"
					        data-bs-target="#navbarVerticalNavMenuEg2" aria-label="Toggle navigation"
					        aria-expanded="false" aria-controls="navbarVerticalNavMenuEg2">
			            <span class="d-flex justify-content-between align-items-center">
			              <span class="text-dark mb-0">Menu</span>

			              <span class="navbar-toggler-default">
			                <i class="bi-list"></i>
			              </span>

			              <span class="navbar-toggler-toggled">
			                <i class="bi-x"></i>
			              </span>
			            </span>
					</button>
				</div>
				<!-- End Navbar Toggle -->
				
				<!-- Navbar Collapse -->
				<div id="navbarVerticalNavMenuEg2" class="collapse navbar-collapse">
					<ul id="navbarSettingsEg2"
					    class="js-sticky-block js-scrollspy nav nav-tabs nav-link-gray nav-vertical"
					    data-hs-sticky-block-options='{
										               "parentSelector": "#navbarVerticalNavMenuEg2",
										               "targetSelector": "#header",
										               "breakpoint": "md",
										               "startPoint": "#navbarVerticalNavMenuEg2",
										               "endPoint": "#stickyBlockEndPointEg2",
										               "stickyOffsetTop": 100
										             }'>
						<li class="nav-item">
							<a class="nav-link" onclick="go_page('notice');">1. 공지사항</a>
						</li>
						<li class="nav-item">
							<a class="nav-link active" onclick="go_page('news');">2. 뉴스 및 소식</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" onclick="go_page('gallery');">3. 갤러리</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" onclick="go_page('qna');">4. 문의게시판</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" onclick="go_page('faq');">5. 자주하는 질문</a>
						</li>
					</ul>
				</div>
				<!-- End Navbar Collapse -->
			</div>
			<!-- End Navbar -->
		</div>
		<!-- End Col -->
		
		<!-- Testimonials -->
		<div class="col-md-9 col-lg-10">
			<h2>뉴스 및 소식</h2>
			<hr/>
			<!-- Card Grid -->
			<div class="container">
				<!-- Card Grid -->
				<div class="container overflow-hidden">
					<div class="row row-cols-1 row-cols-sm-2 gx-7" id="div-list">
					</div>
					<!-- End Row -->
				</div>
				<!-- End Card Grid -->
			</div>
			<!-- End Card Grid -->
			
			
			<s:authorize access="hasRole('ADMIN')">
				<button type="button" class="btn btn-white float-end" style="--bs-btn-border-width: 1px;"
				        onclick="fn_goWrite();">글쓰기
				</button>
			</s:authorize>
			
			<!-- Pagination -->
			<c:if test="${pageInfo.pages != 0}">
				<nav aria-label="Page navigation" id="nav-page">
				</nav>
			</c:if>
			<!-- End Pagination -->
		
		
		</div>
		<!-- End Description -->
	</div>
	<!-- End Testimonials -->
	
	
	<!-- End Sticky End Point -->
	<div id="stickyBlockEndPointEg2"></div>
</div>
<!-- End Icon Blocks -->
<script>
	(function () {
		// INITIALIZATION OF STICKY BLOCKS
		// =======================================================
		new HSStickyBlock('.js-sticky-block', {
			targetSelector: document.getElementById('header').classList.contains('navbar-fixed') ? '#header' : null
		})
	})()
</script>
</body>
</html>
