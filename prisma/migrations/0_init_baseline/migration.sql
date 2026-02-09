-- CreateTable
CREATE TABLE `categoria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_categoria` VARCHAR(200) NULL,

    INDEX `nome_categoria`(`nome_categoria`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `site` (
    `id_site` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_site` VARCHAR(200) NULL,
    `url_home` VARCHAR(200) NULL,
    `url_admin` VARCHAR(200) NULL,
    `ordem` INTEGER NULL,
    `nome_teste` VARCHAR(200) NULL,

    INDEX `nome_site`(`nome_site`),
    PRIMARY KEY (`id_site`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pauta` (
    `id_pauta` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NULL,
    `id_site` INTEGER NULL,
    `site` VARCHAR(100) NULL,
    `id_categoria` INTEGER NULL,
    `categoria` VARCHAR(100) NULL,
    `status` VARCHAR(50) NOT NULL,
    `data` DATETIME(0) NOT NULL,
    `data_inicio` DATETIME(0) NULL,
    `data_conclusao` DATETIME(0) NULL,
    `texto` LONGTEXT NULL,
    `titulo` VARCHAR(300) NULL,
    `preco` FLOAT NULL,

    INDEX `categoria`(`categoria`),
    INDEX `id_usuario`(`id_usuario`),
    INDEX `site`(`site`),
    INDEX `id_site`(`id_site`),
    INDEX `id_categoria`(`id_categoria`),
    PRIMARY KEY (`id_pauta`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario` (
    `id_usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 0,
    `nivel` INTEGER NOT NULL DEFAULT 0,
    `data` DATETIME(0) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `senha` VARCHAR(255) NULL,
    `pix` VARCHAR(100) NULL,

    PRIMARY KEY (`id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pagamentos` (
    `id_pagamento` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `ano` YEAR NOT NULL,
    `mes` TINYINT NOT NULL,
    `total_itens` INTEGER NOT NULL,
    `total_valor` DECIMAL(10, 2) NOT NULL,
    `criado_em` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `data_pagamento` DATETIME(0) NULL,
    `status` ENUM('pendente', 'pago') NOT NULL DEFAULT 'pendente',
    `id_transacao_mp` INTEGER NULL,

    UNIQUE INDEX `uk_usuario_ano_mes`(`id_usuario`, `ano`, `mes`),
    PRIMARY KEY (`id_pagamento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notificacao` (
    `id_notificacao` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NULL,
    `mensagem` LONGTEXT NOT NULL,
    `data_envio` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `id_usuario`(`id_usuario`),
    PRIMARY KEY (`id_notificacao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notificacao_visualizada` (
    `id_visualizada` INTEGER NOT NULL AUTO_INCREMENT,
    `id_notificacao` INTEGER NOT NULL,
    `id_usuario` INTEGER NOT NULL,
    `data_visualizacao` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `FK_notificcao_visualizou`(`id_notificacao`),
    INDEX `FK_uusuario_visualizou`(`id_usuario`),
    PRIMARY KEY (`id_visualizada`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pauta` ADD CONSTRAINT `FK_usuario_pauta` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pauta` ADD CONSTRAINT `FK_pauta_site` FOREIGN KEY (`id_site`) REFERENCES `site`(`id_site`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pauta` ADD CONSTRAINT `FK_pauta_categoria` FOREIGN KEY (`id_categoria`) REFERENCES `categoria`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pagamentos` ADD CONSTRAINT `FK_pagamentos_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `notificacao` ADD CONSTRAINT `FK_usuario_notificacao` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notificacao_visualizada` ADD CONSTRAINT `FK_notificcao_visualizou` FOREIGN KEY (`id_notificacao`) REFERENCES `notificacao`(`id_notificacao`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notificacao_visualizada` ADD CONSTRAINT `FK_uusuario_visualizou` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;