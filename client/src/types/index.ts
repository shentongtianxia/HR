export interface WorkHistory {
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface Education {
  school: string;
  degree: string;
  period: string;
  description?: string;
}

export interface AIEvaluation {
  score: number;
  summary: string;
  pros: string[];
  cons: string[];
  suggestion: string;
}

export interface CandidateDetails {
  workHistory: WorkHistory[];
  education: Education[];
  skills: string[];
}

export interface Candidate {
  id: string;
  name: string;
  avatar: string;
  title: string;
  experience: string;
  education: string;
  location: string;
  salary: string;
  status: "active" | "interviewing" | "hired" | "rejected";
  matchScore: number;
  tags: string[];
  summary: string;
  details: CandidateDetails;
  aiEvaluation: AIEvaluation;
}
