<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

class HondController extends AbstractController {

    /**
     * @Route("/api/honds", name="new_hond", methods={"POST"})
     * @return Response
     */
    function postHond(): Response {
        return new Response("Create new hond");
    }
}