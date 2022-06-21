<?php 

namespace App\Controller;

use App\Entity\Inschrijving;
use App\Services\DbManager;
use App\Services\Validator;
use App\Services\EntityLoader;
use App\Services\ResponseHandler;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class InschrijvingController extends AbstractController{

    /**
     * @Route("/api/inschrijvingen", name="all_boekingen")
     */
    function getAllInschrijvings(DbManager $dbm) {
        
        $date = new DateTime();
        $data = $dbm->query("select * from inschrijving where datum >= :now", ["now"=>$date->format("Y-m-d")]);

        return $this->json($data);
    }

    /**
     * @Route("/api/inschrijvings", name="post_inschrijving", methods={"POST"})
     */
    function postInschrijving( Request $request, EntityLoader $loader, Validator $validator, ResponseHandler $responseHandler, EntityManagerInterface $em ) {

        $payload = json_decode($request->getContent(), true);

        $loader->checkPayloadForKeys($payload, ["klant_id", "hond_id", "training_id"]);

        $validator->validatePayload("inschrijving", $payload);

        $dag = date("l", strtotime($payload["datum"]));

        if( $payload["training_id"] == 1 && !in_array($dag, ["Wednesday, Saturday"]) ) $responseHandler->badRequest(["datum" => "Privé trainingen gaan enkel door op Woensdag en Zaterdag"]);
        
        elseif( $payload["training_id"] === 2 && !in_array($dag, ["Wednesday, Saturday"])){
            $responseHandler->badRequest(["datum" => "Groepstrainingen gaan enkel door op Zondag"]);
            $inschrijvingen = $loader->getDbm()->query("select count(id) from training where id = :id and datum = :datum", ["id"=>$payload["training_id"], "datum"=>$payload["datum"]])[0];
            if( $inschrijvingen > 10 ) $responseHandler->badRequest(["training_id" => "Deze training is helaas volboekt."]);
        } 

        $inschrijving = new Inschrijving();
        $inschrijving->initialize($payload, $loader);

        $em->persist($inschrijving);
        $em->flush();

        return $this->json("Uw inschrijving is goed ontvangen!");
    }

}