<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\KennelRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\MaxDepth;

/**
 * @ApiResource()
 * @ORM\Entity(repositoryClass=KennelRepository::class)
 */
class Kennel
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="text")
     */
    private $omschrijving;

    /**
     * @ORM\Column(type="float")
     */
    private $prijs;

    /**
     * @ORM\OneToMany(targetEntity=BoekingDetail::class, mappedBy="kennel")
     */
    private $boekings;

    public function __construct()
    {
        $this->boekings = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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
    public function initialize( array $data ): Kennel {
        
        $this->setOmschrijving($data["omschrijving"]);
        $this->setPrijs($data["prijs"]);

        return $this;
    }

    /**
     * @return Collection<int, BoekingDetail>
     */
    public function getBoekings(): Collection
    {
        return $this->boekings;
    }

    public function addBoeking(BoekingDetail $boeking): self
    {
        if (!$this->boekings->contains($boeking)) {
            $this->boekings[] = $boeking;
            $boeking->setKennel($this);
        }

        return $this;
    }

    public function removeBoeking(BoekingDetail $boeking): self
    {
        if ($this->boekings->removeElement($boeking)) {
            // set the owning side to null (unless already changed)
            if ($boeking->getKennel() === $this) {
                $boeking->setKennel(null);
            }
        }

        return $this;
    }
}
