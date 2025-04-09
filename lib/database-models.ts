// Database models for user credentials and theme preferences

// User credential model
export interface UserCredential {
  id: string
  email: string
  passwordHash: string // Hashed password, never store plain text
  salt: string // Salt used for password hashing
  role: "student" | "faculty" | "admin"
  firstName: string
  lastName: string
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

// User preference model
/*export interface UserPreference {
  userId: string
  theme: "light" | "dark" | "system"
  language?: string
  notifications?: boolean
  updatedAt: Date
}*/

// Session model for authentication
export interface UserSession {
  id: string
  userId: string
  token: string
  expiresAt: Date
  createdAt: Date
  ipAddress?: string
  userAgent?: string
}

// Remember me token model
export interface RememberMeToken {
  id: string
  userId: string
  selector: string // Random selector used to find the token
  validator: string // Hashed token that is validated
  expiresAt: Date
  createdAt: Date
}

// Database schema for user credentials and preferences
/*
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  salt VARCHAR(255) NOT NULL,
  role ENUM('student', 'faculty', 'admin') NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  last_login DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE user_preferences (
  user_id VARCHAR(36) PRIMARY KEY,
  theme ENUM('light', 'dark', 'system') NOT NULL DEFAULT 'light',
  language VARCHAR(10),
  notifications BOOLEAN DEFAULT TRUE,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE sessions (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  user_agent TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE remember_me_tokens (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  selector VARCHAR(255) NOT NULL,
  validator VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_remember_me_tokens_selector ON remember_me_tokens(selector);
*/
