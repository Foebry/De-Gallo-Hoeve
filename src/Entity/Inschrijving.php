<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\InschrijvingRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ApiResource()
 * @ORM\Entity(repositoryClass=InschrijvingRepository::class)
 */
class Inschrijving
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="datetime")
     */
    private $datum;

    /**
     * @ORM\Column(type="integer")
     */
    private $klant_id;

    /**
     * @ORM\Column(type="integer")
     */
    private $hond_id;

    /**
     * @ORM\Column(type="integer")
     */
    private $training_id;

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

    public function getKlantId(): ?int
    {
        return $this->klant_id;
    }

    public function setKlantId(int $klant_id): self
    {
        $this->klant_id = $klant_id;

        return $this;
    }

    public function getHondId(): ?int
    {
        return $this->hond_id;
    }

    public function setHondId(int $hond_id): self
    {
        $this->hond_id = $hond_id;

        return $this;
    }

    public function getTrainingId(): ?int
    {
        return $this->training_id;
    }

    public function setTrainingId(int $training_id): self
    {
        $this->training_id = $training_id;

        return $this;
    }
}
