<?php

namespace App\Services;

use Symfony\Component\Mime\Address;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;
use App\Entity\Klant;
use DateTime;

    class MailService {

        private $helper;
        private $dbm;
        private $mailer;

        public function __construct( CustomHelper $helper, DbManager $dbm, MailerInterface $mailer )
        {
            $this->helper = $helper;
            $this->dbm = $dbm;
            $this->mailer = $mailer;
        }

        public function send($type, $info) {

            switch( $type ) {
                case "register":
                    $this->sendRegisterMail( $info );
                    break;
                case "inschrijving":
                    $this->sendInschrijvingEmail( $info );
                    break;
                case "boeking":
                    $this->sendBoekingEmail( $info );
                    break;
                default:
                    break;
            }

        }

        private function sendRegisterMail( Klant $klant ){

            $randomCode = $this->helper->generateRandomString(30);
            $created = new DateTime("now");
            $this->dbm->query(
                "insert into confirm set klant_id = :klant_id, code = :code, created_at = :created", 
                ["klant_id" => $klant->getId(), "code" => $randomCode, "created" => $created->format("Y-m-d H:i:s")]);

            $plain_font = "font-family: 'Segoe UI', sans-serif; font-size: 16px;";
            $SP = '<p style="' . $plain_font . ' font-weight: normal; margin: 0; margin-bottom: 15px;">';
            $EP = '</p>';
            $this->dbm->logger->info("klant-email={$klant->getEmail()}");
        
            $email = (new TemplatedEmail())
                ->from('sander.fabry@gmail.com')
                ->to(new Address($klant->getEmail()))
                ->addBcc("rain_fabry@hotmail.com")
                ->subject('Bedankt voor uw registratie')
                ->htmlTemplate('emails/register.html.twig') // path of the Twig template to render
                ->context([
                    'MAIL_SUBJECT'
                    => 'Bedankt voor uw registratie',
                    'AANSPREKING'
                    =>$SP . "Beste {$klant->getVnaam()}" . $EP,
                    'BLOCK_VOOR_ACTION'
                    =>$SP . 'Bedankt voor uw registratie. Gelieve deze nog te bevestigen door op de knop hieronder te klikken.' . $EP,
                    'ACTION_HYPERLINK'
                    => "https://wdev2.be/fs_sander/eindwerk/confirm/{$randomCode}",
                    'ACTION_BUTTON_TEKST'
                    => "Bevestig uw registratie",
                    'BLOCK_NA_ACTION'
                    => $SP . 'Als u nog vragen hebt, aarzel niet om ons te contacteren. 
                                        We zullen u met plezier verder helpen.<br><br>' . $EP,
                    'SLOT_BEGROETING'
                    => $SP . "Met vriendelijke groet,<br>De Gallo-hoeve". $EP,
                    'font_fam_size_plain_text'
                    => $plain_font,
                    'footer_font_size'
                    => "font-size: 14px;",
                ])
                //->attach( ... bijlage ...)
            ;
        
            $this->mailer->send($email);
        }

        function sendInschrijvingEmail(Klant $klant) {
            $plain_font = "font-family: 'Segoe UI', sans-serif; font-size: 16px;";
            $SP = '<p style="' . $plain_font . ' font-weight: normal; margin: 0; margin-bottom: 15px;">';
            $EP = '</p>';
        
            $email = (new TemplatedEmail())
                ->from('sander.fabry@gmail.com')
                ->to(new Address($klant->getEmail()))
                ->addBcc("rain_fabry@hotmail.com")
                ->subject('Bedankt voor uw inschrijving')
                ->htmlTemplate('emails/inschrijving.html.twig') // path of the Twig template to render
                ->context([
                    'MAIL_SUBJECT'
                    => 'Bedankt voor uw registratie',
                    'AANSPREKING'
                    =>$SP . "Beste {$klant->getVnaam()}" . $EP,
                    'BLOCK_VOOR_ACTION'
                    =>$SP . 'U ontvangt deze email omdat u zich zonet heeft ingeschreven voor een training bij de Gallo-Hoeve' . $EP,
                    'BLOCK_NA_ACTION'
                    => $SP . 'Als u nog vragen hebt, aarzel niet om ons te contacteren. 
                                        We zullen u met plezier verder helpen.<br><br>' . $EP,
                    'SLOT_BEGROETING'
                    => $SP . "Met vriendelijke groet,<br>De Gallo-hoeve". $EP,
                    'font_fam_size_plain_text'
                    => $plain_font,
                    'footer_font_size'
                    => "font-size: 14px;",
                ])
                //->attach( ... bijlage ...)
            ;
        
            $this->mailer->send($email);
        }

        function sendBoekingEmail(Klant $klant) {
            $plain_font = "font-family: 'Segoe UI', sans-serif; font-size: 16px;";
            $SP = '<p style="' . $plain_font . ' font-weight: normal; margin: 0; margin-bottom: 15px;">';
            $EP = '</p>';
        
            $email = (new TemplatedEmail())
                ->from('sander.fabry@gmail.com')
                ->to(new Address($klant->getEmail()))
                ->addBcc("rain_fabry@hotmail.com")
                ->subject('Bedankt voor uw boeking')
                ->htmlTemplate('emails/boeking.html.twig') // path of the Twig template to render
                ->context([
                    'MAIL_SUBJECT'
                    => 'Bedankt voor uw boeking',
                    'AANSPREKING'
                    =>$SP . "Beste {$klant->getVnaam()}" . $EP,
                    'BLOCK_VOOR_ACTION'
                    =>$SP . 'U ontvangt deze email omdat u zonet een boeking heeft geplaatst bij de Gallo-Hoeve' . $EP,
                    'BLOCK_NA_ACTION'
                    => $SP . 'Als u nog vragen hebt, aarzel niet om ons te contacteren. 
                                        We zullen u met plezier verder helpen.<br><br>' . $EP,
                    'SLOT_BEGROETING'
                    => $SP . "Met vriendelijke groet,<br>De Gallo-hoeve". $EP,
                    'font_fam_size_plain_text'
                    => $plain_font,
                    'footer_font_size'
                    => "font-size: 14px;",
                ])
                //->attach( ... bijlage ...)
            ;
        
            $this->mailer->send($email);
        }
    }