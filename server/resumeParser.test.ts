import { describe, expect, it, vi } from "vitest";
import { extractTextFromWord, extractResumeInfo } from "./resumeParser";

// Mock mammoth module
vi.mock("mammoth", () => ({
  default: {
    extractRawText: vi.fn(async () => ({
      value: "张三\n邮箱：zhangsan@example.com\n电话：138****1234\n\n工作经历：\n2020-至今 ABC科技公司 高级工程师",
    })),
  },
}));

// Mock LLM module
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn(async () => ({
    choices: [
      {
        message: {
          content: JSON.stringify({
            name: "张三",
            email: "zhangsan@example.com",
            phone: "138****1234",
            location: "北京",
            position: "高级工程师",
            yearsOfExperience: 5,
            expectedSalary: "20-30K",
            summary: "资深软件工程师，擅长前端开发",
            workExperiences: [
              {
                company: "ABC科技公司",
                position: "高级工程师",
                startDate: "2020-01",
                endDate: null,
                description: "负责前端架构设计和开发",
              },
            ],
            educations: [
              {
                school: "清华大学",
                major: "计算机科学",
                degree: "本科",
                startDate: "2015-09",
                endDate: "2019-06",
              },
            ],
            skills: ["JavaScript", "React", "TypeScript"],
          }),
        },
      },
    ],
  })),
}));

describe("resumeParser", () => {
  describe("extractTextFromWord", () => {
    it("should extract text from Word document", async () => {
      const buffer = Buffer.from("mock word content");
      const text = await extractTextFromWord(buffer);
      
      expect(text).toBeDefined();
      expect(typeof text).toBe("string");
    });
  });

  describe("extractResumeInfo", () => {
    it("should extract structured information from resume text using AI", async () => {
      const resumeText = "张三\n邮箱：zhangsan@example.com\n电话：138****1234\n\n工作经历：\n2020-至今 ABC科技公司 高级工程师";
      
      const resumeInfo = await extractResumeInfo(resumeText);
      
      expect(resumeInfo).toBeDefined();
      expect(resumeInfo.name).toBe("张三");
      expect(resumeInfo.email).toBe("zhangsan@example.com");
      expect(resumeInfo.phone).toBe("138****1234");
      expect(resumeInfo.position).toBe("高级工程师");
      expect(resumeInfo.workExperiences).toHaveLength(1);
      expect(resumeInfo.workExperiences[0].company).toBe("ABC科技公司");
      expect(resumeInfo.educations).toHaveLength(1);
      expect(resumeInfo.skills).toContain("JavaScript");
    });

    it("should handle resume text with missing information", async () => {
      const resumeText = "简单的简历文本";
      
      const resumeInfo = await extractResumeInfo(resumeText);
      
      expect(resumeInfo).toBeDefined();
      expect(resumeInfo.name).toBeDefined();
    });
  });
});
