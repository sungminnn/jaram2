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
                return new UploadAdapter(loader)
            }
        }

        $(function () {
            <!-- 대표인사말 editor -->
            $("#edit-btn-01").off("click").on("click", function () {
                if ($("#edit-btn-icon-01").hasClass("bi-pencil")) {
                    ClassicEditor

                        .create(document.querySelector('#editor01'), {
                            extraPlugins: [MyCustomUploadAdapterPlugin]
                            , toolbar: ['undo', 'redo'
                                , '|', 'bold', 'italic', 'underline'
                                , '|', 'fontSize', 'fontColor', 'fontBackgroundColor', 'highLight'
                                , '|', 'link', 'imageUpload', 'insertTable', 'blockQuote'
                                , '|', 'bulletedList', 'numberedList']
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
                            editor01.setData($("#ceo-text").html());
                        })
                        .catch(error => {
                            console.error(error);
                        });
                    $("#ceo-text").hide();
                    $("#edit-btn-icon-01").removeClass("bi-pencil");
                    $("#edit-btn-icon-01").addClass("bi-save");
                } else {
                    editor01.destroy()
                        .catch(error => {
                            console.log(error);
                        });

                    $("#ceo-text").show();

                    $("#edit-btn-icon-01").addClass("bi-pencil");
                    $("#edit-btn-icon-01").removeClass("bi-save");

                    //editor 메세지 저장
                    fnSaveEditorMsg("editor01", "대표소개");
                }
            })

        });

        /**
         * editor 메세지 저장
         */
        function fnSaveEditorMsg(editor, editorName) {
            let data = {
                  SEQ      : $("#seq").val()
                , EDT_ID   : editor
                , EDT_NAME : editorName
                , EDT_TEXT : editor01.getData()
	            , EDT_TITLE: editorName
                , PAGE     : 'ceo'
            };
	        //FormData 새로운 객체 생성
			let formData = new FormData();
	        // 'key'라는 이름으로 위에서 담은 data를 formData에 append한다. type은 json
            formData.append('key', new Blob([ JSON.stringify(data) ], {type : "application/json"}));
	        cfn_ajaxTransmit("/save-editor-message", formData, null, false);
        }


        /**
         * Ajax callback
         */
        function fn_callBack(id, res, stat) {
            if (id === '/save-editor-message') {
                if (stat === "success") {
                    $('#ceo-text *').remove();
                    $("#ceo-text").append(res.EDT_INFO.EDT_TEXT);
                } else {
                    $.alert(id + "\n" + res + "\n" + stat);
                }
            }
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
					<button type="button" class="navbar-toggler btn btn-white mb-3" data-bs-toggle="collapse" data-bs-target="#navbarVerticalNavMenuEg2" aria-label="Toggle navigation"  aria-expanded="false" aria-controls="navbarVerticalNavMenuEg2">
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
					<ul id="navbarSettingsEg2" class="js-sticky-block js-scrollspy nav nav-tabs nav-link-gray nav-vertical"
					    data-hs-sticky-block-options='{
										               "parentSelector": "#navbarVerticalNavMenuEg2",
										               "targetSelector": "#header",
										               "breakpoint": "md",
										               "startPoint": "#navbarVerticalNavMenuEg2",
										               "endPoint": "#stickyBlockEndPointEg2",
										               "stickyOffsetTop": 100
										             }'>
						<li class="nav-item">
							<a class="nav-link active" href="/ceo">1. 대표 소개</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" href="/page-purpose-of-esta">2. 설립취지문</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" href="/page-vision-mission">3. 비전과 미션</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" href="/page-organization">4. 조직도</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" href="/page-location">5. 오시는길</a>
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
			<h2>대표소개</h2>
			<hr/>
			<div class="bg-soft-dark-to-start-75">
				<div class="container content-space-2">
					<div class="row justify-content-evenly align-items-md-center">
						<!-- End Col -->

						<div class="col-md-7" style="margin:5%;">
							<!-- Blockquote -->
							<figure class="blockquote-lg mb-7">
								<!-- 대표 인삿말 ckeditor -->
								<div id="editor01"></div>

								<blockquote class="blockquote" id="ceo-text-area"></blockquote>
								<div id="ceo-text" style="line-height: inherit;">
										<c:if test="${edtMessage.boardInfo.EDT_ID == 'editor01'}">
											${edtMessage.boardInfo.EDT_TEXT}
											<input type="hidden" id="seq" value="${edtMessage.boardInfo.SEQ}">
										</c:if>
								</div>
								<s:authorize access="hasRole('ADMIN')">
									<button type="button" class="btn btn-primary btn-icon btn-sm ckeditor-btn z98" id="edit-btn-01">
										<i class="bi bi-pencil" id="edit-btn-icon-01"></i>
									</button>
								</s:authorize>
							</figure>
							<!-- End Blockquote -->

						</div>
						<!-- End Col -->
					</div>
					<!-- End Row -->
				</div>
			</div>
		</div>
		<!-- End Testimonials -->
	</div>


	<!-- End Sticky End Point -->
	<div id="stickyBlockEndPointEg2"></div>

</div>
<script>
    (function() {
        // INITIALIZATION OF STICKY BLOCKS
        // =======================================================
        new HSStickyBlock('.js-sticky-block', {
            targetSelector: document.getElementById('header').classList.contains('navbar-fixed') ? '#header' : null
        })
    })()
</script>
</body>
</html>
