<?php

namespace App\Controller\Admin;

use App\Entity\Inschrijving;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;

class InschrijvingCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Inschrijving::class;
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
