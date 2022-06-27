<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\HondRepository;
use App\Services\CustomHelper;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use DateTime;
use App\Services\EntityLoader;
use App\Services\Logger;
use Symfony\Component\Serializer\Annotation\MaxDepth;

/**
 * @ApiResource()
 * @ORM\Entity(repositoryClass=HondRepository::class)
 */
class Hond extends AbstractEntity
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
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $chip_nr;

    /**
     * @ORM\ManyToOne(targetEntity=Ras::class, inversedBy="honden")
     * @ORM\JoinColumn(nullable=false)
     * @MaxDepth(1)
     */
    private $ras;

    /**
     * @ORM\OneToMany(targetEntity=BoekingDetail::class, mappedBy="hond", orphanRemoval=true)µ
     * @MaxDepth(1)
     */
    private $boekings;

    /**
     * @ORM\OneToMany(targetEntity=Inschrijving::class, mappedBy="hond", orphanRemoval=true)
     */
    private $inschrijvingen;

    /**
     * @ORM\ManyToOne(targetEntity=Klant::class, inversedBy="honden")
     * @ORM\JoinColumn(nullable=false)
     */
    private $klant;

    /**
     * @ORM\Column(type="boolean")
     */
    private $geslacht;

    public function __construct()
    {
        $this->boekings = new ArrayCollection();
        $this->inschrijvingen = new ArrayCollection();
        $this->helper = new CustomHelper();
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

    public function getGeboortedatum(): ?\DateTimeInterface
    {
        return $this->geboortedatum;
    }

    public function setGeboortedatum(\DateTimeInterface $geboortedatum): self
    {
        $this->geboortedatum = $geboortedatum;

        return $this;
    }

    public function getChipNr(): ?string
    {
        return $this->chip_nr;
    }

    public function setChipNr(?string $chip_nr): self
    {   
        
        $this->chip_nr = $chip_nr ?? $this->helper->generateRandomString();

        return $this;
    }

    public function getRas(): ?Ras
    {
        return $this->ras;
    }

    public function setRas(?Ras $ras): self
    {
        $this->ras = $ras;

        return $this;
    }

    public function getKlantNaam(): string {
        return $this->klant->getFullName();
    }

    public function getGender(): string {
        return $this->geslacht ? "Reu" : "Teef";
    }

    public function getRasNaam(): string {
        return $this->ras->getNaam();
    }

    public function initialize( array $data, EntityLoader $loader ): Hond {
        
        $this->setNaam($data["naam"]);
        $this->setRas( $loader->getRasById( $data["ras_id"] ) );
        $this->setGeboortedatum(new DateTime($data["geboortedatum"]));
        $this->setChipNr($data["chip_nr"] ?? $loader->getHelper()->generateRandomString());
        $this->setGeslacht( $data["geslacht"] );
        $this->setKlant( $data["Klant"] );
        
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
            $boeking->setHond($this);
        }

        return $this;
    }

    public function removeBoeking(BoekingDetail $boeking): self
    {
        if ($this->boekings->removeElement($boeking)) {
            // set the owning side to null (unless already changed)
            if ($boeking->getHond() === $this) {
                $boeking->setHond(null);
            }
        }

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
            $inschrijvingen->setHond($this);
        }

        return $this;
    }

    public function removeInschrijvingen(Inschrijving $inschrijvingen): self
    {
        if ($this->inschrijvingen->removeElement($inschrijvingen)) {
            // set the owning side to null (unless already changed)
            if ($inschrijvingen->getHond() === $this) {
                $inschrijvingen->setHond(null);
            }
        }

        return $this;
    }

    public function getKlant(): ?Klant
    {
        return $this->klant;
    }

    public function setKlant(?Klant $klant): self
    {
        $this->klant = $klant;

        return $this;
    }

    public function isGeslacht(): ?bool
    {
        return $this->geslacht;
    }

    public function setGeslacht(bool $geslacht): self
    {
        $this->geslacht = $geslacht;

        return $this;
    }
}
