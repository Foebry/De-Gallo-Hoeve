<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\RasRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\MaxDepth;

/**
 * @ApiResource()
 * @ORM\Entity(repositoryClass=RasRepository::class)
 */
class Ras
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
     * @ORM\Column(type="string", length=255)
     */
    private $soort;

    /**
     * @ORM\OneToMany(targetEntity=Hond::class, mappedBy="ras", orphanRemoval=true)
     */
    private $honden;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $avatar;

    public function __construct()
    {
        $this->honden = new ArrayCollection();
    }

    public function __toString()
    {
        return $this->naam;
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

    public function getSoort(): ?string
    {
        return $this->soort;
    }

    public function setSoort(string $soort): self
    {
        $this->soort = $soort;

        return $this;
    }

    public function initialize( array $data ): Ras {
        
        $this->setNaam($data["naam"]);
        $this->setSoort($data["soort"]);

        return $this;
    }

    /**
     * @return Collection<int, Hond>
     */
    public function getHonden(): Collection
    {
        return $this->honden;
    }

    public function addHonden(Hond $honden): self
    {
        if (!$this->honden->contains($honden)) {
            $this->honden[] = $honden;
            $honden->setRas($this);
        }

        return $this;
    }

    public function removeHonden(Hond $honden): self
    {
        if ($this->honden->removeElement($honden)) {
            // set the owning side to null (unless already changed)
            if ($honden->getRas() === $this) {
                $honden->setRas(null);
            }
        }

        return $this;
    }

    public function getAvatar(): ?string
    {
        return $this->avatar;
    }

    public function setAvatar(?string $avatar): self
    {
        $this->avatar = $avatar;

        return $this;
    }
}
