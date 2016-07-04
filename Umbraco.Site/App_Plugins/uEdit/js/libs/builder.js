if (!window.jQuery) {
    var uEditjq = document.createElement('script');
    uEditjq.src = '/app_plugins/uedit/js/libs/jquery.js';
    document.getElementsByTagName('body')[0].appendChild(uEditjq);

    var uEditjqui = document.createElement('script');
    uEditjqui.src = '/app_plugins/uedit/js/libs/jquery-ui.js';
    document.getElementsByTagName('body')[0].appendChild(uEditjqui);
} else {

    if (!window.jQuery.ui) {
        var uEditjqui = document.createElement('script');
        uEditjqui.src = '/app_plugins/uedit/js/libs/jquery-ui.js';
        document.getElementsByTagName('body')[0].appendChild(uEditjqui);
    }

}

var uEdit_tinymce = document.createElement('script');
uEdit_tinymce.src = '/umbraco/lib/tinymce/tinymce.min.js';
document.getElementsByTagName('body')[0].appendChild(uEdit_tinymce);

var uEdit_codemirror = document.createElement('script');
uEdit_codemirror.src = '/Umbraco/lib/tinymce/plugins/codemirror/CodeMirror/lib/codemirror.js';
document.getElementsByTagName('body')[0].appendChild(uEdit_codemirror);

var uEditapp = document.createElement('script');
uEditapp.src = '/app_plugins/uedit/js/app/app.js';
document.getElementsByTagName('body')[0].appendChild(uEditapp);