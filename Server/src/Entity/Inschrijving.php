<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\InschrijvingRepository;
use Doctrine\ORM\Mapping as ORM;
use DateTime;
use App\Services\EntityLoader;
use Symfony\Component\Serializer\Annotation\MaxDepth;

/**
 * @ApiResource()
 * @ORM\Entity(repositoryClass=InschrijvingRepository::class)
 */
class Inschrijving extends AbstractEntity
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
    private $datum;

    /**
     * @ORM\ManyToOne(targetEntity=Hond::class, inversedBy="inschrijvingen")
     * @ORM\JoinColumn(nullable=false)
     */
    private $hond;

    /**
     * @ORM\ManyToOne(targetEntity=Training::class, inversedBy="inschrijvingen")
     * @ORM\JoinColumn(nullable=false)
     */
    private $training;

    /**
     * @ORM\ManyToOne(targetEntity=Klant::class, inversedBy="inschrijvingen")
     * @ORM\JoinColumn(nullable=false)
     */
    private $klant;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDatum(): ?\DateTimeInterface
    {
        return $this->datum;
    }

    public function setDatum(\DateTimeInterface $datum): self
    {
        $this->datum = $datum;

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

    public function getTraining(): ?Training
    {
        return $this->training;
    }

    public function setTraining(?Training $training): self
    {
        $this->training = $training;

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

    public function initialize( array $data, EntityLoader $loader ): Inschrijving {
        
        $this->setDatum( new DateTime($data["datum"]) );
        $this->setHond( $loader->getHondById($data["hond_id"]) );
        $this->setKlant( $loader->getKlantBy( ["id", $data["klant_id"]] ) );
        $this->setTraining( $loader->getTrainingById($data["training_id"]) );

        return $this;
    }
}
