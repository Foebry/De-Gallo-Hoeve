<?php

namespace App\Controller\Admin;

use App\Controller\KlantController;
use App\Services\DbManager;
use DateTime;
use EasyCorp\Bundle\EasyAdminBundle\Config\Dashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\Menu\SubMenuItem;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;
use EasyCorp\Bundle\EasyAdminBundle\Config\MenuItem;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DashboardController extends AbstractDashboardController
{   
    private $dbm;

    public function __construct( DbManager $dbm )
    {
        $this->dbm = $dbm;    
    }

    /**
     * @Route("/", name="home")
     */
    public function home(){
        return $this->redirect("/admin");
    }

    /**
     * @Route("/admin", name="admin")
     */
    public function index(): Response
    {
        // redirect to some CRUD controller
        $routeBuilder = $this->get(AdminUrlGenerator::class);
        return $this->redirect($routeBuilder->setController(KlantCrudController::class)->generateUrl());
    }

    /**
     * @Route("/admin/overview")
     */
    function overview() {
        $time_monday = strtotime("monday this week");
        $time_sunday = strtotime("sunday this week");
        $monday_date = new DateTime();
        $sunday_date = new DateTime();
        $monday = $monday_date->setTimestamp($time_monday)->format("Y-m-d");
        $sunday = $sunday_date->setTimestamp($time_sunday)->format("Y-m-d");
        $last_monday = new DateTime("$monday - 7 days");
        $last_sunday = new DateTime("$sunday - 7 days");
        $first_of_month = date('Y-m-01');
        $first_of_last_month = new DateTime("$first_of_month - 1 month");
        $last_of_month = date('Y-m-t');
        $last_of_last_month = new DateTime("$last_of_month - 1 month");
        $first_of_year = date("Y-01-01");
        $last_of_year = date("Y-12-31");
        $first_of_last_year = new DateTime("$first_of_year - 1 year");
        $last_of_last_year = new DateTime("$last_of_year - 1 year");

        $subscriptions = $this->dbm->query(
            "select count(id) this_week, 
            (select count(id) from inschrijving where datum >= :monthStart and datum <= :monthEnd) this_month,
            (select count(id) from inschrijving where datum >= :yearStart and datum <= :yearEnd) this_year,
            (select count(id) from inschrijving where datum >= :prevWeekStart and datum <= :prevWeekEnd) last_week,
            (select count(id) from inschrijving where datum >= :prevMonthStart and datum <= :prevMonthEnd) last_month,
            (select count(id) from inschrijving where datum >= :prevYearStart and datum <= :prevYearEnd) last_year
            from inschrijving 
            where datum >= :monday and datum <= :sunday",
            ["monday" => $monday, "sunday" => $sunday, "monthStart" => $first_of_month, "monthEnd" => $last_of_month,
             "yearStart" => $first_of_year, "yearEnd" => $last_of_year, "prevWeekStart" => $last_monday->format("Y-m-d"), "prevWeekEnd" => $last_sunday->format("Y-m-d"),
             "prevMonthStart" => $first_of_last_month->format("Y-m-d"), "prevMonthEnd" => $last_of_last_month->format("Y-m-d"),
             "prevYearStart" => $first_of_last_year->format("Y-m-d"), "prevYearEnd" => $last_of_last_year->format("Y-m-d")]
            )[0];

        $boekingen = $this->dbm->query(
            "select count(id) this_week, 
            (select count(id) from boeking where start >= :monthStart and start <= :monthEnd) this_month,
            (select count(id) from boeking where start >= :yearStart and start <= :yearEnd) this_year,
            (select count(id) from boeking where start >= :prevWeekStart and start <= :prevWeekEnd) last_week,
            (select count(id) from boeking where start >= :prevMonthStart and start <= :prevMonthEnd) last_month,
            (select count(id) from boeking where start >= :prevYearStart and start <= :prevYearEnd) last_year
            from boeking 
            where start >= :monday and start <= :sunday",
            ["monday" => $monday, "sunday" => $sunday, "monthStart" => $first_of_month, "monthEnd" => $last_of_month,
             "yearStart" => $first_of_year, "yearEnd" => $last_of_year, "prevWeekStart" => $last_monday->format("Y-m-d"), "prevWeekEnd" => $last_sunday->format("Y-m-d"),
             "prevMonthStart" => $first_of_last_month->format("Y-m-d"), "prevMonthEnd" => $last_of_last_month->format("Y-m-d"),
             "prevYearStart" => $first_of_last_year->format("Y-m-d"), "prevYearEnd" => $last_of_last_year->format("Y-m-d")]
        )[0];

        $subscriptions = [
            0 => [
                "amount" => $subscriptions["this_week"],
                "direction" => $subscriptions["this_week"] - $subscriptions["last_week"]
            ],
            1 =>[
                "amount" => $subscriptions["this_month"],
                "direction" => $subscriptions["this_month"] - $subscriptions["last_month"]
            ],
            2 => [
                "amount" => $subscriptions["this_year"],
                "direction" => $subscriptions["this_year"] - $subscriptions["last_year"]
            ],
        ];
        $reservations = [
            0 => [
                "amount" => $boekingen["this_week"],
                "direction" => $boekingen["this_week"] - $boekingen["last_week"]
                ],
            1 => [
                "amount" => $boekingen["this_month"],
                "direction" => $boekingen["this_month"] - $boekingen["last_month"],
                ],
            2 => [
                "amount" => $boekingen["this_year"],
                "direction" => $boekingen["this_year"] - $boekingen["last_year"]
                ]
            ];

        return $this->render("admin/dashboard.html.twig", ["subscriptions" => $subscriptions, "reservations" => $reservations]);
    }

    public function configureDashboard(): Dashboard
    {
        return Dashboard::new()
            ->setTitle('Control');
    }

    public function configureMenuItems(): iterable
    {
        yield MenuItem::section("Data", "fa fa-cog");
        
        yield MenuItem::LinkToCrud("Klanten", "fa fa-address-book", KlantCrudController::getEntityFqcn());
        yield MenuItem::LinkToCrud("Boekingen", "fa fa-hotel", BoekingCrudController::getEntityFqcn());
        yield MenuItem::LinkToCrud("Inschrijvingen", "fa fa-folder", InschrijvingCrudController::getEntityFqcn());
        yield MenuItem::LinkToCrud("Trainingen", "fa fa-list", TrainingCrudController::getEntityFqcn());
        yield MenuItem::LinkToCrud("Honden", "fa fa-dog", HondCrudController::getEntityFqcn());
        yield MenuItem::LinkToCrud("Rassen", "fa fa-list", RasCrudController::getEntityFqcn());
        yield MenuItem::LinkToCrud("Kennels", "fa fa-list", KennelCrudController::getEntityFqcn());

        yield MenuItem::section("Content", "fa fa-book");
        
        yield MenuItem::linkToCrud("Diensten", "fa fa-list", DienstCrudController::getEntityFqcn());
        yield MenuItem::linkToCrud("Content", "fa fa-book", ContentCrudController::getEntityFqcn());
    }
}
