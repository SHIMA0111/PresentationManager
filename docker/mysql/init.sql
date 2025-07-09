-- PresentationManager データベース初期化スクリプト

-- データベースの作成
CREATE DATABASE IF NOT EXISTS presentation_manager;
USE presentation_manager;

-- ユーザーテーブル
CREATE TABLE IF NOT EXISTS users (
    id varchar(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    role int DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
);

-- チームテーブル
CREATE TABLE IF NOT EXISTS teams (
    id varchar(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
);

-- プレゼンテーションテーブル
CREATE TABLE IF NOT EXISTS presentations (
    id varchar(255) PRIMARY KEY,
    presentation_datetime DATETIME NOT NULL, 
    team_id varchar(255),
    user_id varchar(255),
    title VARCHAR(255),
    description TEXT,
    status int DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL
);

-- チームメンバーテーブル
CREATE TABLE IF NOT EXISTS team_members (
    team_id varchar(255) NOT NULL,
    user_id varchar(255) NOT NULL,
    role int DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL,
    PRIMARY KEY (team_id, user_id),
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- サンプルデータの挿入
INSERT INTO users (id, email, name, role) VALUES
('cd626be2-298f-d753-d269-4708d5ae7e10', 'admin@example.com', '管理者', 1),
('123e4567-e89b-12d3-a456-426614174000', 'user1@example.com', 'ユーザー1', 0),
('123e4567-e89b-12d3-a456-426614174001', 'user2@example.com', 'ユーザー2', 0),
('123e4567-e89b-12d3-a456-426614174002', 'user3@example.com', 'ユーザー3', 0),
('123e4567-e89b-12d3-a456-426614174003', 'user4@example.com', 'ユーザー4', 0),
('123e4567-e89b-12d3-a456-426614174004', 'user5@example.com', 'ユーザー5', 0),
('123e4567-e89b-12d3-a456-426614174005', 'user6@example.com', 'ユーザー6', 0),
('123e4567-e89b-12d3-a456-426614174006', 'user7@example.com', 'ユーザー7', 0),
('123e4567-e89b-12d3-a456-426614174007', 'user8@example.com', 'ユーザー8', 0)
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO teams (id, name, description) VALUES
('123e4567-e89b-12d3-a456-426614174000', '開発チーム', 'メインの開発チーム'),
('123e4567-e89b-12d3-a456-426614174001', 'デザインチーム', 'UI/UXデザインチーム'),
('123e4567-e89b-12d3-a456-426614174002', 'マーケティングチーム', 'マーケティングチーム')
ON DUPLICATE KEY UPDATE description = VALUES(description);

INSERT INTO team_members (team_id, user_id, role) VALUES
('123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174000', 1),
('123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174001', 0),
('123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174002', 0),
('123e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174003', 1),
('123e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174004', 0),
('123e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174005', 0),
('123e4567-e89b-12d3-a456-426614174002', '123e4567-e89b-12d3-a456-426614174006', 1),
('123e4567-e89b-12d3-a456-426614174002', '123e4567-e89b-12d3-a456-426614174007', 0)
ON DUPLICATE KEY UPDATE role = VALUES(role);

INSERT INTO presentations (id, presentation_datetime, team_id, user_id, title, description, status) VALUES
('123e4567-e89b-12d3-a456-426614174000', '2025-01-01 10:00:00', '123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174000', 'プレゼンテーション1', 'プレゼンテーション1の説明', 0),
('123e4567-e89b-12d3-a456-426614174001', '2025-01-01 10:00:00', '123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174001', 'プレゼンテーション2', 'プレゼンテーション2の説明', 0),
('123e4567-e89b-12d3-a456-426614174002', '2025-01-01 10:00:00', '123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174002', 'プレゼンテーション3', 'プレゼンテーション3の説明', 0),
('123e4567-e89b-12d3-a456-426614174003', '2025-01-01 10:00:00', '123e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174003', 'プレゼンテーション4', 'プレゼンテーション4の説明', 0),
('123e4567-e89b-12d3-a456-426614174004', '2025-01-01 10:00:00', '123e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174004', 'プレゼンテーション5', 'プレゼンテーション5の説明', 0),
('123e4567-e89b-12d3-a456-426614174005', '2025-01-01 10:00:00', '123e4567-e89b-12d3-a456-426614174002', '123e4567-e89b-12d3-a456-426614174005', 'プレゼンテーション6', 'プレゼンテーション6の説明', 0),
('123e4567-e89b-12d3-a456-426614174006', '2025-01-01 10:00:00', '123e4567-e89b-12d3-a456-426614174002', '123e4567-e89b-12d3-a456-426614174006', 'プレゼンテーション7', 'プレゼンテーション7の説明', 0),
('123e4567-e89b-12d3-a456-426614174007', '2025-01-01 10:00:00', '123e4567-e89b-12d3-a456-426614174002', '123e4567-e89b-12d3-a456-426614174007', 'プレゼンテーション8', 'プレゼンテーション8の説明', 0)
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description), status = VALUES(status);

-- インデックスの作成
CREATE INDEX idx_presentations_user_id ON presentations(user_id);
CREATE INDEX idx_presentations_status ON presentations(status);

-- team_membersテーブルの最適化されたインデックス戦略
-- 複合主キー(team_id, user_id)が既に存在するため、追加のインデックスは最小限に

-- 1. 複合インデックス（user_id, team_id）: ユーザーが所属するチームの検索に最適
CREATE INDEX idx_team_members_user_team ON team_members(user_id, team_id);

-- 2. カバリングインデックス（team_id, role, user_id）: チームメンバー一覧取得時のパフォーマンス向上
CREATE INDEX idx_team_members_team_role_user ON team_members(team_id, role, user_id);

-- 3. カバリングインデックス（user_id, role, team_id）: ユーザーのチーム役割取得時のパフォーマンス向上
CREATE INDEX idx_team_members_user_role_team ON team_members(user_id, role, team_id); 