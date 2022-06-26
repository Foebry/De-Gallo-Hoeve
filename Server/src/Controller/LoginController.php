<?php

namespace App\Controller;

use App\Services\DbManager;
use App\Services\EntityLoader;
use App\Services\Logger;
use App\Services\ResponseHandler;
use App\Services\Validator;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

class LoginController extends AbstractController
{

    /**
     * @Route("/api/login", name="json_login", methods={"POST"})
     */
    public function app_login( DbManager $dbm, Request $request, EntityLoader $loader, ResponseHandler $responseHandler ): Response{

        $payload = json_decode( $request->getContent(), true );
        $loader->checkPayloadForKeys( $payload, ["email", "password"]);
        $email = $payload["email"];
        $password = $payload["password"];

        $klant = $loader->getKlantBy(["email", $email]);
        if( !password_verify( $password, $klant->getPassword() ) ) $responseHandler->badRequest(["password" => "Invalid password"]);

        $dbm->logger->info( sprintf( "Klant %s logged in.", $klant->getId() ) );
        return $this->json([
            "naam" => $klant->getVnaam(),
            "id" => $klant->getId()
        ]);




    /** @var Klant $user*/
        $user = $this->getUser();

        $dbm->logger->info(sprintf( "User %s logged in", $user->getId() ) );

        return !$user ? null : $this->json([
            "id"=>$user->getId(),
            "naam"=>$user->getVnaam()
        ]);
    }

    /**
     * @Route("/login", name="app_login")
     */
    public function login(AuthenticationUtils $authenticationUtils): Response
    {
        if ($this->getUser()) {
            return $this->redirectToRoute('admin');
        }

        // get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();
        // last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername();

        return $this->render('security/login.html.twig', ['last_username' => $lastUsername, 'error' => $error]);
    }

    /**
     * @Route("/logout", name="app_logout")
     */
    public function logout(): void
    {
        throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }
}
