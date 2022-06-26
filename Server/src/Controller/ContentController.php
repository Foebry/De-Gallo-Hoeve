<?php

namespace App\Controller;

use App\Services\DbManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;


    class ContentController extends AbstractController{

        private $dbm;

        public function __construct( DbManager $dbm )
        {
            $this->dbm = $dbm;
        }

        /**
         * @Route("api/content/index")
         */
        public function getIndexContent(): Response {
            $content = $this->dbm->query("select `content`, image from content where id = 1")[0];
            $imagesData = $this->dbm->query("select * from image");
            $dienstenData = $this->dbm->query("select id, image, summary, caption, link from dienst");

            $images = [];
            $indexes = array_rand($imagesData, 12);
            foreach($indexes as $index){
                $images[] = $imagesData[$index];
            }
            
            $diensten = [];
            foreach($dienstenData as $dienst){
                $this->dbm->logger->info("dienst:".json_encode($dienst));
                $dienst["summary"] = explode("\n", base64_decode($dienst["summary"]));
                $diensten[] = $dienst;
            }


            $data = [
                "content" => explode("\n", base64_decode($content["content"])),
                "image" => $content["image"],
                "images" => $images,
                "diensten" => $diensten
            ];


            return $this->json($data);
        }

        /**
         * @Route("api/content/hotel")
         */
        public function getHotelContent(): Response {
            $data = $this->dbm->query("select `content` from content where id in (2, 3, 4)");
            $content = [
                "reserveren" => explode("\n", base64_decode($data[0]["content"])),
                "verblijven" => explode("\n", base64_decode($data[1]["content"])),
                "verwachtingen" => explode("\n", base64_decode($data[2]["content"])),
            ];

            return $this->json($content);
        }

        /**
         * @Route("api/content/training")
         */
        public function getTrainingContent(): Response {
            $data = $this->dbm->query("select `content`, image from content where id in (5, 6)");
            $content = [
                "prive" => [
                    "priveContent" => explode("\n", base64_decode($data[0]["content"])),
                    "priveImg" => $data[0]["image"],
                ],
                "group" => [
                    "groupContent" => explode("\n", base64_decode($data[0]["content"])),
                    "groupImg" => $data[1]["image"],
                ]
            ];

            return $this->json($content);
        }
    }