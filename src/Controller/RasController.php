<?php

namespace App\Controller;

use App\Entity\Ras;
use App\Services\DbManager;
use Doctrine\ORM\EntityManagerInterface;
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
     * @Route("/api/rassen", name="get_rassen")
     * @return Response
     */
    function getAllRassen(EntityManagerInterface $em): Response {

        /** @var Ras $repo */
        $repo = $em->getRepository(Ras::class);
        $data = $repo->findAll();
        $rassen = [];

        /** @var Ras $ras */
        foreach($data as $ras){
            $rassen[] = [
                "value" => $ras->getId(),
                "label" => $ras->getNaam()
            ];
        }
        $this->dbm->logger->info(json_encode($rassen));

        return $this->json($rassen);

    }
    // /**
    //  * @Route("/api/ras", name="get_rassen")
    //  * @return Response
    //  */
    // function getAllRassen(): Response {
        
    //     $data = $this->dbm->query( "select id, naam from ras" );
    //     return $this->json( $data );
    // }
}