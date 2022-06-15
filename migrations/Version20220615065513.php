<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220615065513 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE boeking DROP FOREIGN KEY FK_AABCF57F1494450');
        $this->addSql('DROP INDEX IDX_AABCF57F1494450 ON boeking');
        $this->addSql('ALTER TABLE boeking CHANGE referentie referentie VARCHAR(255) NOT NULL, CHANGE klant_id klant_id_id INT NOT NULL');
        $this->addSql('ALTER TABLE boeking ADD CONSTRAINT FK_AABCF57F1494450 FOREIGN KEY (klant_id_id) REFERENCES klant (id)');
        $this->addSql('CREATE INDEX IDX_AABCF57F1494450 ON boeking (klant_id_id)');
        $this->addSql('ALTER TABLE boeking_detail DROP FOREIGN KEY FK_7FABAC0CC8BA01C0');
        $this->addSql('ALTER TABLE boeking_detail DROP FOREIGN KEY FK_7FABAC0C5C466B90');
        $this->addSql('ALTER TABLE boeking_detail DROP FOREIGN KEY FK_7FABAC0CC973B66');
        $this->addSql('DROP INDEX IDX_7FABAC0CC8BA01C0 ON boeking_detail');
        $this->addSql('DROP INDEX IDX_7FABAC0CC973B66 ON boeking_detail');
        $this->addSql('DROP INDEX IDX_7FABAC0C5C466B90 ON boeking_detail');
        $this->addSql('ALTER TABLE boeking_detail ADD boeking_id_id INT NOT NULL, ADD hond_id_id INT NOT NULL, ADD kennel_id_id INT NOT NULL, DROP hond_id, DROP boeking_id, DROP kennel_id');
        $this->addSql('ALTER TABLE boeking_detail ADD CONSTRAINT FK_7FABAC0CC8BA01C0 FOREIGN KEY (kennel_id_id) REFERENCES kennel (id)');
        $this->addSql('ALTER TABLE boeking_detail ADD CONSTRAINT FK_7FABAC0C5C466B90 FOREIGN KEY (hond_id_id) REFERENCES hond (id)');
        $this->addSql('ALTER TABLE boeking_detail ADD CONSTRAINT FK_7FABAC0CC973B66 FOREIGN KEY (boeking_id_id) REFERENCES boeking (id)');
        $this->addSql('CREATE INDEX IDX_7FABAC0CC8BA01C0 ON boeking_detail (kennel_id_id)');
        $this->addSql('CREATE INDEX IDX_7FABAC0CC973B66 ON boeking_detail (boeking_id_id)');
        $this->addSql('CREATE INDEX IDX_7FABAC0C5C466B90 ON boeking_detail (hond_id_id)');
        $this->addSql('ALTER TABLE hond DROP FOREIGN KEY FK_2DFC6F85BD234606');
        $this->addSql('ALTER TABLE hond DROP FOREIGN KEY FK_2DFC6F851494450');
        $this->addSql('DROP INDEX IDX_2DFC6F85BD234606 ON hond');
        $this->addSql('DROP INDEX IDX_2DFC6F851494450 ON hond');
        $this->addSql('ALTER TABLE hond ADD ras_id_id INT NOT NULL, ADD klant_id_id INT NOT NULL, DROP ras_id, DROP klant_id');
        $this->addSql('ALTER TABLE hond ADD CONSTRAINT FK_2DFC6F85BD234606 FOREIGN KEY (ras_id_id) REFERENCES ras (id)');
        $this->addSql('ALTER TABLE hond ADD CONSTRAINT FK_2DFC6F851494450 FOREIGN KEY (klant_id_id) REFERENCES klant (id)');
        $this->addSql('CREATE INDEX IDX_2DFC6F85BD234606 ON hond (ras_id_id)');
        $this->addSql('CREATE INDEX IDX_2DFC6F851494450 ON hond (klant_id_id)');
        $this->addSql('ALTER TABLE inschrijving DROP FOREIGN KEY FK_1166587D5C466B90');
        $this->addSql('ALTER TABLE inschrijving DROP FOREIGN KEY FK_1166587D1494450');
        $this->addSql('ALTER TABLE inschrijving DROP FOREIGN KEY FK_1166587D909E143A');
        $this->addSql('DROP INDEX IDX_1166587D5C466B90 ON inschrijving');
        $this->addSql('DROP INDEX IDX_1166587D909E143A ON inschrijving');
        $this->addSql('DROP INDEX IDX_1166587D1494450 ON inschrijving');
        $this->addSql('ALTER TABLE inschrijving ADD training_id_id INT NOT NULL, ADD klant_id_id INT NOT NULL, ADD hond_id_id INT NOT NULL, DROP klant_id, DROP hond_id, DROP training_id');
        $this->addSql('ALTER TABLE inschrijving ADD CONSTRAINT FK_1166587D5C466B90 FOREIGN KEY (hond_id_id) REFERENCES hond (id)');
        $this->addSql('ALTER TABLE inschrijving ADD CONSTRAINT FK_1166587D1494450 FOREIGN KEY (klant_id_id) REFERENCES klant (id)');
        $this->addSql('ALTER TABLE inschrijving ADD CONSTRAINT FK_1166587D909E143A FOREIGN KEY (training_id_id) REFERENCES training (id)');
        $this->addSql('CREATE INDEX IDX_1166587D5C466B90 ON inschrijving (hond_id_id)');
        $this->addSql('CREATE INDEX IDX_1166587D909E143A ON inschrijving (training_id_id)');
        $this->addSql('CREATE INDEX IDX_1166587D1494450 ON inschrijving (klant_id_id)');
        $this->addSql('ALTER TABLE kennel DROP naam');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE boeking DROP FOREIGN KEY FK_AABCF57F1494450');
        $this->addSql('DROP INDEX IDX_AABCF57F1494450 ON boeking');
        $this->addSql('ALTER TABLE boeking CHANGE referentie referentie VARCHAR(255) DEFAULT NULL, CHANGE klant_id_id klant_id INT NOT NULL');
        $this->addSql('ALTER TABLE boeking ADD CONSTRAINT FK_AABCF57F1494450 FOREIGN KEY (klant_id) REFERENCES klant (id)');
        $this->addSql('CREATE INDEX IDX_AABCF57F1494450 ON boeking (klant_id)');
        $this->addSql('ALTER TABLE boeking_detail DROP FOREIGN KEY FK_7FABAC0CC973B66');
        $this->addSql('ALTER TABLE boeking_detail DROP FOREIGN KEY FK_7FABAC0C5C466B90');
        $this->addSql('ALTER TABLE boeking_detail DROP FOREIGN KEY FK_7FABAC0CC8BA01C0');
        $this->addSql('DROP INDEX IDX_7FABAC0CC973B66 ON boeking_detail');
        $this->addSql('DROP INDEX IDX_7FABAC0C5C466B90 ON boeking_detail');
        $this->addSql('DROP INDEX IDX_7FABAC0CC8BA01C0 ON boeking_detail');
        $this->addSql('ALTER TABLE boeking_detail ADD hond_id INT NOT NULL, ADD boeking_id INT NOT NULL, ADD kennel_id INT NOT NULL, DROP boeking_id_id, DROP hond_id_id, DROP kennel_id_id');
        $this->addSql('ALTER TABLE boeking_detail ADD CONSTRAINT FK_7FABAC0CC973B66 FOREIGN KEY (boeking_id) REFERENCES boeking (id)');
        $this->addSql('ALTER TABLE boeking_detail ADD CONSTRAINT FK_7FABAC0C5C466B90 FOREIGN KEY (hond_id) REFERENCES hond (id)');
        $this->addSql('ALTER TABLE boeking_detail ADD CONSTRAINT FK_7FABAC0CC8BA01C0 FOREIGN KEY (kennel_id) REFERENCES kennel (id)');
        $this->addSql('CREATE INDEX IDX_7FABAC0CC973B66 ON boeking_detail (boeking_id)');
        $this->addSql('CREATE INDEX IDX_7FABAC0C5C466B90 ON boeking_detail (hond_id)');
        $this->addSql('CREATE INDEX IDX_7FABAC0CC8BA01C0 ON boeking_detail (kennel_id)');
        $this->addSql('ALTER TABLE hond DROP FOREIGN KEY FK_2DFC6F85BD234606');
        $this->addSql('ALTER TABLE hond DROP FOREIGN KEY FK_2DFC6F851494450');
        $this->addSql('DROP INDEX IDX_2DFC6F85BD234606 ON hond');
        $this->addSql('DROP INDEX IDX_2DFC6F851494450 ON hond');
        $this->addSql('ALTER TABLE hond ADD ras_id INT NOT NULL, ADD klant_id INT NOT NULL, DROP ras_id_id, DROP klant_id_id');
        $this->addSql('ALTER TABLE hond ADD CONSTRAINT FK_2DFC6F85BD234606 FOREIGN KEY (ras_id) REFERENCES ras (id)');
        $this->addSql('ALTER TABLE hond ADD CONSTRAINT FK_2DFC6F851494450 FOREIGN KEY (klant_id) REFERENCES klant (id)');
        $this->addSql('CREATE INDEX IDX_2DFC6F85BD234606 ON hond (ras_id)');
        $this->addSql('CREATE INDEX IDX_2DFC6F851494450 ON hond (klant_id)');
        $this->addSql('ALTER TABLE inschrijving DROP FOREIGN KEY FK_1166587D909E143A');
        $this->addSql('ALTER TABLE inschrijving DROP FOREIGN KEY FK_1166587D1494450');
        $this->addSql('ALTER TABLE inschrijving DROP FOREIGN KEY FK_1166587D5C466B90');
        $this->addSql('DROP INDEX IDX_1166587D909E143A ON inschrijving');
        $this->addSql('DROP INDEX IDX_1166587D1494450 ON inschrijving');
        $this->addSql('DROP INDEX IDX_1166587D5C466B90 ON inschrijving');
        $this->addSql('ALTER TABLE inschrijving ADD klant_id INT NOT NULL, ADD hond_id INT NOT NULL, ADD training_id INT NOT NULL, DROP training_id_id, DROP klant_id_id, DROP hond_id_id');
        $this->addSql('ALTER TABLE inschrijving ADD CONSTRAINT FK_1166587D909E143A FOREIGN KEY (training_id) REFERENCES training (id)');
        $this->addSql('ALTER TABLE inschrijving ADD CONSTRAINT FK_1166587D1494450 FOREIGN KEY (klant_id) REFERENCES klant (id)');
        $this->addSql('ALTER TABLE inschrijving ADD CONSTRAINT FK_1166587D5C466B90 FOREIGN KEY (hond_id) REFERENCES hond (id)');
        $this->addSql('CREATE INDEX IDX_1166587D909E143A ON inschrijving (training_id)');
        $this->addSql('CREATE INDEX IDX_1166587D1494450 ON inschrijving (klant_id)');
        $this->addSql('CREATE INDEX IDX_1166587D5C466B90 ON inschrijving (hond_id)');
        $this->addSql('ALTER TABLE kennel ADD naam VARCHAR(255) NOT NULL');
    }
}
