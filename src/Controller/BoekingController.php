<?php

namespace App\Controller;

use DateTime;
use App\Services\Validator;
use App\Services\EntityLoader;
use App\Services\ResponseHandler;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

    class BoekingController extends AbstractController {

        private $validator;
        private $loader;
        private $responseHandler;
        private $request;

        function __construct( Validator $validator, EntityLoader $loader, ResponseHandler $responseHandler, RequestStack $requestStack )
        {
            $this->validator = $validator;
            $this->loader = $loader;
            $this->responseHandler = $responseHandler;
            $this->request = $requestStack->getCurrentRequest();
        }

        /**
         * @Route("/api/boekings", name="postBoeking", methods={"POST"})
         * @return Response
         * @todo controleer of kennels vrij zijn gedurende de gevraagde periode.
         * @todo indien geen kennels aangeduidt, wijs zelf kennel toe.
         */
        function postBoeking(): Response {

            $table = $this->validator->getTableFromRequestUri();
            $payload = json_decode( $this->request->getContent(), true );

            $this->loader->checkPayloadForKeys( $payload, ["klant_id", "details"], [ "details" => ["message"=>"Gelieve minstens 1 hond aan te duiden"]]);
            $this->loader->getKlantById( $payload["klant_id"] );

            $data = $this->checkBoekingPayload();
            $details = $this->checkDetailsPayload( $payload );

            $boeking_id = $this->loader->getDbm()->generateInsertStatmentAndGetInsertId( $table, $data );
            
            foreach( $details as $detailData ){
                $detailData["boeking_id"] = $boeking_id;
                $this->loader->getDbm()->generateInsertStatmentAndGetInsertId( "boeking_detail", $detailData );
            }

            $data["details"] = $details;

            return $this->json( $data, 201 );           
        }

        function checkBoekingPayload(): array {

            $boekingData = $this->validator->validatePayload();

            $start = $boekingData["startdatum"];
            $eind = $boekingData["einddatum"];
            $now = new DateTime();

            if( $now > $start ) $this->responseHandler->badRequest( ["startdatum" => "Gelieve een datum in de toekomst te kiezen"]);
            if( $start >= $eind ) $this->responseHandler->badRequest( ["einddatum" => "Gelieve einddatum na begindatum te kiezen."]);
            
            return $boekingData;
        }

        function checkDetailsPayload( $payload ): array {

            $boekingDetails = [];

            $controllerFunction = function( $id ) {
                return $this->loader->getHondById( $id );
            };
            //controleren of hond niet meerdere malen voorkomt
            if( !$this->validator->controleerUniekeEntiteiten( $payload["details"], "hond_id", $controllerFunction ) ){
                $this->responseHandler->badRequest( ["message"=>"Een hond kan maar 1 maal geboekt worden."] );
            }

            foreach( $payload["details"] as $data ){

                $boekingDetails[] = $this->validator->validatePayload("boeking_detail", $data);
            }

            return [];
        }
    }