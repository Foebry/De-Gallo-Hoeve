<?php

namespace App\Controller\Admin;

use EasyCorp\Bundle\EasyAdminBundle\Config\Dashboard;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;
use EasyCorp\Bundle\EasyAdminBundle\Config\MenuItem;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DashboardController extends AbstractDashboardController
{
    /**
     * @Route("/admin", name="admin")
     */
    public function index(): Response
    {
        // redirect to some CRUD controller
        $routeBuilder = $this->get(AdminUrlGenerator::class);

        return  $this->redirect($routeBuilder->setController(TrainingCrudController::class)->generateUrl());
        /*
        // you can also redirect to different pages depending on the current user
        if('jane' === $this->getUser()->getUsername()) {
            return $this->redirect('...');
        }*/

        // you can also redirect some template to display a proper Dashboard
        // (tip: it's easier if yoour template extends from @EasyAdmin/page/content.html.twig)
        return $this->render('some/path/my-dashboard.html.twig');
    }

    public function configureDashboard(): Dashboard
    {
        return Dashboard::new()
            ->setTitle('Server');
    }

    public function configureMenuItems(): iterable
    {
        yield MenuItem::linkToDashboard('Dashboard', 'fa fa-home');
        yield MenuItem::LinkToCrud("Klanten", "fa fa-users", KlantCrudController::getEntityFqcn());
        yield MenuItem::LinkToCrud("Boekingen", "fa fa-folder", BoekingCrudController::getEntityFqcn());
        yield MenuItem::LinkToCrud("Inschrijvingen", "fa fa-folder", InschrijvingCrudController::getEntityFqcn());
        yield MenuItem::LinkToCrud("Trainingen", "fa fa-list", TrainingCrudController::getEntityFqcn());
        yield MenuItem::LinkToCrud("Honden", "fa fa-list", HondCrudController::getEntityFqcn());
        yield MenuItem::LinkToCrud("Rassen", "fa fa-list", RasCrudController::getEntityFqcn());
        yield MenuItem::LinkToCrud("Kennels", "fa fa-list", KennelCrudController::getEntityFqcn());
    }
}
