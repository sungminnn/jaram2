<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="s" uri="http://www.springframework.org/security/tags" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="en">
<head>
	<script>
		/** editor upload **/
		function MyCustomUploadAdapterPlugin(editor) {
			editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
				return new UploadAdapter(loader);
			}
		}

		$(function () {
			//비밀글 표시
			let secureYn = "${boardInfo.QNA_SECURE_YN}";
			if (secureYn === 'Y') {
				$("input[name='lockIcon']").removeClass("bi-unlock").addClass("bi-lock");
			}

			ClassicEditor
				.create(document.querySelector('#editor01'), {
					extraPlugins: [MyCustomUploadAdapterPlugin]
					, toolbar: ['undo', 'redo'
						, '|', 'bold', 'italic', 'underline'
						, '|', 'fontSize', 'fontColor', 'fontBackgroundColor', 'highLight'
						, '|', 'link', 'imageUpload', 'insertTable', 'blockQuote'
						, '|', 'bulletedList', 'numberedList', 'alignment']
					, table: {
						contentToolbar: [
							'tableColumn',
							'tableRow',
							'mergeTableCells'
						]
					}
				})
				.then(editor => {
					window.editor01 = editor;
					//수정 시 내용
					editor01.setData($("#edtText").html());
				})
				.catch(error => {
					console.error(error);
				});

		});

		/**
		 * 게시판 내용 저장
		 */
		function fn_saveBoard() {
			if (!fn_validation()) {
				return false;
			}

			$.confirm({
				title: '알림'
				, content: '저장하시겠습니까?'
				, buttons: {
					confirm: {
						text: '예'
						, btnClass: 'btn-blue'
						, action: function () {
							//FormData 새로운 객체 생성
							let formData = new FormData();

							// input class 값
							let fileInput = $('.input-file');

							// fileInput 개수를 구한다.
							for (let i = 0; i < fileInput.length; i++) {
								if (fileInput[i].files.length > 0) {
									for (let j = 0; j < fileInput[i].files.length; j++) {
										// formData에 'file'이라는 키값으로 fileInput 값을 append 시킨다.
										formData.append('file', $('.input-file')[i].files[j]);
									}
								}
							}

							// 넘길 데이터를 담아준다.
							let data = {
								SEQ: "${boardInfo.SEQ}"
								, EDT_ID: "editor01"
								, EDT_TEXT: editor01.getData()
								, EDT_TITLE: $("#title").val()
								, INPUT_NAME: $("#inputName").val()
								, QNA_PASSWORD: $("#qnaPassword").val()
								, QNA_SECURE_YN: $("#qnaSecureYn").val()
							};

							//value 변경하여 저장할 수 없도록 막기
							if ("${boardInfo.INPUT_NAME}" !== '') {
								data.INPUT_NAME = "${boardInfo.INPUT_NAME}";
								data.QNA_PASSWORD = "${boardInfo.QNA_PASSWORD}";
							}

							// 'key'라는 이름으로 위에서 담은 data를 formData에 append한다. type은 json
							formData.append('key', new Blob([JSON.stringify(data)], {type: "application/json"}));
							cfn_ajaxTransmit("/save-qna-board", formData, null, false);
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
		 * 저장 전 validation check
		 */
		function fn_validation() {
			<s:authorize access="isAnonymous()">
			if (common.isEmpty($("#inputName").val())) {
				$.alert("이름을 입력해주십시오.");
				return false;
			} else if (common.isEmpty($("#qnaPassword").val())) {
				$.alert("비밀번호를 입력해주십시오.");
				return false;
			} else if ($("#qnaPassword").val().length < 4) {
				$.alert("비밀번호는 4자 이상 입력하세요.");
				return false;
			}
			</s:authorize>
			if (common.isEmpty($("#title").val())) {
				$.alert("제목을 입력해주십시오.");
				return false;
			} else if (common.isEmpty(editor01.getData())) {
				$.alert("내용을 입력해주십시오.");
				return false;
			}

			return true;
		}

		/**
		 * Ajax callback
		 */
		function fn_callBack(id, res, stat) {
			if (id === '/save-qna-board') {
				if (stat === "success") {
					$.confirm({
						title: '알림'
						, content: '저장되었습니다.'
						, buttons: {
							confirm: {
								text: '예'
								, btnClass: 'btn-blue'
								, action: function () {1
									location.href = "/board?page=qna";
								}
							},
						}
					});
				}
			}
		}

		/**
		 * 첨부파일 행 추가
		 */
		function fn_addFileInput() {
			let divFile = $("#div-file");
			divFile.append('<div class="input-group my-2 file-input">'
				+ '<input type="file" name="uploadFile" class="form-control input-file" onchange="fn_selectFile(this);">'
				+ '<button type="button" class="btn btn-soft-secondary d-inline" onclick="fn_deleteFileInput(this);">파일삭제</button>'
				+ '</div>');
		}

		/**
		 * 첨부파일 행 삭제
		 */
		function fn_deleteFileInput(ths) {
			$(ths).parent().remove();
		}

		/**
		 * 파일 선택
		 */
		function fn_selectFile(element) {
			common.uploadChk(element);
		}

		/**
		 * 수정 시 첨부파일 삭제
		 */
		function fu_deleteFile(fileSeq, element) {
			$.confirm({
				title: '알림'
				, content: '삭제하시겠습니까?'
				, buttons: {
					confirm: {
						text: '예'
						, btnClass: 'btn-blue'
						, action: function () {
							$(element).parent().remove();
							let data = {
								FILE_SEQ: fileSeq
							};
							cfn_ajaxTransmit("/delete-file-info", data);
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
				$("#qnaSecureYn").val("Y");
			} else {
				$(element).children().removeClass('bi-lock').addClass('bi-unlock');
				$("#qnaSecureYn").val("N");
			}
		}
	
	</script>
</head>
<body>
<!--메인이미지 경로-->
<input type="hidden" id="qnaSecureYn" value="${boardInfo.QNA_SECURE_YN}">
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
							<a class="nav-link active" onclick="go_page('gallery');">3. 갤러리</a>
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
			<form id="frm" method="post" enctype="multipart/form-data">
				<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}">
				<!-- 미인증 -->
				<s:authorize access="isAnonymous()">
					<div class="input-group mb-3">
						<!-- 이름 -->
						<div class="mb-3">
							<label class="form-label" for="inputName">이름</label>
							<input type="text" class="form-control" placeholder="이름을 입력하세요." id="inputName" name="inputName"
							       value="${boardInfo.INPUT_NAME}" maxlength="300" <c:if test="${boardInfo.INPUT_NAME != null}">disabled</c:if>>
						</div>
						<!-- 비밀번호 -->
						<div class="mb-3" style="margin-left:10px;">
							<label class="form-label" for="qnaPassword">비밀번호</label>
							<div class="input-group">
								<input type="password" class="form-control" placeholder="비밀번호를 입력하세요." id="qnaPassword" name="qnaPassword"
								       maxlength="300" <c:if test="${boardInfo.INPUT_NAME != null}">value="****" disabled</c:if>>
								<button type="button" class="btn btn-icon" style="border: 0.0625rem solid rgba(220, 224, 229, 0.6);" onclick="fn_lockUnlock($(this));">
									<c:if test="${boardInfo.QNA_SECURE_YN == 'Y'}">
										<i class="bi bi-lock" name="lockIcon"></i>
									</c:if>
									<c:if test="${boardInfo.QNA_SECURE_YN != 'Y'}">
										<i class="bi bi-unlock" name="lockIcon"></i>
									</c:if>
								</button>
							</div>
						</div>
					</div>
				</s:authorize>
				<!-- 제목 -->
				<div class="mb-3">
					<label class="form-label" for="title">제목</label>
					<div class="input-group">
						<input type="text" class="form-control" placeholder="제목을 입력하세요." id="title" name="title" value="${boardInfo.EDT_TITLE}" maxlength="300">
						<button type="button" class="btn btn-icon" style="border: 0.0625rem solid rgba(220, 224, 229, 0.6);" onclick="fn_lockUnlock($(this));">
							<s:authorize access="!isAnonymous()">
								<c:if test="${boardInfo.QNA_SECURE_YN == 'Y'}">
									<i class="bi bi-lock" name="lockIcon"></i>
								</c:if>
								<c:if test="${boardInfo.QNA_SECURE_YN != 'Y'}">
									<i class="bi bi-unlock" name="lockIcon"></i>
								</c:if>
							</s:authorize>
						</button>
					</div>
				</div>
				
				<!-- 내용 -->
				<div class="mb-3">
					<label class="form-label">내용</label>
					<div id="editor01"></div>
					<div id="edtText" class="d-none">${boardInfo.EDT_TEXT}</div>
				</div>
				
				<!-- 첨부파일 -->
				<div class="mb-3">
					<label class="form-label">첨부파일</label>
					<button type="button" class="btn btn-soft-success btn-icon btn-xsm" style="margin-left:4px;" onclick="fn_addFileInput();">
						<i class="bi-file-earmark-plus"></i>
					</button>
					<ul>
						<c:forEach items="${uploadFiles}" var="item">
							<li><a href="/files/${item.SEQ}/download" class="link-info link-sm">${item.ORG_FILE_NAME}</a><i class="bi bi-x pointer" onclick="fu_deleteFile('${item.SEQ}', this);"></i>
							</li>
						</c:forEach>
					</ul>
					<div id="div-file">
						<div class="input-group file-input">
							<input type="file" name="uploadFile" class="form-control input-file" onchange="fn_selectFile(this);">
							<button type="button" class="btn btn-soft-secondary d-inline" onclick="fn_deleteFileInput(this);">파일삭제</button>
						</div>
					</div>
				</div>
				
				<div class="table-responsive">
					<button type="button" class="btn btn-white float-start" onclick="location.href='/board?page=${PAGE}';">목록
					</button>
					<button type="button" class="btn btn-white float-end"
					        onclick="fn_saveBoard();">저장
					</button>
				</div>
				<!-- End Table -->
			</form>
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
