<?php

namespace App\Entity;

    class AbstractClass {
        
        public function initialize(array $data) {
            
            foreach( $data as $key => $value ){
                if($key === "email") $value = strtolower( $value );
                $this->$key = $value;
            }
        }
    }