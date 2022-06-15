<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\BoekingDetailRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ApiResource()
 * @ORM\Entity(repositoryClass=BoekingDetailRepository::class)
 */
class BoekingDetail
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="boolean")
     */
    private $medicatie;

    /**
     * @ORM\Column(type="date", nullable=true)
     */
    private $loops;

    /**
     * @ORM\Column(type="boolean")
     */
    private $ontsnapping;

    /**
     * @ORM\Column(type="boolean")
     */
    private $sociaal;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $extra;

    /**
     * @ORM\ManyToOne(targetEntity=Boeking::class, inversedBy="boekingDetails")
     * @ORM\JoinColumn(nullable=false)
     */
    private $boeking_id;

    /**
     * @ORM\ManyToOne(targetEntity=Hond::class, inversedBy="boekingDetails")
     * @ORM\JoinColumn(nullable=false)
     */
    private $hond_id;

    /**
     * @ORM\ManyToOne(targetEntity=Kennel::class, inversedBy="boekingDetails")
     * @ORM\JoinColumn(nullable=false)
     */
    private $kennel_id;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function isMedicatie(): ?bool
    {
        return $this->medicatie;
    }

    public function setMedicatie(bool $medicatie): self
    {
        $this->medicatie = $medicatie;

        return $this;
    }

    public function getLoops(): ?\DateTimeInterface
    {
        return $this->loops;
    }

    public function setLoops(?\DateTimeInterface $loops): self
    {
        $this->loops = $loops;

        return $this;
    }

    public function isOntsnapping(): ?bool
    {
        return $this->ontsnapping;
    }

    public function setOntsnapping(bool $ontsnapping): self
    {
        $this->ontsnapping = $ontsnapping;

        return $this;
    }

    public function isSociaal(): ?bool
    {
        return $this->sociaal;
    }

    public function setSociaal(bool $sociaal): self
    {
        $this->sociaal = $sociaal;

        return $this;
    }

    public function getExtra(): ?string
    {
        return $this->extra;
    }

    public function setExtra(?string $extra): self
    {
        $this->extra = $extra;

        return $this;
    }

    public function getBoekingId(): ?Boeking
    {
        return $this->boeking_id;
    }

    public function setBoekingId(?Boeking $boeking_id): self
    {
        $this->boeking_id = $boeking_id;

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

    public function getKennelId(): ?Kennel
    {
        return $this->kennel_id;
    }

    public function setKennelId(?Kennel $kennel_id): self
    {
        $this->kennel_id = $kennel_id;

        return $this;
    }
}
