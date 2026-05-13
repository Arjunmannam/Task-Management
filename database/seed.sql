-- ============================================================
--  UNIFY PLATFORM  —  Seed Data (Demo)
--  Run after schema.sql
-- ============================================================

USE unify_db;

-- ── demo users ────────────────────────────────────────────────
INSERT IGNORE INTO users (id, full_name, email, password_hash, role) VALUES
  (1, 'Alex Chen', 'alex@demo.com', '$2a$12$hashGoesHere', 'ADMIN'),
  (2, 'Sara Kim',  'sara@demo.com', '$2a$12$hashGoesHere', 'USER');

-- ── demo projects ─────────────────────────────────────────────
INSERT IGNORE INTO projects (id, name, description, color, owner_id) VALUES
  (1, 'E-Commerce Platform',  'Full-stack shopping app',        '#6366f1', 1),
  (2, 'Analytics Dashboard',  'Real-time data visualization',   '#f59e0b', 1),
  (3, 'Mobile App Redesign',  'UX overhaul for iOS/Android',    '#10b981', 2);

-- ── demo project members ──────────────────────────────────────
INSERT IGNORE INTO project_members (project_id, user_id) VALUES
  (1, 1), (1, 2), (2, 1), (3, 2);
