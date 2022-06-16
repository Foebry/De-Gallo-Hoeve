<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\RasRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ApiResource()
 * @ORM\Entity(repositoryClass=RasRepository::class)
 */
class Ras extends AbstractClass
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(name="id")
     * @groups({"honds: read"})
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
     * @ORM\OneToMany(targetEntity=Hond::class, mappedBy="ras_id")
     */
    private $honds;

    public function __construct()
    {
        $this->honds = new ArrayCollection();
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

    /**
     * @return Collection<int, Hond>
     */
    public function getHonds(): Collection
    {
        return $this->honds;
    }

    public function addHond(Hond $hond): self
    {
        if (!$this->honds->contains($hond)) {
            $this->honds[] = $hond;
            $hond->setRasId($this);
        }

        return $this;
    }

    public function removeHond(Hond $hond): self
    {
        if ($this->honds->removeElement($hond)) {
            // set the owning side to null (unless already changed)
            if ($hond->getRasId() === $this) {
                $hond->setRasId(null);
            }
        }

        return $this;
    }
}
