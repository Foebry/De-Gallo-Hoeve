<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

class KennelController extends AbstractController {

    /**
     * @Route("/api/kennels", name="get_kennels")
     * @return Response
     */
    function getKennels(): Response {
        return $this->json(["message"=>"get all kennels"]);
    }
}