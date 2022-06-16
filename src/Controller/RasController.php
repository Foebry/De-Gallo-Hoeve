<?php

namespace App\Controller;

use App\Services\DbManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

class RasController extends AbstractController {

    private $dbm;

    function __construct( DbManager $dbm )
    {
        $this->dbm = $dbm;
    }

    /**
     * @Route("/api/ras", name="get_rassen")
     * @return Response
     */
    function getAllRassen(): Response {
        
        $data = $this->dbm->query( "select id, naam from ras" );
        return $this->json( $data );
    }
}