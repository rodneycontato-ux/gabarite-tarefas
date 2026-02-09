/*
  Warnings:

  - You are about to drop the column `nome_teste` on the `site` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `site` DROP COLUMN `nome_teste`,
    ADD COLUMN `nome_teste_teste` VARCHAR(200) NULL;
