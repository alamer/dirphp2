/*
 * Поиск информации об элементе в строке
 */
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

function copyToClipboard(text) {
    window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
}

$(document).ready(function() {
    var pathname = window.location.pathname;
    pathname = pathname.replace(/^\/|\/$/g, '');
            

    //alert(pathname);
    //Проверяем авторизацию

    //запрос чтобы взять данные по директории
    $.post('/ajax_handler.php', {fold: pathname, action: "LIST"}, function(data) {
        alert(data);
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
        var pathname = window.location.pathname;
        pathname = pathname.replace(/^\/|\/$/g, '');
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
        var pathname = window.location.pathname;
        pathname = pathname.replace(/^\/|\/$/g, '');
        $.each($('.table').find('.checkbox'), function(key, value) {
            if ($(value).prop('checked'))
            {
                var el=getElementInfo(value);
                alert(pathname+" "+el.item);
            }           
        });
    });
});