import { eq, like, or, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, candidates, workExperiences, educations, projects, skills, aiEvaluations } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * 获取候选人列表，支持搜索和筛选
 */
export async function getCandidates(params?: {
  search?: string;
  position?: string;
  minExperience?: number;
  maxExperience?: number;
  status?: string;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get candidates: database not available");
    return [];
  }

  let query = db.select().from(candidates);

  const conditions = [];

  if (params?.search) {
    conditions.push(
      or(
        like(candidates.name, `%${params.search}%`),
        like(candidates.email, `%${params.search}%`),
        like(candidates.position, `%${params.search}%`)
      )
    );
  }

  if (params?.position) {
    conditions.push(like(candidates.position, `%${params.position}%`));
  }

  if (params?.minExperience !== undefined) {
    conditions.push(sql`${candidates.yearsOfExperience} >= ${params.minExperience}`);
  }

  if (params?.maxExperience !== undefined) {
    conditions.push(sql`${candidates.yearsOfExperience} <= ${params.maxExperience}`);
  }

  if (params?.status) {
    conditions.push(eq(candidates.status, params.status as any));
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }

  const result = await query.orderBy(sql`${candidates.matchScore} DESC`);
  return result;
}

/**
 * 获取候选人详细信息（包括关联数据）
 */
export async function getCandidateDetail(candidateId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get candidate detail: database not available");
    return null;
  }

  const candidate = await db.select().from(candidates).where(eq(candidates.id, candidateId)).limit(1);
  if (candidate.length === 0) return null;

  const workExp = await db.select().from(workExperiences).where(eq(workExperiences.candidateId, candidateId));
  const edu = await db.select().from(educations).where(eq(educations.candidateId, candidateId));
  const proj = await db.select().from(projects).where(eq(projects.candidateId, candidateId));
  const skillList = await db.select().from(skills).where(eq(skills.candidateId, candidateId));

  return {
    candidate: candidate[0],
    workExperiences: workExp,
    educations: edu,
    projects: proj,
    skills: skillList,
  };
}

/**
 * 获取候选人的技能列表
 */
export async function getCandidateSkills(candidateId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get candidate skills: database not available");
    return [];
  }

  return await db.select().from(skills).where(eq(skills.candidateId, candidateId));
}

/**
 * 获取AI评价
 */
export async function getAiEvaluation(candidateId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get AI evaluation: database not available");
    return null;
  }

  const result = await db.select().from(aiEvaluations).where(eq(aiEvaluations.candidateId, candidateId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

/**
 * 创建或更新AI评价
 */
export async function upsertAiEvaluation(evaluation: {
  candidateId: number;
  overallScore: string;
  strengths: string;
  risks: string;
  suggestions: string;
  detailedAnalysis: string;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert AI evaluation: database not available");
    return;
  }

  await db.insert(aiEvaluations).values(evaluation).onDuplicateKeyUpdate({
    set: {
      overallScore: evaluation.overallScore,
      strengths: evaluation.strengths,
      risks: evaluation.risks,
      suggestions: evaluation.suggestions,
      detailedAnalysis: evaluation.detailedAnalysis,
      updatedAt: new Date(),
    },
  });
}


/**
 * 导入候选人信息
 */
export async function importCandidate(data: {
  name: string;
  phone?: string;
  email?: string;
  position: string;
  yearsOfExperience?: number;
  location?: string;
  expectedSalary?: string;
  summary?: string;
  workExperiences?: Array<{
    company: string;
    position: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    achievements?: string;
  }>;
  educations?: Array<{
    school: string;
    degree?: string;
    major?: string;
    startDate?: string;
    endDate?: string;
  }>;
  skills?: Array<{
    name: string;
    level?: "beginner" | "intermediate" | "advanced" | "expert";
  }>;
}): Promise<number> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    // 插入候选人基本信息
    const [candidateResult] = await db.insert(candidates).values({
      name: data.name,
      phone: data.phone,
      email: data.email,
      position: data.position,
      yearsOfExperience: data.yearsOfExperience,
      location: data.location,
      expectedSalary: data.expectedSalary,
      summary: data.summary,
      status: 'pending',
      matchScore: '0', // 初始匹配度为0，后续可通过AI评价更新
    });

    const candidateId = candidateResult.insertId;

    // 插入工作经历
    if (data.workExperiences && data.workExperiences.length > 0) {
      await db.insert(workExperiences).values(
        data.workExperiences.map(exp => ({
          candidateId,
          company: exp.company,
          position: exp.position,
          startDate: exp.startDate,
          endDate: exp.endDate,
          description: exp.description,
          achievements: exp.achievements,
        }))
      );
    }

    // 插入教育背景
    if (data.educations && data.educations.length > 0) {
      await db.insert(educations).values(
        data.educations.map(edu => ({
          candidateId,
          school: edu.school,
          degree: edu.degree,
          major: edu.major,
          startDate: edu.startDate,
          endDate: edu.endDate,
        }))
      );
    }

    // 插入技能标签
    if (data.skills && data.skills.length > 0) {
      await db.insert(skills).values(
        data.skills.map(skill => ({
          candidateId,
          name: skill.name,
          level: skill.level || 'intermediate',
        }))
      );
    }

    return candidateId;
  } catch (error) {
    console.error("[Database] Failed to import candidate:", error);
    throw error;
  }
}
