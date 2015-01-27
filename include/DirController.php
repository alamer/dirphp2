<?php

require 'Config.php';

class DirController {

    private $conf; //Конфиг

//Конструктор

    function __construct() {
        $this->conf = new Config();
    }

//Конвертация размера в файлы\папки
    private function byteConvert($bytes) {
        if ($bytes > 0) {
            $s = array('Б', 'Кб', 'Мб', 'Гб', 'Тб', 'Пб');
            $e = floor(log($bytes) / log(1024));

            return sprintf('%.2f ' . $s[$e], ($bytes / pow(1024, floor($e))));
        } else
            return '0';
    }

    private function getsize($path) {
        if (!is_dir($path)) {
            return filesize($path);
        }
        $size = 0;
        foreach (scandir($path) as $file) {
            if ($file == '.' or $file == '..') {
                continue;
            }
            $size+=$this->getsize($path . '/' . $file);
        }
        return $size;
    }

// Function to remove folders and files
    private function rrmdir($dir) {
        if (is_dir($dir)) {
            $files = scandir($dir);
            foreach ($files as $file) {
                if ($file != "." && $file != "..") {
                    $this->rrmdir("$dir/$file");
                }
            }
            rmdir($dir);
        } else if (file_exists($dir)) {
            unlink($dir);
        }
    }

// Function to Copy folders and files       
    private function rcopy($src, $dst) {
        if (file_exists($dst)) {
            $this->rrmdir($dst);
        }
        if (is_dir($src)) {
            mkdir($dst);
            $files = scandir($src);
            foreach ($files as $file) {
                if ($file != "." && $file != "..") {
                    $this->rcopy("$src/$file", "$dst/$file");
                }
            }
        } else if (file_exists($src)) {
            copy($src, $dst);
        }
    }

    private function deleteDirectory($dirPath) {
        if (is_dir($dirPath)) {
            $objects = scandir($dirPath);
            foreach ($objects as $object) {
                if ($object != "." && $object != "..") {
                    if (filetype($dirPath . DIRECTORY_SEPARATOR . $object) == "dir") {
                        $this->deleteDirectory($dirPath . DIRECTORY_SEPARATOR . $object);
                    } else {
                        unlink($dirPath . DIRECTORY_SEPARATOR . $object);
                    }
                }
            }
            reset($objects);
            rmdir($dirPath);
        } else {
            unlink($dirPath);
        }
    }

    private function getFileExtension($filename) {

        $path_info = pathinfo($filename);
        return $path_info['extension'];
    }

    private function getFileBasename($filename) {

        $path_info = pathinfo($filename);
        return $path_info['basename'];
    }

    private function checkDirMask($filename) {
        return array_search($filename, $this->conf->getMask());
    }

    private function checkFileMask($filepath) {
        $path_parts = pathinfo($filepath);
// && array_search($path_parts['basename'], $this->conf->getMask())
        return array_search('.' . $path_parts['extension'], $this->conf->getMask());
    }

    private function getBaseDir($dir) {
        $base_dir = $this->conf->base_dir;
        if (isset($dir)) {
            $base_dir = $base_dir . "/" . $dir;
        }
        return $base_dir;
    }

    public function authorization($username, $password) {
        return ($username === $this->conf->getUsername()) && ($password === $this->conf->getPassword());
    }

    public function check_auth() {
        return ($this->conf->getUsername() === $_COOKIE['username']) && ( $this->conf->getPassword() === $_COOKIE['password']);
    }

    public function listDir($dir) {

        $base_dir = $this->getBaseDir($dir);
        if (!is_dir($base_dir))
            die("Wrong folder");
        $dirs_array = array();
        $files_array = array();
        foreach (array_diff(scandir($base_dir), array(".", "..")) as $value) {
            if (is_dir($base_dir . '/'.$value)) {
                $dirs_array[] = $value;
            } else {
                $files_array[] = $value;
            }
        }

        sort($dirs_array);
        sort($files_array);
        $files = array_merge($dirs_array,$files_array);
        /* usort($files, create_function('$a,$b', '
          return	is_dir ($a)
          ? (is_dir ($b) ? strnatcasecmp ($a, $b) : -1)
          : (is_dir ($b) ? 1 : (
          strcasecmp (pathinfo ($a, PATHINFO_FILENAME), pathinfo ($b, PATHINFO_FILENAME))
          ))	;')); */
        $cnt = 0;
        foreach ($files as $filename) {
            $filepath = $base_dir . '/' . $filename;
            if (is_dir($filepath)) {
                //Фильтр по именам папок
                if ($this->checkDirMask($filename) === FALSE) {
                    $files_out[$cnt]['item'] = $filename;
                    $files_out[$cnt]['size'] = $this->byteconvert($this->getsize($filepath));
                    $files_out[$cnt]['time'] = date("d.m.Y H:i:s", filectime($filepath));
                    $files_out[$cnt]['type'] = 'folder';
                    $cnt++;
                }
            } else {
                if ($this->checkFileMask($filename) === FALSE) {
                    $files_out[$cnt]['item'] = $filename;
                    $files_out[$cnt]['size'] = $this->byteconvert($this->getsize($filepath));
                    $files_out[$cnt]['time'] = date("d.m.Y H:i:s", filectime($filepath));
                    $files_out[$cnt]['type'] = 'file';
                    $cnt++;
                }
            }
        }
        //echo $base_dir . " ";
        //print_r($files_out);
        return $files_out;
    }

    public function createDir($dir, $newdir) {

        $base_dir = $this->getBaseDir($dir);
        if (is_dir($base_dir)) {
            return (mkdir($base_dir . "/" . $newdir, 0777, true));
        } else {

            return FALSE;
        }
    }

    public function remove($dir) {
        $base_dir = $this->getBaseDir($dir);
        $this->deleteDirectory($base_dir);
    }

    public function rename($dir, $olditem, $newitem) {

        $base_dir = $this->getBaseDir($dir);
        if ($base_dir . "/" . $olditem === $base_dir . "/" . $newitem) {
            return TRUE;
        } else {
            //переименовываем
            if (is_dir($base_dir . "/" . $olditem)) {
                $this->rcopy($base_dir . "/" . $olditem, $base_dir . "/" . $newitem);
                $this->rrmdir($base_dir . "/" . $olditem);
                return TRUE;
            } else {
                rename($base_dir . "/" . $olditem, $base_dir . "/" . $newitem);
                return TRUE;
            }
        }
        return FALSE;
    }

}
