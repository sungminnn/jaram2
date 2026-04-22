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
                                , '|', 'bold', 'italic', 'underline', 'alignment'
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
                            editor01.setData($("#biz-text").html());
                        })
                        .catch(error => {
                            console.error(error);
                        });
                    $("#biz-text").hide();
                    $("#edit-btn-icon-01").removeClass("bi-pencil");
                    $("#edit-btn-icon-01").addClass("bi-save");
                } else {
                    editor01.destroy()
                        .catch(error => {
                            console.log(error);
                        });

                    $("#biz-text").show();

                    $("#edit-btn-icon-01").addClass("bi-pencil");
                    $("#edit-btn-icon-01").removeClass("bi-save");

                    //editor 메세지 저장
                    fnSaveEditorMsg("editor01", "사업소개");
                }
            })

        });

        /**
         * editor 메세지 저장
         */
        function fnSaveEditorMsg(editor, editorName) {
            let data = {
                SEQ: $("#seq").val()
                , EDT_ID: editor
                , EDT_NAME: editorName
                , EDT_TEXT: editor01.getData()
                , EDT_TITLE: editorName
                , PAGE: "${page}"
            };
            //FormData 새로운 객체 생성
            let formData = new FormData();
            // 'key'라는 이름으로 위에서 담은 data를 formData에 append한다. type은 json
            formData.append('key', new Blob([JSON.stringify(data)], {type: "application/json"}));
            cfn_ajaxTransmit("/save-editor-message", formData, null, false);
        }


        /**
         * Ajax callback
         */
        function fn_callBack(id, res, stat) {
            if (id === '/save-editor-message') {
                if (stat === "success") {
                    $('#biz-text *').remove();
                    $("#biz-text").append(res.EDT_INFO.EDT_TEXT);
                } else {
                    $.alert(id + "\n" + res + "\n" + stat);
                }
            }
        }
    </script>
</head>
<body>

<div class="container content-space-3 content-space-lg-3">
    <!-- Testimonials -->
    <div class="">
        <c:if test="${page == 'biz-1'}">
            <h2>🌿 국공립 퍼스티어고운어린이집</h2>
        </c:if>
        <c:if test="${page == 'biz-2'}">
            <h2>🌿 행복자곡다함께키움센터</h2>
        </c:if>
        <c:if test="${page == 'biz-3'}">
            <h2>🌿 국공립 판교숲길어린이집</h2>
        </c:if>
        <hr/>
        <div class="container content-space-2">
            <div class="row justify-content-evenly align-items-md-center">
                <!-- End Col -->
                    <!-- Blockquote -->
                        <!-- 대표 인삿말 ckeditor -->
                        <div id="editor01"></div>

                        <div id="biz-text" style="line-height: inherit;">
                            <c:if test="${edtMessage.boardInfo.EDT_ID == 'editor01'}">
                                ${edtMessage.boardInfo.EDT_TEXT}
                                <input type="hidden" id="seq" value="${edtMessage.boardInfo.SEQ}">
                            </c:if>
                        </div>
                        <s:authorize access="hasRole('ADMIN')">
                            <button type="button" class="btn btn-primary btn-icon btn-sm ckeditor-btn z98"
                                    id="edit-btn-01">
                                <i class="bi bi-pencil" id="edit-btn-icon-01"></i>
                            </button>
                        </s:authorize>
                    <!-- End Blockquote -->

                </div>
                <!-- End Col -->
            <!-- End Row -->
        </div>
    </div>
    <!-- End Testimonials -->
</div>
</body>
</html>
