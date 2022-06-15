<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use App\Services\EntityLoader;
use App\Services\Validator;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Klant;

    class RegistrationController extends AbstractController {

        private $emailVerifier;
        private $validator;

        public function __construct( Validator $validator ){

            $this->validator = $validator;

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
            $honden = $this->checkHondenPayload( $payload );
            // $arts = $this->checkArtsPayload();

            $klant_id = $loader->getDbm()->generateInsertStatmentAndGetInsertId( $table, $data );
            // $loader->getDbm()->generateInsertStatmentAndGetInsertId("arts", $arts);

            foreach( $honden as &$hondData ){
                $hondData["klant_id"] = $klant_id;
                $hondData["id"] = $loader->getDbm()->generateInsertStatmentAndGetInsertId( "hond", $hondData );
            }
            $data["honden"] = $honden;

            return $this->json( $data, 201 );
        }

        function checkHondenPayload( $payload ): array {

            $honden = [];

            foreach( $payload["honden"] as $hondData ){
                $honden = $this->validator->validatePayload( "hond", $hondData );
            }

            return $honden;
        }

        function checkArtsPayload(): array {

            return [];
        }
    }