<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220613091326 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE punten_detail DROP FOREIGN KEY FK_6DA56532CB944F1A');
        $this->addSql('ALTER TABLE vak_teacher DROP FOREIGN KEY FK_3C9FC1AA41807E1D');
        $this->addSql('ALTER TABLE vak_teacher DROP FOREIGN KEY FK_3C9FC1AABDCC7DA2');
        $this->addSql('CREATE TABLE ras (id INT AUTO_INCREMENT NOT NULL, naam VARCHAR(255) NOT NULL, soort VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB');
        $this->addSql('DROP TABLE punten_detail');
        $this->addSql('DROP TABLE student');
        $this->addSql('DROP TABLE teacher');
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP TABLE vak');
        $this->addSql('DROP TABLE vak_teacher');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE punten_detail (id INT AUTO_INCREMENT NOT NULL, student_id INT NOT NULL, datum DATE DEFAULT NULL, aantal INT NOT NULL, INDEX IDX_6DA56532CB944F1A (student_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE student (id INT AUTO_INCREMENT NOT NULL, naam VARCHAR(255) CHARACTER SET utf8 NOT NULL COLLATE `utf8_unicode_ci`, voornaam VARCHAR(255) CHARACTER SET utf8 DEFAULT NULL COLLATE `utf8_unicode_ci`, geboortedatum DATE DEFAULT NULL, punten INT DEFAULT NULL, geslacht INT DEFAULT NULL, UNIQUE INDEX UNIQ_B723AF33FC4DB938 (naam), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE teacher (id INT AUTO_INCREMENT NOT NULL, naam VARCHAR(255) CHARACTER SET utf8 NOT NULL COLLATE `utf8_unicode_ci`, voornaam VARCHAR(255) CHARACTER SET utf8 DEFAULT NULL COLLATE `utf8_unicode_ci`, geboortedatum DATE DEFAULT NULL, specialisatie VARCHAR(255) CHARACTER SET utf8 DEFAULT NULL COLLATE `utf8_unicode_ci`, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) CHARACTER SET utf8 NOT NULL COLLATE `utf8_unicode_ci`, roles LONGTEXT CHARACTER SET utf8 NOT NULL COLLATE `utf8_unicode_ci` COMMENT \'(DC2Type:json)\', password VARCHAR(255) CHARACTER SET utf8 NOT NULL COLLATE `utf8_unicode_ci`, naam VARCHAR(255) CHARACTER SET utf8 DEFAULT NULL COLLATE `utf8_unicode_ci`, voornaam VARCHAR(255) CHARACTER SET utf8 DEFAULT NULL COLLATE `utf8_unicode_ci`, telefoon VARCHAR(50) CHARACTER SET utf8 DEFAULT NULL COLLATE `utf8_unicode_ci`, is_verified TINYINT(1) NOT NULL, UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE vak (id INT AUTO_INCREMENT NOT NULL, naam VARCHAR(255) CHARACTER SET utf8 NOT NULL COLLATE `utf8_unicode_ci`, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE vak_teacher (id INT AUTO_INCREMENT NOT NULL, teacher_id INT NOT NULL, vak_id INT NOT NULL, INDEX IDX_3C9FC1AA41807E1D (teacher_id), INDEX IDX_3C9FC1AABDCC7DA2 (vak_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE punten_detail ADD CONSTRAINT FK_6DA56532CB944F1A FOREIGN KEY (student_id) REFERENCES student (id)');
        $this->addSql('ALTER TABLE vak_teacher ADD CONSTRAINT FK_3C9FC1AABDCC7DA2 FOREIGN KEY (vak_id) REFERENCES vak (id)');
        $this->addSql('ALTER TABLE vak_teacher ADD CONSTRAINT FK_3C9FC1AA41807E1D FOREIGN KEY (teacher_id) REFERENCES teacher (id)');
        $this->addSql('DROP TABLE ras');
    }
}
