import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * 候选人基本信息表
 */
export const candidates = mysqlTable("candidates", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  avatar: text("avatar"), // 头像URL
  position: varchar("position", { length: 100 }).notNull(), // 应聘职位
  yearsOfExperience: int("yearsOfExperience").default(0), // 工作年限
  location: varchar("location", { length: 100 }), // 所在地
  expectedSalary: varchar("expectedSalary", { length: 50 }), // 期望薪资
  summary: text("summary"), // 个人总结
  matchScore: decimal("matchScore", { precision: 5, scale: 2 }).default("0"), // 匹配度评分 0-100
  status: mysqlEnum("status", ["pending", "reviewing", "interviewed", "offered", "rejected"]).default("pending"),
  resumeFileUrl: text("resumeFileUrl"), // 简历文件URL
  resumeFileKey: text("resumeFileKey"), // S3文件key
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Candidate = typeof candidates.$inferSelect;
export type InsertCandidate = typeof candidates.$inferInsert;

/**
 * 工作经历表
 */
export const workExperiences = mysqlTable("work_experiences", {
  id: int("id").autoincrement().primaryKey(),
  candidateId: int("candidateId").notNull(),
  company: varchar("company", { length: 200 }).notNull(), // 公司名称
  position: varchar("position", { length: 100 }).notNull(), // 职位
  startDate: varchar("startDate", { length: 20 }), // 开始日期 YYYY-MM
  endDate: varchar("endDate", { length: 20 }), // 结束日期 YYYY-MM 或 "至今"
  description: text("description"), // 工作描述
  achievements: text("achievements"), // 主要成就
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WorkExperience = typeof workExperiences.$inferSelect;
export type InsertWorkExperience = typeof workExperiences.$inferInsert;

/**
 * 教育背景表
 */
export const educations = mysqlTable("educations", {
  id: int("id").autoincrement().primaryKey(),
  candidateId: int("candidateId").notNull(),
  school: varchar("school", { length: 200 }).notNull(), // 学校名称
  degree: varchar("degree", { length: 50 }), // 学历：本科、硕士、博士等
  major: varchar("major", { length: 100 }), // 专业
  startDate: varchar("startDate", { length: 20 }), // 开始日期 YYYY-MM
  endDate: varchar("endDate", { length: 20 }), // 结束日期 YYYY-MM
  description: text("description"), // 描述
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Education = typeof educations.$inferSelect;
export type InsertEducation = typeof educations.$inferInsert;

/**
 * 项目经验表
 */
export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  candidateId: int("candidateId").notNull(),
  name: varchar("name", { length: 200 }).notNull(), // 项目名称
  role: varchar("role", { length: 100 }), // 项目角色
  startDate: varchar("startDate", { length: 20 }), // 开始日期 YYYY-MM
  endDate: varchar("endDate", { length: 20 }), // 结束日期 YYYY-MM
  description: text("description"), // 项目描述
  technologies: text("technologies"), // 使用技术
  achievements: text("achievements"), // 项目成果
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

/**
 * 技能标签表
 */
export const skills = mysqlTable("skills", {
  id: int("id").autoincrement().primaryKey(),
  candidateId: int("candidateId").notNull(),
  name: varchar("name", { length: 100 }).notNull(), // 技能名称
  level: mysqlEnum("level", ["beginner", "intermediate", "advanced", "expert"]).default("intermediate"), // 技能水平
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Skill = typeof skills.$inferSelect;
export type InsertSkill = typeof skills.$inferInsert;

/**
 * AI评价记录表
 */
export const aiEvaluations = mysqlTable("ai_evaluations", {
  id: int("id").autoincrement().primaryKey(),
  candidateId: int("candidateId").notNull().unique(), // 每个候选人一条评价记录
  overallScore: decimal("overallScore", { precision: 5, scale: 2 }).default("0"), // 综合评分 0-100
  strengths: text("strengths"), // 核心优势（JSON数组）
  risks: text("risks"), // 潜在风险（JSON数组）
  suggestions: text("suggestions"), // 面试建议（JSON数组）
  detailedAnalysis: text("detailedAnalysis"), // 详细分析
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AiEvaluation = typeof aiEvaluations.$inferSelect;
export type InsertAiEvaluation = typeof aiEvaluations.$inferInsert;
