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

// 数据已清空，等待新数据导入
export const candidates: Candidate[] = [];
