<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\TrainingRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ApiResource()
 * @ORM\Entity(repositoryClass=TrainingRepository::class)
 */
class Training
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
     * @ORM\Column(type="text")
     */
    private $omschrijving;

    /**
     * @ORM\Column(type="float")
     */
    private $prijs;

    /**
     * @ORM\OneToMany(targetEntity=Inschrijving::class, mappedBy="training", orphanRemoval=true)
     */
    private $inschrijvingen;

    public function __construct()
    {
        $this->inschrijvingen = new ArrayCollection();
    }

    public function __toString()
    {
        return $this->getNaam();
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

    public function getOmschrijving(): ?string
    {
        return $this->omschrijving;
    }

    public function setOmschrijving(string $omschrijving): self
    {
        $this->omschrijving = $omschrijving;

        return $this;
    }

    public function getPrijs(): ?float
    {
        return $this->prijs;
    }

    public function setPrijs(float $prijs): self
    {
        $this->prijs = $prijs;

        return $this;
    }

    public function initialize( array $data ): Training {
        
        $this->setNaam($data["naam"]);
        $this->setOmschrijving($data["omschrijving"]);
        $this->setPrijs($data["prijs"]);

        return $this;
    }

    /**
     * @return Collection<int, Inschrijving>
     */
    public function getInschrijvingen(): Collection
    {
        return $this->inschrijvingen;
    }

    public function addInschrijvingen(Inschrijving $inschrijvingen): self
    {
        if (!$this->inschrijvingen->contains($inschrijvingen)) {
            $this->inschrijvingen[] = $inschrijvingen;
            $inschrijvingen->setTraining($this);
        }

        return $this;
    }

    public function removeInschrijvingen(Inschrijving $inschrijvingen): self
    {
        if ($this->inschrijvingen->removeElement($inschrijvingen)) {
            // set the owning side to null (unless already changed)
            if ($inschrijvingen->getTraining() === $this) {
                $inschrijvingen->setTraining(null);
            }
        }

        return $this;
    }
}
