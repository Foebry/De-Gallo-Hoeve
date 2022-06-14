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
class Training extends AbstractClass
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
     * @ORM\OneToMany(targetEntity=Inschrijving::class, mappedBy="training_id")
     */
    private $inschrijvings;

    public function __construct()
    {
        $this->inschrijvings = new ArrayCollection();
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
            $inschrijving->setTrainingId($this);
        }

        return $this;
    }

    public function removeInschrijving(Inschrijving $inschrijving): self
    {
        if ($this->inschrijvings->removeElement($inschrijving)) {
            // set the owning side to null (unless already changed)
            if ($inschrijving->getTrainingId() === $this) {
                $inschrijving->setTrainingId(null);
            }
        }

        return $this;
    }
}
