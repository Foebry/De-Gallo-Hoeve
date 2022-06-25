<?php

namespace App\Controller\Admin;

use App\Entity\Boeking;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\CollectionField;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;

class BoekingCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Boeking::class;
    }

    /*
    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id'),
            TextField::new('title'),
            TextEditorField::new('description'),
        ];
    }
    */
    public function configureFields(string $pageName): iterable {
        
            yield IdField::new("id")
                ->onlyOnIndex();
            yield DateField::new('start');
            yield DateField::new('eind');
            yield TextField::new('klantNaam', 'Klant')
                ->onlyOnIndex();
            yield AssociationField::new("klant", "Klant")
                ->hideOnIndex();
            yield TextField::new('Referentie')
                ->onlyOnIndex();
            yield CollectionField::new("honden")
                ->hideOnIndex();
        
    }
}
