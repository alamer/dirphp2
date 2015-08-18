/*
 * Поиск информации об элементе в строке
 */

var DIRJS = {};

DIRJS.getPathname = function () {
    var pathname = window.location.pathname;
    return pathname.replace(/^\/|\/$/g, '');
};


DIRJS.getElementInfo = function (el) {
    var strdiv = $(el).parent().closest('div').parent();
    var item = strdiv.find(".name").text();
    var type = $(el).parent().closest('div').parent().attr('class');
    var res = new Object();
    res.item = item;
    res.type = type;
    return res;
};

DIRJS.initParentRef = function () {
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

DIRJS.clearCookies = function () {
    $.cookie("username", null, {path: '/'});
    $.cookie("password", null, {path: '/'});
};

DIRJS.isLoggedIn = function () {
    if (typeof $.cookie('username') === 'undefined' || $.cookie('username') == 'null') {
        DIRJS.hideAll();
    }
    else
    {
        DIRJS.showAll();
    }
};

DIRJS.hideAll = function () {
    $(".rename").hide();
    $(".create").hide();
    $(".remove").hide();
    $(".upload").hide();
    $(".flag").hide();
    $("#logout").hide();
    $("#login").show();
};

DIRJS.showAll = function () {
    $(".rename").show();
    $(".create").show();
    $(".remove").show();
    $(".upload").show();
    $(".flag").show();
    $("#logout").show();
    $("#login").hide();
};

DIRJS.copyToClipboard = function (text) {
    window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
};

DIRJS.loadFolderList = function () {
    $.post('/include/ajax_handler.php', {fold: DIRJS.pathname, action: "LIST"}, function (data) {
        if (data !== 'null') {
            var obj = jQuery.parseJSON(data);
            var cnt = 0;
            $.each(obj, function (key, value) {
                cnt++;
                var arr = value.size.split(' ');
                if (arr[1] === undefined)
                    arr[1] = " ";
                var url = window.location.href;
                if (!url.match("/$"))
                    url += "/";
                var link = url + encodeURIComponent(value.item);
                var previewClass='';
                if (link.match(/\.(jpeg|jpg|gif|png)$/gi) != null)
                {
                    previewClass='preview';
                }
                var add_html = '<div class="' + (cnt % 2 === 0 ? "odd" : "even") + '">' +
                        '<div class="cell flag">' +
                        '<input id="checkbox-' + value.item + '" class="checkbox" type="checkbox" name="">  ' +
                        '<label for="checkbox-' + value.item + '"></label> ' +
                        '</div>' +

                        '<div class="cell name"><a class="' + value.type+' '+previewClass + ' " href="' + link + '" target="_self" >' + value.item + '</a></div>' +
                        '<div class="cell manage">' +
                        '<a class="clipboard tooltip"  data-title="Копировать ссылку в буфер обмена"></a><a class="rename tooltip"  data-title="Переименовать"></a>' +
                        '</div>' +
                        '<div class="cell size"><span>' + arr[0] + '</span> ' + arr[1] + '</div>' +
                        '<div class="cell date">' + value.time + '</div>' +
                        '</div>';
                $('.table').append(add_html);
            });

            var xOffset = -20;
            var yOffset = 40;

            $('.preview').on('mouseover', function (e) {
                var img = $(this);
                $("body").append("<p id='preview'><img style='max-width: 600px;max-height:500px' src='" + img.attr('href') + "' alt='Image preview' />" + "</p>");
                //alert(-e.pageY + $(window ).height());
                var offset = 0;
                if (-e.pageY + $(window).height() < 400) {
                    offset = 400;
                }
                $("#preview").css({
                    "top": (e.pageY - xOffset - offset) + "px",
                    "left": (e.pageX + yOffset) + "px",
                    'display': 'block'
                });

            });
            $('.preview').on('mouseleave', function (e) {
                $('#preview').remove();
            });
        }

        DIRJS.clipboardBind();

        //@TODO rename bind
        DIRJS.renameBind();
        DIRJS.isLoggedIn();
    });
};


DIRJS.createFolderBind = function () {
    //Подвязываем кнопки с действиями
    $(".create").click(function () {
        //$("#remove").css("display", "block");
        $("#create").css("display", "block");
        /*var pathname = window.location.pathname;
         pathname = pathname.replace(/^\/|\/$/g, '');
         alert(pathname);*/
    });

    $("#create_ok").click(function () {
        var pathname = DIRJS.getPathname();
        if ($(".newfolder").val() !== "") {
            $.post('/include/ajax_handler.php', {fold: pathname, newdir: $(".newfolder").val(), action: "CREATE"}, function (data) {
                if (data == "")
                {
                    location.reload();
                }
                else
                {
                    DIRJS.showError("Произошла ошибка </br> при создании папки", data);
                }
            });
        }
        else
        {
            DIRJS.showAlert("Имя папки не может быть пустым");
        }
    });

    $("#create_cancel").click(function () {
        $("#create").css("display", "none");
    });
};

DIRJS.authBind = function () {
    //авторизация
    $(".login").click(function () {
        $.post('/include/ajax_handler.php', {username: $(".username").val(), password: $(".password").val(), action: "AUTH"}, function (data) {
            if (data == $(".username").val())
            {
                location.reload();
                $.cookie("username", $(".username").val(), {expires: 10, path: '/'});
                $.cookie("password", $(".password").val(), {expires: 10, path: '/'});
            }
            else
            {
                DIRJS.showError("Неверные имя пользователя или пароль", "");
            }
        });
    });
    //авторизация
    $(".logout").click(function () {

        DIRJS.clearCookies();
        location.reload();

    });
};


DIRJS.removeBind = function ()
{
    //Подвязываем кнопки с действиями
    $(".remove").click(function () {
        if ($('.table').find('.checkbox:checked').size() > 0) {
            $("#remove").css("display", "block");
        } else
        {
            DIRJS.showAlert("Вы должны выбрать<br>файлы / папки для удаления!");
        }
    });
    $("#remove_ok").click(function () {
        var pathname = DIRJS.getPathname();

        $.each($('.table').find('.checkbox:checked'), function (key, value) {

            var el = DIRJS.getElementInfo(value);
            var to_delete = el.item
            if (!pathname == "")
                to_delete = pathname + "/" + el.item;
            $.post('/include/ajax_handler.php', {item: to_delete, action: "REMOVE"}, function (data) {
                if (data == "")
                {
                    location.reload();
                }
                else
                {
                    DIRJS.showError("Произошла ошибка при удалении <br /> файла " + to_delete, data);
                }
            });
        });

    });
    $("#remove_cancel").click(function () {
        $("#remove").css("display", "none");
    });
};


DIRJS.clipboardBind = function () {
    var copy_sel = $('.clipboard');
    // Disables other default handlers on click (avoid issues)
    copy_sel.on('click', function (e) {
        e.preventDefault();
    });
    // Apply clipboard click event
    copy_sel.clipboard({
        path: '/js/jquery.clipboard.swf',
        copy: function () {
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


DIRJS.renameBind = function () {
    //Подвязываем кнопки с действиями
    $(".rename").click(function () {
        var el = DIRJS.getElementInfo(this);
        var item = el.item;
        $(".original").html(item);
        $(".new").val(item);
        //var pathname = DIRJS.getPathname();
        $("#rename").css("display", "block");
        //alert(pathname + " " + item);
    });
    $("#rename_ok").click(function () {
        var pathname = DIRJS.getPathname();
        var item = $(".new").val();
        if (item !== "") {
            $.post('/include/ajax_handler.php', {fold: pathname, olditem: $(".original").html(), newitem: item, action: "RENAME"}, function (data) {
                if (data == "")
                {
                    location.reload();
                }
                else
                {
                    DIRJS.showError("Произошла ошибка при переименовании <br />  " + $(".original").html() + " в " + item, data);
                }
            });
        }
        else
        {
            DIRJS.showAlert("Имя файла/папки не может быть пустым");
        }

    });
    $("#rename_cancel").click(function () {
        $("#rename").css("display", "none");
    });
};

DIRJS.uploaderBind = function ()
{
    var size;
    var allowedExtensions;
    $.ajax({
        type: 'POST',
        url: '/include/ajax_handler.php',
        data: {action: "CONFIG"},
        async: false
    }).done(function (data) {
        var obj = jQuery.parseJSON(data);
        size = obj.size;
        allowedExtensions = obj.valid_extensions;
    });
    var uploader = new ss.SimpleUpload({
        button: 'upload-btn', // file upload button
        url: '/include/uploadHandler.php', // server side handler
        sessionProgressUrl: '/include/sessionProgress.php', // enables cross-browser progress support (more info below)
        name: 'uploadfile', // upload parameter name        
        responseType: 'json',
        allowedExtensions: allowedExtensions,
        maxSize: size, // kilobytes
        multiple: true,
        debug: true,
        queue: true,
        maxUploads: 1,
        hoverClass: 'ui-state-hover',
        focusClass: 'ui-state-focus',
        disabledClass: 'ui-state-disabled',
        data: {'fold1': DIRJS.getPathname()},
        onChange: function (filename, extension, uploadBtn)
        {

        },
        onSubmit: function (filename, extension) {
            var progress = document.createElement('div'), // container for progress bar
                    bar = document.createElement('div'), // actual progress bar
                    fileSize = document.createElement('div'), // container for upload file size
                    wrapper = document.createElement('div'), // container for this progress bar
                    progressBox = document.getElementById('progressBox'); // on page container for progress bars

            // Assign each element its corresponding class
            progress.className = 'progress';
            bar.className = 'bar';
            fileSize.className = 'size';
            wrapper.className = 'wrapper';

            // Assemble the progress bar and add it to the page
            progress.appendChild(bar);
            wrapper.innerHTML = '<div class="name">' + filename + '</div>'; // filename is passed to onSubmit()
            wrapper.appendChild(fileSize);
            wrapper.appendChild(progress);
            progressBox.appendChild(wrapper); // just an element on the page to hold the progress bars    

            // Assign roles to the elements of the progress bar
            this.setProgressBar(bar); // will serve as the actual progress bar
            this.setFileSizeBox(fileSize); // display file size beside progress bar
            this.setProgressContainer(wrapper); // designate the containing div to be removed after upload


        },
        onSizeError: function (filename, fileSize) {
            DIRJS.showError("Файл слишком большой " + filename, "Размер файла: " + fileSize + " <br/> допустимый " + uploader.maxSize);
            //alert("Файл слишком большой ") + filename;
            /*if ((uploader.getQueueSize()) == 0)
             location.reload();*/

        },
        onExtError: function (filename, extension) {
            DIRJS.showError("Недопустимое разрешение файла " + filename, "Список допустимых: " + uploader.allowedExtensions.toString());
            //alert("Недопустимое разрешение файла " + filename);
            /*if ((uploader.getQueueSize()) == 0)
             location.reload();*/
        },
        onComplete: function (filename, response) {
            if ((uploader.getQueueSize()) == 0 && response.success == true)
                location.reload();
            if (!response) {
                DIRJS.showError("Не удалось закачать файл " + filename, response.msg);
                alert(filename + 'upload failed');
                return false;
            }
            if (response.success == true)
            {
                //alert(filename);
                //location.reload();
            }
            else
            {
                DIRJS.showError("Не удалось закачать файл " + filename, response.msg);
            }

            // do something with response...
        }
    });
};

DIRJS.initAlert = function (alert_text) {
    $("#alert_confirm").click(function () {
        DIRJS.hideAlert();
    });
};

DIRJS.showAlert = function (alert_text) {
    $("#alert_text").html(alert_text);
    $("#alert").css("display", "block");

};

DIRJS.hideAlert = function () {
    $("#alert").css("display", "none");
    $("#alert_text").html("");
};


DIRJS.initError = function ()
{
    $(".more").click(function () {
        if ($("#info").is(":visible")) {
            $("#info").slideUp("slow");
        } else {
            $("#info").slideToggle("slow");
        }
    });

    $("#error_confirm").click(function () {
        location.reload();
    });
};

DIRJS.showError = function (error_text, debug_info) {
    $("#error_text").html(error_text);
    $("#info").html(debug_info);
    $("#error").css("display", "block");

};

DIRJS.init = function ()
{
    DIRJS.pathname = DIRJS.getPathname();
    DIRJS.isLoggedIn();
    DIRJS.initParentRef();
    DIRJS.loadFolderList();
    DIRJS.authBind();
    DIRJS.createFolderBind();
    DIRJS.removeBind();
    DIRJS.uploaderBind();
    DIRJS.initAlert();
    DIRJS.initError();
};

$(document).ready(function () {
    DIRJS.init();
});