import { drizzle } from "drizzle-orm/mysql2";
import dotenv from "dotenv";

dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

// 示例候选人数据
const candidatesData = [
  {
    name: "窦先生",
    email: "dou@example.com",
    phone: "138****1234",
    avatar: null,
    position: "销售经理",
    yearsOfExperience: 15,
    location: "滁州",
    expectedSalary: "1-1.2万/月",
    summary: "15年销售经验，深耕锂电行业。曾任职亿纬锂能，天能电源等头部企业，具备丰富的大客户开发与维护经验。擅长销售战略制定与团队管理。",
    matchScore: "95.00",
    status: "reviewing",
  },
  {
    name: "赵先生",
    email: "zhao@example.com",
    phone: "139****5678",
    avatar: null,
    position: "销售经理",
    yearsOfExperience: 6,
    location: "合肥",
    expectedSalary: "1-1.5万/月",
    summary: "6年销售经验，专注新能源锂电池销售。具备扎实的市场开发能力和客户维护经验，熟悉行业动态。",
    matchScore: "88.00",
    status: "pending",
  },
  {
    name: "钟先生",
    email: "zhong@example.com",
    phone: "136****9012",
    avatar: null,
    position: "销售经理",
    yearsOfExperience: 7,
    location: "深圳",
    expectedSalary: "1.5-2万/月",
    summary: "7年销售经验，擅长锂电池技术型销售。具备丰富的B2B销售经验和团队管理能力。",
    matchScore: "92.00",
    status: "pending",
  },
  {
    name: "董先生",
    email: "dong@example.com",
    phone: "137****3456",
    avatar: null,
    position: "销售经理",
    yearsOfExperience: 10,
    location: "东莞",
    expectedSalary: "1.2-1.8万/月",
    summary: "10年销售经验，深耕正极材料和锂电池行业。具备完整的销售流程管理和团队建设经验。",
    matchScore: "90.00",
    status: "pending",
  },
  {
    name: "陈先生",
    email: "chen@example.com",
    phone: "135****7890",
    avatar: null,
    position: "销售主管",
    yearsOfExperience: 12,
    location: "惠州",
    expectedSalary: "1-1.5万/月",
    summary: "12年销售经验，擅长锂电池PACK和主材配套销售。具备强大的市场拓展能力和客户关系管理经验。",
    matchScore: "89.00",
    status: "pending",
  },
  {
    name: "吴女士",
    email: "wu@example.com",
    phone: "138****2345",
    avatar: null,
    position: "外贸销售经理",
    yearsOfExperience: 8,
    location: "深圳",
    expectedSalary: "1.5-2万/月",
    summary: "8年外贸销售经验，专注跨国客户开发。熟悉国际贸易流程，具备优秀的英语沟通能力和谈判技巧。",
    matchScore: "94.00",
    status: "pending",
  },
  {
    name: "贺女士",
    email: "he@example.com",
    phone: "139****6789",
    avatar: null,
    position: "外贸业务经理",
    yearsOfExperience: 18,
    location: "深圳",
    expectedSalary: "1.8-2.5万/月",
    summary: "18年外贸业务经验，专注保险柜和防盗设备出口。具备丰富的国际市场开发和大客户维护经验。",
    matchScore: "91.00",
    status: "pending",
  },
];

// 工作经历数据（对应窦先生）
const workExperiencesData = [
  {
    candidateId: 1,
    company: "惠州亿纬锂能股份有限公司",
    position: "销售经理",
    startDate: "2023-04",
    endDate: "至今",
    description: "负责锂电池销售业务，开发和维护大客户关系。",
    achievements: "负责锂电池市场拓展，制定销售战略并指导团队执行；独立开发2B市场KA客户；建立客户关系并保持长期稳定合作关系。",
  },
  {
    candidateId: 1,
    company: "浙江省长兴天都新能源有限公司",
    position: "销售经理",
    startDate: "2017-11",
    endDate: "2023-03",
    description: "负责锂电池市场拓展，根据销售战略完成销售任务。",
    achievements: "负责锂电池市场拓展，根据销售战略完成销售任务；制定销售目标并指导团队执行。",
  },
  {
    candidateId: 1,
    company: "安徽古井集团",
    position: "销售经理",
    startDate: "2011-12",
    endDate: "2017-08",
    description: "负责代理商管理及区域内销售活动。",
    achievements: "负责代理商管理及区域内销售活动；策划执行促销活动并监督落实。",
  },
];

// 教育背景数据
const educationsData = [
  {
    candidateId: 1,
    school: "安徽大学",
    degree: "本科",
    major: "市场营销",
    startDate: "2007-09",
    endDate: "2011-06",
    description: "主修市场营销、销售管理等课程。",
  },
];

// 项目经验数据
const projectsData = [
  {
    candidateId: 1,
    name: "亿纬锂能大客户开发项目",
    role: "项目负责人",
    startDate: "2023-04",
    endDate: "至今",
    description: "负责开发2B市场的大型客户，建立长期合作关系。",
    technologies: "CRM系统、销售数据分析工具",
    achievements: "成功开发多个KA客户，年销售额增长30%以上。",
  },
];

// 技能标签数据
const skillsData = [
  { candidateId: 1, name: "锂电池销售", level: "expert" },
  { candidateId: 1, name: "大客户开发", level: "expert" },
  { candidateId: 1, name: "团队管理", level: "advanced" },
  { candidateId: 1, name: "市场调研", level: "advanced" },
  { candidateId: 2, name: "新能源锂电池", level: "advanced" },
  { candidateId: 2, name: "销售渠道建设", level: "intermediate" },
  { candidateId: 3, name: "锂电池技术", level: "advanced" },
  { candidateId: 3, name: "技术型销售", level: "advanced" },
  { candidateId: 4, name: "正极材料", level: "expert" },
  { candidateId: 4, name: "锂电池销售", level: "advanced" },
  { candidateId: 5, name: "锂电池PACK", level: "advanced" },
  { candidateId: 5, name: "主材配套", level: "advanced" },
  { candidateId: 6, name: "国际贸易", level: "expert" },
  { candidateId: 6, name: "英语沟通", level: "expert" },
  { candidateId: 7, name: "外贸业务", level: "expert" },
  { candidateId: 7, name: "阿里巴巴", level: "advanced" },
];

// AI评价数据
const aiEvaluationsData = [
  {
    candidateId: 1,
    overallScore: "95.00",
    strengths: JSON.stringify([
      "行业头部企业（亿纬锂能、天能）背景，资源丰富",
      "15年销售经验，稳定性高",
      "具备团队管理和战略制定能力"
    ]),
    risks: JSON.stringify([
      "学历背景一般（专本），但经验可弥补",
      "期望薪资相对较低，需确认是否有其他求职意向"
    ]),
    suggestions: JSON.stringify([
      "强烈推荐面试，重点考察其在亿纬锂能的具体业务和客户资源情况",
      "了解其对公司业务和行业趋势的理解深度",
      "确认其离职原因和稳定性，评估团队管理风格是否匹配公司文化"
    ]),
    detailedAnalysis: "该候选人具有资深锂电销售专家，具备头部企业背景和丰富的KA资源。非常适合需要快速打开市场或维护大客户的团队。其15年经验和稳定的职业履历显示出较高的专业度和可靠性。",
  },
];

async function seed() {
  try {
    console.log("开始插入示例数据...");

    // 插入候选人
    const insertedCandidates = await db.execute(`
      INSERT INTO candidates (name, email, phone, avatar, position, yearsOfExperience, location, expectedSalary, summary, matchScore, status)
      VALUES 
        ${candidatesData.map((c, i) => `(
          '${c.name}', '${c.email}', '${c.phone}', ${c.avatar ? `'${c.avatar}'` : 'NULL'}, 
          '${c.position}', ${c.yearsOfExperience}, '${c.location}', '${c.expectedSalary}', 
          '${c.summary.replace(/'/g, "''")}', ${c.matchScore}, '${c.status}'
        )`).join(',')}
    `);
    console.log(`✓ 插入 ${candidatesData.length} 个候选人`);

    // 插入工作经历
    await db.execute(`
      INSERT INTO work_experiences (candidateId, company, position, startDate, endDate, description, achievements)
      VALUES 
        ${workExperiencesData.map(w => `(
          ${w.candidateId}, '${w.company}', '${w.position}', '${w.startDate}', '${w.endDate}',
          '${w.description.replace(/'/g, "''")}', '${w.achievements.replace(/'/g, "''")}'
        )`).join(',')}
    `);
    console.log(`✓ 插入 ${workExperiencesData.length} 条工作经历`);

    // 插入教育背景
    await db.execute(`
      INSERT INTO educations (candidateId, school, degree, major, startDate, endDate, description)
      VALUES 
        ${educationsData.map(e => `(
          ${e.candidateId}, '${e.school}', '${e.degree}', '${e.major}', '${e.startDate}', '${e.endDate}',
          '${e.description.replace(/'/g, "''")}'
        )`).join(',')}
    `);
    console.log(`✓ 插入 ${educationsData.length} 条教育背景`);

    // 插入项目经验
    await db.execute(`
      INSERT INTO projects (candidateId, name, role, startDate, endDate, description, technologies, achievements)
      VALUES 
        ${projectsData.map(p => `(
          ${p.candidateId}, '${p.name}', '${p.role}', '${p.startDate}', '${p.endDate}',
          '${p.description.replace(/'/g, "''")}', '${p.technologies}', '${p.achievements.replace(/'/g, "''")}'
        )`).join(',')}
    `);
    console.log(`✓ 插入 ${projectsData.length} 条项目经验`);

    // 插入技能标签
    await db.execute(`
      INSERT INTO skills (candidateId, name, level)
      VALUES 
        ${skillsData.map(s => `(${s.candidateId}, '${s.name}', '${s.level}')`).join(',')}
    `);
    console.log(`✓ 插入 ${skillsData.length} 条技能标签`);

    // 插入AI评价
    await db.execute(`
      INSERT INTO ai_evaluations (candidateId, overallScore, strengths, risks, suggestions, detailedAnalysis)
      VALUES 
        ${aiEvaluationsData.map(a => `(
          ${a.candidateId}, ${a.overallScore}, '${a.strengths.replace(/'/g, "''")}', 
          '${a.risks.replace(/'/g, "''")}', '${a.suggestions.replace(/'/g, "''")}', 
          '${a.detailedAnalysis.replace(/'/g, "''")}'
        )`).join(',')}
    `);
    console.log(`✓ 插入 ${aiEvaluationsData.length} 条AI评价`);

    console.log("\n✅ 所有示例数据插入成功！");
    process.exit(0);
  } catch (error) {
    console.error("❌ 插入数据失败:", error);
    process.exit(1);
  }
}

seed();
