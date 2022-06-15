<?php

namespace App\Controller;

use App\Services\DbManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

class KennelController extends AbstractController {

    private $dbm;

    function __construct( DbManager $dbm )
    {
        $this->dbm = $dbm;
        
    }

    /**
     * @Route("/api/kennels", name="get_kennels")
     * @return Response
     */
    function getKennels(): Response {
        
        $data = $this->dbm->query( "select id, naam from kennel" );

        return $this->json( $data );
    }
}