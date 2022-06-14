<?php

namespace App\Controller;

use App\Entity\Klant;
use App\Entity\Hond;
use App\Services\EntityLoader;
use App\Services\ResponseHandler;
use App\Services\Validator;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

class KlantController extends AbstractController {

    private $validator;
    private $loader;
    private $responseHandler;
    private $request;

    public function __construct( Validator $validator, EntityLoader $loader, ResponseHandler $responseHandler, RequestStack $requestStack)
    {
        $this->validator = $validator;
        $this->loader = $loader;
        $this->responseHandler = $responseHandler;
        $this->request = $requestStack->getCurrentRequest();
    }

    /**
     * @Route("/api/users/{id}/honden", name="get_my_honden")
     * @return Response
     */
    function getMyHonden(int $id ) {
        
        $this->loader->getKlantById($id);

        $query = "select hond.id id, hond.naam, ras.naam ras from hond join ras on ras_id = ras.id where klant_id = :id";
        $data = $this->loader->getDbm()->query($query, ["id" => $id]);

        return $this->json( $data );
    }

    /**
     * @Route("/api/users/{id}/honden/{hond_id}", name="delete_my_hond", methods={"DELETE"})
     * @return Response
     */
    function deleteMyHond(int $id, int $hond_id, EntityManagerInterface $em  ): Response {
        
        $this->loader->getEntities(["klant"=>$id, "hond"=>$hond_id]);

        $query = "delete from hond where id = :id";
        $this->loader->getDbm()->query( $query, ["id" => $id] );

        return $this->json([], 204);
    }

    /**
     * @Route("/api/users/{id}/honden/{hond_id}", name="update_my_hond", methods={"PATCH"})
     * @return Response
     */
    function updateMyHond(int $id, int $hond_id): Response {

        $table = "hond";
        $this->loader->getEntities(["klant"=>$id, "hond"=>$hond_id]);
        
        $data = $this->validator->validatePayload( $table );

        if( count( $data ) > 0 ) $this->loader->getDbm()->generateUpdateStatement( $table, $data, $id );

        return $this->json($data, 200);
    }

    /**
     * @Route("/api/users/{id}/inschrijvingen", name="get_my_inschrijvingen")
     * @return Response
     */
    function getMyInschrijvingen(int $id): Response {
        
        $this->loader->getKlantById( $id );

        $query = "select inschrijving.id, datum, hond.naam hond, training.naam training from inschrijving \n".
                 "join hond on hond.id = hond_id \n".
                 "join training on training.id = training_id \n".
                 "where inschrijving.klant_id = :id";
        
        $data = $this->dbm->query( $query, ["id" => $id] );

        return $this->json( $data );
    }

    /**
     * @Route("/api/users/{id}/boekingen", name="get_my_boekingen")
     * @return Response
     */
    function getMyBoekingen(int $id): Response {
        
        $this->loader->getKlantById($id);

        $query = "select boeking.id id, startdatum start, einddatum eind, referentie ".
                 "from boeking where klant_id = :id";
        
        $data = $this->loader->getDbm()->query( $query, ["id" => $id] );

        return $this->json( $data );
    }
}