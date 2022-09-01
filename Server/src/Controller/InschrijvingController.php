<?php 

namespace App\Controller;

use App\Entity\Inschrijving;
use App\Services\AvailabilityChecker;
use App\Services\DbManager;
use App\Services\Validator;
use App\Services\EntityLoader;
use App\Services\MailService;
use App\Services\ResponseHandler;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class InschrijvingController extends AbstractController{

    /**
     * @Route("/api/inschrijvingen", name="all_boekingen", methods={"GET"})
     */
    function getAllInschrijvings(DbManager $dbm) {
        
        $date = new DateTime();
        $inschrijvingenData = $dbm->query("select datum, count(datum) amount from inschrijving where datum >= :now group by datum", ["now"=>$date->format("Y-m-d")]);

        $prive = [];
        $groep = [];

        foreach($inschrijvingenData as $row){
            $dag = date("l", strtotime($row["datum"]));
            if($dag === "Sunday" and $row["amount"] >= 5) $groep[] = $row["datum"];
            if( in_array( $dag, ["Wednesday", "Friday", "Saturday"])) $prive[] = $row["datum"];
        }
        $data = [
            "prive" => $prive,
            "groep" => $groep
        ];

        return $this->json($data);
    }

    /**
     * @Route("/api/inschrijvings", name="post_inschrijving", methods={"POST"})
     */
    function postInschrijving( Request $request, EntityLoader $loader, Validator $validator, ResponseHandler $responseHandler, EntityManagerInterface $em, AvailabilityChecker $checker, MailService $mailService ) {

        $payload = json_decode($request->getContent(), true);
        $validator->validateCSRF($payload);

        $loader->checkPayloadForKeys($payload, ["klant_id", "hond_id", "training_id"]);
        $klant = $loader->getKlantBy(["id", $payload["klant_id"]]);

        $validator->validatePayload("inschrijving", $payload);

        $dag = date("l", strtotime($payload["datum"]));

        if( $payload["training_id"] == 1 && !in_array($dag, ["Wednesday", "Saturday"]) ) $responseHandler->badRequest(["failure" => "Privé trainingen gaan enkel door op Woensdag en Zaterdag"]);
        
        elseif( $payload["training_id"] === 2 && $dag !== "Sunday" ){
            $responseHandler->badRequest(["failure" => "Groepstrainingen gaan enkel door op Zondag"]);
        } 
        $inschrijvingen = $loader->getDbm()->query("select count(id) amount from inschrijving where id = :id and datum = :datum", ["id"=>$payload["training_id"], "datum"=>$payload["datum"]])[0]["amount"];
        if( $inschrijvingen >= 5 ) $responseHandler->badRequest(["failure" => "Deze training is helaas volboekt."]);

        $checker->isKlantReedsIngeschrevenVoorTraining($klant, $payload["training_id"], $payload["datum"], $loader);

        $inschrijving = new Inschrijving();
        $inschrijving->initialize($payload, $loader);

        $em->persist($inschrijving);
        $em->flush();

        $mailService->send("inschrijving", $klant);

        return $this->json(["success" => "Uw inschrijving werd goed ontvangen!"], 201);
    }

}