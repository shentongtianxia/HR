export interface Candidate {
  id: string;
  name: string;
  age: number;
  experience: string;
  location: string;
  salary: string;
  status: string;
  avatar: string;
  role: string;
  tags: string[];
  skills: string[];
  education: string;
  summary: string;
  matchScore: number;
  projects: Project[];
  contact: string;
}

export interface Project {
  name: string;
  role: string;
  time: string;
  description: string;
}

export const candidates: Candidate[] = [
  {
    id: "620241524",
    name: "王先生",
    age: 34,
    experience: "12年",
    location: "上海",
    salary: "1.7-2.3万/月",
    status: "离职-一周内到岗",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    role: "Python 后端开发",
    tags: ["后端架构", "电商系统", "Tornado", "FastAPI"],
    skills: ["Python", "MySQL", "Linux", "Redis", "Tornado", "FastAPI"],
    education: "上海工程技术大学 - 本科",
    summary: "12年经验资深后端开发，精通 Python/MySQL，擅长电商及采购系统架构设计。",
    matchScore: 95,
    contact: "138****1234",
    projects: [
      {
        name: "文件生成系统",
        role: "核心开发",
        time: "2024.01-2025.01",
        description: "基于 Tornado 开发自动化文件生成系统，支持 PDF/图片生成，服务医药中间体企业。"
      },
      {
        name: "非经营性采购系统",
        role: "架构设计与开发",
        time: "2024.01-2025.01",
        description: "基于 FastAPI 构建企业采购管理系统，实现流程电子化。"
      }
    ]
  },
  {
    id: "675829652",
    name: "陈先生",
    age: 28,
    experience: "7年",
    location: "苏州",
    salary: "1.5-1.8万/月",
    status: "在职-看机会",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    role: "AI 工程师 / Python 开发",
    tags: ["AI大模型", "RAG", "国产化适配", "Qwen"],
    skills: ["Python", "PyTorch", "TensorFlow", "Docker", "RAG", "LLM"],
    education: "安徽工程大学 - 本科",
    summary: "7年经验，专注 AI 大模型应用落地，熟悉 RAG、Dify 及国产化适配。",
    matchScore: 98,
    contact: "139****5678",
    projects: [
      {
        name: "智能辅助诊断系统",
        role: "AI 工程师",
        time: "2024.07-2024.12",
        description: "基于 Qwen2-72B + RAG 构建医疗问答系统，实现精准辅助诊断。"
      },
      {
        name: "CDSS 临床辅助诊断",
        role: "核心开发",
        time: "2024.02-2024.07",
        description: "利用 Llama/UNet 等模型构建智能化辅助诊断平台。"
      }
    ]
  }
];
