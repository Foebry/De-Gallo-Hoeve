<?php

namespace App\Controller;

use App\Entity\Klant;
use App\Services\DbManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

class LoginController extends AbstractController {

    private $dbm;

    function __construct(DbManager $dbm)
    {
        $this->dbm = $dbm;
    }

    /**
     * @Route("/api/login", name="login", methods={"POST"})
     * @return Response
     */
    function login(): Response {
        
        /** @var Klant $user*/
        $user = $this->getUser();

        $this->dbm->logger->info(sprintf( "User %s logged in", $user->getId() ) );

        return !$user ? null : $this->json([
            "id"=>$user->getId(),
            "name"=>$user->getVnaam()
        ]);
    }
}