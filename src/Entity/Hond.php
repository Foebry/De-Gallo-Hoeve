<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\HondRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
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
     * @ORM\OneToMany(targetEntity=Inschrijving::class, mappedBy="hond_id")
     */
    private $inschrijvings;

    /**
     * @ORM\ManyToOne(targetEntity=Ras::class, inversedBy="honds")
     * @ORM\JoinColumn(nullable=false)
     */
    private $ras_id;

    /**
     * @ORM\ManyToOne(targetEntity=Klant::class, inversedBy="honds")
     * @ORM\JoinColumn(nullable=false)
     */
    private $klant_id;

    /**
     * @ORM\OneToMany(targetEntity=BoekingDetail::class, mappedBy="hond_id")
     */
    private $boekingDetails;

    public function __construct()
    {
        $this->inschrijvings = new ArrayCollection();
        $this->boekingDetails = new ArrayCollection();
    }

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

    /**
     * @return Collection<int, Inschrijving>
     */
    public function getInschrijvings(): Collection
    {
        return $this->inschrijvings;
    }

    public function addInschrijving(Inschrijving $inschrijving): self
    {
        if (!$this->inschrijvings->contains($inschrijving)) {
            $this->inschrijvings[] = $inschrijving;
            $inschrijving->setHondId($this);
        }

        return $this;
    }

    public function removeInschrijving(Inschrijving $inschrijving): self
    {
        if ($this->inschrijvings->removeElement($inschrijving)) {
            // set the owning side to null (unless already changed)
            if ($inschrijving->getHondId() === $this) {
                $inschrijving->setHondId(null);
            }
        }

        return $this;
    }

    public function getRasId(): ?Ras
    {
        return $this->ras_id;
    }

    public function setRasId(?Ras $ras_id): self
    {
        $this->ras_id = $ras_id;

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

    /**
     * @return Collection<int, BoekingDetail>
     */
    public function getBoekingDetails(): Collection
    {
        return $this->boekingDetails;
    }

    public function addBoekingDetail(BoekingDetail $boekingDetail): self
    {
        if (!$this->boekingDetails->contains($boekingDetail)) {
            $this->boekingDetails[] = $boekingDetail;
            $boekingDetail->setHondId($this);
        }

        return $this;
    }

    public function removeBoekingDetail(BoekingDetail $boekingDetail): self
    {
        if ($this->boekingDetails->removeElement($boekingDetail)) {
            // set the owning side to null (unless already changed)
            if ($boekingDetail->getHondId() === $this) {
                $boekingDetail->setHondId(null);
            }
        }

        return $this;
    }
}
