<?php

namespace App\Entity;

use App\Repository\DienstRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=DienstRepository::class)
 */
class Dienst
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $image;

    /**
     * @ORM\Column(type="text")
     */
    private $summary;

    /**
     * @ORM\Column(type="text")
     */
    private $summary_default;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $caption;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $link;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getImage(): ?string
    {
        return $this->image;
    }

    public function setImage(?string $image): self
    {
        $this->image = $image;

        return $this;
    }

    public function getSummary(): ?string
    {
        return base64_decode($this->summary);
    }

    public function setSummary(string $summary): self
    {   
        $this->summary = base64_encode(strip_tags(trim($summary)));

        return $this;
    }

    public function getSummaryDefault(): ?string
    {
        return $this->summary_default;
    }

    public function setSummaryDefault(string $summary_default): self
    {
        $this->summary_default = $summary_default;

        return $this;
    }

    public function getCaption(): ?string
    {
        return $this->caption;
    }

    public function setCaption(string $caption): self
    {
        $this->caption = $caption;

        return $this;
    }

    public function getLink(): ?string
    {
        return $this->link;
    }

    public function setLink(?string $link): self
    {
        $this->link = $link;

        return $this;
    }

    public function getLinks(): array {
        return [
            "/contact",
            "/index",
            "/training",
            "/hotel"
        ];
    }
}
