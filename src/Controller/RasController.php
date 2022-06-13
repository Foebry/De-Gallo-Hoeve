<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

class RasController extends AbstractController {

    /**
     * @Route("/api/ras", name="get_rassen")
     * @return Response
     */
    function getAllRassen(): Response {
        return new Response("Get all Rassen");
    }
}