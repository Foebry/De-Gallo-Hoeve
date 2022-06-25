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
use App\Services\DbManager;
use App\Services\MailService;

    class RegistrationController extends AbstractController {

        private $validator;
				private $loader;

        public function __construct( Validator $validator, EntityLoader $loader )
        {
            $this->validator = $validator;
						$this->loader = $loader;
        }

        /**
         * @Route("/api/register", name="register", methods={"POST"})
         */
        public function register( Request $request, EntityLoader $loader, CustomHelper $helper, EntityManagerInterface $em, MailService $mailService ){
            $this->loader->getDbm()->logger->info("testing register");
            $payload = json_decode( $request->getContent(), true );

            $loader->checkPayloadForKeys( $payload, ["honden"] );

            $data = $this->validator->validatePayload();
            $payload["honden"] = $helper->checkPayloadHonden( $payload["honden"], $this->validator );

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

            $mailService->send("register", $klant);

            return $this->json( ["message"=>"Bedankt voor uw registratie! Gelieve uw registratie te bevestigen door op de knop 'bevestig registratie' te klikken in de email die we u hebben toegezonden.\n Geen mail ontvangen? bekijk dan zeker ook uw spam"], 201 );
        }

				/**
				 * @Route("/confirm/{code}")
				 */
				function confirmRegistration( string $code, DbManager $dbm, EntityManagerInterface $em ){

					$klant_id = $dbm->query("select klant_id from confirm where code = :code", ["code" => $code])[0];
					$klant = $this->loader->getKlantBy(["id", $klant_id]);

					$klant->setVerified(true);

					$em->persist($klant);
					$em->flush();
					
					$dbm->query("delete from confirm where code = :code", ["code" => $code]);

					return $this->redirect("https://de-gallo-hoeve.vercel.app/");

				}

    }