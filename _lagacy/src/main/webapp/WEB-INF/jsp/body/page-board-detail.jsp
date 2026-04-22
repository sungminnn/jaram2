<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="s" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="en">
<head>
	<script>
		$(function () {
			//사이드바 현재 active page 표시
			fn_sidebarActive();
			
			//댓글란 생성
			fn_setInsertCommentDiv($("#insertCommentDiv"));
			
			//댓글목록 생성
			fn_setCommentListDiv(${commentList});
		});

		/**
		 * 사이드바 현재 active page 표시
		 */
		function fn_sidebarActive() {
			$('.sub-menu').each(function (index, item) {
				if ("/board?page=${page}" === $(this).attr("href")) {
					$(this).addClass('active');
				}
			});
		}

		/**
		 * 게시글 수정
		 */
		function fn_updateBoard() {
			location.href = "/admin/page-board-update?seq=${boardInfo.SEQ}&page=${page}";
		}

		/**
		 * 게시글 삭제
		 */
		function fn_deleteBoard() {
			$.confirm({
				title: '알림'
				, content: '게시글을 삭제하시겠습니까?'
				, buttons: {
					confirm: {
						text: '예'
						, btnClass: 'btn-blue'
						, action: function () {
							location.href = "/admin/page-board-delete?seq=${boardInfo.SEQ}&page=${page}";
						}
					},
					cancel: {
						text: '아니오'
						, action: function () {
							//닫기
						}
					}
				}
			});
		}

		/**
		 * 문의 게시판 글 수정/삭제(by User)
		 */
		function fn_userBoardUD(gubn) {
			let loginId = "${LOGIN_ID}";
			if ((common.isEmpty(loginId) || (common.isNotEmpty(loginId) && loginId !== '${boardInfo.INPUT_ID}'))) {
				$.confirm({
					title: ''
					,
					content: '<span>작성 시 등록한 비밀번호를 입력해주십시오.</span><br><br><div class="t-center"><input type="password" id="qnaPassword" class="form-control"></div>'
					,
					buttons: {
						confirm: {
							text: '확인'
							, btnClass: 'btn-blue'
							, action: function () {
								$("#GUBN").val(gubn);
								//조회
								let data = {
									QNA_PASSWORD: $("#qnaPassword").val()
								  , SEQ: ${boardInfo.SEQ}
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
				if (gubn === 'U') {
					location.href = "/qna-update?seq=${boardInfo.SEQ}";
				} else if (gubn === 'D') {
					$.confirm({
						title: '알림'
						, content: '게시글을 삭제하시겠습니까?'
						, buttons: {
							confirm: {
								text: '예'
								, btnClass: 'btn-blue'
								, action: function () {
									location.href = "/qna-delete?seq=${boardInfo.SEQ}";
								}
							},
							cancel: {
								text: '아니오'
								, action: function () {
									//닫기
								}
							}
						}
					});
				}
			}

			return false;
		}

		/**
		 * Ajax callback
		 */
		function fn_callBack(id, res, stat) {
			switch(id){

				case "/qna-chk-password" :
					if (res.code === 'success') {
						if ($("#GUBN").val() === "U") {
							location.href = "/qna-update?seq=${boardInfo.SEQ}";
						} else {
							location.href = "/qna-delete?seq=${boardInfo.SEQ}";
						}
					} else {
						$.alert(res.msg);
					}
				break;

				case "/insert-comment" :
					let commentList = res.commentList;
					if (res.msg === 'success') {
						$.confirm({
							title: '알림'
							, content: '등록되었습니다.'
							, buttons: {
								confirm: {
									text: '확인'
									, action: function () {
										//댓글란 그리기
										fn_setInsertCommentDiv($("#insertCommentDiv"));
										//댓글목록 그리기
										fn_setCommentListDiv(commentList);
									}
								}
							}
						});
					}
				break;

				case "/comment-chk":
					//댓글 수정&삭제
					if( res.code === 'success_chk_pwd' ){ //댓글 비밀번호 체크
						$.confirm({
							  title: ''
							, content: '<span>작성 시 등록한 비밀번호를 입력해주십시오.</span><br><br><div class="t-center"><input type="password" id="commentPassword" class="form-control"></div>'
							, buttons: {
								confirm: {
									text: '확인'
									, btnClass: 'btn-blue'
									, action: function () {
										//조회
										let data = {
											  COMMENT_SEQ      : res.seq
											, COMMENT_PASSWORD : $("#commentPassword").val()
											, GUBN             : res.gubn
										};
										cfn_ajaxTransmit("/comment-chk-password", data);
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
					}else{
						//로그인 사용자가 같은 경우 체크 없이 변경
						if (res.code === "success_U") {
							//댓글 수정란으로 변경
							fn_setCommentUpdateDiv(res);
						} else if (res.code === "success_D" ) {
							//댓글 삭제
							fn_deleteComment(res);
						}
					}

				break;

				//댓글 비밀번호 체크
				case "/comment-chk-password":
					if( res.code === 'success' ){
						if( res.gubn === 'U'){
							//댓글수정
							fn_setCommentUpdateDiv(res);
						}else{
							//댓글삭제
							fn_deleteComment(res);
						}
					}else if( res.code === 'fail' ){
						//비밀번호가 일치하지 않습니다.
						$.alert(res.msg);
						return false;
					}
				break;

				//댓글 삭제
				case "/qna-comment-delete":
					if( res.code === 'success' ){
						$.alert("댓글이 삭제되었습니다.");
						//댓글목록 생성
						fn_setCommentListDiv(res.commentList);
					}else if( res.code === 'fail' ){
						//비밀번호가 일치하지 않습니다.
						$.alert(res.msg);
						return false;
					}
				break;

				case "/update-comment":
					if( res.code === 'success' ){
						$.alert("댓글이 수정되었습니다.");
						//댓글목록 생성
						fn_setCommentListDiv(res.commentList);
					}
				break;

				case "default" :

				break;
			}
		}


		/**
		 * 이미지 가져오기
		 */
		function fn_setThumbnail(event, obj) {
			let imgDiv = $(obj).parent().parent().next();
			for (let image of event.target.files) {
				//파일 확장자 체크
				if( !cfn_checkFileName(event.target.files[0].name)){
					event.target.value = "";
					return false;
				}
				$(imgDiv).empty();
				let reader = new FileReader();
				reader.onload = function (event) {
					$(imgDiv).append(     '<div class="lb-wrap" >'
										+ '<div class="lb-text2">'
										+ '<i class="bi bi-x-circle-fill pointer" style="font-size: 20px;color:#a9a9a9;" onclick="fn_deleteImg(this);"></i>'
										+ '</div>'
										+ '<div class="main-img lb-image">'
										+ '<img alt="" class="main-img" src="' + event.target.result + '" >'
										+ '</div>'
										+ '</div>'
					);
				};

				reader.readAsDataURL(image);
			}
		}

		/**
		 * 댓글 첨부 이미지 삭제
		 */
		function fn_deleteImg( obj) {
			$(obj).parent().parent().parent().empty();
			$(".comment_image_upload").val("");
		}

		/**
		 *  댓글 작성
		 */
		function fn_saveComment() {
			let loginUser = "<s:authentication property='principal'/>";
			//로그인 한 경우
			if (loginUser === 'anonymousUser') {
				if (common.isEmpty($("#commentName").val())) {
					$.alert("댓글 작성자를 입력해주십시오.");
					return false;
				} else if (common.isEmpty($("#commentPwd").val())) {
					$.alert("댓글 비밀번호를 입력해주십시오.");
					return false;
				}
			}
			if (common.isEmpty($("#comment").val())) {
				$.alert("댓글 내용을 입력해주십시오.");
				return false;
			}

			$.confirm({
				title: '알림'
				, content: '댓글을 등록하시겠습니까?'
				, buttons: {
					confirm: {
						text: '예'
						, btnClass: 'btn-blue'
						, action: function () {
							//FormData 새로운 객체 생성
							let formData = new FormData();

							// input class 값
							let fileInput = $('.commentUploadFile');

							// fileInput 개수를 구한다.
							for (let i = 0; i < fileInput.length; i++) {
								if (fileInput[i].files.length > 0) {
									for (let j = 0; j < fileInput[i].files.length; j++) {
										// formData에 'file'이라는 키값으로 fileInput 값을 append 시킨다.
										formData.append('file', $('.commentUploadFile')[i].files[j]);
									}
								}
							}

							// 넘길 데이터를 담아준다.
							let data = {
								  COMMENT_DEPTH: 1
								, COMMENT_TEXT: $("#comment").val().replace(/(?:\r\n|\r|\n)/g,'<br/>')
								, COMMENT_PASSWORD: $("#commentPwd").val()
								, SECURE_YN: $("#secureYn").val()
								, INPUT_NAME: $("#commentName").val()
								, EDT_SEQ: ${boardInfo.SEQ}
							};

							// 'key'라는 이름으로 위에서 담은 data를 formData에 append한다. type은 json
							formData.append('key', new Blob([JSON.stringify(data)], {type: "application/json"}));
							cfn_ajaxTransmit("/insert-comment", formData, null, false);
						}
					},
					cancel: {
						text: '아니오'
						, action: function () {
							//닫기
						}
					}
				}
			});

		}

		/**
		 * 비밀글 여부 변경
		 */
		function fn_lockUnlock(element) {
			let btnCls = $(element).children().attr('class');
			if (btnCls === 'bi bi-unlock') {
				$(element).children().removeClass('bi-unlock').addClass('bi-lock');
				$("#secureYn").val("Y");
			} else {
				$(element).children().removeClass('bi-lock').addClass('bi-unlock');
				$("#secureYn").val("N");
			}
		}

		/**
		 * 답글 달기
		 */
		function fn_addComment(obj){
			console.log(obj);
			console.log($("."+obj));
		}

		/**
		 * 댓글/답글란 생성
		 */
		function fn_setInsertCommentDiv(div){
			$(div).empty();
			//로그인 여부
			let loginUser = "<s:authentication property='principal'/>";
			//로그인 사용자명
			let loginUserName = "${LOGIN_NAME}";
			//댓글, 답글 구분
			let commentSe = "";
			//익명인 경우래
			let anony = "";
			//로그인 사용자인 경우
			let auth = "";

			if( $(div).attr("id") === 'insertCommentDiv' ){
				commentSe = 'comment';
			}else{
				commentSe = 'reComment';
			}
			if( loginUser === 'anonymousUser') {
				anony = '<div class="input-group mb-2">' +
						    '<div>' +
						        '<input type="text" class="form-control" placeholder="이름" id="' + commentSe + 'Name" name="' + commentSe + 'Name">' +
						    '</div>' +
						    '<div style="margin-left:10px;">' +
							    '<div class="input-group">' +
								    '<input type="password" class="form-control" placeholder="비밀번호" id="' + commentSe + 'Pwd" name="' + commentSe + 'Pwd">' +
								    '<button type="button" class="btn btn-icon" style="border: 0.0625rem solid rgba(220, 224, 229, 0.6);" onclick="fn_lockUnlock($(this));">' +
								        '<i class="bi bi-unlock" name="lockIcon"></i>' +
								    '</button>' +
							    '</div>' +
						    '</div>' +
					    '</div>';
			}else {
				auth = '<div class="input-group mb-2">' +
						   '<div class="input-group" style="width:30%">' +
							   '<span class="input-group-text" id="basic-addon1">작성자</span>' +
							   '<input type="text" class="form-control" aria-label="Username" aria-describedby="basic-addon1" value="' + loginUserName + '" readonly id="'+commentSe+'Name">' +
							   '<button type="button" class="btn btn-icon" style="border: 0.0625rem solid rgba(220, 224, 229, 0.6);" onclick="fn_lockUnlock($(this));">' +
							       '<i class="bi bi-unlock" name="lockIcon"></i>' +
							   '</button>' +
						   '</div>' +
					   '</div>';
			}

			let divStr = anony + auth +
						 '<div class="mb-3">' +
						 	 '<div class="textarea_block" style="padding-bottom:20px;">' +
						 		 '<textarea class="form-control no-resize-textarea fs-6" rows="4" placeholder="댓글을 남겨주세요." id="'+commentSe+'" name="'+commentSe+'" maxlength="1000" wrap="hard"></textarea>' +
						 		 '<div class="file-add-block" style="display: none" ></div>' +
						 		 '<button class="btn btn-primary btn-sm float-end" onclick="fn_saveComment();">작성</button>' +
						 		 '<div class="d-inline-block position-relative pointer">' +
						 		    '<i class="bi bi-image">' +
						 				'<input type="file" name="updCommentUploadFile" class="comment_image_upload commentUploadFile" onchange="fn_setThumbnail(event, this);">' +
						 			'</i>' +
						 		 '</div>' +
						 		 '<div class="div-main-img-comment">' +
						 		 '</div>' +
						 	 '</div>' +
						  '</div>';

			$(div).append(divStr);
		}

		/**
		 * 댓글 목록 그리기
		 */
		function fn_setCommentListDiv(commentList){
			let div = $("#listCommentDiv");
			let divElement = "";
			let loginId = "${LOGIN_ID}";
			
			div.empty();
			
			commentList.forEach(function (el, index) {
				let imageElement = "";

				if(!common.isEmpty(el.IMG_PATH)){
					//미리보기 이미지
					imageElement =  "<div class='main-img lb-image' id=\"div_image_"+el.COMMENT_SEQ+"\">"
							     +     "<img class='main-img' src='"+el.IMG_PATH+"'  alt=''>"
								 + "</div>";

				}
				divElement = "<div style=\"float:left;display:table;\" >"
							+ "<span class=\"avatar avatar-sm avatar-primary avatar-circle\">"
							+ "<span class=\"avatar-initials\" style=\"background-color: #c7d3cc;\"><i class=\"bi bi-person-fill\" style=\"font-size:20px;\"></i></span>"
							+ "</span>"
							+ "</div>"
						//이름
							+ "<div style=\"padding-left:10px;display: table;font-size: 12px;\">"
							+ "<span>"+el.INPUT_NAME+"</span>"
							+ "</div>"
						//작성일시
							+ "<div style=\"padding-left:10px;font-size: 12px;display:table;margin-bottom:5px;\">"
							+ "<span>"+el.INPUT_DT+"</span>"
						//수정&삭제 버튼
							+ "<div style=\"padding-left:10px;display:inline-block;\" id=\"div_ud_"+el.COMMENT_SEQ+"\">"
						    + "<a class=\"pointer d_none\" id=\"a_cancel_"+el.COMMENT_SEQ+"\" style=\"margin-left: 4px;\" onclick=\"fn_cancelCommentUD("+el.COMMENT_SEQ+");\">취소</a> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
							+ "<a class=\"pointer\" id=\"a_update_"+el.COMMENT_SEQ+"\"  style=\"margin-left: 4px;\" onclick=\"fn_commentUD('U', "+el.COMMENT_SEQ+");\">수정</a> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
						    + "<a class=\"pointer\" id=\"a_delete_"+el.COMMENT_SEQ+"\"  onclick=\"fn_commentUD('D',"+el.COMMENT_SEQ+");\">삭제</a>"
							+ "</div>"
							+ "</div>"
						//댓글내용
							+ "<div style=\"padding-left:10px;font-size: 14px;display:table;width:100%;\" class=\"my-2\" id=\"div_"+el.COMMENT_SEQ+"\"></div>"
							+ "<div style=\"padding-left:10px;font-size: 14px;display:table;width:100%;\" class=\"my-2\" id=\"div_text_"+el.COMMENT_SEQ+"\">"
							+ "<span style=\"word-break: break-word;\">"+el.COMMENT_TEXT+"</span>"
						//이미지
							+ imageElement
							+ "</div>"
						//답글 버튼
							+ "<p class=\"mb-4\" style=\"border-bottom: 1px solid #efefef;padding-bottom: 10px;\"><a class=\"link link-dark pointer\"  style=\"font-size:12px;\" onclick=\"fn_addComment('"+el.COMMENT_SEQ+"_replyComment');\">답글</a></p>"
							+ "<div class=\""+el.COMMENT_SEQ+"_replyComment\"></div>";
				div.append(divElement);
			});
		}

		/**
		 * 댓글 수정 버튼 클릭
		 * @param commentSeq
		 */
		function fn_commentUD(gubn, commentSeq){
			//조회
			let data = {
				COMMENT_SEQ : commentSeq
			  , GUBN        : gubn
			};
			cfn_ajaxTransmit("/comment-chk", data);
		}

		/**
		 *  댓글 수정 저장
		 */
		function fn_updateComment(seq) {
			if (common.isEmpty($("#comment_"+seq).val())) {
				$.alert("댓글 내용을 입력해주십시오.");
				return false;
			}

			$.confirm({
				title: '알림'
				, content: '댓글을 저장하시겠습니까?'
				, buttons: {
					confirm: {
						text: '예'
						, btnClass: 'btn-blue'
						, action: function () {
							//FormData 새로운 객체 생성
							let formData = new FormData();

							// input class 값
							let fileInput = $('#commentUploadFile_'+seq);

							// fileInput 개수를 구한다.
							for (let i = 0; i < fileInput.length; i++) {
								if (fileInput[i].files.length > 0) {
									for (let j = 0; j < fileInput[i].files.length; j++) {
										// formData에 'file'이라는 키값으로 fileInput 값을 append 시킨다.
										formData.append('file', fileInput[i].files[j]);
									}
								}
							}

							// 넘길 데이터를 담아준다.
							let data = {
								  COMMENT_TEXT : $("#comment_"+seq).val().replace(/(?:\r\n|\r|\n)/g,'<br/>')
								, COMMENT_SEQ  : seq
								, EDT_SEQ      : ${boardInfo.SEQ}
							};

							// 'key'라는 이름으로 위에서 담은 data를 formData에 append한다. type은 json
							formData.append('key', new Blob([JSON.stringify(data)], {type: "application/json"}));
							cfn_ajaxTransmit("/update-comment", formData, null, false);
						}
					},
					cancel: {
						text: '아니오'
						, action: function () {
							//닫기
						}
					}
				}
			});

		}

		/*
		 * 댓글 수정란 생성
		 */
		function fn_setCommentUpdateDiv(res){
			$("#a_cancel_"+res.seq).removeClass("d_none"); //취소버튼
			$("#a_update_"+res.seq).addClass("d_none");  //수정버튼
			$("#a_delete_"+res.seq).addClass("d_none");  //삭제버틍
			$("#div_text_"+res.seq).hide();
			$("#div_image_"+res.seq).hide();

			let content = res.comment.COMMENT_TEXT;
			content = content.replaceAll("<br/>", "\r\n");
			let imgPath = res.comment.IMG_PATH === null ? '' : '<div class="lb-wrap" >'
													+ '<div class="lb-text2">'
													+ '<i class="bi bi-x-circle-fill pointer" style="font-size: 20px;color:#a9a9a9;" onclick="fn_deleteImg(this);"></i>'
													+ '</div>'
													+ '<div class="main-img lb-image">'
													+ '<img alt="" class="main-img" src="' + res.comment.IMG_PATH + '" >'
													+ '</div>'
													+ '</div>';

			//답글 수정란으로 변경
			$("#div_"+res.seq).append(
					'<div class="mb-3">' +
						'<div class="textarea_block" style="padding-bottom:23px;">' +
							'<textarea class="form-control no-resize-textarea fs-6" rows="4" placeholder="댓글을 남겨주세요." name="updComment" id="comment_'+res.seq+'" maxlength="1000" wrap="hard">'+content+'</textarea>' +
							'<div class="file-add-block" style="display: none" ></div>' +
							'<button class="btn btn-primary btn-sm float-end" onclick="fn_updateComment('+res.seq+');">저장</button>' +
							'<div class="d-inline-block position-relative pointer">' +
							'<i class="bi bi-image">' +
								'<input type="file" name="updCommentUploadFile" class="comment_image_upload commentUploadFile" id="commentUploadFile_'+res.seq+'" onchange="fn_setThumbnail(event, this);">' +
							'</i>'+
							'</div>'+
							'<div class="div-main-img-comment">' +
								imgPath +
							'</div>' +
						'</div>' +
					'</div>'
			);
		}

		/**
		 * 댓글 삭제
		 */
		function fn_deleteComment(res){
			$.confirm({
				title: '알림'
				, content: '댓글을 삭제하시겠습니까?'
				, buttons: {
					confirm: {
						text: '예'
						, btnClass: 'btn-blue'
						, action: function () {
							//조회
							let data = {
								  COMMENT_SEQ      : res.seq
								, GUBN             : res.gubn
								, EDT_SEQ          : ${boardInfo.SEQ}
								, COMMENT_PASSWORD : res.comment_pwd
							};
							cfn_ajaxTransmit("/qna-comment-delete", data);
						}
					},
					cancel: {
						text: '아니오'
						, action: function () {
							//닫기
						}
					}
				}
			});
		}

		/**
		 * 댓글 수정 취소
		 */
		function fn_cancelCommentUD(commentSeq){
			$("#div_"+commentSeq).empty(); //수정란
			$("#a_cancel_"+commentSeq).addClass("d_none"); //취소버튼
			$("#a_update_"+commentSeq).removeClass("d_none");  //수정버튼
			$("#a_delete_"+commentSeq).removeClass("d_none");  //삭제버틍
			$("#div_text_"+commentSeq).show(); //작성자,작성일시
			$("#div_image_"+commentSeq).show(); //이미지
		}
	</script>
</head>
<body>
<input type="hidden" id="GUBN" name="GUBN">
<input type="hidden" id="secureYn" name="secureYn">
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
							<a class="nav-link sub-menu" href="/board?page=notice">1. 공지사항</a>
						</li>
						<li class="nav-item">
							<a class="nav-link sub-menu" href="/board?page=news">2. 뉴스 및 소식</a>
						</li>
						<li class="nav-item">
							<a class="nav-link sub-menu" href="/board?page=gallery">3. 갤러리</a>
						</li>
						<li class="nav-item">
							<a class="nav-link sub-menu" href="/board?page=qna">4. 문의게시판</a>
						</li>
						<li class="nav-item">
							<a class="nav-link sub-menu" href="/board?page=faq">5. 자주하는 질문</a>
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
			<h6><c:out value="${boardInfo.EDT_TITLE}"/></h6>
			<div style="float:left;display: table">
				<span class="avatar avatar-sm avatar-primary avatar-circle">
				  <span class="avatar-initials"><i class="bi bi-person-fill" style="font-size:20px;"></i></span>
				</span>
			</div>
			<div style="padding-left:10px;display: table;font-size: 12px;">
				<span>${boardInfo.INPUT_NAME}</span>
			</div>
			<div style="padding-left:10px;font-size: 12px;display:table;">
				<span>${boardInfo.INPUT_DT}</span>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
				<s:authorize access="!hasRole('ADMIN')">
					<c:if test="${page == 'qna' && (( boardInfo.INPUT_ID != '' && boardInfo.INPUT_ID == LOGIN_ID ) || boardInfo.INPUT_ID == null)}">
						<a class="pointer" style="margin-left: 4px;" onclick="fn_userBoardUD('U');">수정</a> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						<a class="pointer" onclick="fn_userBoardUD('D');">삭제</a>
					</c:if>
				</s:authorize>
				<s:authorize access="hasRole('ADMIN')">
					<c:if test="${page != 'qna'}">
						<a class="pointer" style="margin-left: 4px;" onclick="fn_updateBoard();">수정</a> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						<a class="pointer" onclick="fn_deleteBoard();">삭제</a>
					</c:if>
					<c:if test="${page == 'qna'}">
						<a class="pointer" style="margin-left: 4px;" onclick="fn_userBoardUD('U');">수정 </a> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						<a class="pointer" onclick="fn_userBoardUD('D');">삭제</a>
					</c:if>
				</s:authorize>
			</div>
			
			<hr style="margin-top:20px;"/>
			<c:if test="${page == 'gallery' || page == 'news'}">
				<h7>${boardInfo.EDT_SUB_TITLE}</h7>
				<hr/>
			</c:if>
			<div id="ceo-text" style="line-height: inherit;" class="ck-content">
				${boardInfo.EDT_TEXT}
			</div>
			<hr/>
			<c:if test="${page == 'gallery' || page == 'news' || page == 'qna' || page == 'notice'}">
				<c:if test="${fn:length(uploadFiles) > 0}">
					<!-- 첨부파일 -->
					<div class="mb-3">
						<label class="form-label">첨부파일</label>
						<ul>
							<c:forEach items="${uploadFiles}" var="item">
								<li><a href="/files/${item.SEQ}/download"
								       class="link-info link-sm">${item.ORG_FILE_NAME}</a>
								</li>
							</c:forEach>
						</ul>
					</div>
				</c:if>
			</c:if>
			

			<!-- 댓글란 -->
			<div id="insertCommentDiv">
			</div>
			
			<hr/>
			<br/>
			
			<!-- 댓글목록 start -->
			<div id="listCommentDiv">
			</div>
			
			<!-- 댓글 목록 end -->
			
			<button type="button" class="btn btn-white float-start" onclick="location.href='/board?page=${page}&pageNum=${pageNum}'">목록</button>
		</div>
		<!-- End Testimonials -->
		
		<!-- End Sticky End Point -->
		<div id="stickyBlockEndPointEg2"></div>
	</div>
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
