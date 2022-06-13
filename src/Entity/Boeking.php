<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\BoekingRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
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
     * @ORM\Column(type="string", length=255)
     */
    private $referentie;

    /**
     * @ORM\ManyToOne(targetEntity=Klant::class, inversedBy="boekings")
     * @ORM\JoinColumn(nullable=false)
     */
    private $klant_id;

    /**
     * @ORM\OneToMany(targetEntity=BoekingDetail::class, mappedBy="boeking_id")
     */
    private $boekingDetails;

    public function __construct()
    {
        $this->boekingDetails = new ArrayCollection();
    }

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

    public function getReferentie(): ?string
    {
        return $this->referentie;
    }

    public function setReferentie(string $referentie): self
    {
        $this->referentie = $referentie;

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
            $boekingDetail->setBoekingId($this);
        }

        return $this;
    }

    public function removeBoekingDetail(BoekingDetail $boekingDetail): self
    {
        if ($this->boekingDetails->removeElement($boekingDetail)) {
            // set the owning side to null (unless already changed)
            if ($boekingDetail->getBoekingId() === $this) {
                $boekingDetail->setBoekingId(null);
            }
        }

        return $this;
    }
}
