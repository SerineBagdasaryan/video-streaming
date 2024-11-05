import { MigrationInterface, QueryRunner } from 'typeorm';

export class MediaStream1730793893693 implements MigrationInterface {
    name= 'MediaStream1730793893693';
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE media_types_enum AS ENUM ('camera', 'screen');
        `);
        await queryRunner.query(`
            CREATE TABLE "media_stream" (
                  "id" SERIAL PRIMARY KEY,
                  "userId" integer NOT NULL,
                  "type" media_types_enum NOT NULL,
                  "filePath" character varying NOT NULL,
                  "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                  "updated_at" TIMESTAMP NOT NULL DEFAULT now()
            );

        `);
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "media_stream"`);
        await queryRunner.query(`DROP TYPE media_types_enum`);
    }
}
