<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220618091410 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE boeking (id INT AUTO_INCREMENT NOT NULL, klant_id INT NOT NULL, start DATE NOT NULL, eind DATE NOT NULL, referentie VARCHAR(255) DEFAULT NULL, INDEX IDX_AABCF57F3C427B2F (klant_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE boeking_detail (id INT AUTO_INCREMENT NOT NULL, kennel_id INT DEFAULT NULL, boeking_id INT NOT NULL, hond_id INT NOT NULL, loops DATE DEFAULT NULL, ontsnapping TINYINT(1) NOT NULL, sociaal TINYINT(1) NOT NULL, medicatie TINYINT(1) NOT NULL, extra LONGTEXT DEFAULT NULL, INDEX IDX_7FABAC0CF061503E (kennel_id), INDEX IDX_7FABAC0C92F000A8 (boeking_id), INDEX IDX_7FABAC0CD7D1D529 (hond_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE hond (id INT AUTO_INCREMENT NOT NULL, ras_id INT NOT NULL, klant_id INT NOT NULL, naam VARCHAR(255) NOT NULL, geboortedatum DATE NOT NULL, chip_nr VARCHAR(255) DEFAULT NULL, INDEX IDX_2DFC6F85B3F040C4 (ras_id), INDEX IDX_2DFC6F853C427B2F (klant_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE inschrijving (id INT AUTO_INCREMENT NOT NULL, hond_id INT NOT NULL, training_id INT NOT NULL, klant_id INT NOT NULL, datum DATETIME NOT NULL, INDEX IDX_1166587DD7D1D529 (hond_id), INDEX IDX_1166587DBEFD98D1 (training_id), INDEX IDX_1166587D3C427B2F (klant_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE kennel (id INT AUTO_INCREMENT NOT NULL, omschrijving LONGTEXT NOT NULL, prijs DOUBLE PRECISION NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE klant (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles LONGTEXT NOT NULL COMMENT \'(DC2Type:json)\', password VARCHAR(255) NOT NULL, vnaam VARCHAR(255) NOT NULL, lnaam VARCHAR(255) NOT NULL, gsm VARCHAR(255) NOT NULL, straat VARCHAR(255) NOT NULL, nr INT NOT NULL, gemeente VARCHAR(255) NOT NULL, postcode INT NOT NULL, verified TINYINT(1) DEFAULT NULL, UNIQUE INDEX UNIQ_BC33ABE1E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE ras (id INT AUTO_INCREMENT NOT NULL, naam VARCHAR(255) NOT NULL, soort VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE training (id INT AUTO_INCREMENT NOT NULL, naam VARCHAR(255) NOT NULL, omschrijving LONGTEXT NOT NULL, prijs DOUBLE PRECISION NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE boeking ADD CONSTRAINT FK_AABCF57F3C427B2F FOREIGN KEY (klant_id) REFERENCES klant (id)');
        $this->addSql('ALTER TABLE boeking_detail ADD CONSTRAINT FK_7FABAC0CF061503E FOREIGN KEY (kennel_id) REFERENCES kennel (id)');
        $this->addSql('ALTER TABLE boeking_detail ADD CONSTRAINT FK_7FABAC0C92F000A8 FOREIGN KEY (boeking_id) REFERENCES boeking (id)');
        $this->addSql('ALTER TABLE boeking_detail ADD CONSTRAINT FK_7FABAC0CD7D1D529 FOREIGN KEY (hond_id) REFERENCES hond (id)');
        $this->addSql('ALTER TABLE hond ADD CONSTRAINT FK_2DFC6F85B3F040C4 FOREIGN KEY (ras_id) REFERENCES ras (id)');
        $this->addSql('ALTER TABLE hond ADD CONSTRAINT FK_2DFC6F853C427B2F FOREIGN KEY (klant_id) REFERENCES klant (id)');
        $this->addSql('ALTER TABLE inschrijving ADD CONSTRAINT FK_1166587DD7D1D529 FOREIGN KEY (hond_id) REFERENCES hond (id)');
        $this->addSql('ALTER TABLE inschrijving ADD CONSTRAINT FK_1166587DBEFD98D1 FOREIGN KEY (training_id) REFERENCES training (id)');
        $this->addSql('ALTER TABLE inschrijving ADD CONSTRAINT FK_1166587D3C427B2F FOREIGN KEY (klant_id) REFERENCES klant (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE boeking_detail DROP FOREIGN KEY FK_7FABAC0C92F000A8');
        $this->addSql('ALTER TABLE boeking_detail DROP FOREIGN KEY FK_7FABAC0CD7D1D529');
        $this->addSql('ALTER TABLE inschrijving DROP FOREIGN KEY FK_1166587DD7D1D529');
        $this->addSql('ALTER TABLE boeking_detail DROP FOREIGN KEY FK_7FABAC0CF061503E');
        $this->addSql('ALTER TABLE boeking DROP FOREIGN KEY FK_AABCF57F3C427B2F');
        $this->addSql('ALTER TABLE hond DROP FOREIGN KEY FK_2DFC6F853C427B2F');
        $this->addSql('ALTER TABLE inschrijving DROP FOREIGN KEY FK_1166587D3C427B2F');
        $this->addSql('ALTER TABLE hond DROP FOREIGN KEY FK_2DFC6F85B3F040C4');
        $this->addSql('ALTER TABLE inschrijving DROP FOREIGN KEY FK_1166587DBEFD98D1');
        $this->addSql('DROP TABLE boeking');
        $this->addSql('DROP TABLE boeking_detail');
        $this->addSql('DROP TABLE hond');
        $this->addSql('DROP TABLE inschrijving');
        $this->addSql('DROP TABLE kennel');
        $this->addSql('DROP TABLE klant');
        $this->addSql('DROP TABLE ras');
        $this->addSql('DROP TABLE training');
    }
}
