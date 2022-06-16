<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use App\Services\EntityLoader;
use App\Services\Validator;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Klant;
use App\Services\ResponseHandler;

    class RegistrationController extends AbstractController {

        private $emailVerifier;
        private $validator;
        private $responseHandler;

        public function __construct( Validator $validator, ResponseHandler $responseHandler ){

            $this->validator = $validator;
            $this->responseHandler = $responseHandler;

        }

        /**
         * @Route("/api/register", name="register", methods={"POST"})
         */
        public function register( Request $request, EntityLoader $loader, EntityManagerInterface $entityManager ){

            $table = $this->validator->getTableFromRequestUri();
            $payload = json_decode( $request->getContent(), true );

            $loader->checkPayloadForKeys( $payload, ["honden"] );

            $data = $this->validator->validatePayload();
            $data["password"] = password_hash( $data["password"], 1 );
            // $arts = $this->checkArtsPayload();
            $payload["honden"] = $this->checkPayloadHonden( $payload["honden"] );

            $klant_id = $loader->getDbm()->generateInsertStatmentAndGetInsertId( $table, $data );
            // $loader->getDbm()->generateInsertStatmentAndGetInsertId("arts", $arts);

            foreach( $payload["honden"] as &$hondData ){
                
                $hondData["klant_id"] = $klant_id;
                $hondData["id"] = $loader->getDbm()->generateInsertStatmentAndGetInsertId( "hond", $hondData );
                $data["honden"][] = $hondData;
                
            }

            return $this->json( $data, 201 );
        }

        function checkPayloadHonden( array $hondenArray ) {
            $honden = [];
            foreach($hondenArray as $hondData){
                $data = $this->validator->validatePayload("hond", $hondData);
                $honden[] = $data;
            }
            return $honden;
        }

        function checkArtsPayload(): array {

            return [];
        }
    }