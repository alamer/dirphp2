<?php
require('Uploader.php');
require 'Config.php';

if (isset($_POST['fold1']))
    $upload_dir = $_POST['fold1'];
if (isset($_GET['fold1']))
    $upload_dir = $_GET['fold1'];

if (!(bool) compact('upload_dir')) $upload_dir = "";

$conf = new Config();
$upload_dir = $conf->base_dir. "/" . $upload_dir . "/";
//$upload_dir = 'test/';
$valid_extensions = $conf->valid_extensions;

$Upload = new FileUpload('uploadfile');
$result = $Upload->handleUpload($upload_dir, $conf->valid_extensions);

if (!$result) {
    echo json_encode(array('success' => false, 'msg' => $Upload->getErrorMsg() . " " . $upload_dir));
} else {
    echo json_encode(array('success' => true, 'file' => $Upload->getFileName()));
}