$(document).ready(function() {
    var pathname = window.location.pathname;
    pathname = pathname.replace(/^\/|\/$/g, '');

    alert(pathname);
    //Проверяем авторизацию
    
    //запрос чтобы взять данные по директории
    $.post('/ajax_handler.php', {fold: pathname, action: "LIST"}, function(data) {
        //строим таблицу
    });
    
    //Подвязываем кнопки с действиями
    

});