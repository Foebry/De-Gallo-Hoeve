<?php

namespace App\Controller\Admin;

use App\Entity\Kennel;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;

class KennelCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Kennel::class;
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
