/*
  Warnings:

  - You are about to drop the column `categoria` on the `pauta` table. All the data in the column will be lost.
  - You are about to drop the column `site` on the `pauta` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `categoria` ON `pauta`;

-- DropIndex
DROP INDEX `site` ON `pauta`;

-- AlterTable
ALTER TABLE `pauta` DROP COLUMN `categoria`,
    DROP COLUMN `site`;
