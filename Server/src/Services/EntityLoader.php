<?php

namespace App\Services;

use App\Entity\Klant;
use App\Entity\Hond;
use App\Entity\Kennel;
use App\Entity\Ras;
use App\Entity\Training;
use App\Services\DbManager;
use App\Services\ResponseHandler;
use Doctrine\ORM\EntityManagerInterface;

class EntityLoader {
    
    private $dbm;
    private $responseHandler;
    private $helper;
    private $em;

    public function __construct(DbManager $dbm, ResponseHandler $rh, CustomHelper $helper, EntityManagerInterface $em )
    {
        $this->dbm = $dbm;
        $this->responseHandler = $rh;
        $this->helper = $helper;
        $this->em = $em;
    }

    function getDbm(): DbManager {
        return $this->dbm;
    }

    function getResponseHandler(): ResponseHandler {
        return $this->responseHandler;
    }

    function getHelper(): CustomHelper {
        return $this->helper;
    }

    /**
     * Zoek klant met id {id} als deze bestaat.
     * @param array $data
     * @return Klant
     */
    public function getKlantBy( array $data ): Klant {

        $klantRepo = $this->em->getRepository(Klant::class);
        $klant = $klantRepo->findOneBy([$data[0] => $data[1]]);

        if( !$klant ){
            $this->dbm->logger->error( sprintf( "Geen klant met %s %s", $data[0], $data[1] ) );
            if( $data[0] === "email") {
                if( $data[1] === "") $this->responseHandler->badRequest(["email" => "Ongeldig email adres"]);
                $this->responseHandler->badRequest(["email" => "email niet gevonden."]);
            }
            $this->responseHandler->NotFound(["message" => "Klant niet gevonden"]);
        }
        
        return $klant;
    }

    /**
     * zoek hond met id {id} als deze bestaat
     * @param int $id;
     * @return Hond
     */
    public function getHondById( int $id ): Hond {
        $this->dbm->logger->info("inside getHondById -- EntityLoader line 69");

        $hondRepo = $this->em->getRepository(Hond::class);
        $hond = $hondRepo->findOneBy(["id" => $id]);

        if( !$hond ) {
            $this->dbm->logger->error( "Geen hond met id $id" );
            $this->responseHandler->NotFound(["message" => "Hond niet gevonden"]);
        }

        return $hond;
    }

    /**
     * Zoek ras met id {id} indien bestaat
     * @param int $id
     * @return Ras
     */
    public function getRasById( int $id ): Ras{

        $rasRepo = $this->em->getRepository(Ras::class);
        $ras = $rasRepo->findOneBy(["id"=>$id]);

        if( !$ras ) {
            $this->dbm->logger->error( "Geen Ras met id $id" );
            $this->responseHandler->badRequest(["message" => "Ras niet gevonden"]);
        }

        return $ras;
    }

    public function getTrainingById( int $id ): Training {

        $trainingRepo = $this->em->getRepository(Training::class);
        $training = $trainingRepo->findOneBy(["id"=>$id]);
        

        if( !$training ) {
            $this->dbm->logger->error( "Geen training met id $id" );
            $this->responseHandler->badRequest( ["message" => "Training niet gevonden"] );
        }

        return $training;
    }

    public function getKennelById( int $id ): Kennel{

        $kennelRepo = $this->em->getRepository(Kennel::class);
        $kennel = $kennelRepo->findOneBy(["id"=>$id]);

        if( !$kennel ) {
            $this->dbm->logger->error( "Geen kennel met id $id" );
            $this->responseHandler->badRequest( ["message" => "Kennel niet gevonden"]);
        }
        return $kennel;
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
            $entities[] = $this->$function($id);
        }
        return $entities;
    }

}