import { useState, useMemo, useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
import { candidates } from "../lib/data";
import { Candidate } from "../types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Briefcase, GraduationCap, MapPin, DollarSign, Star, AlertTriangle, Lightbulb, CheckCircle2, Search, Download, Upload, FileText, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

export default function SimpleView() {
  // Initialize candidates state with data from data.ts
  const [candidateList, setCandidateList] = useState(candidates);
  const [selectedId, setSelectedId] = useState(candidates[0]?.id);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCandidates = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return candidateList;
    return candidateList.filter((c) => 
      c.name.toLowerCase().includes(query) ||
      c.title.toLowerCase().includes(query) ||
      c.tags.some(tag => tag.toLowerCase().includes(query)) ||
      c.location.toLowerCase().includes(query)
    );
  }, [searchQuery, candidateList]);

  const selectedCandidate = candidateList.find((c) => c.id === selectedId) || filteredCandidates[0];
  const resumeRef = useRef<HTMLDivElement>(null);

  // Helper to get avatar based on gender/name
  const getAvatar = (candidate: typeof candidates[0]) => {
    const isFemale = candidate.name.includes("女士") || candidate.name.includes("小姐") || candidate.name.includes("女");
    return isFemale ? "/images/avatar_female.png" : "/images/avatar_male.png";
  };

  // Export PDF function
  const handleExportPDF = async () => {
    if (!resumeRef.current || !selectedCandidate) return;
    
    const toastId = toast.loading("正在生成PDF...");
    
    try {
      // Create a clone of the resume content to render for PDF
      const originalElement = resumeRef.current;
      const clone = originalElement.cloneNode(true) as HTMLElement;
      
      // Wrap in a container to ensure styles (like Tailwind variables) are preserved if they are on body/html
      // But here we just append to body. We ensure the clone has a white background and proper width.
      clone.style.position = 'fixed'; // Use fixed to avoid affecting layout
      clone.style.top = '-10000px';
      clone.style.left = '-10000px';
      clone.style.width = '794px'; // A4 width in pixels at 96 DPI is approx 794px
      clone.style.height = 'auto';
      clone.style.zIndex = '-1';
      clone.style.overflow = 'visible';
      clone.style.background = '#ffffff';
      clone.style.padding = '40px';
      // Force text color to black for better readability in PDF
      clone.style.color = '#000000';
      
      document.body.appendChild(clone);
      
      // Wait a moment for DOM to settle (optional but helpful for images)
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(clone, {
        scale: 2, // Higher scale for better quality
        useCORS: true, // Enable CORS for images
        allowTaint: false, // Disallow taint to prevent security errors
        logging: true, // Enable logging for debugging
        backgroundColor: "#ffffff",
        windowWidth: 794,
        onclone: (clonedDoc) => {
          // Ensure all images in the clone have crossOrigin set
          const images = clonedDoc.getElementsByTagName('img');
          for (let i = 0; i < images.length; i++) {
            images[i].crossOrigin = "Anonymous";
          }
        }
      });
      
      document.body.removeChild(clone);
      
      const imgData = canvas.toDataURL("image/jpeg", 0.95); // Use JPEG for smaller size, PNG for quality
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Subsequent pages
      while (heightLeft > 0) {
        position -= pageHeight; // Shift up by one page height
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`${selectedCandidate.name}_简历报告.pdf`);
      toast.success("PDF导出成功");
      toast.dismiss(toastId);
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("导出失败，请重试");
      toast.dismiss(toastId);
    }
  };

  // AI Tag Generation
  const generateAITags = (text: string) => {
    const keywords = [
      // Tech
      "Java", "Python", "React", "Vue", "Spring", "MySQL", "Docker", "Kubernetes", "Go", "C++", "Node.js", "TypeScript", "AWS", "Cloud",
      // Sales & Business
      "销售", "管理", "英语", "外贸", "大客户", "KA", "团队管理", "市场拓展", "商务谈判", "渠道管理", "B2B", "SaaS",
      // Soft Skills
      "沟通能力", "领导力", "抗压能力", "解决问题"
    ];
    const foundTags = keywords.filter(keyword => text.toLowerCase().includes(keyword.toLowerCase()));
    return Array.from(new Set(foundTags));
  };

  // File Import Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      let text = "";
      if (file.name.endsWith(".docx")) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else if (file.name.endsWith(".txt") || file.name.endsWith(".md")) {
        text = await file.text();
      } else if (file.name.endsWith(".pdf")) {
        // Basic PDF text extraction
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          fullText += content.items.map((item: any) => item.str).join(" ") + "\n";
        }
        text = fullText;
      } else {
        toast.error("不支持的文件格式");
        return;
      }

      if (text) {
        // Simple deduplication check based on file name or content hash (simulated here)
        // In a real app, we would check against existing candidate IDs or content hash
        const isDuplicate = candidateList.some(c => c.name === file.name.split('.')[0] || text.includes(c.name));
        
        if (isDuplicate) {
          toast.warning(`检测到重复候选人: ${file.name}`, {
            description: "该候选人已存在于系统中，跳过导入。"
          });
          return;
        }

        const aiTags = generateAITags(text);
        
        // Create new candidate object
        const newCandidate: Candidate = {
          id: Date.now().toString(), // Simple ID generation
          name: file.name.split('.')[0],
          title: "待评估候选人", // Default title
          experience: "经验待解析",
          education: "学历待解析", // Added missing field
          location: "地点待解析",
          salary: "薪资面议",
          status: "active", // Added missing field
          tags: aiTags.length > 0 ? aiTags : ["待标签"],
          matchScore: 0, // Initial score
          avatar: "/images/avatar_male.png", // Default avatar
          summary: text.substring(0, 150) + "...", // Use beginning of text as summary
          details: { // Nested under details
            workHistory: [
              {
                company: "待解析公司",
                period: "待解析时间",
                role: "待解析职位",
                description: text.substring(0, 300) // Raw text as description for now
              }
            ],
            education: [ // Changed to array
              {
                school: "待解析学校",
                degree: "待解析学历",
                period: "待解析时间"
              }
            ],
            skills: aiTags // Added skills
          },
          aiEvaluation: {
            score: 75,
            summary: "新导入简历，等待进一步详细分析。",
            pros: aiTags.map(t => `具备 ${t} 技能`),
            cons: ["简历信息需人工核对"],
            suggestion: "建议安排初步沟通以核实信息。" // Changed advice to suggestion
          }
        };

        setCandidateList(prev => [newCandidate, ...prev]);
        setSelectedId(newCandidate.id); // Select the new candidate
        toast.success(`成功导入候选人: ${file.name}`);
        toast.info(`AI 自动提取标签: ${aiTags.join(", ") || "无"}`);
      }
    } catch (error) {
      console.error("Import failed:", error);
      toast.error("文件解析失败");
    }
  };

  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Left Column: Candidate List (20%) */}
      <div className="w-1/5 border-r bg-muted/10 flex flex-col">
        <div className="p-4 border-b bg-background space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg tracking-tight">候选人</h2>
            <div className="flex gap-2">
              <div className="relative">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".docx,.pdf,.md,.txt"
                  onChange={handleFileUpload}
                />
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => document.getElementById("file-upload")?.click()}>
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-xs text-muted-foreground self-center">共 {filteredCandidates.length} 位</span>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索姓名、职位、标签..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="flex flex-col">
            {filteredCandidates.map((candidate) => (
              <button
                key={candidate.id}
                onClick={() => setSelectedId(candidate.id)}
                className={`flex items-start gap-3 p-4 text-left transition-colors hover:bg-accent/50 border-b last:border-0 ${
                  selectedId === candidate.id ? "bg-accent" : ""
                }`}
              >
                <Avatar className="h-10 w-10 mt-1">
                  <AvatarImage src={getAvatar(candidate)} alt={candidate.name} className="object-cover" />
                  <AvatarFallback>{candidate.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium truncate">{candidate.name}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      candidate.matchScore >= 90 ? "bg-green-100 text-green-700" : 
                      candidate.matchScore >= 80 ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                    }`}>
                      {candidate.matchScore}%
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground truncate mb-1">
                    {candidate.title} · {candidate.experience}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {candidate.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-[10px] bg-secondary px-1 rounded text-secondary-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Middle Column: Detailed Resume (50%) */}
      <div className="w-1/2 border-r bg-background flex flex-col">
        {selectedCandidate ? (
          <ScrollArea className="h-full">
            <div className="p-8 max-w-3xl mx-auto" ref={resumeRef}>
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex gap-6">
                  <Avatar className="h-24 w-24 border-4 border-background shadow-sm bg-secondary/20">
                    <AvatarImage src={getAvatar(selectedCandidate)} alt={selectedCandidate.name} className="object-cover" />
                    <AvatarFallback className="text-2xl">{selectedCandidate.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{selectedCandidate.name}</h1>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {selectedCandidate.experience}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {selectedCandidate.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <GraduationCap className="h-4 w-4" />
                        {selectedCandidate.education}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {selectedCandidate.salary}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedCandidate.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        安排面试
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => {
                          setDate(d);
                          if (d) {
                            toast.success(`已安排面试: ${format(d, "yyyy年MM月dd日", { locale: zhCN })}`, {
                              description: `候选人: ${selectedCandidate?.name}`,
                              action: {
                                label: "撤销",
                                onClick: () => setDate(undefined)
                              }
                            });
                          }
                        }}
                        locale={zhCN}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Button variant="outline" size="sm" className="gap-2" onClick={handleExportPDF}>
                    <Download className="h-4 w-4" />
                    导出PDF
                  </Button>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Summary */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  个人总结
                </h3>
                <p className="text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-lg">
                  {selectedCandidate.summary}
                </p>
              </section>

              {/* Work History */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  工作经历
                </h3>
                <div className="space-y-6">
                  {selectedCandidate.details.workHistory.map((work, index) => (
                    <div key={index} className="relative pl-4 border-l-2 border-muted pb-6 last:pb-0">
                      <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-base">{work.company}</h4>
                        <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded">
                          {work.period}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-primary mb-2">{work.role}</div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {work.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Education */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  教育背景
                </h3>
                <div className="grid gap-4">
                  {selectedCandidate.details.education.map((edu, index) => (
                    <Card key={index} className="shadow-sm">
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <div className="font-medium">{edu.school}</div>
                          <div className="text-sm text-muted-foreground">{edu.degree}</div>
                        </div>
                        <div className="text-sm text-muted-foreground">{edu.period}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Skills */}
              <section>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  专业技能
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCandidate.details.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </section>
            </div>
          </ScrollArea>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            请选择一位候选人查看详情
          </div>
        )}
      </div>

      {/* Right Column: AI Evaluation (30%) */}
      <div className="w-[30%] bg-muted/10 border-l flex flex-col">
        <div className="p-4 border-b bg-background flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center text-primary">
            <Star className="h-4 w-4" />
          </div>
          <h2 className="font-semibold text-lg">AI 智能评价</h2>
        </div>
        
        {selectedCandidate ? (
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {/* Overall Score */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6 text-center">
                  <div className="text-sm text-muted-foreground mb-1">综合匹配度</div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {selectedCandidate.aiEvaluation.score}
                    <span className="text-lg text-muted-foreground font-normal">/100</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedCandidate.aiEvaluation.summary}
                  </p>
                </CardContent>
              </Card>

              {/* Pros */}
              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2 text-green-600">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-600" />
                  核心优势
                </h3>
                <ul className="space-y-2">
                  {selectedCandidate.aiEvaluation.pros.map((pro, i) => (
                    <li key={i} className="text-sm bg-green-50 text-green-900 p-3 rounded-md border border-green-100">
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2 text-amber-600">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                  潜在风险
                </h3>
                <ul className="space-y-2">
                  {selectedCandidate.aiEvaluation.cons.map((con, i) => (
                    <li key={i} className="text-sm bg-amber-50 text-amber-900 p-3 rounded-md border border-amber-100">
                      {con}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suggestion */}
              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2 text-blue-600">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                  面试建议
                </h3>
                <div className="text-sm bg-blue-50 text-blue-900 p-4 rounded-md border border-blue-100 leading-relaxed flex gap-3">
                  <Lightbulb className="h-5 w-5 shrink-0 text-blue-600" />
                  {selectedCandidate.aiEvaluation.suggestion}
                </div>
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            暂无评价数据
          </div>
        )}
      </div>
    </div>
  );
}
