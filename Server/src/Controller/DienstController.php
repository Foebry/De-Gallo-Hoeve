<?php

namespace App\Controller;

use App\Services\DbManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

    class DienstController extends AbstractController {

        private $dbm;
        private $em;

        public function __construct( DbManager $dbm, EntityManagerInterface $em )
        {
            $this->dbm = $dbm;
            $this->em = $em;
        }

        /**
         * @Route("/api/diensten", methods={"GET"})
         */
        public function getDiensten( Request $request): Response{            
            
            $data = $this->dbm->query("select image, summary, caption, link from dienst");
            foreach($data as &$row){
                $row["summary"] = base64_decode($row["summary"], true);
            }

            return $this->json($data);
        }
    }