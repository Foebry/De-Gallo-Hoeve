<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\BoekingRepository;
use App\Services\EntityLoader;
use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\MaxDepth;

/**
 * @ApiResource()
 * @ORM\Entity(repositoryClass=BoekingRepository::class)
 * 
 */
class Boeking extends AbstractEntity
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="datetime")
     */
    private $start;

    /**
     * @ORM\Column(type="date")
     */
    private $eind;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $referentie;

    /**
     * @ORM\OneToMany(targetEntity=BoekingDetail::class, mappedBy="boeking")
     * @MaxDepth(1)
     */
    private $details;

    /**
     * @ORM\ManyToOne(targetEntity=Klant::class, inversedBy="boekings")
     * @ORM\JoinColumn(nullable=false)
     * @MaxDepth(1)
     */
    private $klant;

    public function __construct()
    {
        $this->details = new ArrayCollection();
    }

    private function setId( $id ){
        $this->id = $id;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStart(): ?\DateTimeInterface
    {
        return $this->start;
    }

    public function setStart(\DateTimeInterface $start): self
    {
        $this->start = $start;

        return $this;
    }

    public function getEind(): ?\DateTimeInterface
    {
        return $this->eind;
    }

    public function setEind(\DateTimeInterface $eind): self
    {
        $this->eind = $eind;

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

    public function getKlantNaam(): string {
        return $this->getKlant()->getFullName();
    }

    public function getHonden(): array {
        $honden = [];
        $details = $this->getDetails();
        foreach($details as $detail){
            $honden[] = $detail->getHond();
        }

        return $honden;
    }

    public function initialize( array $data, EntityLoader $loader ): Boeking {

        $this->setId( $data["id"] ?? null );
        $this->setEind(new DateTime($data["eind"]));
        $this->setStart( new DateTime($data["start"]));
        $this->setReferentie($data["referentie"] ?? $loader->getHelper()->generateRandomString());
        $this->setKlant( $loader->getKlantBy(["id", $data["klant_id"]]) );

        return $this;
    }

    /**
     * @return Collection<int, BoekingDetail>
     */
    public function getDetails(): Collection
    {
        return $this->details;
    }

    public function addDetail(BoekingDetail $detail): self
    {
        if (!$this->details->contains($detail)) {
            $this->details[] = $detail;
            $detail->setBoeking($this);
        }

        return $this;
    }

    public function removeDetail(BoekingDetail $detail): self
    {
        if ($this->details->removeElement($detail)) {
            // set the owning side to null (unless already changed)
            if ($detail->getBoeking() === $this) {
                $detail->setBoeking(null);
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
}
