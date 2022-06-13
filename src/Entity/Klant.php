<?php

namespace App\Entity;

use App\Repository\KlantRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @ORM\Entity(repositoryClass=KlantRepository::class)
 */
class Klant implements UserInterface, PasswordAuthenticatedUserInterface
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=180, unique=true)
     */
    private $email;

    /**
     * @ORM\Column(type="json")
     */
    private $roles = [];

    /**
     * @var string The hashed password
     * @ORM\Column(type="string")
     */
    private $password;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $vnaam;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $lnaam;

    /**
     * @ORM\Column(type="string", length=20)
     */
    private $telefoon;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $straat;

    /**
     * @ORM\Column(type="integer")
     */
    private $nr;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $gemeente;

    /**
     * @ORM\Column(type="integer")
     */
    private $postcode;

    /**
     * @ORM\Column(type="boolean")
     */
    private $verified;

    /**
     * @ORM\OneToMany(targetEntity=Inschrijving::class, mappedBy="klant_id")
     */
    private $inschrijvings;

    /**
     * @ORM\OneToMany(targetEntity=Hond::class, mappedBy="klant_id")
     */
    private $honds;

    /**
     * @ORM\OneToMany(targetEntity=Boeking::class, mappedBy="klant_id")
     */
    private $boekings;

    public function __construct()
    {
        $this->inschrijvings = new ArrayCollection();
        $this->honds = new ArrayCollection();
        $this->boekings = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @deprecated since Symfony 5.3, use getUserIdentifier instead
     */
    public function getUsername(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * Returning a salt is only needed, if you are not using a modern
     * hashing algorithm (e.g. bcrypt or sodium) in your security.yaml.
     *
     * @see UserInterface
     */
    public function getSalt(): ?string
    {
        return null;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getVnaam(): ?string
    {
        return $this->vnaam;
    }

    public function setVnaam(string $vnaam): self
    {
        $this->vnaam = $vnaam;

        return $this;
    }

    public function getLnaam(): ?string
    {
        return $this->lnaam;
    }

    public function setLnaam(string $lnaam): self
    {
        $this->lnaam = $lnaam;

        return $this;
    }

    public function getTelefoon(): ?string
    {
        return $this->telefoon;
    }

    public function setTelefoon(string $telefoon): self
    {
        $this->telefoon = $telefoon;

        return $this;
    }

    public function getStraat(): ?string
    {
        return $this->straat;
    }

    public function setStraat(string $straat): self
    {
        $this->straat = $straat;

        return $this;
    }

    public function getNr(): ?int
    {
        return $this->nr;
    }

    public function setNr(int $nr): self
    {
        $this->nr = $nr;

        return $this;
    }

    public function getGemeente(): ?string
    {
        return $this->gemeente;
    }

    public function setGemeente(string $gemeente): self
    {
        $this->gemeente = $gemeente;

        return $this;
    }

    public function getPostcode(): ?int
    {
        return $this->postcode;
    }

    public function setPostcode(int $postcode): self
    {
        $this->postcode = $postcode;

        return $this;
    }

    public function isVerified(): ?bool
    {
        return $this->verified;
    }

    public function setVerified(bool $verified): self
    {
        $this->verified = $verified;

        return $this;
    }

    /**
     * @return Collection<int, Inschrijving>
     */
    public function getInschrijvings(): Collection
    {
        return $this->inschrijvings;
    }

    public function addInschrijving(Inschrijving $inschrijving): self
    {
        if (!$this->inschrijvings->contains($inschrijving)) {
            $this->inschrijvings[] = $inschrijving;
            $inschrijving->setKlantId($this);
        }

        return $this;
    }

    public function removeInschrijving(Inschrijving $inschrijving): self
    {
        if ($this->inschrijvings->removeElement($inschrijving)) {
            // set the owning side to null (unless already changed)
            if ($inschrijving->getKlantId() === $this) {
                $inschrijving->setKlantId(null);
            }
        }

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
            $hond->setKlantId($this);
        }

        return $this;
    }

    public function removeHond(Hond $hond): self
    {
        if ($this->honds->removeElement($hond)) {
            // set the owning side to null (unless already changed)
            if ($hond->getKlantId() === $this) {
                $hond->setKlantId(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Boeking>
     */
    public function getBoekings(): Collection
    {
        return $this->boekings;
    }

    public function addBoeking(Boeking $boeking): self
    {
        if (!$this->boekings->contains($boeking)) {
            $this->boekings[] = $boeking;
            $boeking->setKlantId($this);
        }

        return $this;
    }

    public function removeBoeking(Boeking $boeking): self
    {
        if ($this->boekings->removeElement($boeking)) {
            // set the owning side to null (unless already changed)
            if ($boeking->getKlantId() === $this) {
                $boeking->setKlantId(null);
            }
        }

        return $this;
    }
}
