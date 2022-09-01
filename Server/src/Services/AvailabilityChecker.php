<?php

namespace App\Services;

use App\Entity\Hond;
use App\Entity\Klant;
use App\Services\EntityLoader;
use DateTime;
use Symfony\Component\HttpFoundation\RequestStack;

    class AvailabilityChecker {

        private $dbm;
        private $request;

        function __construct( DbManager $dbm, RequestStack $requestStack)
        {
            $this->dbm = $dbm;
            $this->request = $requestStack->getCurrentRequest();
        }

        public function checkBoeking(){

            $payload = json_decode( $this->request->getContent(), true );
            $start = $payload["start"];
            $eind = $payload["eind"];
            $aantal = count( $payload["details"] );
        
            $kennels = [];

            //controleer of voldoende vrije kennels tijdens de boekingperiode.
            $data = $this->dbm->query(
                "select kennel.id from kennel
                    left join boeking_detail on kennel.id = boeking_detail.kennel_id
                    left join boeking on boeking_id = boeking_detail.boeking_id
                where boeking.eind < :start or boeking.start > :eind or boeking.id is null",
                ["start" => $start, "eind" => $eind]
            );
            $this->dbm->logger->info("aantal:$aantal, count:".count($data));
            if( $aantal > count( $data ) ) $this->dbm->responseHandler->unprocessableEntity(["failure" => "Helaas hebben we tijdens deze periode niet voldoende plaats."]);

            $random_indexes = array_rand($data, $aantal);
            if( $aantal === 1) $random_indexes = [$random_indexes];
            foreach($random_indexes as $index){
                $kennels[] = $data[$index]["id"];
            }

            return $kennels;

        }

        public function isHondNogNietGeboektTijdensBoekingPeriode(Hond $hond, DateTime $start, DateTime $eind){

            $hond_id = $hond->getId();
            $hond_naam = $hond->getNaam();

            $data = $this->dbm->query(
                "select count(*) aantal from boeking
                    inner join boeking_detail bd on boeking.id = bd.boeking_id
                where bd.hond_id = :hond_id
                and (
                    (boeking.start <= :start AND boeking.eind >= :eind) OR
                    (boeking.start <= :start AND boeking.eind > :start AND boeking.eind <= :eind) OR
                    (boeking.start > :start AND boeking.start < :eind AND boeking.eind >= :eind) OR
                    (boeking.start > :start AND boeking.eind < :eind)
                    )",
                ["hond_id" => $hond_id, "start" => $start->format("Y-m-d"), "eind" => $eind->format("Y-m-d")]
            )[0];
            if ($data["aantal"] > 0 ) $this->dbm->responseHandler->unprocessableEntity(["failure" => "Het lijkt erop dat $hond_naam al een plekje heeft tijdens deze periode"]);
        }

        public function isKlantReedsIngeschrevenVoorTraining( Klant $klant, int $training_id, string $datum, EntityLoader $loader){

            $data = $this->dbm->query(
                "select hond_id from inschrijving
                where klant_id = :klant_id
                and training_id = :training_id
                and datum = :datum",
                ["klant_id" => $klant->getId(), "datum" => $datum, "training_id" => $training_id]
            );

            if( count( $data ) > 0 ){
                $hond = $loader->getHondById($data[0]["hond_id"]);
                $hond_naam = $hond->getNaam();
                $this->dbm->responseHandler->unprocessableEntity(["failure" => "U bent reeds ingeschreven voor deze training met $hond_naam"]);
            }
        }
    }