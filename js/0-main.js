/*
 * Поиск информации об элементе в строке
 */

function getPathname()
{
    var pathname = window.location.pathname;
    return pathname = pathname.replace(/^\/|\/$/g, '');
}


function getElementInfo(el)
{
    var strdiv = $(el).parent().closest('div').parent();
    var item = strdiv.find(".name").text();
    var type = $(el).parent().closest('div').parent().attr('class');
    var res = new Object();
    res.item = item;
    res.type = type;
    return res;
}


function initParentRef()
{
    var url = window.location.href;
    var pathname = getPathname();
    if (!url.match("/$"))
        url += "/";
    if (pathname == "")
    {
        $(".parent").hide();
    }
    else
    {
        result = url.replace(/\/[^\/]+\/?$/ig, "");
        $(".parent").attr('href', result);
    }
}

function copyToClipboard(text) {
    window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
}

$(document).ready(function() {
    var pathname = getPathname();

    initParentRef();
    //alert(pathname);
    //Проверяем авторизацию

    //запрос чтобы взять данные по директории
    $.post('/ajax_handler.php', {fold: pathname, action: "LIST"}, function(data) {
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
        //Подвязываем кнопки с действиями
        $(".clipboard").click(function() {
            var item = getElementInfo(this).item;
            var url = window.location.href;
            if (!url.match("/$"))
                url += "/";
            var link = url + encodeURIComponent(item);
            copyToClipboard(link);
        });

        //Подвязываем кнопки с действиями
        $(".rename").click(function() {
            var el = getElementInfo(this);
            var item = el.item;
            var pathname = getPathname();
            alert(pathname + " " + item);
        });

        //Подвязываем кнопки с действиями
        $(".create").click(function() {
            var pathname = window.location.pathname;
            pathname = pathname.replace(/^\/|\/$/g, '');
            alert(pathname);
        });

        //Подвязываем кнопки с действиями
        $(".remove").click(function() {
            var pathname = getPathname();
            $.each($('.table').find('.checkbox'), function(key, value) {
                if ($(value).prop('checked'))
                {
                    var el = getElementInfo(value);
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
                }
            });
        });
    });


});