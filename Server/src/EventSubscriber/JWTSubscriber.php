<?php
namespace App\EventSubscriber;

use App\Entity\Klant;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Lexik\Bundle\JWTAuthenticationBundle\Events;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTAuthenticatedEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use App\Services\Logger;

class JWTSubscriber implements EventSubscriberInterface
{

    const REFRESH_TIME = 1800;

    private $payload;
    private $user;
    private $em;

    public function __construct(JWTTokenManagerInterface $jwtManager, Logger $logger, EntityManagerInterface $em)
    {
        $this->jwtManager = $jwtManager;
        $this->logger = $logger;
        $this->em = $em;
    }

    public static function getSubscribedEvents()
    {
        return [
            Events::AUTHENTICATION_SUCCESS => 'onAuthenticationSuccess',
            Events::JWT_AUTHENTICATED => 'onAuthenticatedAccess',
            KernelEvents::RESPONSE => 'onAuthenticatedResponse'
        ];
    }

    public function onAuthenticatedResponse(ResponseEvent $event)
    {
        if($this->payload && $this->user)
        {
            $expireTime = $this->payload['exp'] - time();
            if($expireTime < static::REFRESH_TIME)
            {
                // Refresh token
                $jwt = $this->jwtManager->create($this->user);

                $response = $event->getResponse();

                // Set cookie
                $this->createCookie($response, $jwt);
            }
        }
    }

    public function onAuthenticatedAccess(JWTAuthenticatedEvent $event)
    {
        $this->payload = $event->getPayload();
        $this->user = $event->getToken()->getUser();
    }

    public function onAuthenticationSuccess(AuthenticationSuccessEvent $event)
    {
        $eventData = $event->getData();
        if(isset($eventData['token']))
        {
            $response = $event->getResponse();
            $user_email = $event->getUser()->getUserIdentifier();
            $klantRepo = $this->em->getRepository(Klant::class);
            $klant = $klantRepo->findOneBy(["email" => $user_email]);
            $event->setData([
                "naam"=>$klant->getVnaam(),
                "id" => $klant->getId(),
                "csrf" => "f0d06032a286c4687959e1a63e3e8105902fd48f23cd73d63765b1f82ea73e29"
            ]);
            $jwt = $eventData['token'];

            // Set cookie
            $this->createCookie($response, $jwt);
        }
    }

    
protected function createCookie(Response $response, $jwt)
    {   
        $response->headers->setCookie(
            new Cookie(
                $name = "BEARER",
                $value = $jwt,
                $expire = new \DateTime("+1 day"),
                $path = "/",
                $domain = null,
                $secure = true,
                $httpOnly = true,
                $raw = false,
                $sameSite = "None"    //kan ook 'lax' zijn, dat is de default waarde
            )
        );
    }
}
