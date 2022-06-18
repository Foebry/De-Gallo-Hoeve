<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220618104912 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE boeking CHANGE start start DATETIME NOT NULL, CHANGE referentie referentie VARCHAR(255) NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE boeking CHANGE start start DATE NOT NULL, CHANGE referentie referentie VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE hond CHANGE klant_id klant_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE klant CHANGE roles roles LONGTEXT DEFAULT NULL COMMENT \'(DC2Type:json)\'');
    }
}
