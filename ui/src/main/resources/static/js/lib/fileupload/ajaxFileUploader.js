AjaxFileUploader = {
    initUploadButton: function (button, dataUrl, paramFunction, callback, condition, onFail) {
        var fileInput = createFileInput();

        button.click(function () {
            if (condition && !condition()) return;

            fileInput[0].click();
        });

        function createFileInput() {
            var file = $('<input type="file" name="file"  style="display: none">');
            var uploadFormData;

            file.fileupload({
                url: dataUrl
            }).bind('fileuploadsubmit', function (e, data) {
                uploadFormData = paramFunction();
                data.formData = uploadFormData;
            }).bind('fileuploaddone', function (e, response) {
                callback(response.result, uploadFormData);
            }).bind('fileuploadfail', function (e, data) {
                onFail(e, data);
            }).bind('fileuploadalways', function () {
                fileInput.remove();
                fileInput = createFileInput();
            });

            $('body').append(file);

            return file;
        }
    }
};