-- ============================================================
--  UNIFY PLATFORM  —  MySQL Database Schema
--  Version: 1.0.0
-- ============================================================

CREATE DATABASE IF NOT EXISTS unify_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE unify_db;

-- ── users ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name     VARCHAR(100)  NOT NULL,
    email         VARCHAR(150)  NOT NULL UNIQUE,
    password_hash VARCHAR(255)  NOT NULL,
    role          ENUM('ADMIN','USER') NOT NULL DEFAULT 'USER',
    avatar_url    VARCHAR(500),
    created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_users_email (email)
) ENGINE=InnoDB;

-- ── projects ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(200)  NOT NULL,
    description VARCHAR(500),
    color       VARCHAR(20)   NOT NULL DEFAULT '#6366f1',
    owner_id    BIGINT UNSIGNED NOT NULL,
    created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_projects_owner (owner_id)
) ENGINE=InnoDB;

-- ── project_members (many-to-many) ───────────────────────────
CREATE TABLE IF NOT EXISTS project_members (
    project_id  BIGINT UNSIGNED NOT NULL,
    user_id     BIGINT UNSIGNED NOT NULL,
    joined_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (project_id, user_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── tasks ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(300)  NOT NULL,
    description TEXT,
    status      ENUM('TODO','IN_PROGRESS','DONE') NOT NULL DEFAULT 'TODO',
    priority    ENUM('LOW','MEDIUM','HIGH')        NOT NULL DEFAULT 'MEDIUM',
    project_id  BIGINT UNSIGNED NOT NULL,
    assignee_id BIGINT UNSIGNED,
    deadline    DATETIME,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (project_id)  REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (assignee_id) REFERENCES users(id)    ON DELETE SET NULL,
    INDEX idx_tasks_project  (project_id),
    INDEX idx_tasks_assignee (assignee_id),
    INDEX idx_tasks_status   (status)
) ENGINE=InnoDB;

-- ── task_comments ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS task_comments (
    id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    task_id    BIGINT UNSIGNED NOT NULL,
    author_id  BIGINT UNSIGNED NOT NULL,
    body       TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (task_id)   REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_comments_task (task_id)
) ENGINE=InnoDB;

-- ── notes ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notes (
    id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title      VARCHAR(300) NOT NULL DEFAULT 'Untitled Note',
    content    LONGTEXT,
    project_id BIGINT UNSIGNED NOT NULL,
    author_id  BIGINT UNSIGNED,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id)  REFERENCES users(id)    ON DELETE SET NULL,
    INDEX idx_notes_project (project_id)
) ENGINE=InnoDB;

-- ── project_files ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS project_files (
    id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    original_name VARCHAR(300) NOT NULL,
    stored_name   VARCHAR(300) NOT NULL UNIQUE,
    file_type     VARCHAR(20)  NOT NULL,
    file_size     BIGINT,
    project_id    BIGINT UNSIGNED NOT NULL,
    uploader_id   BIGINT UNSIGNED,
    uploaded_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (project_id)  REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (uploader_id) REFERENCES users(id)    ON DELETE SET NULL,
    INDEX idx_files_project (project_id)
) ENGINE=InnoDB;

-- ── spreadsheets ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS spreadsheets (
    id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(200) NOT NULL DEFAULT 'Data Tracker',
    data_json  LONGTEXT NOT NULL,
    project_id BIGINT UNSIGNED NOT NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    INDEX idx_ss_project (project_id)
) ENGINE=InnoDB;

-- ── diagrams ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS diagrams (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(200) NOT NULL DEFAULT 'Untitled Diagram',
    shapes_json LONGTEXT NOT NULL,
    project_id  BIGINT UNSIGNED NOT NULL,
    updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    INDEX idx_diagrams_project (project_id)
) ENGINE=InnoDB;

-- ── prototypes ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS prototypes (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(200) NOT NULL,
    screens_json LONGTEXT NOT NULL,
    project_id  BIGINT UNSIGNED NOT NULL,
    updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── activity_log ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS activity_log (
    id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id    BIGINT UNSIGNED,
    project_id BIGINT UNSIGNED,
    action     VARCHAR(100) NOT NULL,
    entity_id  BIGINT UNSIGNED,
    metadata   JSON,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE SET NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    INDEX idx_activity_project (project_id),
    INDEX idx_activity_user    (user_id),
    INDEX idx_activity_time    (created_at)
) ENGINE=InnoDB;
