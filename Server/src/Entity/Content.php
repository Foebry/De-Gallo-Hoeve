<?php

namespace App\Entity;

use App\Repository\ContentRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ContentRepository::class)
 */
class Content
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
    private $subtitle;

    /**
     * @ORM\Column(type="text")
     */
    private $content;

    /**
     * @ORM\Column(type="text")
     */
    private $default_content;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSubtitle(): ?string
    {
        return $this->subtitle;
    }

    public function setSubtitle(?string $subtitle): self
    {
        $this->subtitle = $subtitle;

        return $this;
    }

    public function getContent(): ?string
    {   
        return str_replace("\n", "<br>", base64_decode($this->content));
    }

    public function setContent(string $content): self
    {
        $content = str_replace("<br>", "\n", $content);

        $this->content = base64_encode(strip_tags(trim($content)));

        return $this;
    }

    public function getDefaultContent(): ?string
    {
        return $this->default_content;
    }

    public function setDefaultContent(string $default_content): self
    {
        $this->default_content = $default_content;

        return $this;
    }

    public function getShort(): string {
        $content = $this->getContent();

        return implode(" ", array_slice(explode(" ", $content), 0, 12));
    }
}
