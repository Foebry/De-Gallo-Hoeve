<?php

namespace App\Controller\Admin;

use App\Entity\Ras;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;

class RasCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Ras::class;
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
