<?php

require 'include/DirController.php';
$controller = new DirController();
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $action = $_POST['action'];
    switch ($action) {
        case "AUTH":
            break;
        case "LIST": //Отображаем список папок
            $fold = $_POST['fold'];
            echo json_encode($controller->listDir($fold));
            break;
        case "REMOVE":
            $item = $_POST['item'];
            $controller->remove($item);
            break;
        case "RENAME":
            $fold = $_POST['fold'];
            $olditem = $_POST['olditem'];
            $newitem = $_POST['newitem'];
            $controller->rename($fold, $olditem, $newitem);
            break;
        case "CREATE":
            $fold = $_POST['fold'];
            $newdir = $_POST['newdir'];
            $controller->createDir($dir, $newdir);
            break;
        default:
            die('Unknown action.');
            break;
    }
} else {
    die('No post.');
}
    