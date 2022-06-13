<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

    class BoekingController extends AbstractController {
        /**
         * @Route("/api/boekings", name="postBoeking", methods={"POST"})
         * @return Response
         */
        function postBoeking(): Response {
            return new Response("Creating a new boeking");
        }
    }