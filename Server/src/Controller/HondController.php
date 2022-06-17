<?php

namespace App\Controller;

use App\Services\EntityLoader;
use App\Services\ResponseHandler;
use App\Services\Validator;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

class HondController extends AbstractController {

    private $validator;
    private $loader;
    private $responseHandler;
    private $request;


    function __construct( Validator $validator, EntityLoader $loader, ResponseHandler $responseHandler, RequestStack $requestStack)
    {
        $this->validator = $validator;
        $this->loader = $loader;
        $this->responseHandler = $responseHandler;
        $this->request = $requestStack->getCurrentRequest();
    }

    /**
     * @Route("/api/honds", name="new_hond", methods={"POST"})
     * @return Response
     */
    function postHond(): Response {

        $table = $this->validator->getTableFromRequestUri();
        $payload = json_decode( $this->request->getContent(), true );

        //controleer of klant en ras bestaan
        $this->loader->checkPayloadForKeys($payload, ["klant_id", "ras_id"]);
        $this->loader->getEntities(["klant"=>$payload["klant_id"], "ras"=>$payload["ras_id"]]);

        $data = $this->validator->validatePayload();
        $data["id"] = $this->loader->getDbm()->generateInsertStatmentAndGetInsertId( $table, $data );

        return $this->json( $data, 201 );
    }
}