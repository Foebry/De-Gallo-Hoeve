<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\KennelRepository;
use Doctrine\ORM\Mapping as ORM;

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
     * @ORM\Column(type="integer")
     */
    private $breedte;

    /**
     * @ORM\Column(type="integer")
     */
    private $lengte;

    /**
     * @ORM\Column(type="integer")
     */
    private $hoogte;

    /**
     * @ORM\Column(type="text")
     */
    private $omschrijving;

    /**
     * @ORM\Column(type="float")
     */
    private $prijs;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getBreedte(): ?int
    {
        return $this->breedte;
    }

    public function setBreedte(int $breedte): self
    {
        $this->breedte = $breedte;

        return $this;
    }

    public function getLengte(): ?int
    {
        return $this->lengte;
    }

    public function setLengte(int $lengte): self
    {
        $this->lengte = $lengte;

        return $this;
    }

    public function getHoogte(): ?int
    {
        return $this->hoogte;
    }

    public function setHoogte(int $hoogte): self
    {
        $this->hoogte = $hoogte;

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
}
