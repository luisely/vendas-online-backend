import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableCart1682431512766 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        ALTER TABLE public.cart ADD active boolean NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        ALTER TABLE public.cart drop active;
    `);
  }
}
