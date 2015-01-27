/*
 * Поиск информации об элементе в строке
 */

var DIRJS = {};

DIRJS.getPathname = function() {
    var pathname = window.location.pathname;
    return pathname = pathname.replace(/^\/|\/$/g, '');
};


DIRJS.getElementInfo = function(el) {
    var strdiv = $(el).parent().closest('div').parent();
    var item = strdiv.find(".name").text();
    var type = $(el).parent().closest('div').parent().attr('class');
    var res = new Object();
    res.item = item;
    res.type = type;
    return res;
};

DIRJS.initParentRef = function() {
    var url = window.location.href;
    var pathname = DIRJS.getPathname();
    if (!url.match("/$"))
        url += "/";
    if (pathname == "")
    {
        $(".parent").hide();
        //$(".home").removeAttr("href");
    }
    else
    {
        result = url.replace(/\/[^\/]+\/?$/ig, "");
        $(".parent").attr('href', result);
    }
};

DIRJS.clearCookies = function() {
    $.cookie("username", null, {path: '/'});
    $.cookie("password", null, {path: '/'});
};

DIRJS.isLoggedIn = function() {
    if (typeof $.cookie('username') === 'undefined' || $.cookie('username') == 'null') {
        DIRJS.hideAll();
    }
    else
    {
        DIRJS.showAll();
    }
};

DIRJS.hideAll = function() {
    $(".rename").hide();
    $(".create").hide();
    $(".remove").hide();
    $(".upload").hide();
    $(".flag").hide();
    $("#logout").hide();
    $("#login").show();
};

DIRJS.showAll = function() {
    $(".rename").show();
    $(".create").show();
    $(".remove").show();
    $(".upload").show();
    $(".flag").show();
    $("#logout").show();
    $("#login").hide();
};

DIRJS.copyToClipboard = function(text) {
    window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
};

DIRJS.loadFolderList = function() {
    $.post('/ajax_handler.php', {fold: DIRJS.pathname, action: "LIST"}, function(data) {
        if (data !== 'null') {
            var obj = jQuery.parseJSON(data);
            $.each(obj, function(key, value) {
                var arr = value.size.split(' ');
                if (arr[1] === undefined)
                    arr[1] = " ";
                var url = window.location.href;
                if (!url.match("/$"))
                    url += "/";
                var link = url + encodeURIComponent(value.item);
                if (value.type === 'folder')
                {

                    var add_html = '<div class="odd">' +
                            '<div class="cell flag">' +
                            '<input id="checkbox-' + value.item + '" class="checkbox" type="checkbox" name="">  ' +
                            '<label for="checkbox-' + value.item + '"></label> ' +
                            '</div>' +
                            '<div class="cell name"><a class="folder" href="' + link + '" >' + value.item + '</a></div>' +
                            '<div class="cell manage">' +
                            '<a class="clipboard tooltip"  data-title="Копировать ссылку в буфер обмена"></a><a class="rename tooltip"  data-title="Переименовать"></a>' +
                            '</div>' +
                            '<div class="cell size"><span>' + arr[0] + '</span> ' + arr[1] + '</div>' +
                            '<div class="cell date">' + value.time + '</div>' +
                            '</div>';

                }
                else {

                    var add_html = '<div class="even">' +
                            '<div class="cell flag">' +
                            '<input id="checkbox-' + value.item + '" class="checkbox" type="checkbox" name="">  ' +
                            '<label for="checkbox-' + value.item + '"></label> ' +
                            '</div>' +
                            '<div class="cell name"><a class="file" href="' + link + '" >' + value.item + '</a></div>' +
                            '<div class="cell manage">' +
                            '<a class="clipboard tooltip"  data-title="Копировать ссылку в буфер обмена"></a><a class="rename tooltip"  data-title="Переименовать"></a>' +
                            '</div>' +
                            '<div class="cell size"><span>' + arr[0] + '</span> ' + arr[1] + '</div>' +
                            '<div class="cell date">' + value.time + '</div>' +
                            '</div>';
                }
                $('.table').append(add_html);
            });
        }

        DIRJS.clipboardBind();

        //@TODO rename bind
        DIRJS.renameBind();
        DIRJS.isLoggedIn();
    });
};

DIRJS.createFolderBind = function() {
    //Подвязываем кнопки с действиями
    $(".create").click(function() {
        //$("#remove").css("display", "block");
        $("#create").css("display", "block");
        /*var pathname = window.location.pathname;
         pathname = pathname.replace(/^\/|\/$/g, '');
         alert(pathname);*/
    });

    $("#create_ok").click(function() {
        var pathname = DIRJS.getPathname();
        if ($(".newfolder").val() !== "") {
            $.post('/ajax_handler.php', {fold: pathname, newdir: $(".newfolder").val(), action: "CREATE"}, function(data) {
                if (data == "")
                {
                    location.reload();
                }
                else
                {
                    alert(data);
                }
            });
        }
        else
        {
            alert("Folder name cannot be emty");
        }
    });

    $("#create_cancel").click(function() {
        $("#create").css("display", "none");
    });
};

DIRJS.authBind = function() {
    //авторизация
    $(".login").click(function() {
        $.post('/ajax_handler.php', {username: $(".username").val(), password: $(".password").val(), action: "AUTH"}, function(data) {
            if (data == $(".username").val())
            {
                location.reload();
                $.cookie("username", $(".username").val(), {expires: 10, path: '/'});
                $.cookie("password", $(".password").val(), {expires: 10, path: '/'});
            }
            else
            {
                alert(data);
            }
        });
    });
    //авторизация
    $(".logout").click(function() {

        DIRJS.clearCookies();
        location.reload();

    });
};


DIRJS.removeBind = function()
{
    //Подвязываем кнопки с действиями
    $(".remove").click(function() {
        if ($('.table').find('.checkbox:checked').size() > 0) {
            $("#remove").css("display", "block");
        } else
        {
            alert("Choose file/folder before");
        }
    });
    $("#remove_ok").click(function() {
        var pathname = DIRJS.getPathname();

        $.each($('.table').find('.checkbox:checked'), function(key, value) {

            var el = DIRJS.getElementInfo(value);
            var to_delete = el.item
            if (!pathname == "")
                to_delete = pathname + "/" + el.item;
            $.post('/ajax_handler.php', {item: to_delete, action: "REMOVE"}, function(data) {
                if (data == "")
                {
                    location.reload();
                }
                else
                {
                    alert(data);
                }
            });
        });

    });
    $("#remove_cancel").click(function() {
        $("#remove").css("display", "none");
    });
};


DIRJS.clipboardBind = function() {
    var copy_sel = $('.clipboard');
    // Disables other default handlers on click (avoid issues)
    copy_sel.on('click', function(e) {
        e.preventDefault();
    });
    // Apply clipboard click event
    copy_sel.clipboard({
        path: '/js/jquery.clipboard.swf',
        copy: function() {
            var this_sel = $(this);
            // Hide "Copy" and show "Copied, copy again?" message in link
            var item = DIRJS.getElementInfo(this).item;
            var url = window.location.href;
            if (!url.match("/$"))
                url += "/";
            var link = url + encodeURIComponent(item);
            // Return text in closest element (useful when you have multiple boxes that can be copied)
            return link;
        }
    });
};


DIRJS.renameBind = function() {
    //Подвязываем кнопки с действиями
    $(".rename").click(function() {
        var el = DIRJS.getElementInfo(this);
        var item = el.item;
        $(".original").html(item);
        $(".new").val(item);
        //var pathname = DIRJS.getPathname();
        $("#rename").css("display", "block");
        //alert(pathname + " " + item);
    });
    $("#rename_ok").click(function() {
        var pathname = DIRJS.getPathname();
        var item = $(".new").val();
        if (item !== "") {
            $.post('/ajax_handler.php', {fold: pathname, olditem: $(".original").html(), newitem: item, action: "RENAME"}, function(data) {
                if (data == "")
                {
                    location.reload();
                }
                else
                {
                    alert(data);
                }
            });
        }
        else
        {
            alert("New name cannot be emty");
        }

    });
    $("#rename_cancel").click(function() {
        $("#rename").css("display", "none");
    });
};

DIRJS.uploaderBind = function()
{
    var uploader = new ss.SimpleUpload({
        button: 'upload-btn', // file upload button
        url: '/uploadHandler.php', // server side handler
        //progressUrl: 'uploadProgress.php', // enables cross-browser progress support (more info below)
        name: 'uploadfile', // upload parameter name        
        responseType: 'json',
        allowedExtensions: ['jpg', 'jpeg', 'png', 'gif', 'zip', '7z', 'rar', 'exe'],
        maxSize: 1024 * 100, // kilobytes
        multiple: true,
        hoverClass: 'ui-state-hover',
        focusClass: 'ui-state-focus',
        disabledClass: 'ui-state-disabled',
        data: {'fold1': DIRJS.getPathname()},
        onSubmit: function(filename, extension) {
            if ($.inArray(extension, this.allowedExtensions))
            {

            }
        },
        onSizeError: function(filename, fileSize) {
            alert("Файл слишком большой");
        },
        onExtError: function(filename, extension) {
            alert("Недопустимое разрешение файла");
        },
        onComplete: function(filename, response) {
            if (!response) {
                alert(filename + 'upload failed');
                return false;
            }
            if (response.success == true)
            {
                location.reload();
            }
            else
            {
                alert('Произошла ошибка при загрузке файла' + response.msg);
            }

            // do something with response...
        }
    });
};

DIRJS.init = function()
{
    DIRJS.pathname = DIRJS.getPathname();
    DIRJS.isLoggedIn();
    DIRJS.initParentRef();
    DIRJS.loadFolderList();
    DIRJS.authBind();
    DIRJS.createFolderBind();
    DIRJS.removeBind();
    DIRJS.uploaderBind();
};

$(document).ready(function() {
    DIRJS.init();

});