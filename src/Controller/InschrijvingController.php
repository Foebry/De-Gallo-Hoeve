<?php

namespace App\Controller;

use App\Services\EntityLoader;
use App\Services\ResponseHandler;
use App\Services\Validator;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

class InschrijvingController extends AbstractController {

    private $validator;
    private $loader;
    private $request;

    function __construct( Validator $validator, EntityLoader $loader, RequestStack $requestStack )
    {
        $this->validator = $validator;
        $this->loader = $loader;
        $this->request = $requestStack->getCurrentRequest();
    }

    /**
     * @Route("/api/inschrijvings", name="create_inschrijving", methods={"POST"})
     * @return Response
     */
    function postInschrijving(): Response {

        $payload = json_decode( $this->request->getContent(), true );
        $table = $this->validator->getTableFromRequestUri();

        $this->loader->checkPayloadForKeys( $payload, ["klant_id", "hond_id", "training_id"] );
        $this->loader->getEntities(["klant"=>$payload["klant_id"], "hond"=>$payload["hond_id"], "training"=>$payload["training_id"]]);

        $data = $this->validator->validatePayload();
        $data["training_id"] = $this->loader->getDbm()->generateInsertStatmentAndGetInsertId( $table, $data );
        
        return $this->json( $data, 201 );
    }
}