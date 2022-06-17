<?php

namespace App\Controller;

use DateTime;
use App\Entity\Inschrijving;
use App\Services\EntityLoader;
use App\Services\ResponseHandler;
use App\Services\Validator;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

class InschrijvingController extends AbstractController {

    private $validator;
    private $loader;
    private $request;
    private $entityManager;

    function __construct( Validator $validator, EntityLoader $loader, RequestStack $requestStack, EntityManagerInterface $entityManager )
    {
        $this->validator = $validator;
        $this->loader = $loader;
        $this->request = $requestStack->getCurrentRequest();
        $this->entityManager = $entityManager;
    }

    /**
     * @Route("/api/inschrijvings", name="create_inschrijving", methods={"POST"})
     * @return Response
     */
    function postInschrijving( Request $request, EntityLoader $loader, Validator $validator, EntityManagerInterface $entityManager ): Response {

        // $inschrijving = new Inschrijving();

        $payload = json_decode( $request->getContent(), true );
        // $table = $validator->getTableFromRequestUri();

        $loader->checkPayloadForKeys( $payload, ["klant_id", "hond_id", "training_id"] );
        $loader->getEntities(["klant"=>$payload["klant_id"], "hond"=>$payload["hond_id"], "training"=>$payload["training_id"]]);

        $data = $validator->validatePayload();
        $validator->isFutureDate( $data["datum"] );

        $data["id"] = $loader->getDbm()->generateInsertStatmentAndGetInsertId( "inschrijving", $data );
        // $inschrijving->initialize($data);
        
        return $this->json( $data, 201 );
    }
}