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
     * @ORM\Column(type="integer")
     */
    private $hond_id;

    /**
     * @ORM\Column(type="integer")
     */
    private $boeking_id;

    /**
     * @ORM\Column(type="integer")
     */
    private $kennel_id;

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

    public function getId(): ?int
    {
        return $this->id;
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

    public function getBoekingId(): ?int
    {
        return $this->boeking_id;
    }

    public function setBoekingId(int $boeking_id): self
    {
        $this->boeking_id = $boeking_id;

        return $this;
    }

    public function getKennelId(): ?int
    {
        return $this->kennel_id;
    }

    public function setKennelId(int $kennel_id): self
    {
        $this->kennel_id = $kennel_id;

        return $this;
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
}
