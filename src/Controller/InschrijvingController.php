<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

class InschrijvingController extends AbstractController {

    /**
     * @Route("/api/inschrijvings", name="create_inschrijving", methods={"POST"})
     * @return Response
     */
    function postInschrijving(): Response {
        return new Response("Create new Inschrijving");
    }
}