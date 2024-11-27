// import { MigrationInterface, QueryRunner } from 'typeorm';
// import { EncryptionHelpers } from '../../common/helpers';
//
// export class CreateOrganization1732539153552 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(`
//       CREATE TABLE "organization" (
//         "id" SERIAL PRIMARY KEY,
//         "name" character varying NOT NULL,
//         "metadata" jsonb NULL,
//         "apiKey" character varying NOT NULL,
//         "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
//         "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
//       );
//     `);
//     const apiKey: string = EncryptionHelpers.encrypt({ id: 1 });
//
//     await queryRunner.query(`
//       INSERT INTO "organization" ("id", "name", "apiKey", "createdAt", "updatedAt")
//       VALUES (1, 'Academy', '${apiKey}', now(), now());
//     `);
//   }
//
//   public async down(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(`DROP TABLE "organization"`);
//   }
// }

import { MigrationInterface, QueryRunner } from 'typeorm';
import { EncryptionHelpers } from '../../common/helpers';

export class CreateOrganization1732539153552 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "organization" (
        "id" SERIAL PRIMARY KEY,
        "name" character varying NOT NULL,
        "metadata" jsonb NULL,
        "apiKey" character varying NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    const apiKey: string = EncryptionHelpers.encrypt({ id: 1 });
    await queryRunner.query(`
      INSERT INTO "organization" ("id", "name", "apiKey", "created_at", "updated_at")
      VALUES (1, 'Academy', '${apiKey.trim()}', now(), now());
    `);
    await queryRunner.query(`
      ALTER TABLE "media_stream"
      ADD COLUMN "organizationId" INTEGER NOT NULL;
    `);

    await queryRunner.query(`
      ALTER TABLE "media_stream"
      ADD CONSTRAINT "FK_MediaStream_Organization"
      FOREIGN KEY ("organizationId")
      REFERENCES "organization"("id")
      ON DELETE CASCADE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "media_stream"
      DROP CONSTRAINT "FK_MediaStream_Organization";
    `);

    await queryRunner.query(`
      ALTER TABLE "media_stream"
      DROP COLUMN "organizationId";
    `);

    await queryRunner.query(`
      DROP TABLE "organization";
    `);
  }
}
