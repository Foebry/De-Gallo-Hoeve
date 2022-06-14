<?php

namespace App\Entity;

    class AbstractClass {
        
        public function initialize(array $data) {
            
            foreach( $data as $key => $value ){
                $this->$key = $value;
            }
        }
    }