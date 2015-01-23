<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

require 'include/DirController.php';

$controller=new DirController();
$controller->listDir("");
echo "<br />";
$controller->listDir("img");
echo "<br />";
$controller->listDir("img/js");

echo "<br />";
$controller->createDir("","folder1");
$controller->remove("folder1");
//$controller->remove("img/js.gif");
//$controller->rename("","ttt2","ttt");
//$controller->rename("img/js","file.gif","file2.gif");