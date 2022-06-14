<?php

namespace App\Services;

use App\Entity\Klant;
use App\Entity\Hond;
use App\Entity\Ras;
use App\Entity\Training;
use App\Services\DbManager;
use App\Services\ResponseHandler;

class EntityLoader {
    
    private $dbm;
    private $responseHandler;

    public function __construct(DbManager $dbm, ResponseHandler $rh)
    {
        $this->dbm = $dbm;
        $this->responseHandler = $rh;
    }

    function getDbm(): DbManager {
        return $this->dbm;
    }

    /**
     * Zoek klant met id {id} als deze bestaat.
     * @param int $id
     * @return Klant
     */
    public function getKlantById( int $id ): Klant {

        $query = "select * from klant where id = :id";
        $data = $this->dbm->query( $query, ["id" => $id] );

        if($data === []) $this->responseHandler->NotFound(["message"=>"Geen klant met id $id"]);

        $klant = new Klant();
        $klant->initialize( $data );
        
        return $klant;
    }

    /**
     * zoek hond met id {id} als deze bestaat
     * @param int $id;
     * @return Hond
     */
    public function getHondById( int $id ): Hond {

        $query = "select * from hond where id = $id";
        $vars = ["id" => $id];
        $data = $this->dbm->query( $query, $vars );

        if( $data === [] ) $this->responseHandler->NotFound(["message" => "Geen hond met id $id"]);

        $hond = new Hond();
        $hond->initialize( $data );

        return $hond;
    }

    /**
     * Zoek ras met id {id} indien bestaat
     * @param int $id
     * @return Ras
     */
    public function getRasById( int $id ): Ras{

        $query = "select * from ras where id = :id";
        $vars = ["id" => $id];
        $data = $this->dbm->query( $query, $vars );

        if( $data === [] ) $this->responseHandler->badRequest(["message" => "Geen Ras met id $id"]);

        $ras = new Ras();
        $ras->initialize( $data );

        return $ras;
    }

    public function getTrainingById( int $id ): Training {
        
        $query = "select * from training where id = $id";
        $vars = ["id" => $id];
        $data = $this->dbm->query( $query, $vars );

        if( $data === [] ) $this->responseHandler->badRequest( ["message" => "Geen training met id $id"] );

        $training = new Training();
        $training->initialize( $data );

        return $training;
    }

    public function checkPayloadForKeys(array $payload, array $keys, array $defaultResponses = []): void {

        foreach($keys as $key){
            if( !in_array( $key, array_keys( $payload ) ) ) {
                if( in_array( $key, array_keys( $defaultResponses ) ) ) {
                    if( is_array( $defaultResponses[$key] ) ) $this->responseHandler->badRequest( $defaultResponses[$key] );
                    elseif( is_string( $defaultResponses[$key] ) ) $this->responseHandler->badRequest( [$key => $defaultResponses[$key]] );
                }
                $this->responseHandler->badRequest( [$key=>"Mag niet leeg zijn"] );
            }
        }
    }

    public function getEntities( array $data ){
        // exit(print(json_encode(["data" => $data])));

        $entities = [];
        $functionMappings = [
            "hond" => "getHondById",
            "klant" => "getKlantById",
            "ras" => "getRasById",
            "training" => "getTrainingById"
        ];

        foreach( $data as $entity => $id ){
            $function = $functionMappings[$entity];
            // exit(print(json_encode(["function" => $function])));
            $entities[$entity] = $this->$function($id);
        }
        return $entities;
    }

}