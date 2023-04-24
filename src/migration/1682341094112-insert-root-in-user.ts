import { UserEntity } from 'src/user/interfaces/user.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertRootInUser1682341094112 implements MigrationInterface {
  name: 'addUserRoot';
  public async up(queryRunner: QueryRunner): Promise<void> {
    const userRoot = await queryRunner.manager.save(
      queryRunner.manager.create<UserEntity>(UserEntity, {
        name: 'root2',
        password:
          '$2b$10$sUMwsWmP/YOI0.NKUbCfRONHKymO7rCoOze0KflPWclwOnuX.6NG6',
        cpf: '999999999',
        email: 'root2@root.com',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            DELETE FROM public."user"
            WHERE email like 'root@root.com';
        `);
  }
}
