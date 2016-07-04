/**
 * uEdit 1.0
 * @copyright uEdit (c) 2014
 */

var uEditApplication = function () {

    var app = {};
    app.index = 0;
    app.titleMen = "";
    app.btnsubmitText = "";
    // modules
    // -----------
    app.modules = {

        init: function () {
            this.droppable();
            this.actions();
            this.save();
            this.publish();
            this.settings.init();
            this.template.init();
            this.contentPicker.event();
        },

        publish: function () {

            $.ajax({
                type: "POST",
                url: '/umbraco/uEdit/uEdit/CheckPublish?pageId=' + $('input[name=uEditPageId]').val(),
                success: function (data) {

                    if (data.isPublished == false) {

                        app.utils.RenderPublish();
                    }

                },
                error: function (a, b, c) {

                }
            });


        },

        droppable: function () {

            var actions = '<div class="uEdit-control-actions"><a href="#" class="uEdit-action-edit">Edit</a><a href="#" class="uEdit-action-delete">Delete</a><a href="#" class="uEdit-action-move">Move</a></div>';

            $(".uEdit-area").sortable({
                beforeStop: function (event, ui) {
                    app.index = ui.item.index();
                },
                receive: function (event, ui) {

                    app.utils.RenderProgressLoader();

                    var dropArea = $(this);

                    $(ui.helper).remove();

                    dropArea.find('.ui-draggable').remove();

                    var area = $(this).attr('data-area');
                    var pageId = $(this).attr('data-pageId');
                    var controlType = $(ui.sender).attr('data-controlType');
                    var menu = $(ui.sender).attr('data-menu');

                    if (menu !== undefined) {

                        var pageId = $(this).attr('data-pageId');
                        var content = ui.sender.textContent;

                        var position = app.index;

                        var areaPosition = dropArea.attr('data-position');

                        if (areaPosition != '' && areaPosition !== undefined) {
                            area = area + '-' + areaPosition;
                        }

                        $.ajax({
                            type: "POST",
                            url: '/Umbraco/uEdit/uEdit/AddControlToArea?areaAlias=' + area + '&controlType=' + controlType + '&pageId=' + pageId + '&position=' + position,
                            success: function (json) {

                                dropArea.find("> .uEdit-placeholder").remove();

                                $('.uEdit-control').removeClass('uEdit-newControl');

                                var widgetWrapper = $("<div class='uEdit-control uEdit-newControl' data-controlId='" + json.controlId + "' data-controlType='" + json.controlType + "'><span class='uEdit-border uEdit-border-top'></span><span class='uEdit-border uEdit-border-right'></span><span class='uEdit-border uEdit-border-bottom'></span><span class='uEdit-border uEdit-border-left'></span></div>");
                                
                                if (json.controlType == 'uEditGrid') {
                                    // Grid control
                                    content = '<div class="row"><div class="col-md-6"><div class="uEdit-area uEdit-droppable uEdit-sortable" data-area="grid-' + json.controlId + '-6" data-pageid="' + json.pageId + '" data-position="0"><div class="uEdit-placeholder">Drag control here</div><span class="uEdit-border uEdit-border-top"></span><span class="uEdit-border uEdit-border-right"></span><span class="uEdit-border uEdit-border-bottom"></span><span class="uEdit-border uEdit-border-left"></span></div></div><div class="col-md-6"><div class="uEdit-area uEdit-droppable uEdit-sortable" data-area="grid-' + json.controlId + '-6" data-pageid="' + json.pageId + '" data-position="1"><div class="uEdit-placeholder">Drag control here</div><span class="uEdit-border uEdit-border-top"></span><span class="uEdit-border uEdit-border-right"></span><span class="uEdit-border uEdit-border-bottom"></span><span class="uEdit-border uEdit-border-left"></span></div></div></div>';
                                    widgetWrapper.prepend(content).prepend(actions)
                                } else if (json.controlType == 'uEditMedia') {
                                    // Media control
                                    widgetWrapper.prepend('<div class="uEdit-media-placeholder">No media set</div>').prepend(actions);
                                } else if (json.controlType == 'uEditMacro') {
                                    // Macro control
                                    widgetWrapper.prepend('<div class="uEdit-macro-placeholder">No macro selected</div>').prepend(actions);
                                } else if (json.controlType == 'uEditSection') {
                                    // Section control
                                    content = '<section><div class="container"><div class="uEdit-area uEdit-droppable uEdit-sortable" data-area="section-' + json.controlId + '"><div class="uEdit-placeholder">Drag control here</div></div></div></section>';
                                    widgetWrapper.prepend(content).prepend(actions)
                                } else if (json.controlType == 'uEditHeading') {
                                    widgetWrapper.prepend('<div class="uEdit-heading-placeholder">No title set</div>').prepend(actions)
                                } else if (json.controlType == 'uEditButton') {
                                    widgetWrapper.prepend('<div class="uEdit-button-placeholder">No title set</div>').prepend(actions)
                                } else {
                                    // Rich Text & Text control
                                    widgetWrapper.prepend('<div class="uEdit-richtext-placeholder">Write content here...</a>').prepend(actions);
                                }

                                var doSort = true;

                                if (position == 0) {
                                    dropArea.prepend(widgetWrapper);
                                } else {
                                    var dropAfterElement = dropArea.find(".uEdit-control:eq(" + (position - 1) + ")");

                                    if (dropAfterElement.length > 0) {
                                        dropAfterElement.after(widgetWrapper);
                                    } else {
                                        doSort = false;
                                        dropArea.append(widgetWrapper);
                                    }
                                    
                                }

                                var widgetsAfter = dropArea.find('.uEdit-control');
                                var i = 0;

                                $(widgetsAfter).each(function (i) {

                                    $(this).attr('data-position', i);

                                    i++;
                                });


                                var dragFromArea = dropArea;
                                var isControlList = true;

                                if (doSort) {
                                    $.ajax({
                                        type: "POST",
                                        url: '/Umbraco/uEdit/uEdit/SortControl?areaFromAlias=' + dragFromArea.attr('data-area') + '&areaToAlias=' + dropArea.attr('data-area') + '&pageId=' + pageId + '&controlId=' + json.controlId + '&position=' + position + '&isControlList=' + isControlList,
                                        success: function (json) {
                                            app.utils.RenderPublish();
                                            app.utils.RemoveLoader();
                                        },
                                        error: function (a, b, c) {
                                        }
                                    });
                                }

                                app.modules.droppable();

                                app.modules.editable(json.controlId, widgetWrapper.find('.uEdit-inline-edit'), area, pageId);

                            },
                            error: function (a, b, c) {
                                app.utils.RemoveLoader();
                            }
                        });
                    }

                },
                items: ".uEdit-control",
                placeholder: "uEdit-state-highlight",
                connectWith: ".uEdit-area",
                handle: ".uEdit-action-move",
                tolerance: "pointer",
                opacity: 0.7,
                forceHelperSize: true,
                cursorAt: { right: 5 },
                helper: function (a, b) {
                    return $('<div class="uEdit-ui-helper">' + b.attr('data-controltype') + '</div>');
                },
                sort: function () {
                    $(this).removeClass("uEdit-state-default");
                },
                stop: function (event, ui) {

                    var widget = $(ui.item);

                    if (widget.hasClass('uEdit-control')) {

                        app.utils.RenderProgressLoader();

                        var dragFromArea = $(event.target);
                        var dropArea = ui.item.closest('.uEdit-area');
                        var isControlList = false;
                        var controlId = $('.uEdit-control.uEdit-newControl').attr('data-controlId');

                        $('.uEdit-control').removeClass('.uEdit-newControl');

                        if (typeof controlId === 'undefined') {
                            controlId = widget.attr('data-controlId');
                        }

                        if (widget.attr('data-id') != '' && widget.attr('data-id') !== undefined) {
                            isControlList = true;
                        }

                        var dragFromAreaAlias = dragFromArea.attr('data-area');
                        var dropAreaAlias = dropArea.attr('data-area');

                        var pageId = dropArea.attr('data-pageId');

                        dropArea.find("> .uEdit-placeholder").remove();

                        var widgets = dropArea.find('> .uEdit-control');
                        var i = 0;

                        $(widgets).each(function (i) {

                            $(this).attr('data-position', i);

                            i++;
                        });

                        $('.uEdit-area').each(function (i) {
                            var area = $(this);
                            if ($(this).find('.uEdit-control').length <= 0 && $(this).find('> .uEdit-placeholder').length <= 0) {
                                area.append('<div class="uEdit-placeholder">Drag control here</div>');
                            }
                        });

                        var position = widget.attr('data-position');

                        $.ajax({
                            type: "POST",
                            url: '/Umbraco/uEdit/uEdit/SortControl?areaFromAlias=' + dragFromAreaAlias + '&areaToAlias=' + dropAreaAlias + '&pageId=' + pageId + '&controlId=' + controlId + '&position=' + position + '&isControlList=' + isControlList,
                            success: function (json) {
                                app.utils.RenderPublish();
                                app.utils.RemoveLoader();
                                app.utils.RemoveProgressLoader();
                            },
                            error: function (a, b, c) {
                            }
                        });

                    }

                }
            }).droppable({
                greedy: true,
                activeClass: "uEdit-state-default",
                hoverClass: "uEdit-state-hover",
                tolerance: "pointer",
                accept: ".uEdit-control",
                helper: 'clone'
            });

        },

        editable: function (controlId, widget, area, pageId) {

            $('body').removeClass('uEdit-toggle-open');

            app.utils.RenderProgressLoader();

            $.ajax({
                type: "GET",
                url: '/Umbraco/uEdit/uEdit/EditControl?controlId=' + controlId + '&pageId=' + pageId + '&areaAlias=' + area,
                success: function (json) {

                    app.utils.RemoveProgressLoader();

                    $('.uEdit-control-edit').html('');

                    var widgetEdit = $('<div class="uEdit-control-container"><form method="post" action="/Umbraco/uEdit/uEdit/EditControl" class="uEdit-control-save">'
                        + '<input type="hidden" name="controlId" value="' + controlId + '" />'
                        + '<input type="hidden" name="area" value="' + area + '" />'
                        + '<input type="hidden" name="pageId" value="' + pageId + '" />'
                        + '<input type="hidden" name="controlType" value="' + json.type + '" />'
                        + '</form></div>');

                    $(json.control.Properties).each(function (i) {

                        var me = this;

                        var controlType = json.type;
                        var alias = me.Alias;
                        var value = '';
                        var $property = '';

                        if (me.Value !== null && me.Value !== undefined) {
                            value = me.Value;
                        }

                        switch (alias) {
                            case "title":

                                if (controlType == "uEditRichtext" || controlType == "uEditMedia" || controlType == "uEditText" || controlType == "uEditHeading" || controlType == "uEditButton") {

                                    $property = app.modules.properties.builder('Umbraco.Textbox', alias, alias, value);

                                }

                                break;
                            case "description":

                                if (controlType == "uEditMedia") {

                                    $property = app.modules.properties.builder('Umbraco.TextboxMultiple', alias, alias, value);

                                }

                                if (controlType == "uEditButton") {
                                    $property = app.modules.properties.builder('Umbraco.Textbox', alias, "Url", value);
                                }

                                break;
                            case "content":

                                if (controlType == "uEditRichtext") {

                                    $property = app.modules.properties.builder('Umbraco.TinyMCEv3', alias, alias, value);

                                }

                                if (controlType == "uEditText") {

                                    $property = app.modules.properties.builder('Umbraco.TextboxMultiple', alias, alias, value);
                                }

                                break;
                            case "template":

                                if (controlType == "uEditMedia" || controlType == "uEditRichtext" || controlType == "uEditText" || controlType == "uEditSection" || controlType == "uEditGrid" || controlType == "uEditHeading" || controlType == "uEditButton") {

                                    $property = $('<div class="uEdit-control-group uEdit-clearfix">'
                                        + '<label for="' + alias + '">' + alias + ' <a href="#" class="uEdit-template-new" style="float:right; margin-left:10px;">New</a> <a href="#" class="uEdit-template-edit" style="float:right; margin-left:10px;">Edit</a></label>'
                                        + '<select name="' + alias + '" id="' + alias + '"><option value="">Select template</option></select>'
                                        + '</div>')

                                    $(json.templates).each(function (i) {

                                        var selected = "";

                                        if (value == this.path) {
                                            selected = 'selected="selected"';
                                        }

                                        $property.find('select').append('<option value="' + this.path + '" ' + selected + '>' + this.name + '</option>');

                                    });
                                }

                                break;
                            case "item":

                                if (controlType == "uEditMedia" || controlType == "uEditSection") {

                                    $property = app.modules.properties.builder('Umbraco.MediaPicker', alias, alias, value);

                                }

                                break;
                            case "macro":

                                if (controlType == "uEditMacro") {

                                    $property = $('<div class="uEdit-control-group uEdit-clearfix">'
                                        + '<label for="select-' + alias + '">' + alias
                                        + '<a href="#" class="uEdit-macro-editTemplate" style="float:right;">Edit</a>'
                                        + '</label>'
                                        + '<select name="select-' + alias + '" id="select-' + alias + '" class="uEdit-macro-select"><option value="">Select macro</option></select>'
                                        + '<input type="hidden" name="' + alias + '" value="' + value.replace(/"/g, "'") + '" />'
                                        + '</div>')

                                    var re = new RegExp("macroAlias=(\"[^<>\"]*\"|'[^<>']*'|\w+)", "g");
                                    var match = re.exec(value);
                                    var macroAlias = '';
                                    if (value != '') {
                                        macroAlias = match[1].replace(/"/g, '').replace(/'/g, '');
                                    }

                                    $(json.macros).each(function (i) {

                                        var selected = "";

                                        if (macroAlias == this.macroAlias) {
                                            selected = 'selected="selected"';

                                            app.modules.macro.renderProperties(this.id, $property.find('select'), value, this.macroAlias);
                                        }

                                        $property.find('select').append('<option value="' + this.id + '" data-macroAlias="' + this.macroAlias + '" ' + selected + '>' + this.macroName + '</option>');

                                    });

                                }

                                break;

                            case "columns":

                                if (controlType == "uEditGrid") {

                                    $property = $('<div class="uEdit-control-group uEdit-clearfix">'
                                        + '<label for="' + alias + '">' + alias + ' <a href="#" class="uEdit-columns-add">Add Column</a></label>'
                                        + '<input type="hidden" name="' + alias + '" id="' + alias + '" value="' + value + '" />'
                                        + '</div>')

                                    var columns = value.split(';');

                                    var screens = ['xs', 'sm', 'md', 'lg'];

                                    $(columns).each(function (index,item) {
                                        
                                        if (item != '') {

                                            var values = item.split(':');

                                            var row = $('<div class="uEdit-control-group uEdit-control-group-columns  uEdit-clearfix">'
                                            + '<select class="uEdit-gridColumns-col"></select>'
                                            + '<select class="uEdit-gridColumns-screen"></select>'
                                            + '<input type="text" class="uEdit-gridColumns-config" value="' + values[2] + '"/>'
                                            + '<a href="#">X</a>'
                                            + '</div>');

                                            for (i = 1; i < 13; i++) {
                                                row.find('.uEdit-gridColumns-col').append('<option value="' + i + '">' + i + '</option>');
                                            }

                                            $(screens).each(function (x, z) {
                                                row.find('.uEdit-gridColumns-screen').append('<option value="' + z + '">' + z + '</option>');
                                            });

                                            row.find('.uEdit-gridColumns-col option[value=' + values[0] + ']').attr('selected', 'selected');
                                            row.find('.uEdit-gridColumns-screen option[value=' + values[1] + ']').attr('selected', 'selected');

                                            $property.append(row);
                                        }


                                    });

                                }

                                if (controlType == "uEditHeading") {
                                    $property = $('<div class="uEdit-control-group uEdit-clearfix">'
                                        + '<label for="' + alias + '">Heading</label>'
                                        + '<select name="' + alias + '" id="' + alias + '">'
                                        + '<option value="h1" ' + (value == "h1" ? "selected=selcted" : "") + '>H1</option>'
                                        + '<option value="h2" ' + (value == "h2" ? "selected=selcted" : "") + '>H2</option>'
                                        + '<option value="h3" ' + (value == "h3" ? "selected=selcted" : "") + '>H3</option>'
                                        + '<option value="h4" ' + (value == "h4" ? "selected=selcted" : "") + ' ' + (value == "" ? "selected=selcted" : "") + '>H4</option>'
                                        + '<option value="h5" ' + (value == "h5" ? "selected=selcted" : "") + '>H5</option>'
                                        + '<option value="h6" ' + (value == "h6" ? "selected=selcted" : "") + '>H6</option>'
                                        + '</select>'
                                        + '</div>');
                                }

                                if (controlType == "uEditButton") {
                                    $property = app.modules.properties.builder('Umbraco.Textbox', alias, "Icon", value);
                                }

                                break;

                            case "class":

                                if (controlType == "uEditGrid" || controlType == "uEditSection" || controlType == "uEditHeading" || controlType == "uEditButton") {

                                    $property = app.modules.properties.builder('Umbraco.Textbox', alias, alias, value);

                                }

                                break;

                            default:
                                "";
                        }

                        widgetEdit.find('form').append($property);

                    });


                    widgetEdit.find('form').append('<button type="submit" data-type="save">Save</button>');

                    $('body').addClass('uEdit-edit-open');

                    $('.uEdit-control-edit').append(widgetEdit);

                    var baseLineConfigObj = {
                        selector: "textarea.uEdit-editable",
                        mode: "exact",
                        skin: "umbraco",
                        menubar: false,
                        statusbar: false,
                        relative_urls: false,
                        force_p_newlines: 'false',
                        remove_linebreaks: false,
                        force_br_newlines: true,
                        apply_source_formatting: true,
                        remove_trailing_nbsp: false,
                        image_dimensions: false,
                        init_instance_callback: function (editor) {
                            app.modules.media.uEditResizeImage(editor);
                        },
                        toolbar: "code bold italic alignleft aligncenter alignright bullist umlist outdent indent link image umbmediapicker umbembeddialog umbmacro",
                        plugins: [
                            "autolink lists link print anchor table",
                            "code fullscreen contextmenu paste codemirror"
                        ],
                        codemirror: {
                            indentOnInit: true, // Whether or not to indent code on init. 
                            path: 'CodeMirror', // Path to CodeMirror distribution
                            config: {           // CodeMirror config object
                                mode: 'htmlmixed',
                                lineNumbers: true
                            }
                        }
                    };

                    tinymce.init(baseLineConfigObj);

                },
                error: function (a, b, c) {
                    app.utils.RemoveProgressLoader();
                }
            });

        },

        actions: function () {

            var me = this;

            if ($('.uEdit-control-list').length <= 0) {

                $('body').append('<div class="uEdit-control-list" style="display:block"><a href="http://www.sendiradid.is" target="_blank" class="uEdit-logo">Sendiráðið</a><a href="#" class="uEdit-Page-Settings" title="Page settings">Page Settings</a><a href="#" class="uEdit-Template" title="Template">Template</a><div class="uEdit-control-container"></div><div class="uEdit-control-footer"><a href="/umbraco#/content/content/edit/' + $('input[name=uEditPageId]').val() + '" target="_blank" class="uEdit-goto-umbraco">Go to Umbraco</a><a href="#" class="uEdit-logout">Logout</a></div></div>');
            }

            if ($('.uEdit-control-edit').length <= 0) {
                $('body').append('<div class="uEdit-control-edit" style="display:block"></div>');
            }

            $('body').on('click', '.uEdit-toggle', function () {

                $('body').toggleClass('uEdit-toggle-open');
                $('body').removeClass('uEdit-edit-open');

                if ($('.uEdit-control-list .uEdit-control').length <= 0) {

                    var controls = ["uEditGrid", "uEditSection", "uEditMacro", "uEditRichtext", "uEditMedia", "uEditText", "uEditHeading", "uEditButton"];

                    var controlLength = controls.length;
                    for (var i = 0; i < controlLength; i++) {

                        var control = controls[i];
                        var controlName = control.replace('uEdit', '')
                        $('.uEdit-control-list .uEdit-control-container').append('<div class="uEdit-control" data-menu="true" data-controlType="' + control + '">' + controlName + '</a>');

                    }

                    $(".uEdit-control-list .uEdit-control").draggable({
                        appendTo: "body",
                        connectToSortable: ".uEdit-area",
                        helper: function (a, b) {
                            return $('<div class="uEdit-ui-helper">' + $(a.target).attr('data-controlType') + '</div>');
                        },
                        refreshPositions: true
                    });

                }

            });

            $('body').on('click', '.uEdit-action-delete', function (e) {
                e.preventDefault();

                app.utils.RenderProgressLoader();

                var widget = $(this).closest('.uEdit-control');

                var area = $(this).closest('.uEdit-area');
                var areaAlias = area.attr('data-area');
                var controlId = widget.attr('data-controlId');
                var controlType = widget.attr('data-controlType');
                var pageId = area.attr('data-pageId');
                var areaPosition = area.attr('data-position');

                if (areaPosition != '' && areaPosition !== undefined) {
                    areaAlias = areaAlias + '-' + areaPosition;
                }

                $.ajax({
                    type: "POST",
                    url: '/Umbraco/uEdit/uEdit/DeleteControlFromArea?areaAlias=' + areaAlias + '&controlId=' + controlId + '&pageId=' + pageId + '&controlType=' + controlType,
                    success: function (json) {

                        widget.remove();

                        if (area.find('.uEdit-control').length <= 0) {
                            area.append('<div class="uEdit-placeholder">Drag control here</div>');
                        }

                        var widgets = area.find('.uEdit-control');
                        var i = 0;

                        $(widgets).each(function (i) {

                            $(this).attr('data-position', i);

                            i++;
                        });

                        app.utils.RenderPublish();
                        app.utils.RemoveProgressLoader();
                    },
                    error: function (a, b, c) {

                    }
                });

            });

            $('body').on('click', '.uEdit-action-edit', function (e) {

                e.preventDefault();

                var control = $(this).closest('.uEdit-control');
                var controlId = control.attr('data-controlId');
                var area = $(this).closest('.uEdit-area').attr('data-area');
                var pageId = $(this).closest('.uEdit-area').attr('data-pageId');

                me.editable(controlId, control.find('.uEdit-inline-edit'), area, pageId);

            });

            $('body').on('click', '.uEdit-action-publish', function (e) {
                e.preventDefault();

                var me = $(this);

                me.attr('disabled', 'disabled');
                me.text('...');
                $.ajax({
                    type: "POST",
                    url: '/Umbraco/uEdit/uEdit/Publish?pageId=' + $('input[name=uEditPageId]').val(),
                    success: function (json) {

                        me.removeAttr('disabled');
                        $('.uEdit-action-wrapper').fadeOut(function () {
                            $(this).remove();
                        });
                    },
                    error: function (a, b, c) {

                    }
                });

            });

            $('body').on('change', '.uEdit-macro-select', function (e) {
                e.preventDefault();

                var me = $(this);
                var val = me.val();

                $('.uEdit-properties-wrapper').html('');

                $('.uEdit-control-edit input[name=macro]').val('');

                if (val != '') {

                    app.modules.macro.renderProperties(val, me, '', me.find('option:selected').attr('data-macroAlias'));

                }

            });

            $('body').on('click', '.uEdit-template-new', function (e) {
                e.preventDefault();

                var contentOverlay = $('<div class="uEdit-content-overlay"><div class="container"></div></div>').hide();

                var editor = $('<div class="uEdit-editor-wrapper"><label for="uEdit-code-name">Name</label><input type="text" name="uEdit-code-name" id="uEdit-code-name" /> <textarea name="uEdit-codeEditor" id="uEdit-codeEditor" style="width:100%; height:500px;"></textarea><div class="uEdit-editor-controls"><button type="button" class="uEdit-btn uEdit-btn-primary">Save</button><button type="button" class="uEdit-btn uEdit-btn-secondary">Cancel</button></div></div>');

                contentOverlay.find('.container').append(editor);

                $('body').append(contentOverlay.fadeIn());

                var myCodeMirror = CodeMirror.fromTextArea(document.getElementById("uEdit-codeEditor"), {
                    mode: "htmlmixed",
                    lineNumbers: true,
                    lineWrapping: true,
                    tabSize: 4,
                    matchBrackets: true,
                    styleActiveLine: true
                });

                app.modules.setMode(myCodeMirror, 'xml');
                app.modules.setMode(myCodeMirror, 'javascript');
                app.modules.setMode(myCodeMirror, 'css');
                app.modules.setMode(myCodeMirror, 'htmlmixed');

                myCodeMirror.getDoc().setValue('@inherits Umbraco.Web.Mvc.UmbracoViewPage<dynamic>');

                myCodeMirror.setSize("100%", 500);

                $(editor).on('click', '.uEdit-btn-primary', function (e) {
                    e.preventDefault();

                    var me = $(this);

                    $.ajax({
                        type: "POST",
                        url: '/Umbraco/uEdit/uEdit/CreateTemplate',
                        data: { content: myCodeMirror.getValue(), name: $('#uEdit-code-name').val(), controlType: $('.uEdit-control-save input[name=controlType]').val() },
                        success: function (json) {

                            me.removeAttr('disabled');

                            if (json.success) {

                                $('.uEdit-control-group #template').html('<option value="">Select emplate</option>');

                                $(json.templates).each(function (i) {

                                    var selected = "";

                                    if ($('#uEdit-code-name').val() == this.name) {
                                        selected = 'selected="selected"';
                                    }

                                    $('.uEdit-control-group #template').append('<option value="' + this.path + '" ' + selected + '>' + this.name + '</option>');

                                });

                                $('.uEdit-content-overlay').fadeOut(function () {
                                    $(this).remove();
                                });

                            } else {
                                alert(json.message);
                            }

                        },
                        error: function (a, b, c) {
                            me.removeAttr('disabled');
                        }
                    });

                });

                $(editor).on('click', '.uEdit-btn-secondary', function (e) {
                    e.preventDefault();

                    $('.uEdit-content-overlay').fadeOut(function () {
                        $(this).remove();
                    });

                });
  
            });

            $('body').on('click', '.uEdit-macro-editTemplate', function (e) {
                e.preventDefault();

                if ($('.uEdit-control-group #select-macro').val() != '') {

                    var contentOverlay = $('<div class="uEdit-content-overlay"><div class="container"></div></div>').hide();

                    var editor = $('<div class="uEdit-editor-wrapper"><label for="uEdit-code-name">Name</label><input type="text" name="uEdit-code-name" id="uEdit-code-name" value="' + $('.uEdit-control-group #select-macro option:selected').text() + '" /> <textarea name="uEdit-codeEditor" id="uEdit-codeEditor" style="width:100%; height:500px;"></textarea><div class="uEdit-editor-controls uEdit-clearfix"><button type="button" class="uEdit-btn uEdit-btn-primary uEdit-left">Save</button><button type="button" class="uEdit-btn uEdit-btn-secondary uEdit-left">Cancel</button></div></div>');

                    contentOverlay.find('.container').append(editor);

                    $('body').append(contentOverlay.fadeIn());

                    var myCodeMirror = CodeMirror.fromTextArea(document.getElementById("uEdit-codeEditor"), {
                        mode: "htmlmixed",
                        lineNumbers: true,
                        lineWrapping: true,
                        tabSize: 4,
                        matchBrackets: true,
                        styleActiveLine: true
                    });

                    app.modules.setMode(myCodeMirror, 'xml');
                    app.modules.setMode(myCodeMirror, 'javascript');
                    app.modules.setMode(myCodeMirror, 'css');
                    app.modules.setMode(myCodeMirror, 'htmlmixed');

                    $.ajax({
                        type: "POST",
                        url: '/Umbraco/uEdit/uEdit/GetMacroTemplateValue',
                        data: { id: $('.uEdit-control-group #select-macro').val() },
                        success: function (json) {
                            myCodeMirror.getDoc().setValue(json.content);
                        }
                    });

                    myCodeMirror.setSize("100%", 500);

                    $(editor).on('click', '.uEdit-btn-primary', function (e) {
                        e.preventDefault();

                        var me = $(this);

                        me.attr('disabled', 'disabled');

                        $.ajax({
                            type: "POST",
                            url: '/Umbraco/uEdit/uEdit/SaveMacroTemplate',
                            data: { content: myCodeMirror.getValue(), id: $('.uEdit-control-group #select-macro').val(), },
                            success: function (json) {

                                me.removeAttr('disabled');

                                if (json.success) {

                                    location.reload();

                                } else {
                                    alert(json.message);
                                }

                            },
                            error: function (a, b, c) {
                                me.removeAttr('disabled');
                            }
                        });

                    });

                    $(editor).on('click', '.uEdit-btn-secondary', function (e) {
                        e.preventDefault();

                        $('.uEdit-content-overlay').fadeOut(function () {
                            $(this).remove();
                        });

                    });


                } else {
                    alert('No template selected');
                }

            });

            $('body').on('click', '.uEdit-template-edit', function (e) {
                e.preventDefault();

                if ($('.uEdit-control-group #template').val() != '') {

                    var contentOverlay = $('<div class="uEdit-content-overlay"><div class="container"></div></div>').hide();

                    var editor = $('<div class="uEdit-editor-wrapper"><label for="uEdit-code-name">Name</label><input type="text" name="uEdit-code-name" id="uEdit-code-name" value="' + $('.uEdit-control-group #template option:selected').text() + '" /> <textarea name="uEdit-codeEditor" id="uEdit-codeEditor" style="width:100%; height:500px;"></textarea><div class="uEdit-editor-controls uEdit-clearfix"><button type="button" class="uEdit-btn uEdit-btn-primary uEdit-left">Save</button><button type="button" class="uEdit-btn uEdit-btn-secondary uEdit-left">Cancel</button><button type="button" class="uEdit-btn uEdit-btn-danger uEdit-right">Delete</button></div></div>');

                    contentOverlay.find('.container').append(editor);

                    $('body').append(contentOverlay.fadeIn());

                    var myCodeMirror = CodeMirror.fromTextArea(document.getElementById("uEdit-codeEditor"), {
                        mode: "htmlmixed",
                        lineNumbers: true,
                        lineWrapping: true,
                        tabSize: 4,
                        matchBrackets: true,
                        styleActiveLine: true
                    });

                    app.modules.setMode(myCodeMirror, 'xml');
                    app.modules.setMode(myCodeMirror, 'javascript');
                    app.modules.setMode(myCodeMirror, 'css');
                    app.modules.setMode(myCodeMirror, 'htmlmixed');

                    $.ajax({
                        type: "POST",
                        url: '/Umbraco/uEdit/uEdit/GetTemplateValue',
                        data: { path: $('.uEdit-control-group #template').val() },
                        success: function (json) {
                            myCodeMirror.getDoc().setValue(json.content);
                        }
                    });

                    myCodeMirror.setSize("100%", 500);

                    $(editor).on('click', '.uEdit-btn-primary', function (e) {
                        e.preventDefault();

                        var me = $(this);

                        me.attr('disabled','disabled');

                        $.ajax({
                            type: "POST",
                            url: '/Umbraco/uEdit/uEdit/SaveTemplate',
                            data: { content: myCodeMirror.getValue(), name: $('#uEdit-code-name').val(), controlType: $('.uEdit-control-save input[name=controlType]').val() },
                            success: function (json) {

                                me.removeAttr('disabled');

                                if (json.success) {

                                    $('.uEdit-control-group #template').html('<option value="">Select emplate</option>');

                                    $(json.templates).each(function (i) {

                                        var selected = "";

                                        if ($('#uEdit-code-name').val() == this.name) {
                                            selected = 'selected="selected"';
                                        }

                                        $('.uEdit-control-group #template').append('<option value="' + this.path + '" ' + selected + '>' + this.name + '</option>');

                                    });

                                    $('.uEdit-content-overlay').fadeOut(function () {
                                        $(this).remove();
                                    });

                                } else {
                                    alert(json.message);
                                }

                            },
                            error: function (a, b, c) {
                                me.removeAttr('disabled');
                            }
                        });

                    });

                    $(editor).on('click', '.uEdit-btn-secondary', function (e) {
                        e.preventDefault();

                        $('.uEdit-content-overlay').fadeOut(function () {
                            $(this).remove();
                        });

                    });

                    $(editor).on('click', '.uEdit-btn-danger', function (e) {
                        e.preventDefault();

                        var me = $(this);

                        me.attr('disabled', 'disabled');

                        $.ajax({
                            type: "POST",
                            url: '/Umbraco/uEdit/uEdit/DeleteTemplate',
                            data: { path: $('.uEdit-control-group #template').val(), controlType: $('.uEdit-control-save input[name=controlType]').val() },
                            success: function (json) {

                                me.removeAttr('disabled');

                                if (json.success) {

                                    $('.uEdit-control-group #template').html('<option value="">Select emplate</option>');

                                    $(json.templates).each(function (i) {

                                        $('.uEdit-control-group #template').append('<option value="' + this.path + '">' + this.name + '</option>');

                                    });

                                    $('.uEdit-content-overlay').fadeOut(function () {
                                        $(this).remove();
                                    });

                                } else {
                                    alert('Server error');
                                }

                            },
                            error: function (a, b, c) {
                                me.removeAttr('disabled');
                            }
                        });

                    });


                } else {
                    alert('No template selected');
                }

            });

            $('body').on('click', '.uEdit-content-edit-advanced', function (e) {
                e.preventDefault();

                var contentOverlay = $('<div class="uEdit-content-overlay"><div class="container"></div></div>').hide();

                var editor = $('<div class="uEdit-editor-wrapper"><textarea name="uEdit-advanced-content" id="uEdit-advanced-content" style="width:100%; height:500px;"></textarea><div class="uEdit-editor-controls"><button type="button" class="uEdit-btn uEdit-btn-primary">Save</button><button type="button" class="uEdit-btn uEdit-btn-secondary">Cancel</button></div></div>');

                $(editor).on('click', '.uEdit-btn-secondary', function (e) {
                    e.preventDefault();

                    $('.uEdit-content-overlay').fadeOut(function () {
                        $(this).remove();
                    });

                });

                $(editor).on('click', '.uEdit-btn-primary', function (e) {
                    e.preventDefault();

                    var data = tinymce.get('uEdit-advanced-content').getContent();

                    tinymce.get('uEdit-editor-simple').setContent(data);

                    $('.uEdit-content-overlay').fadeOut(function () {

                        $(this).remove();

                    });

                });

                contentOverlay.find('.container').append(editor);

                $('body').append(contentOverlay.fadeIn());

                var baseLineConfigObj = {
                    selector: "textarea#uEdit-advanced-content",
                    mode: "exact",
                    skin: "umbraco",
                    menubar: false,
                    statusbar: false,
                    relative_urls: false,
                    force_p_newlines: 'false',
                    remove_linebreaks: false,
                    force_br_newlines: true,
                    apply_source_formatting: true,
                    remove_trailing_nbsp: false,
                    image_dimensions: false,
                    init_instance_callback: function (editor) {
                        app.modules.media.uEditResizeImage(editor);
                    },
                    toolbar: "code bold italic formatselect alignleft aligncenter alignright bullist umlist outdent indent link table umbmediapicker umbembeddialog umbmacro fullscreen",
                    plugins: [
                        "autolink lists link print anchor table",
                        "code fullscreen contextmenu paste codemirror"
                    ],
                    codemirror: {
                        indentOnInit: true, // Whether or not to indent code on init. 
                        path: 'CodeMirror', // Path to CodeMirror distribution
                        config: {           // CodeMirror config object
                            mode: 'htmlmixed',
                            lineNumbers: true,
                            indentUnit: 4,
                            tabSize: 4,
                        }
                    }
                };

                baseLineConfigObj.setup = function (editor) {

                    editor.addButton('umbmediapicker', {
                        icon: 'custom icon-picture',
                        tooltip: 'Media Picker',
                        onclick: function () {

                            var selectedElm = editor.selection.getNode(),
                                currentTarget;


                            if (selectedElm.nodeName === 'IMG') {
                                var img = $(selectedElm);
                                currentTarget = {
                                    name: img.attr("alt"),
                                    url: img.attr("src"),
                                    id: img.attr("rel")
                                };
                            }


                            app.modules.media.init(editor);

                            var id = -1;

                            app.modules.media.LoadMedia(id);

                        }
                    });

                };

                tinymce.init(baseLineConfigObj);

                var data = tinymce.get('uEdit-editor-simple').getContent();

                tinymce.get('uEdit-advanced-content').setContent(data);

            });



            $('body').on('click', '.uEdit-action-cancel', function (e) {
                e.preventDefault();

                var me = $(this);

                me.attr('disabled', 'disabled');
                me.text('...');

                $.ajax({
                    type: "POST",
                    url: '/Umbraco/uEdit/uEdit/Cancel?pageId=' + $('input[name=uEditPageId]').val(),
                    success: function (json) {

                        me.removeAttr('disabled');

                        location.reload();
                    },
                    error: function (a, b, c) {

                    }
                });

            });
            
            $('body').on('click', '.uEdit-columns-add', function (e) {

                e.preventDefault();

                var screens = ['xs', 'sm', 'md', 'lg'];

                var group = $(this).closest('.uEdit-control-group');

                var row = $('<div class="uEdit-control-group uEdit-control-group-columns  uEdit-clearfix">'
                           + '<select class="uEdit-gridColumns-col"></select>'
                           + '<select class="uEdit-gridColumns-screen"></select>'
                           + '<input type="text" class="uEdit-gridColumns-config"/>'
                           + '<a href="#">X</a>'
                           + '</div>');

                for (i = 1; i < 13; i++) {
                    row.find('.uEdit-gridColumns-col').append('<option value="' + i + '">' + i + '</option>');
                }

                $(screens).each(function (x, z) {
                    row.find('.uEdit-gridColumns-screen').append('<option value="' + z + '">' + z + '</option>');
                });

                group.append(row);

            });

            $('body').on('click', '.uEdit-control-group-columns a', function (e) {

                e.preventDefault();

                var group = $(this).closest('.uEdit-control-group-columns');

                group.remove();

            });

            $('body').on('click', '.uEdit-logout', function (e) {
                e.preventDefault();

                app.utils.RenderLoader();

                $.ajax({
                    type: "POST",
                    url: '/Umbraco/uEdit/uEdit/Logout',
                    success: function (json) {
                        window.location.reload();
                    },
                    error: function (a, b, c) {

                    }
                });


            });

            $('body').on('click', '.uEdit-Tab h4', function (e) {

                $(this).parent().find('.uEdit-Tab-Properties').toggle();

            });

            $('body').on('click', '.uEdit-ContentPicker-add', function (e) {
                e.preventDefault();

                app.modules.contentPicker.init();

                app.modules.contentPicker.param.$container = $(this).closest('.uEdit-control-group');

            });

            $('body').on('click', '.uEdit-ContentPicker-remove', function (e) {
                e.preventDefault();

                var $container = $(this).closest('.uEdit-control-group');

                $container.find('input').val('');
                $container.find('a').text('Add').removeClass('uEdit-ContentPicker-remove').addClass('uEdit-ContentPicker-add');
            });

        },

        settings: {

            init: function () {

                this.save();

                $('.uEdit-Page-Settings').on('click', function (e) {

                    e.preventDefault();

                    $('body').removeClass('uEdit-toggle-open');

                    var pageId = $('input[name=uEditPageId]').val();

                    $('.uEdit-control-edit').html('');

                    $.ajax({
                        type: "POST",
                        url: '/Umbraco/uEdit/uEdit/GetSettings?pageId=' + pageId,
                        success: function (json) {

                            var container = '';

                            $('.uEdit-control-edit .uEdit-control-container').remove();

                            var widgetEdit = $('<div class="uEdit-control-container"><form method="post" action="/Umbraco/uEdit/uEdit/SavePage" class="uEdit-page-save">'
                                + '<input type="hidden" name="pageId" value="' + pageId + '" />'
                                + '</form></div>');

                            $(json.tabs).each(function (i, o) {

                                container = app.modules.properties.tabBuilder(o, json.properties, widgetEdit);

                            });

                            container.find('form').append('<button type="submit" data-type="save">Save</button>');

                            $('.uEdit-control-edit').append(container);

                            var baseLineConfigObj = {
                                selector: "textarea.uEdit-editable",
                                mode: "exact",
                                skin: "umbraco",
                                menubar: false,
                                statusbar: false,
                                relative_urls: false,
                                force_p_newlines: 'false',
                                remove_linebreaks: false,
                                force_br_newlines: true,
                                apply_source_formatting: true,
                                remove_trailing_nbsp: false,
                                image_dimensions: false,
                                init_instance_callback: function (editor) {
                                    app.modules.media.uEditResizeImage(editor);
                                },
                                toolbar: "code bold italic alignleft aligncenter alignright bullist umlist outdent indent link image umbmediapicker umbembeddialog umbmacro",
                                plugins: [
                                    "autolink lists link print anchor table",
                                    "code fullscreen contextmenu paste codemirror"
                                ],
                                codemirror: {
                                    indentOnInit: true, // Whether or not to indent code on init. 
                                    path: 'CodeMirror', // Path to CodeMirror distribution
                                    config: {           // CodeMirror config object
                                        mode: 'htmlmixed',
                                        lineNumbers: true
                                    }
                                }
                            };

                            tinymce.init(baseLineConfigObj);

                            $('body').addClass('uEdit-edit-open');
                        }
                    });

                });

            },

            save: function () {

                $('body').on('submit', '.uEdit-page-save', function (e) {
                    e.preventDefault();

                    app.utils.RenderLoader();

                    var form = $(this);

                    form.find('button[type=submit]').attr('disabled', 'disabled').text('...');

                    $.ajax({
                        type: "POST",
                        url: form.attr('action'),
                        data: form.serialize(),
                        success: function (json) {

                            window.location.reload();

                        },
                        error: function (a, b, c) {
                            app.utils.RemoveLoader();
                        }
                    });
                });
            }

        },

        template: {

            init: function () {

                this.save();
                this.load();
                this.del();

                $('.uEdit-Template').on('click', function (e) {

                    e.preventDefault();

                    $('body').removeClass('uEdit-toggle-open');

                    var pageId = $('input[name=uEditPageId]').val();

                    $('.uEdit-control-edit').html('');

                    $.ajax({
                        type: "POST",
                        url: '/Umbraco/uEdit/uEdit/GetTemplates',
                        success: function (json) {

                            var templates = '';

                            $(json.items).each(function (x, z) {

                                templates = templates + '<option value="' + z.id +'">' + z.title + '</option>';

                            });

                            var container = '<div class="uEdit-control-group uEdit-clearfix">'
                                + '<label for="template">Template</label>'
                                + '<select name="template" class="uEdit-Templates-Select" id="template"><option value="">Select template</option>' + templates + '</select>'
                                + '<a href="#" class="uEdit-template-saveInsert">Create new</a><a href="#" class="uEdit-template-load">Load</a><a href="#" class="uEdit-template-delete">Delete Template</a></div>';

                            $('.uEdit-control-edit .uEdit-control-container').remove();

                            var widgetEdit = $('<div class="uEdit-control-container">'
                                + '<input type="hidden" name="pageId" value="' + pageId + '" />'
                                + '</div>');

                            $('.uEdit-control-edit').append(container);

                            $('body').addClass('uEdit-edit-open');
                        }
                    });

                });

            },

            save: function () {

                $('body').on('click', '.uEdit-template-saveInsert', function (e) {
                    e.preventDefault();

                    var content = '<div class="uEdit-control-group uEdit-clearfix uEdit-Template-CreateGroup"><label>Name</label><input type="text" class="uEdit-Template-Name" name="templateName"/><button type="button" class="uEdit-Template-SaveButton">Save</button></div>';

                    $('.uEdit-Template-CreateGroup').remove();

                    $('.uEdit-control-edit').append(content);

                });

                $('body').on('click', '.uEdit-Template-SaveButton', function (e) {

                    e.preventDefault();

                    var pageId = $('input[name=uEditPageId]').val();

                    var name = $('.uEdit-Template-Name').val();

                    if (name != '') {
                        $.ajax({
                            type: "POST",
                            url: '/Umbraco/uEdit/uEdit/InsertTemplate',
                            data: {
                                pageId: pageId,
                                title: $('.uEdit-Template-Name').val()
                            },
                            success: function (json) {
                                window.location.reload();
                            }
                        });
                    } else {
                        alert('Template name cannot be empty.');
                    }


                });

            },

            load: function () {

                $('body').on('click', '.uEdit-template-load', function (e) {

                    e.preventDefault();

                    var pageId = $('input[name=uEditPageId]').val();

                    var templateId = $('.uEdit-Templates-Select').val();

                    if (templateId != '') {
                        $.ajax({
                            type: "POST",
                            url: '/Umbraco/uEdit/uEdit/LoadTemplate',
                            data: {
                                pageId: pageId,
                                templateId: templateId
                            },
                            success: function (json) {
                                window.location.reload();
                            }
                        });
                    } else {
                        alert('No template selected.');
                    }


                });

            },

            del: function () {

                $('body').on('click', '.uEdit-template-delete', function (e) {

                    e.preventDefault();

                    var pageId = $('input[name=uEditPageId]').val();

                    var templateId = $('.uEdit-Templates-Select').val();

                    if (templateId != '') {
                        $.ajax({
                            type: "POST",
                            url: '/Umbraco/uEdit/uEdit/DeletePageTemplate',
                            data: {
                                pageId: pageId,
                                templateId: templateId
                            },
                            success: function (json) {
                                window.location.reload();
                            }
                        });
                    } else {
                        alert('No template selected.');
                    }


                });
            }

        },

        save: function () {

            $('body').on('click', '.uEdit-control-save button[type=submit]', function (e) {
                $('input[name=uEditType]').val($(this).attr('data-type'));
                app.btnsubmitText = $(this).text();
                $(this).text('...');
            });

            $('body').on('submit', '.uEdit-control-save', function (e) {
                e.preventDefault();

                app.utils.RenderLoader();

                var me = $(this);

                if ($('.uEdit-properties-wrapper').length > 0) {

                    me.find('.uEdit-control-group').each(function (i, v) {

                        var input = $(this).find('input,textarea,select');

                        var inputValue = input.val();
                        var inputAlias = input.attr('name');

                        if (inputAlias != 'select-macro') {

                            var inputMacro = $('.uEdit-control-edit input[name=macro]');
                            var inputMacroValue = $('.uEdit-control-edit input[name=macro]').val();


                            if (input.is(':checkbox')) {
                                inputValue = input.is(':checked') ? '1' : '0';
                            }

                            var re = new RegExp(inputAlias + "=(\"[^<>\"]*\"|'[^<>']*'|\w+)", "g");

                            if (inputMacroValue.indexOf(inputAlias + "=") > -1) {
                                inputMacroValue = inputMacroValue.replace(re, inputAlias + "='" + inputValue + "'")
                            } else {
                                inputMacroValue = inputMacroValue.replace("/>", inputAlias + "='" + inputValue + "' />")
                            }

                            inputMacro.val(inputMacroValue);

                        }


                    });

                }

                if ($('.uEdit-control-group-columns').length > 0) {

                    var columnsValue = "";

                    me.find('.uEdit-control-group-columns').each(function (i, v) {

                        var col = $(this).find('.uEdit-gridColumns-col').val();
                        var screen = $(this).find('.uEdit-gridColumns-screen').val();
                        var config = $(this).find('.uEdit-gridColumns-config').val();

                        columnsValue = columnsValue + (col + ":" + screen + ":" + config + ";");

                    });

                    $('.uEdit-control-edit input[name=columns]').val(columnsValue);

                }

                var form = $(this).closest('form');

                var controlId = form.find('input[name=controlId]').val();

                form.find('button[type=submit]').attr('disabled', 'disabled');

                $.ajax({
                    type: "POST",
                    url: form.attr('action'),
                    data: form.serialize(),
                    success: function (json) {

                        form.find('button[type=submit]').removeAttr('disabled');

                        var area = $('.uEdit-control[data-controlId = ' + controlId + ']').closest('.uEdit-area');

                        if (json.reload) {
                            window.location.reload();
                        } else {
                            area.replaceWith(json.controlView)

                            app.modules.droppable();

                            app.utils.RenderPublish();

                            form.find("button:contains('...')").text(app.btnsubmitText);

                            app.utils.RemoveLoader();

                        }

                    },
                    error: function (a, b, c) {
                        app.utils.RemoveLoader();
                    }
                });

            });

        },

        setMode: function (cm,mode) {

            if (mode !== undefined) {
                var script = '/Umbraco/lib/tinymce/plugins/codemirror/CodeMirror/mode/' + mode + '/' + mode + '.js';

                $.getScript(script, function (data, success) {
                    if (success) cm.setOption('mode', mode);
                    else cm.setOption('mode', 'clike');
                });
            }
            else cm.setOption('mode', 'clike');

        },

        media: {
            
            param: {
                $container: ''
            },

            init: function (editor) {
                var m = this;

                $('.uEdit-media-menu').remove();

                var menu = $('<div class="uEdit-media-menu"><div class="uEdit-media-menu-header"></div><div class="uEdit-media-menu-container"></div><div class="uEdit-media-menu-footer"></div></div>').hide();

                menu.find('.uEdit-media-menu-footer').append('<a href="#">Cancel</a>');

                menu.find('.uEdit-media-menu-header').append('<ul class="uEdit-media-breadcrumb clearfix"></ul>');

                $('body').append(menu.fadeIn());

                $('.uEdit-media-menu').on('click', '.uEdit-media-folder,.uEdit-media-breadcrumb a', function (e) {

                    e.preventDefault();

                    var me = $(this);

                    $('.uEdit-media-menu-container').fadeOut(function () {
                        $('.uEdit-media-menu-container').html('');

                        app.modules.media.LoadMedia(me.attr('data-Id'));

                    });

                });

                $('.uEdit-media-menu').on('click', '.uEdit-media-menu-footer a', function (e) {

                    e.preventDefault();

                    $('.uEdit-media-menu').fadeOut(function () {

                        $('.uEdit-media-menu').remove();

                    });

                });

                $('.uEdit-media-menu').on('click', '.uEdit-media-image', function () {

                    var me = $(this);

                    var img = me.find('img');

                    if ($('.uEdit-content-overlay').length > 0) {

                        var data = {
                            alt: '',
                            src: img.attr('data-src'),
                            rel: '',
                            id: '__mcenew'
                        };

                        editor.insertContent('<div class="img-wrapper">' + editor.dom.createHTML('img', data) +'</div>');

                        window.setTimeout(function () {

                            var imgElm = editor.dom.get('__mcenew');
                            var size = editor.dom.getSize(imgElm);

                            var newSize = app.modules.media.scaleToMaxSize(800, size.w, size.h);

                            editor.dom.setAttrib(imgElm, 'id', null);

                            var src = data.src + "?width=" + newSize.width + "&height=" + newSize.height;
                            editor.dom.setAttrib(imgElm, 'src', src);
                            editor.dom.setAttrib(imgElm, 'data-mce-src', src);

                        }, 500);

                    } else {


                        m.param.$container.find('.uEdit-image-wrapper i,.uEdit-image-wrapper img,.uEdit-image-wrapper p').remove();

                        m.param.$container.find('.uEdit-image-wrapper').append(img).addClass('uEdit-hasImage').attr('data-Id', me.attr('data-Id')).removeClass('uEdit-hasFile');
                        m.param.$container.find('input[type=hidden]').val(me.attr('data-Id'));

                    }

                    $('.uEdit-media-menu').fadeOut(function () {

                        $('.uEdit-media-menu').remove();

                    });

                });

                $('.uEdit-media-menu').on('click', '.uEdit-media-file', function () {

                    var me = $(this);

                    var img = me.find('i');
                    var text = '<p>' + me.text() + '</p>';
                    $('.uEdit-image-wrapper i,.uEdit-image-wrapper img').remove();


                    m.param.$container.find('.uEdit-image-wrapper').append(img).append(text).addClass('uEdit-hasFile').attr('data-Id', me.attr('data-Id')).removeClass('uEdit-hasImage');
                    m.param.$container.find('input[type=hidden]').val(me.attr('data-Id'));

                    $('.uEdit-media-menu').fadeOut(function () {

                        $('.uEdit-media-menu').remove();

                    });

                });

            },

            LoadMedia: function (parentId,editor) {

                $.ajax({
                    type: "POST",
                    url: '/Umbraco/uEdit/uEdit/GetMedia?id=' + parentId,
                    success: function (json) {

                        $('.uEdit-media-breadcrumb').html('<li><a href="#" data-Id="-1">Media</a></li>');

                        $(json.history).each(function (i, v) {

                            $('.uEdit-media-breadcrumb').append('<li><a href="#" data-Id="' + v.id + '">' + v.name + '</a></li>');

                        });

                        $(json.items).each(function (i, v) {

                            var item = "";

                            if (v.contentType == '1031') {
                                item = '<div class="uEdit-media-folder uEdit-media-item" data-Id="' + v.id + '"><i class="uEdit-icon-folder"></i> ' + v.text + '</div>';
                            }

                            if (v.contentType == '1032') {
                                item = '<div class="uEdit-media-image uEdit-media-item" data-Id="' + v.id + '"><img src="/umbraco/backoffice/UmbracoApi/Images/GetBigThumbnail?originalImagePath=' + v.src + '" alt="' + v.text + '" title="' + v.text + '" data-src="' + v.src + '"/></div>';
                            }

                            if (v.contentType == '1033') {
                                item = '<div class="uEdit-media-file uEdit-media-item" data-Id="' + v.id + '"><i class="uEdit-icon-document"></i> ' + v.text + '</div>';
                            }

                            $('.uEdit-media-menu-container').append(item).fadeIn();

                        });

                    },
                    error: function (a, b, c) {

                    }
                });

            },

            scaleToMaxSize: function (maxSize, width, height) {
                var retval = { width: width, height: height };

                var maxWidth = maxSize; // Max width for the image
                var maxHeight = maxSize;    // Max height for the image
                var ratio = 0;  // Used for aspect ratio

                // Check if the current width is larger than the max
                if (width > maxWidth) {
                    ratio = maxWidth / width;   // get ratio for scaling image

                    retval.width = maxWidth;
                    retval.height = height * ratio;

                    height = height * ratio;    // Reset height to match scaled image
                    width = width * ratio;    // Reset width to match scaled image
                }

                // Check if current height is larger than max
                if (height > maxHeight) {
                    ratio = maxHeight / height; // get ratio for scaling image

                    retval.height = maxHeight;
                    retval.width = width * ratio;
                    width = width * ratio;    // Reset width to match scaled image
                }

                return retval;
            },

            uEditResizeImage: function(editor) {
            
                var me = this;

                editor.on('mouseup', function (e) {

                    var mySelection = editor.selection.getNode();

                    if (mySelection.tagName == "IMG") {

                        if (mySelection.src.indexOf("width") != -1) {

                            setTimeout(
                                me.fixSize(mySelection,editor),
                                100
                            );
                        }
                    }

                });

            },

            fixSize: function (el,editor) {
                newWidth = el.width;
                newHeight = el.height;
                newUrl = el.src.replace(/width=[0-9]+/,"width="+newWidth);
                newUrl = newUrl.replace(/height=[0-9]+/,"height="+newHeight);

                editor.dom.setAttrib(el, 'src', newUrl);
            }

        },

        contentPicker: {

            param: {
                $container: ''
            },

            event: function() {

                $('body').on('click','.uEdit-plus', function () {

                    var contentId = $(this).next().attr('data-contentId');
                    var $container = $(this).parent();

                    if ($container.find(' > ul').length > 0) {
                        $container.toggleClass('uEdit-open');
                    } else {

                        $container.addClass('uEdit-open');

                        $.ajax({
                            type: "POST",
                            url: '/Umbraco/uEdit/uEdit/GetContent',
                            data: {
                                pageId: contentId
                            },
                            success: function (json) {

                                var list = $('<ul></ul>');

                                $(json.pages).each(function (index, item) {
                                    list.append('<li class="' + (item.hasChildren ? 'uEdit-hasChildren' : 'uEdit-hasNoChildren') + '">' + (item.hasChildren ? '<div class="uEdit-plus"></div>' : '') + '<a href="#" data-contentId=' + item.id + '>' + item.name + '</a></li>');
                                });
                                console.log("about to render content picker");
                                $container.append(list);

                            }
                        });

                    }

                });

            },

            init: function () {
                var me = this;

                $('.uEdit-media-menu').remove();

                var cancel = $('<a href="#">Cancel</a>').on('click', function (e) {

                    e.preventDefault();

                    $('.uEdit-media-menu').fadeOut(function () {

                        $('.uEdit-media-menu').remove();

                    });

                });

                var menu = $('<div class="uEdit-media-menu"><div class="uEdit-content-menu-container"></div><div class="uEdit-media-menu-footer"></div></div>').hide();

                menu.find('.uEdit-media-menu-footer').append(cancel);

                $('body').on('click', '.uEdit-Content-Tree a', function (e) {
                    e.preventDefault();

                    me.param.$container.find('input').val($(this).attr('data-contentId'));
                    me.param.$container.find('a').text($(this).text()).removeClass('uEdit-ContentPicker-add').addClass('uEdit-ContentPicker-remove');

                    $('.uEdit-media-menu').fadeOut(function () {

                        $('.uEdit-media-menu').remove();

                    });

                });


                $.ajax({
                    type: "POST",
                    url: '/Umbraco/uEdit/uEdit/GetContent',
                    data: {
                        pageId: 0
                    },
                    success: function (json) {

                        var list = $('<ul class="uEdit-Content-Tree"></ul>');

                        $(json.pages).each(function (index, item) {
                            list.append('<li class="' + (item.hasChildren ? 'uEdit-hasChildren' : 'uEdit-hasNoChildren') + '">' + (item.hasChildren ? '<div class="uEdit-plus"></div>' : '')  + '<a href="#" data-contentId=' + item.id + '>' + item.name + '</a></li>');
                        });

                        menu.find('.uEdit-content-menu-container').append(list);

                        $('body').append(menu.fadeIn());
                    }
                });

            }

        },

        macro: {

            renderProperties: function (macroId, select, macro, macroAlias) {

                $.ajax({
                    type: "POST",
                    url: '/Umbraco/uEdit/uEdit/GetMacroProperty?id=' + macroId,
                    success: function (json) {

                        if (macro == '') {
                            $('.uEdit-control-edit input[name=macro]').val("<?UMBRACO_MACRO macroAlias='" + macroAlias + "' />");
                        }

                        var propWrapper = $('<div class="uEdit-properties-wrapper"></div>');

                        $(json.properties).each(function (i, v) {

                            var inputValue = $('.uEdit-control-edit input[name=macro]').val();

                            var macroAttributeValue = '';

                            if (macro != '') {

                                var re = new RegExp(json.properties[i].macroPropertyAlias + "=(\"[^<>\"]*\"|'[^<>']*'|\w+)", "g");
                                var match = re.exec(macro);

                                if (match != null) {
                                    macroAttributeValue = match[1].replace(/"/g, '');
                                }

                            } else {
                                $('.uEdit-control-edit input[name=macro]').val(inputValue.replace('/>', ' ' + json.properties[i].macroPropertyAlias + "='' />"));
                            }

                            var $property = app.modules.properties.builder(json.properties[i].editorAlias, json.properties[i].macroPropertyAlias, json.properties[i].macroPropertyName, macroAttributeValue);

                            propWrapper.append($property);

                        });

                        propWrapper.insertAfter(select);
                    },
                    error: function (a, b, c) {

                    }
                });

            }

        },

        properties: {

            builder: function (contentType, alias, name, value) {

                var property = $('');

                if (contentType == 'Umbraco.TextboxMultiple') {

                    property = $('<div class="uEdit-control-group uEdit-clearfix">'
                     + '<label for="' + alias + '">' + name + '</label>'
                     + '<textarea name="' + alias + '" rows="6" id="' + alias + '">' + value + '</textarea>'
                     + '</div>');

                } else if (contentType == 'Umbraco.Textbox') {

                    property = $('<div class="uEdit-control-group uEdit-clearfix">'
                        + '<label for="' + alias + '">' + name + '</label>'
                        + '<input type="text" name="' + alias + '" id="' + alias + '" value="' + value + '" />'
                        + '</div>');

                } else if (contentType == 'Umbraco.ContentPickerAlias') {

                    var contentValue = 'Add';

                    property = $('<div class="uEdit-control-group uEdit-clearfix">'
                        + '<label for="' + alias + '">' + name + '</label>'
                        + '<a href="#" class="uEdit-ContentPicker ' + (value != '' ? 'uEdit-ContentPicker-remove' : 'uEdit-ContentPicker-add') + '" >' + contentValue + '</a>'
                        + '<input type="hidden" name="' + alias + '" id="' + alias + '" value="' + value + '" />'
                        + '</div>');

                    if (value != '') {

                        $.ajax({
                            type: "POST",
                            url: '/Umbraco/uEdit/uEdit/GetContentItem?id=' + value,
                            success: function (json) {
                                property.find('a').text(json.name);
                            },
                            error: function (a, b, c) {
                                console.log("Dafuq?");
                            }
                        });

                    }

                } else if (contentType == 'Umbraco.TrueFalse') {

                    var checked = '';

                    if (value != null && value == 1) {
                        checked = 'checked="checked"';
                    }

                    property = $('<div class="uEdit-control-group uEdit-clearfix uEdit-control-checkbox">'
                        + '<label for="' + alias + '">'
                        + '<input type="checkbox" name="' + alias + '" id="' + alias + '" ' + checked + '/>'
                        + name
                        + '</label>'
                        + '</div>');

                } else if (contentType == 'Umbraco.TinyMCEv3') {

                    property = $('<div class="uEdit-control-group uEdit-clearfix">'
                        + '<label for="' + alias + '">' + alias + '  <a href="#" class="uEdit-content-edit-advanced" style="float:right;">Advanced</a></label>'
                        + '<textarea class="uEdit-editable" name="' + alias + '" id="uEdit-editor-simple" rows="7">' + value + '</textarea>'
                        + '</div>');

                } else if (contentType == 'Umbraco.MediaPicker') {
                
                    property = $('<div class="uEdit-control-group uEdit-clearfix">'
                        + '<label for="' + alias + '">' + alias + '</label>'
                        + '<input type="hidden" name="' + alias + '" id="' + alias + '" value="' + value + '" />'
                        + '<div class="uEdit-image-wrapper" data-Id="' + value + '"><i class="uEdit-icon uEdit-icon-add"></i></div>'
                        + '</div>');

                    if (value != '') {

                        $.ajax({
                            type: "POST",
                            url: '/Umbraco/uEdit/uEdit/GetMediaItem?id=' + value,
                            success: function (json) {

                                property.find('.uEdit-image-wrapper p').remove();

                                if (json.type == 'image') {
                                    var img = '<img src="/umbraco/backoffice/UmbracoApi/Images/GetBigThumbnail?originalImagePath=' + json.src + '" alt="' + json.name + '" title="' + json.name + '"/>';

                                    property.find('.uEdit-image-wrapper').addClass('uEdit-hasImage').removeClass('uEdit-hasFile').append(img);
                                }
                                if (json.type == 'file') {
                                    var file = '<i class="uEdit-icon-document"></i><p>' + json.name + '</p>';

                                    property.find('.uEdit-image-wrapper').addClass('uEdit-hasFile').removeClass('uEdit-hasImage').append(file);
                                }

                            },
                            error: function (a, b, c) {

                            }
                        });

                    }

                    property.find('.uEdit-image-wrapper').on('click', function (e) {
                        e.preventDefault();

                        app.modules.media.param.$container = $(this).closest('.uEdit-control-group');

                        app.modules.media.init();

                        var id = -1;

                        if ($(this).attr('data-Id') != '') {
                            id = $(this).attr('data-Id');
                        }

                        app.modules.media.LoadMedia(id);

                    });

                } else {
                    property = $('<div class="uEdit-control-group uEdit-clearfix">'
                        + '<label for="' + alias + '">' + name + '</label>'
                        + '<input type="text" name="' + alias + '" id="' + alias + '" value="' + value + '" />'
                        + '</div>');
                }


                return property;
            },
            tabBuilder: function (tabObject, tabProperties, container) {

                var $tabContainer = $('<div class="uEdit-Tab"><h4>' + tabObject.Name + '</h4><div class="uEdit-Tab-Properties"></div></div>');

                $(tabObject.PropertyTypes).each(function (index, o) {

                    var propertyEditorAlias = o.PropertyEditorAlias;
                    var propertyAlias = o.Alias;
                    var propertyName = o.Name;
                    var propertyValue = "";

                    for (var i = 0; i < tabProperties.length; i++) {

                        if (tabProperties[i].Alias == propertyAlias) {
                            propertyValue = tabProperties[i].Value;
                        }
                    }

                    if (!propertyValue) {
                        propertyValue = '';
                    }

                    var $property = app.modules.properties.builder(propertyEditorAlias, propertyAlias, propertyName, propertyValue);

                    $tabContainer.find('.uEdit-Tab-Properties').append($property);

                });

                container.find('form').append($tabContainer);

                return container;

            }
        }

    };

    app.utils = {

        RenderPublish: function () {

            if ($('.uEdit-action-publish').length <= 0) {
                $('body').append('<div class="uEdit-action-wrapper"><a href="#" class="uEdit-action-cancel">Cancel</a><a href="#" class="uEdit-action-publish">Publish page</a></div>');
            }

        },

        RenderLoader: function () {
            $('body').append('<div class="uEdit-loader"></div>');
        },

        RenderProgressLoader: function () {
            if ($('.uEdit-progress-loader').length <= 0) {
                $('body').append('<div class="uEdit-progress-loader"></div>');
            }
            
        },

        RemoveProgressLoader: function () {
            $('.uEdit-progress-loader').fadeOut(function () {
                $(this).remove();
            });
        },

        RemoveLoader: function () {
            $('.uEdit-loader').fadeOut(function () {
                $(this).remove();
            });
        }

    };


    // initializer
    // -----------
    app.initialize = (function () {

        app.modules.init();

        // globalize scope 
        uEditApplication = app;

    }());
};


var checkReady = function () {
    if (window.jQuery) {

        if (window.jQuery.ui) {
            uEditApplication();
        } else {
            window.setTimeout(function () { checkReady(); }, 100);
        }
    }
    else {
        window.setTimeout(function () { checkReady(); }, 100);
    }
};

checkReady();