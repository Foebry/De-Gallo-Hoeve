<?php

namespace App\Controller\Admin;

use App\Entity\Hond;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\BooleanField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;

class HondCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Hond::class;
    }

    public function configureFields(string $pageName): iterable
    {
        yield IdField::new("id")
            ->onlyOnIndex();
        yield TextField::new("chip_nr", "Chip nummer");
        yield TextField::new("Naam");
        yield DateField::new("Geboortedatum");
        yield TextField::new("rasNaam", "Ras")
            ->onlyOnIndex();
        yield TextField::new("KlantNaam", "Klant")
            ->onlyOnIndex();
        yield AssociationField::new("klant", "Eigenaar");
        yield TextField::new("gender", "Geslacht")
            ->onlyOnIndex();
        yield BooleanField::new("geslacht", "isReu")
            ->renderAsSwitch("false")
            ->hideOnIndex();
        yield AssociationField::new("ras")
            ->hideOnIndex();
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
}
