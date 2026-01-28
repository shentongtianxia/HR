import { useState, useMemo, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";
import { candidates } from "../lib/data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Briefcase, GraduationCap, MapPin, DollarSign, Star, AlertTriangle, Lightbulb, CheckCircle2, Search, Download, Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SimpleView() {
  const [selectedId, setSelectedId] = useState(candidates[0]?.id);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCandidates = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return candidates;
    return candidates.filter((c) => 
      c.name.toLowerCase().includes(query) ||
      c.title.toLowerCase().includes(query) ||
      c.tags.some(tag => tag.toLowerCase().includes(query)) ||
      c.location.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const selectedCandidate = candidates.find((c) => c.id === selectedId) || filteredCandidates[0];
  const resumeRef = useRef<HTMLDivElement>(null);

  // Helper to get avatar based on gender/name
  const getAvatar = (candidate: typeof candidates[0]) => {
    const isFemale = candidate.name.includes("女士") || candidate.name.includes("小姐") || candidate.name.includes("女");
    return isFemale ? "/images/avatar_female.png" : "/images/avatar_male.png";
  };

  // Export PDF function
  const handleExportPDF = async () => {
    if (!resumeRef.current || !selectedCandidate) return;
    
    try {
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });
      
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`${selectedCandidate.name}_简历报告.pdf`);
      toast.success("PDF导出成功");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("导出失败，请重试");
    }
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
        toast.success(`成功解析文件: ${file.name}`);
        // In a real app, we would parse this text into the candidate structure
        // For now, we'll just show a toast with the first few chars
        console.log("Parsed text:", text.substring(0, 200));
        toast.info("文件解析成功（演示模式：仅提取文本，未入库）");
      }
    } catch (error) {
      console.error("Import failed:", error);
      toast.error("文件解析失败");
    }
  };

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
                <Button variant="outline" size="sm" className="gap-2" onClick={handleExportPDF}>
                  <Download className="h-4 w-4" />
                  导出PDF
                </Button>
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
