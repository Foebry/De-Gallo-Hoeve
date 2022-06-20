<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use App\Services\EntityLoader;
use App\Services\Validator;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Klant;
use App\Entity\Hond;
use App\Services\CustomHelper;

    class RegistrationController extends AbstractController {

        private $validator;

        public function __construct( Validator $validator )
        {
            $this->validator = $validator;
        }

        /**
         * @Route("/api/register", name="register", methods={"POST"})
         */
        public function register( Request $request, EntityLoader $loader, CustomHelper $helper, EntityManagerInterface $em ){

            $payload = json_decode( $request->getContent(), true );

            $loader->checkPayloadForKeys( $payload, ["honden"] );

            $data = $this->validator->validatePayload();
            $payload["honden"] = $this->checkPayloadHonden( $payload["honden"] );

            /** @var Klant $klant */
            $klant = $helper->create(Klant::class, $data, $loader);
            $em->persist( $klant );
            

            foreach( $payload["honden"] as &$hondData ){
                
                $hondData["Klant"] = $klant;
                $hond = $helper->create(Hond::class, $hondData, $loader);
                $klant->addHonden( $hond );
                
                $em->persist($hond);
                
            }
            $em->flush();

            return $this->json( ["message"=>"Bedankt voor uw registratie!"], 201 );
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