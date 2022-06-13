<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\HondRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ApiResource()
 * @ORM\Entity(repositoryClass=HondRepository::class)
 */
class Hond
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $naam;

    /**
     * @ORM\Column(type="date")
     */
    private $geboortedatum;

    /**
     * @ORM\Column(type="integer")
     */
    private $ras_id;

    /**
     * @ORM\Column(type="integer")
     */
    private $klant_id;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNaam(): ?string
    {
        return $this->naam;
    }

    public function setNaam(string $naam): self
    {
        $this->naam = $naam;

        return $this;
    }

    public function getGeboortedatum(): ?\DateTimeInterface
    {
        return $this->geboortedatum;
    }

    public function setGeboortedatum(\DateTimeInterface $geboortedatum): self
    {
        $this->geboortedatum = $geboortedatum;

        return $this;
    }

    public function getRasId(): ?int
    {
        return $this->ras_id;
    }

    public function setRasId(int $ras_id): self
    {
        $this->ras_id = $ras_id;

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
}
