<?php

namespace App\Entity;

use App\Repository\KlantRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\MaxDepth;

/**
 * @ORM\Entity(repositoryClass=KlantRepository::class)
 */
class Klant extends AbstractEntity implements UserInterface, PasswordAuthenticatedUserInterface
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
     * @ORM\Column(type="string", length=255)
     */
    private $gsm;

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
     * @ORM\OneToMany(targetEntity=Boeking::class, mappedBy="klant", orphanRemoval=true)
     * @MaxDepth(1)
     */
    private $boekingen;

    /**
     * @ORM\OneToMany(targetEntity=Hond::class, mappedBy="klant", orphanRemoval=true)
     * @MaxDepth(1)
     */
    private $honden;

    /**
     * @ORM\OneToMany(targetEntity=Inschrijving::class, mappedBy="klant", orphanRemoval=true)
     * @MaxDepth(1)
     */
    private $inschrijvingen;

    public function __construct()
    {
        $this->boekingen = new ArrayCollection();
        $this->honden = new ArrayCollection();
        $this->inschrijvingen = new ArrayCollection();
    }

    public function __toString()
    {
        return $this->getFullName();
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

    public function getFullName(): string {
        return $this->getVnaam()." ".$this->getLnaam();
    }

    public function getAuthorization(): string {
        $roles = array_values( $this->getRoles() );
        if( in_array( "ROLE_ADMIN", $roles ) ) return "ADMIN";
        elseif( in_array( "ROLE_USER", $roles ) ) return "KLANT";
        else return "NONE";
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

    public function getGsm(): ?string
    {
        return $this->gsm;
    }

    public function setGsm(string $gsm): self
    {
        $this->gsm = $gsm;

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

    public function setVerified(?bool $verified): self
    {
        $this->verified = $verified;

        return $this;
    }

    public function initialize( array $payload ): Klant {  
        
        $this->setEmail($payload["email"]);
        $this->setGemeente($payload["gemeente"]);
        $this->setGsm($payload["gsm"]);
        $this->setLnaam($payload["lnaam"]);
        $this->setNr($payload["nr"]);
        $this->setPassword( password_hash($payload["password"], 1));
        $this->setPostcode($payload["postcode"]);
        $this->setStraat($payload["straat"]);
        $this->setVerified(0);
        $this->setVnaam($payload["vnaam"]);
        $this->setRoles([]);

        return $this;
    }

    public function isOwnerOf( Hond $hond ): bool{

        $honden = $this->getHonden();
        foreach( $honden as $huisdier ){
            if( $hond->getId() === $huisdier->getId() ) return true;
        }
        return false;
    }

    /**
     * @return Collection<int, Boeking>
     */
    public function getBoekingen(): Collection
    {
        return $this->boekingen;
    }

    public function addBoekingen(Boeking $boekingen): self
    {
        if (!$this->boekingen->contains($boekingen)) {
            $this->boekingen[] = $boekingen;
            $boekingen->setKlant($this);
        }

        return $this;
    }

    public function removeBoekingen(Boeking $boekingen): self
    {
        if ($this->boekingen->removeElement($boekingen)) {
            // set the owning side to null (unless already changed)
            if ($boekingen->getKlant() === $this) {
                $boekingen->setKlant(null);
            }
        }

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
            $honden->setKlant($this);
        }

        return $this;
    }

    public function removeHonden(Hond $honden): self
    {
        if ($this->honden->removeElement($honden)) {
            // set the owning side to null (unless already changed)
            if ($honden->getKlant() === $this) {
                $honden->setKlant(null);
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
            $inschrijvingen->setKlant($this);
        }

        return $this;
    }

    public function removeInschrijvingen(Inschrijving $inschrijvingen): self
    {
        if ($this->inschrijvingen->removeElement($inschrijvingen)) {
            // set the owning side to null (unless already changed)
            if ($inschrijvingen->getKlant() === $this) {
                $inschrijvingen->setKlant(null);
            }
        }

        return $this;
    }
}
