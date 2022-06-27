<?php

namespace App\Services;

use App\Entity\AbstractEntity;
use App\Entity\Boeking;
use App\Entity\BoekingDetail;
use App\Entity\Hond;
use App\Entity\Inschrijving;
use App\Entity\Kennel;
use App\Entity\Klant;
use App\Entity\Ras;
use App\Entity\Training;

    class CustomHelper {
        
        public function create( string $namespace, array $data, EntityLoader $loader): AbstractEntity {
            $className = explode("\\", $namespace)[2];
            
            switch( $className ) {
                case "Boeking":
                    $class = new Boeking();
                    break;
                case "BoekingDetail":
                    $class = new BoekingDetail();
                    break;
                case "Hond":
                    $class = new Hond();
                    break;
                case "Inschrijing":
                    $class = new Inschrijving();
                    break;
                case "Kennel":
                    $class = new Kennel();
                    break;
                case "Klant":
                    $class = new Klant();
                    break;
                case "Ras":
                    $class = new Ras();
                    break;
                case "Training":
                    $class = new Training();
                    break;
            }  
            
            
            return $class->initialize($data, $loader);

        }

        public function generateRandomString($length=15) {
            $characters = "0123456789abcdefghijklmnopqrstuvwxyz";
            $randomString = "";
    
            for( $i=0; $i<$length; $i++ ) {
                $index = rand(0, strlen($characters)-1);
                $randomString .= rand(0, 10) > 5 ? $characters[$index] : strtoupper($characters[$index]);
            }
    
            return $randomString;
        }

        function checkPayloadHonden( array $hondenArray, Validator $validator ) {
            $honden = [];
            foreach($hondenArray as $hondData){
                $data = $validator->validatePayload("hond", $hondData);
                $honden[] = $data;
            }
            return $honden;
        }
    }