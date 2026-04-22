<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="s" uri="http://www.springframework.org/security/tags" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<!DOCTYPE html>
<html lang="en">
<head>
	<script>
		let pageNum = "1";
		$(function () {
			pageNum = "${pageNum}"
			fn_search(pageNum);

			$("#searchTitle").on("keydown", function (e) {
				if (e.keyCode === 13) {
					fn_search('1');
				}
			});
		});

		/**
		 * 게시글 상세보기
		 */
		function fn_goDetail(seq) {
			//조회
			let data = {
				SEQ: seq
			};
			cfn_ajaxTransmit("/qna-auth-chk", data);
		}

		/**
		 * 게시글쓰기
		 */
		function fn_goWrite() {
			location.href="/qna-write";
		}

		/**
		 * ajax 조회
		 */
		function fn_search(pageNum) {
			//조회
			let data = {
				  pageNum: pageNum
				, PAGE   : 'qna'
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
			} else if (id === '/qna-chk-password') {
				if (res.code === 'success') {
					location.href="/board-detail?seq="+res.seq+"&page=qna&pageNum="+pageNum;
				} else {
					$.alert(res.msg);
				}
			} else if (id === '/qna-auth-chk') {
				let code = res.code;
				if (code === 'fail') {
					//권한이 없습니다.
					$.alert(res.msg);
					return false;
				} else if (code === 'success-chk-pwd') {
					//비밀번호 체크
					$.confirm({
						title: ''
						, content: '<span>작성 시 등록한 비밀번호를 입력해주십시오.</span><br><br><div class="t-center"><input type="password" id="qnaPassword" class="form-control"></div>'
						, buttons: {
							confirm: {
								text: '확인'
								, btnClass: 'btn-blue'
								, action: function () {
									if( common.isEmpty($("#qnaPassword").val()) ){
										$.alert("비밀번호를 입력하세요.");
										return false;
									}
									//조회
									let data = {
										  QNA_PASSWORD: $("#qnaPassword").val()
										, SEQ: res.seq
									};
									cfn_ajaxTransmit("/qna-chk-password", data);
								}
							},
							cancel: {
								text: '취소'
								, action: function () {
									//닫기
								}
							}
						}
					});
				} else {
					//조회 성공
					location.href="/board-detail?seq="+res.seq+"&page=qna&pageNum="+pageNum;
				}
			}
		}

		/**
		 * append table row
		 * @param list
		 */
		function fn_setTable(list) {
			let tbody = $("#notice-tbl tbody");
			tbody.empty();
			if (list.length === 0) {
				tbody.append('<tr><td class="text-center" colspan="5">등록된 데이터가 없습니다.</td></tr>');
			} else {
				list.forEach(function (el, index) {
					//비밀글 자물쇠 아이콘
					let secureIcon = "";
					//댓글 갯수 아이콘
					let commentIcon = "";
					//파일첨부 아이콘
					let fileIcon = "";
					//작성자
					let authorId = el.INPUT_NAME === 'undefined' ? '' : el.INPUT_NAME;

					if (el.QNA_SECURE_YN === 'Y') {
						secureIcon = '<i class="bi bi-lock"></i>';
					}
					if (el.COMMENT_CNT > 0) {
						commentIcon = '<i class="bi bi-chat" ><span style="font-size:13px;">' + el.COMMENT_CNT + '</span></i>';
					}
					if( el.FILE_CNT > 0 ){
						fileIcon = '<i class="bi bi-file-earmark-richtext-fill" style="color:grey;" ></i>'
					}
					tbody.append('<tr onclick="fn_goDetail(\'' + el.SEQ + '\');">'
						+ '<td class="text-center">' + el.RN + '</td>'
						+ '<td><a href="#" class="link-dark link-sm">' + secureIcon + ' ' + el.EDT_TITLE + ' ' + commentIcon + ' '  + fileIcon + '</a></td>'
						+ '<td class="text-center">' + el.INPUT_DT + '</td>'
						+ '<td class="text-center">' + authorId + '</td>'
						+ '<td class="text-center">' + el.VIEW_CNT + '</td>'
						+ '</tr>');
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
			              <span class="text-dark mb-0"></span>
			
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
							<a class="nav-link active" onclick="go_page('qna');">4. 문의게시판</a>
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
			<h2>문의게시판</h2>
			<hr/>
			<!-- Start Table -->
			<div class="table-responsive">
				<div class="col-md-4 mb-2 float-end">
					<label class="form-label visually-hidden" for="searchTitle">Search </label>
					<!-- Form -->
					<div class="input-group-merge">
			          <span class="input-group-prepend input-group-text" style="cursor:pointer;" onclick="fn_search();">
			            <i class="bi-search"></i>
			          </span>
						<input type="text" class="form-control form-control-lg" id="searchTitle"
						       placeholder="Search" aria-label="Search">
					</div>
					<!-- End Form -->
				</div>
				
				<table class="table table-nowrap table-align-middle " id="notice-tbl">
					<thead class="thead-light">
					<tr>
						<th style="width:10%;text-align: center;">No</th>
						<th style="width:65%;text-align: center;">제목</th>
						<th style="width:15%;text-align: center;">작성일</th>
						<th style="width:10%;text-align: center;">작성자</th>
						<th style="width:10%;text-align: center;">조회수</th>
					</tr>
					</thead>
					<tbody>
					<c:if test="${list.size() == 0 }">
						<tr>
							<td colspan="5" class="text-center">등록된 데이터가 없습니다.</td>
						</tr>
					</c:if>
					<c:forEach items="${list}" var="item">
						<tr onclick="fn_goDetail('${item.SEQ}');">
							<td class="text-center"><c:out value="${item.RN}"/></td>
							<td>
								<a href="#" class="link-dark link-sm">
									<c:if test="${item.QNA_SECURE_YN == 'Y'}">
										<i class="bi bi-lock"></i>
									</c:if>
									<c:out value="${item.EDT_TITLE}"/>
									<c:if test="${item.COMMENT_CNT > 0 }">
										<i class="bi bi-chat"><span style="font-size: 13px;">${item.COMMENT_CNT}</span></i>
									</c:if>
									<c:if test="${item.FILE_CNT > 0 }">
										<i class="bi bi-file-earmark-richtext-fill" style="color:grey;" ></i>
									</c:if>
								</a>
							</td>
							<td class="text-center"><c:out value="${item.INPUT_DT}"/></td>
							<td class="text-center"><c:out value="${item.INPUT_NAME}"/></td>
							<td class="text-center"><c:out value="${item.VIEW_CNT}"/></td>
						</tr>
					</c:forEach>
					</tbody>
				</table>
				<button type="button" class="btn btn-white float-end" style="--bs-btn-border-width: 1px;"
				        onclick="fn_goWrite();">글쓰기
				</button>
			</div>
			<!-- End Table -->
			
			<!-- Pagination -->
			<c:if test="${pageInfo.pages != 0}">
				<nav aria-label="Page navigation" id="nav-page">
					<ul class="pagination justify-content-center">
						<li class="page-item">
							<a class="page-link pointer"
							   onclick="fn_search('<c:out value="${pageInfo.prePage == 0 ? 1 : pageInfo.prePage}"/>')"
							   aria-label="Previous">
								<span aria-hidden="true"><i class="bi bi-chevron-double-left"></i></span>
								<span class="visually-hidden">Previous</span>
							</a>
						</li>
						<c:set var="startPage" value="${pageInfo.startPage == 0 ? 1 : pageInfo.startPage}"/>
						<c:set var="endPage" value="${pageInfo.pages > 5 ? 5 : pageInfo.pages}"/>
						<c:set var="nextPage" value="${pageInfo.nextPage == 0 ? pageInfo.pages : pageInfo.nextPage}"/>
						<c:forEach var="i" begin="${startPage}" end="${endPage}">
							<li class="page-item"><a
									class="page-link pointer <c:if test="${pageInfo.pageNum == i}">active</c:if>"
									onclick="fn_search(${i})">${i}</a></li>
						</c:forEach>
						<li class="page-item">
							<a class="page-link pointer" onclick="fn_search('<c:out value="${nextPage}"/>')"
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
