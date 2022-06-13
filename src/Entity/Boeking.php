<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\BoekingRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ApiResource()
 * @ORM\Entity(repositoryClass=BoekingRepository::class)
 */
class Boeking
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="date")
     */
    private $startdatum;

    /**
     * @ORM\Column(type="date")
     */
    private $einddatum;

    /**
     * @ORM\Column(type="integer")
     */
    private $klant_id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $referentie;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStartdatum(): ?\DateTimeInterface
    {
        return $this->startdatum;
    }

    public function setStartdatum(\DateTimeInterface $startdatum): self
    {
        $this->startdatum = $startdatum;

        return $this;
    }

    public function getEinddatum(): ?\DateTimeInterface
    {
        return $this->einddatum;
    }

    public function setEinddatum(\DateTimeInterface $einddatum): self
    {
        $this->einddatum = $einddatum;

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

    public function getReferentie(): ?string
    {
        return $this->referentie;
    }

    public function setReferentie(string $referentie): self
    {
        $this->referentie = $referentie;

        return $this;
    }
}
