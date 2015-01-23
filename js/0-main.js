/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(document).ready(function() {
    var pathname = window.location.pathname;
    pathname = pathname.replace(/^\/|\/$/g, '');

    alert(pathname);
    //запрос чтобы взять данные по директории
    $.post('/ajax_handler.php', {fold: pathname, action: "LIST"}, function(data) {
        alert(data);
    });

});