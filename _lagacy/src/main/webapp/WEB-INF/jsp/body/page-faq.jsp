<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="s" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="en">
<head>
	<script>

		$(function () {
		});
		
		/**
		 * 게시글 상세보기(수정, 삭제용)
		 */
		function fn_goDetail(seq) {
			location.href="/board-detail?seq="+seq+"&page=faq&pageNum="+pageNum;
		}
		
		/**
		 * 게시글쓰기
		 */
		function fn_goWrite() {
			location.href="/admin/page-board-write?page=faq";
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
							<a class="nav-link" onclick="go_page('news');">2. 뉴스 및 소식</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" onclick="go_page('gallery');">3. 갤러리</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" onclick="go_page('qna');">4. 문의게시판</a>
						</li>
						<li class="nav-item">
							<a class="nav-link active" onclick="go_page('faq');">5. 자주하는 질문</a>
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
			<h2>자주하는 질문</h2>
			<hr/>

			<!-- FAQ -->
			<div class="container">
				<div class="row">

					<div class="col-lg-12">
						<!-- Accordion -->
						<div class="accordion accordion-flush" id="accordionFAQ">
							<c:set var="cnt" value="0"/>
							<c:forEach items="${list}" var="item" >
								<c:set var="cnt" value="${cnt+1}"/>
								<!-- Accordion Item -->
								<div class="accordion-item">
									<div class="accordion-header" id="heading_${item.SEQ}">
										<a class="accordion-button <c:if test="${cnt != 1}">collapsed</c:if>" role="button" data-bs-toggle="collapse" data-bs-target="#collapse_${item.SEQ}" aria-expanded="true" aria-controls="collapse_${item.SEQ}">
											${item.EDT_TITLE}
												<s:authorize access="hasRole('ADMIN')">
													<button type="button" class="btn btn-primary btn-icon btn-sm z98" id="edit-btn-01" onclick="fn_goDetail('${item.SEQ}')" style="width: 1.3125rem;
													    height: 1.3125rem;margin-left: 4px;">
														<i class="bi bi-pencil" id="edit-btn-icon-01" style="color:#ffffff;"></i>
													</button>
												</s:authorize>
										</a>
									</div>
									<div id="collapse_${item.SEQ}" class="accordion-collapse collapse <c:if test="${cnt == 1}">show</c:if>" aria-labelledby="heading_${item.SEQ}" data-bs-parent="#accordionFAQ">
										<div class="accordion-body">
											${item.EDT_TEXT}
										</div>
									</div>
								</div>
								<!-- End Accordion Item -->
							</c:forEach>
						</div>
						<!-- End Accordion -->
					</div>
					<!-- End Col -->
				</div>
				<!-- End Row -->
			</div>
			<!-- End FAQ -->
			
			<s:authorize access="hasRole('ADMIN')">
				<button type="button" class="btn btn-white float-end" style="--bs-btn-border-width: 1px;"
				        onclick="fn_goWrite();">글쓰기
				</button>
			</s:authorize>
			
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
