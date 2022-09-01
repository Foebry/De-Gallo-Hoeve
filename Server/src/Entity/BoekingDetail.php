<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\BoekingDetailRepository;
use Doctrine\ORM\Mapping as ORM;
use DateTime;
use App\Services\EntityLoader;
use Symfony\Component\Serializer\Annotation\MaxDepth;

/**
 * @ApiResource()
 * @ORM\Entity(repositoryClass=BoekingDetailRepository::class)
 */
class BoekingDetail extends AbstractEntity
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

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
     * @ORM\Column(type="boolean")
     */
    private $medicatie;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $extra;

    /**
     * @ORM\ManyToOne(targetEntity=Kennel::class, inversedBy="boekings")
     * @MaxDepth(1)
     */
    private $kennel;

    /**
     * @ORM\ManyToOne(targetEntity=Boeking::class, inversedBy="details")
     * @ORM\JoinColumn(nullable=false)
     * @MaxDepth(1)
     */
    private $boeking;

    /**
     * @ORM\ManyToOne(targetEntity=Hond::class, inversedBy="boekings")
     * @ORM\JoinColumn(nullable=false)
     * @MaxDepth(1)
     */
    public $hond;

    public function __toString()
    {
        return $this->getHond()->getNaam();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function isMedicatie(): ?bool
    {
        return $this->medicatie;
    }

    public function setMedicatie(bool $medicatie): self
    {
        $this->medicatie = $medicatie;

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

    public function initialize( array $data, EntityLoader $loader ): BoekingDetail {

        $this->setBoeking($data["Boeking"]);
        $this->setExtra($data["extra"] ?? "");
        $this->setHond( $loader->getHondById( $data["hond_id"] ) );
        $this->setKennel( $data["Kennel"] );
        $this->setLoops(new DateTime($data["loops"] ?? "1990-01-01") );
        $this->setMedicatie($data["medicatie"]);
        $this->setOntsnapping($data["ontsnapping"]);
        $this->setSociaal($data["sociaal"]);

        return $this;
    }

    public function getKennel(): ?Kennel
    {
        return $this->kennel;
    }

    public function setKennel(?Kennel $kennel): self
    {
        $this->kennel = $kennel;

        return $this;
    }

    public function getBoeking(): ?Boeking
    {
        return $this->boeking;
    }

    public function setBoeking(?Boeking $boeking): self
    {
        $this->boeking = $boeking;

        return $this;
    }

    public function getHond(): ?Hond
    {
        return $this->hond;
    }

    public function setHond(?Hond $hond): self
    {
        $this->hond = $hond;

        return $this;
    }
}
