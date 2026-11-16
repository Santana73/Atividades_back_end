-- Banco de dados e tabela da Loja de Informática.
-- Para executar:  mysql -u root -p < database/schema.sql
-- (ou cole no MySQL Workbench / phpMyAdmin)

-- Garante que os acentos sejam lidos como UTF-8, independente do cliente.
SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS loja_informatica
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE loja_informatica;

CREATE TABLE IF NOT EXISTS produtos (
  id        INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  nome      VARCHAR(150)  NOT NULL,
  categoria VARCHAR(80)   NOT NULL,
  preco     DECIMAL(10,2) NOT NULL,
  estoque   INT UNSIGNED  NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_produtos_nome (nome),      -- impede nomes repetidos
  KEY idx_produtos_categoria (categoria)   -- acelera o filtro por categoria
) ENGINE=InnoDB;

-- Dados iniciais. INSERT IGNORE: se rodar o script de novo, os nomes que já
-- existem (UNIQUE) são ignorados em vez de gerar erro.
INSERT IGNORE INTO produtos (nome, categoria, preco, estoque) VALUES
  ('Notebook Dell Inspiron 15', 'Computadores',  3499.90,  8),
  ('Mouse sem fio Logitech',    'Periféricos',     89.90, 40),
  ('Teclado mecânico Redragon', 'Periféricos',    249.90, 15),
  ('Monitor LG 24 polegadas',   'Monitores',      799.00, 12),
  ('SSD Kingston 480GB',        'Armazenamento',  279.90, 25);
