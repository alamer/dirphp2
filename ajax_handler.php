<?php

require 'include/DirController.php';
$controller = new DirController();
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $action = $_POST['action'];
    switch ($action) {
        case "AUTH":
            $username = $_POST['username'];
            $password = $_POST['password'];
            if ($controller->authorization($username, $password)) {
                $_SESSION['username'] = $username;
                echo $_SESSION['username'];
            } else {
                die("Wrong username or password");
            }
            break;
        case "LIST": //Отображаем список папок
            $fold = $_POST['fold'];
            echo json_encode($controller->listDir($fold));
            break;
        case "REMOVE":
            if ($controller->check_auth()) {
                $item = $_POST['item'];
                $controller->remove($item);
            } else {
                die("Not authorized");
            }
            break;
        case "RENAME":
            if ($controller->check_auth()) {
                $fold = $_POST['fold'];
                $olditem = $_POST['olditem'];
                $newitem = $_POST['newitem'];
                $controller->rename($fold, $olditem, $newitem);
            } else {
                die("Not authorized");
            }
            break;
        case "CREATE":
            if ($controller->check_auth()) {
                $fold = $_POST['fold'];
                $newdir = $_POST['newdir'];
                $controller->createDir($fold, $newdir);
            } else {
                die("Not authorized");
            }
            break;
        case "LOGOUT":
            break;
        default:
            die('Unknown action.');
            break;
    }
} else {
    die('No post.');
}
    