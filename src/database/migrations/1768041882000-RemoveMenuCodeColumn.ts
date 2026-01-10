import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RemoveMenuCodeColumn1768041882000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Remove the code column from the menus table
    await queryRunner.dropColumn('menus', 'code');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Add back the code column if we need to rollback
    await queryRunner.addColumn(
      'menus',
      new TableColumn({
        name: 'code',
        type: 'varchar',
        length: '100',
        isUnique: true,
        isNullable: false,
      }),
    );
  }
}
