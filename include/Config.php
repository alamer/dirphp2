<?php

class Config {

    const USERNAME = 'alamer';
    const PASSWORD = '31337';
    const MAX_FILESIZE=702400000; //Kb

    public static $mask = array(".php", ".html", ".js", "css", "js", "img", "Joomla", "phpMyAdmin", "crontab", "ess", "CI", "eset_upd", "rtgui", "wTorrent", "fm2");
    var $valid_extensions;
    public $base_dir;

    function __construct() {
        $this->base_dir =  str_replace("include","",getcwd());
        $this->valid_extensions = array('jpg', 'jpeg', 'png', 'gif', 'zip', '7z', 'rar', 'exe');
    }

    public function getMask() {
        return self::$mask;
    }

    public function getUsername() {
        return self::USERNAME;
    }

    public function getPassword() {
        return self::PASSWORD;
    }
    
       public function getMaxSize() {
        return self::MAX_FILESIZE;
    }

}
