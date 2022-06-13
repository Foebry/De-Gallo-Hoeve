<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

class TrainingController extends AbstractController {

    /**
     * @Route("/api/training/{id}", name="specifieke_training")
     */
    function getTraining(int $id): Response {
        return new Response("data for specific training");
    }
}