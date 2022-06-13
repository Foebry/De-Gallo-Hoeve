<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

class KlantController extends AbstractController {

    /**
     * @Route("/api/user/{id}/honden", name="get_my_honden")
     * @return Response
     */
    function getMyHonden(int $id): Response{
        return $this->json(["message"=>"get my honden"]);
    }

    /**
     * @Route("/api/user/{id}/honden/{hond_id}", name="delete_my_hond", methods={"DELETE"})
     * @return Response
     */
    function deleteMyHond(int $id, int $hond_id): Response {
        return $this->json(["message"=>"delete my hond"]);
    }

    /**
     * @Route("/api/users/{id}/honden/{hond_id}", name="update_my_hond", methods={"PATCH, PUT"})
     * @return Response
     */
    function updateMyHond(int $id, int $hond_id): Response {
        return $this->json(["message"=>"update my hond"]);
    }

    /**
     * @Route("/api/users/{id}/inschrijvingen", name="get_my_inschrijvingen")
     * @return Response
     */
    function getMyInschrijvingen(int $id): Response {
        return $this->json(["message"=>"Get my inschrijvingen"]);
    }

    /**
     * @Route("/api/users/{id}/inschrijvingen/{inschrijving_id}", name="get_my_specific_inschrijving")
     * @return Response
     */
    function getMySpecificInschrijving(int $id, int $inschrijving_id): Response {
        return $this->json(["message"=>"Get my specific inschrijving"]);
    }

    /**
     * @Route("/api/users/{id}/boekingen/", name="get_my_boekingen")
     * @return Response
     */
    function getMyBoekingen(int $id): Response {
        return $this->json(["message"=>"Get my boekingen"]);
    }

    /**
     * @Route("/api/users/{id}/boekingen/{boeking_id}", name="get_my_specific_boeking")
     * @return Response
     */
    function getMySpecificBoeking(int $id, int $boeking_id): Response {
        return $this->json(["message"=>"Get my specific boeking"]);
    }
}