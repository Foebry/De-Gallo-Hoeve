<?php

namespace App\Controller;

use DateTime;
use App\Entity\Boeking;
use App\Entity\BoekingDetail;
use App\Services\CustomHelper;
use App\Services\Validator;
use App\Services\EntityLoader;
use App\Services\ResponseHandler;
use App\Services\AvailabilityChecker;
use App\Services\MailService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

    class BoekingController extends AbstractController {

        private $validator;
        private $loader;
        private $responseHandler;
        private $request;
        private $checker;

        function __construct( Validator $validator, EntityLoader $loader, ResponseHandler $responseHandler, RequestStack $requestStack, AvailabilityChecker $checker )
        {
            $this->validator = $validator;
            $this->loader = $loader;
            $this->responseHandler = $responseHandler;
            $this->request = $requestStack->getCurrentRequest();
            $this->checker = $checker;
        }

        /**
         * @Route("/api/boekings", name="postBoeking", methods={"POST"})
         * @return Response
         * @todo controleer of kennels vrij zijn gedurende de gevraagde periode.
         * @todo indien geen kennels aangeduidt, wijs zelf kennel toe.
         */
        function postBoeking(EntityManagerInterface $em, CustomHelper $helper, MailService $mailService): Response {
            $payload = json_decode( $this->request->getContent(), true );
            $this->validator->validateCSRF($payload);

            $this->loader->checkPayloadForKeys( $payload, ["klant_id", "details"], [ "details" => ["message"=>"Gelieve minstens 1 hond aan te duiden"]]);
            if(count($payload["details"]) === 0) $this->responseHandler->badRequest(["message" => "Gelieve minstens 1 hond aan te duiden"]);

            /** @var Klant $klant */
            $klant = $this->loader->getKlantBy( ["id", $payload["klant_id"]] );

            $data = $this->checkBoekingPayload();
            $kennels = $this->checker->checkBoeking();

            /** @var Boeking $boeking */
            $boeking = $helper->create( Boeking::class, $data, $this->loader );
            $klant->addBoekingen($boeking);
            
            $em->persist($boeking);
            
            $detailRows = $this->checkDetailsPayload( $payload );
            
            $index = 0;
            foreach( $detailRows as &$detailData ){

                $hond = $this->loader->getHondById( $detailData["hond_id"]);

                if( !$klant->isOwnerOf($hond) ) $this->responseHandler->unprocessableEntity(["message" => "Het lijkt dat deze hond niet bij jou hoort"]);
                $this->checker->isHondNogNietGeboektTijdensBoekingPeriode($hond, $boeking->getStart(), $boeking->getEind());

                $kennel_id = $kennels[$index];
                $kennel = $this->loader->getKennelById($kennel_id);

                $detailData["Boeking"] = $boeking;
                $detailData["Kennel"] = $kennel;

                /** @var BoekingDetail $detail */
                $detail = $helper->create(BoekingDetail::class, $detailData, $this->loader);
                $hond->addBoeking($detail);
                $boeking->addDetail($detail);

                $em->persist($detail);

                $index += 1;
            }
            $em->flush();

            $data["details"] = $detailRows;

            $mailService->send("boeking", $klant);

            return $this->json( ["success" => "Uw boeking is goed ontvangen!"], 201 );           
        }

        function checkBoekingPayload(): array {

            $boekingData = $this->validator->validatePayload();
            $payload = json_encode( $boekingData );

            $this->loader->getDbm()->logger->info("payload: $payload -- BoekingController line 84");
            $start = new DateTime( $boekingData["start"] );
            $this->loader->getDbm()->logger->info("created datetime from start -- BoekingController line 85");
            $eind = new DateTime( $boekingData["eind"] );
            $now = new DateTime();

            if( $now > $start ) $this->responseHandler->badRequest( ["period" => "Gelieve een begindatum in de toekomst te kiezen"]);
            if( $start >= $eind ) $this->responseHandler->badRequest( ["period" => "Gelieve einddatum na begindatum te kiezen."]);
            
            return $boekingData;
        }

        function checkDetailsPayload( $payload ): array {

            $boekingDetails = [];

            $controllerFunction = function( $id ) {
                return $this->loader->getHondById( $id );
            };

            foreach( $payload["details"] as $data ){

                $boekingDetails[] = $this->validator->validatePayload("boeking_detail", $data);
            }
            //controleren of hond niet meerdere malen voorkomt
            if( !$this->validator->controleerUniekeEntiteiten( $payload["details"], "hond_id", $controllerFunction ) ){
                $this->responseHandler->badRequest( ["message"=>"Een hond kan maar 1 maal geboekt worden."] );
            }

            return $boekingDetails;
        }
    }