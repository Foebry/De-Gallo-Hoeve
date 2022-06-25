<?php

namespace App\Controller\Admin;

use App\Entity\Inschrijving;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\BooleanField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateField;
use EasyCorp\Bundle\EasyAdminBundle\Field\EmailField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TelephoneField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;

class InschrijvingCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Inschrijving::class;
    }

    public function configureFields(string $pageName): iterable
    {
        yield IdField::new("id")
            ->onlyOnIndex();
        yield AssociationField::new("klant")
            ->setDisabled();
        yield AssociationField::new("hond");
        yield AssociationField::new("training");
        yield DateField::new("datum");
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
