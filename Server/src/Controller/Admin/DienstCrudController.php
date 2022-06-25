<?php

namespace App\Controller\Admin;

use App\Entity\Dienst;
use EasyCorp\Bundle\EasyAdminBundle\Config\Menu\SubMenuItem;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\CollectionField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

class DienstCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Dienst::class;
    }

    private function getLinkChoices(){
        return [
            "test", "test2"
        ];
    }

    public function configureFields(string $pageName): iterable
    { 
            yield IdField::new("id")
                ->onlyOnIndex();
            yield TextField::new("caption", "Naam");
            yield TextField::new("image");
            yield TextField::new("link")
                ->onlyOnIndex();
            yield TextEditorField::new("summary")
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
