<?php

namespace App\Controller;

use App\Entity\Klant;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

    class KlantController extends AbstractController {

        /**
         * @Route("/api/klanten/{klant}/honden")
         */
        function getMyHonden(Klant $klant): Response {
            $honden = $klant->getHonden();
            $data = [];
            foreach($honden as $hond) {
                $data[] = [
                    "id" => $hond->getId(),
                    "naam" => $hond->getNaam(),
                    "geslacht" => $hond->isGeslacht(),
                    "avatar" => $hond->getRas()->getAvatar()
                ];
            }
            return $this->json($data);
        }
    }