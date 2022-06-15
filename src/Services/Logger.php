<?php

namespace App\Services;

use \DateTime;

class Logger
{
    private $dbfile;
    private $errorfile;
    private $infofile;

    public function __construct( $dbfile, $errorfile, $infofile )
    {
        $this->dbfile = $dbfile;
        $this->infofile = $infofile;
        $this->errorfile = $errorfile;
    }

    private function Log( string $msg, string $type ): void
    {   
        $dt = new DateTime("now");
        $now = $dt->format("y-m-d H:i:s.v");
        $message = "$now - $msg";

        $files = [
            "error" => $this->errorfile, 
            "db" => $this->dbfile,
            "info" => $this->infofile
        ];

        $fp = fopen($files[$type], "a+");
        fwrite( $fp, $message . "\r\n" );
    }

    public function db( $query, $vars=[] ) {
        foreach( $vars as $key => $value) {
            $query = str_replace(":$key", "'$value'", $query);
        }
        $this->Log( $query, "db");
    }

    public function info( $msg ){
        $this->Log( $msg, "info" );
    }

    public function error( $msg ) {
        $this->Log( $msg."\n".str_repeat("#", 200), "error" );
    }

    public function ShowLog()
    {
        return file_get_contents( $this->logfile );
    }
}