<?php

namespace App\Controller\Admin;

use App\Entity\Klant;
use App\Entity\Ras;
use App\Services\Logger;
use Doctrine\ORM\EntityManagerInterface;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\BooleanField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\EmailField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TelephoneField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\NumberField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;

class KlantCrudController extends AbstractCrudController
{   
    private $em;
    private $logger;

    public function __construct(EntityManagerInterface $em, Logger $logger)
    {
        $this->em = $em;
        $this->logger = $logger;
    }

    public static function getEntityFqcn(): string
    {
        return Klant::class;
    }

    private function getHondChoices() {
        $repo = $this->em->getRepository(Ras::class);
        $rassen = $repo->findAll();
        foreach($rassen as $ras) $ras = $ras->getNaam();
        // $this->logger->info($rassen[0]);
        return $rassen;
    }

    
    public function configureFields(string $pageName): iterable
    {
        
        return [
            IdField::new('id')
                ->onlyOnIndex(),
            TextField::new('fullName', "Naam")
                ->onlyOnIndex(),
            TextField::new('Authorization', 'Authorizatie')
                ->onlyOnIndex(),
            TextField::new('vnaam', 'Voornaam')
                ->onlyOnForms(),
            TextField::new('lnaam', 'Achternaam')
                ->onlyOnForms(),
            EmailField::new('Email'),
            TelephoneField::new('Gsm'),
            TextField::new('Straat')
                ->onlyOnForms(),
            NumberField::new('nr')
                ->onlyOnForms(),
            TextField::new("Gemeente"),
            NumberField::new("Postcode")
                ->onlyOnForms(),
            BooleanField::new("verified", "Geverifiëerd")
                ->onlyOnIndex()
                ->renderAsSwitch(false),
            BooleanField::new("verified", "Geverifiëerd")
                ->onlyOnForms(),
        ];
    }
    
}
