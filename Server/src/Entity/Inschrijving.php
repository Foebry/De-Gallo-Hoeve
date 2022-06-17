<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\InschrijvingRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ApiResource()
 * @ORM\Entity(repositoryClass=InschrijvingRepository::class)
 */
class Inschrijving extends AbstractClass
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    protected $id;

    /**
     * @ORM\Column(type="datetime")
     */
    protected $datum;

    /**
     * @ORM\ManyToOne(targetEntity=Training::class, inversedBy="inschrijvings")
     * @ORM\JoinColumn(nullable=false)
     */
    protected $training_id;

    /**
     * @ORM\ManyToOne(targetEntity=Klant::class, inversedBy="inschrijvings")
     * @ORM\JoinColumn(nullable=false)
     */
    protected $klant_id;

    /**
     * @ORM\ManyToOne(targetEntity=Hond::class, inversedBy="inschrijvings")
     * @ORM\JoinColumn(nullable=false)
     */
    protected $hond_id;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDatum(): ?\DateTimeInterface
    {
        return $this->datum;
    }

    public function setDatum(\DateTimeInterface $datum): self
    {
        $this->datum = $datum;

        return $this;
    }

    public function getTrainingId(): ?Training
    {
        return $this->training_id;
    }

    public function setTrainingId(?Training $training_id): self
    {
        $this->training_id = $training_id;

        return $this;
    }

    public function getKlantId(): ?Klant
    {
        return $this->klant_id;
    }

    public function setKlantId(?Klant $klant_id): self
    {
        $this->klant_id = $klant_id;

        return $this;
    }

    public function getHondId(): ?Hond
    {
        return $this->hond_id;
    }

    public function setHondId(?Hond $hond_id): self
    {
        $this->hond_id = $hond_id;

        return $this;
    }
}
