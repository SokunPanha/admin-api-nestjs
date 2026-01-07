import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveMenuParentForeignKey1767777200000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key constraint on menus.parent_id
    await queryRunner.query(
      `ALTER TABLE "menus" DROP CONSTRAINT IF EXISTS "menus_parent_id_fkey"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Re-add the foreign key constraint
    await queryRunner.query(
      `ALTER TABLE "menus" ADD CONSTRAINT "menus_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "menus"("id") ON DELETE CASCADE`,
    );
  }
}
