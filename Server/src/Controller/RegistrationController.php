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
use \DateTime;
use Symfony\Bridge\Doctrine\Form\ChoiceList\EntityLoaderInterface;

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

            return $this->json( ["success"=>"Hartelijk dank voor uw registratie! Bekijk zeker uw email om uw registratie te bevestigen"], 201 );
        }

				/**
				 * @Route("/confirm/{code}")
				 */
				function confirmRegistration( string $code, DbManager $dbm, EntityManagerInterface $em ){

					[$klant_id, $created_at] = $dbm->query("select klant_id, created_at from confirm where code = :code", ["code" => $code])[0];
          if( new DateTime($created_at) > new DateTime("now - 1 hour")){
            $this->render("expiredConfirm", ["code" => $code]);
            exit();
          }
					$klant = $this->loader->getKlantBy(["id", $klant_id]);

					$klant->setVerified(true);

					$em->persist($klant);
					$em->flush();
					
					$dbm->query("delete from confirm where code = :code", ["code" => $code]);

					return $this->redirect("https://de-gallo-hoeve.vercel.app/");

				}

        /**
         * @Route("/confirm/{code}/reset")
         */
        function resetConfirmRegistration(string $code, DbManager $dbm, CustomHelper $helper, MailService $mailService ){

          $klant_id = $dbm->query("select klant_id from confirm where code = :code", ["code" => $code])[0];
          $klant = $this->loader->getKlantBy(["id", $klant_id]);

          $code = $helper->generateRandomString();
          $dbm->query("update confirm set code = :code where klant_id = :klant_id", ["code" => $code, "klant_id" => $klant_id]);

          $mailService->send("register", $klant);

        }

    }