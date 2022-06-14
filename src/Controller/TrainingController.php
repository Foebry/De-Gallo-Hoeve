<?php

namespace App\Controller;

use App\Services\DbManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

class TrainingController extends AbstractController {

    private $dbm;

    function __construct( DbManager $dbm )
    {
        $this->dbm = $dbm;
    }

    /**
     * @Route("/api/trainings", name="get_trainings")
     */
    function getTrainings(int $id): Response {
        return new Response;
    }
}