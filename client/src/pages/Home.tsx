import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Loader2, Search, Sparkles, User, Briefcase, MapPin, DollarSign, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BatchImportDialog } from "@/components/BatchImportDialog";

export default function Home() {
  const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importFormData, setImportFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    yearsOfExperience: 0,
    location: "",
    expectedSalary: "",
    summary: "",
  });

  // 获取候选人列表
  const { data: candidates, isLoading: candidatesLoading } = trpc.candidates.list.useQuery();

  // 获取选中候选人的详情
  const { data: candidateDetail, isLoading: detailLoading } = trpc.candidates.detail.useQuery(
    { id: selectedCandidateId! },
    { enabled: !!selectedCandidateId }
  );

  // 获取选中候选人的AI评价
  const { data: evaluation, isLoading: evaluationLoading } = trpc.candidates.evaluation.useQuery(
    { candidateId: selectedCandidateId! },
    { enabled: !!selectedCandidateId }
  );

  // 生成AI评价
  const generateEvaluation = trpc.candidates.generateEvaluation.useMutation();

  // 导入候选人
  const utils = trpc.useUtils();
  const importCandidate = trpc.candidates.importCandidate.useMutation({
    onSuccess: () => {
      toast.success("候选人导入成功！");
      setImportDialogOpen(false);
      setImportFormData({
        name: "",
        email: "",
        phone: "",
        position: "",
        yearsOfExperience: 0,
        location: "",
        expectedSalary: "",
        summary: "",
      });
      utils.candidates.list.invalidate();
    },
    onError: (error) => {
      toast.error("导入失败：" + error.message);
    },
  });

  // 筛选候选人
  const filteredCandidates = useMemo(() => {
    if (!candidates) return [];
    if (!searchTerm) return candidates;

    const term = searchTerm.toLowerCase();
    return candidates.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.position.toLowerCase().includes(term) ||
        c.email?.toLowerCase().includes(term) ||
        c.skills.some((s) => s.name.toLowerCase().includes(term))
    );
  }, [candidates, searchTerm]);

  // 自动选择第一个候选人
  if (candidates && candidates.length > 0 && !selectedCandidateId) {
    setSelectedCandidateId(candidates[0].id);
  }

  const handleGenerateEvaluation = async () => {
    if (!selectedCandidateId) return;
    await generateEvaluation.mutateAsync({ candidateId: selectedCandidateId });
  };

  // 获取匹配度颜色
  const getScoreColor = (score: string | number) => {
    const numScore = typeof score === "string" ? parseFloat(score) : score;
    if (numScore >= 90) return "bg-green-100 text-green-800 border-green-200";
    if (numScore >= 80) return "bg-blue-100 text-blue-800 border-blue-200";
    if (numScore >= 70) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* 顶部标题栏 */}
      <header className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">招聘管理系统</h1>
            <p className="text-sm text-muted-foreground">智能简历筛选与评价</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              共 {candidates?.length || 0} 位候选人
            </Badge>
            <BatchImportDialog />
            <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  导入候选人
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>导入候选人信息</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">姓名 *</Label>
                      <Input
                        id="name"
                        value={importFormData.name}
                        onChange={(e) => setImportFormData({ ...importFormData, name: e.target.value })}
                        placeholder="请输入姓名"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">应聘职位 *</Label>
                      <Input
                        id="position"
                        value={importFormData.position}
                        onChange={(e) => setImportFormData({ ...importFormData, position: e.target.value })}
                        placeholder="请输入应聘职位"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">邮箱</Label>
                      <Input
                        id="email"
                        type="email"
                        value={importFormData.email}
                        onChange={(e) => setImportFormData({ ...importFormData, email: e.target.value })}
                        placeholder="请输入邮箱"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">电话</Label>
                      <Input
                        id="phone"
                        value={importFormData.phone}
                        onChange={(e) => setImportFormData({ ...importFormData, phone: e.target.value })}
                        placeholder="请输入电话"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="experience">工作年限</Label>
                      <Input
                        id="experience"
                        type="number"
                        value={importFormData.yearsOfExperience}
                        onChange={(e) => setImportFormData({ ...importFormData, yearsOfExperience: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">所在地</Label>
                      <Input
                        id="location"
                        value={importFormData.location}
                        onChange={(e) => setImportFormData({ ...importFormData, location: e.target.value })}
                        placeholder="请输入所在地"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salary">期望薪资</Label>
                      <Input
                        id="salary"
                        value={importFormData.expectedSalary}
                        onChange={(e) => setImportFormData({ ...importFormData, expectedSalary: e.target.value })}
                        placeholder="如：10-15K"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="summary">个人总结</Label>
                    <Textarea
                      id="summary"
                      value={importFormData.summary}
                      onChange={(e) => setImportFormData({ ...importFormData, summary: e.target.value })}
                      placeholder="请输入个人总结、工作经历或技能特长..."
                      rows={6}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
                    取消
                  </Button>
                  <Button
                    onClick={() => {
                      if (!importFormData.name || !importFormData.position) {
                        toast.error("请填写姓名和应聘职位！");
                        return;
                      }
                      importCandidate.mutate(importFormData);
                    }}
                    disabled={importCandidate.isPending}
                  >
                    {importCandidate.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    确认导入
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* 三栏布局 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧：候选人列表 */}
        <div className="w-80 border-r bg-card flex flex-col">
          {/* 搜索框 */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索姓名、职位、技能..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* 候选人列表 */}
          <ScrollArea className="flex-1">
            {candidatesLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="p-2">
                {filteredCandidates.map((candidate) => (
                  <Card
                    key={candidate.id}
                    className={`p-4 mb-2 cursor-pointer transition-all hover:shadow-md ${
                      selectedCandidateId === candidate.id
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                    onClick={() => setSelectedCandidateId(candidate.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {candidate.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-foreground truncate">
                            {candidate.name}
                          </h3>
                          <Badge
                            className={`ml-2 text-xs font-bold ${getScoreColor(
                              candidate.matchScore || '0'
                            )}`}
                          >
                            {candidate.matchScore || '0'}分
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 truncate">
                          {candidate.position} · {candidate.yearsOfExperience}年经验
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.slice(0, 3).map((skill) => (
                            <Badge
                              key={skill.id}
                              variant="secondary"
                              className="text-xs"
                            >
                              {skill.name}
                            </Badge>
                          ))}
                          {candidate.skills.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{candidate.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* 中间：简历详情 */}
        <div className="flex-1 bg-background overflow-hidden">
          <ScrollArea className="h-full">
            {detailLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : candidateDetail ? (
              <div className="p-8 max-w-4xl">
                {/* 候选人基本信息 */}
                <div className="mb-8">
                  <div className="flex items-start gap-6 mb-6">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                        {candidateDetail.candidate.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold text-foreground mb-2">
                        {candidateDetail.candidate.name}
                      </h2>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          <span>{candidateDetail.candidate.position}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{candidateDetail.candidate.yearsOfExperience}年经验</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{candidateDetail.candidate.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span>{candidateDetail.candidate.expectedSalary}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {candidateDetail.skills.map((skill) => (
                          <Badge key={skill.id} variant="outline">
                            {skill.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 个人总结 */}
                {candidateDetail.candidate.summary && (
                  <section className="mb-8">
                    <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                      <User className="h-5 w-5" />
                      个人总结
                    </h3>
                    <Card className="p-4 bg-card">
                      <p className="text-foreground leading-relaxed">
                        {candidateDetail.candidate.summary}
                      </p>
                    </Card>
                  </section>
                )}

                {/* 工作经历 */}
                {candidateDetail.workExperiences.length > 0 && (
                  <section className="mb-8">
                    <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      工作经历
                    </h3>
                    <div className="space-y-4">
                      {candidateDetail.workExperiences.map((work) => (
                        <Card key={work.id} className="p-5 bg-card">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-foreground text-lg">
                                {work.company}
                              </h4>
                              <p className="text-primary font-medium">{work.position}</p>
                            </div>
                            <Badge variant="secondary">
                              {work.startDate} - {work.endDate}
                            </Badge>
                          </div>
                          {work.description && (
                            <p className="text-muted-foreground mb-2">{work.description}</p>
                          )}
                          {work.achievements && (
                            <div className="mt-3 pl-4 border-l-2 border-primary/30">
                              <p className="text-sm text-foreground">{work.achievements}</p>
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  </section>
                )}

                {/* 教育背景 */}
                {candidateDetail.educations.length > 0 && (
                  <section className="mb-8">
                    <h3 className="text-xl font-semibold text-foreground mb-3">教育背景</h3>
                    <div className="space-y-3">
                      {candidateDetail.educations.map((edu) => (
                        <Card key={edu.id} className="p-4 bg-card">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-foreground">{edu.school}</h4>
                              <p className="text-muted-foreground">
                                {edu.degree} · {edu.major}
                              </p>
                            </div>
                            <Badge variant="secondary">
                              {edu.startDate} - {edu.endDate}
                            </Badge>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </section>
                )}

                {/* 项目经验 */}
                {candidateDetail.projects.length > 0 && (
                  <section className="mb-8">
                    <h3 className="text-xl font-semibold text-foreground mb-3">项目经验</h3>
                    <div className="space-y-4">
                      {candidateDetail.projects.map((project) => (
                        <Card key={project.id} className="p-5 bg-card">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-foreground text-lg">
                                {project.name}
                              </h4>
                              <p className="text-primary font-medium">{project.role}</p>
                            </div>
                            <Badge variant="secondary">
                              {project.startDate} - {project.endDate}
                            </Badge>
                          </div>
                          {project.description && (
                            <p className="text-muted-foreground mb-2">{project.description}</p>
                          )}
                          {project.technologies && (
                            <p className="text-sm text-muted-foreground mb-2">
                              <span className="font-medium">技术栈：</span>
                              {project.technologies}
                            </p>
                          )}
                          {project.achievements && (
                            <div className="mt-3 pl-4 border-l-2 border-primary/30">
                              <p className="text-sm text-foreground">{project.achievements}</p>
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>请从左侧选择候选人查看详情</p>
              </div>
            )}
          </ScrollArea>
        </div>

        {/* 右侧：AI智能评价 */}
        <div className="w-96 border-l bg-card flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI 智能评价
              </h3>
              {selectedCandidateId && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleGenerateEvaluation}
                  disabled={generateEvaluation.isPending}
                >
                  {generateEvaluation.isPending ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      生成中
                    </>
                  ) : (
                    "重新生成"
                  )}
                </Button>
              )}
            </div>
          </div>

          <ScrollArea className="flex-1">
            {evaluationLoading || generateEvaluation.isPending ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : evaluation ? (
              <div className="p-4 space-y-6">
                {/* 综合评分 */}
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">综合匹配度</p>
                  <div className="text-5xl font-bold text-primary mb-1">
                    {evaluation.overallScore || '0'}
                    <span className="text-2xl text-muted-foreground">/100</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {parseFloat(evaluation.overallScore || '0') >= 90
                      ? "非常匹配"
                      : parseFloat(evaluation.overallScore || '0') >= 80
                      ? "匹配度高"
                      : parseFloat(evaluation.overallScore || '0') >= 70
                      ? "基本匹配"
                      : "需要评估"}
                  </p>
                </div>

                {/* 核心优势 */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    核心优势
                  </h4>
                  <div className="space-y-2">
                    {JSON.parse(evaluation.strengths || '[]').map((strength: string, idx: number) => (
                      <div
                        key={idx}
                        className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800"
                      >
                        <p className="text-sm text-foreground">{strength}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 潜在风险 */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-orange-500" />
                    潜在风险
                  </h4>
                  <div className="space-y-2">
                    {JSON.parse(evaluation.risks || '[]').map((risk: string, idx: number) => (
                      <div
                        key={idx}
                        className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800"
                      >
                        <p className="text-sm text-foreground">{risk}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 面试建议 */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    面试建议
                  </h4>
                  <div className="space-y-2">
                    {JSON.parse(evaluation.suggestions || '[]').map((suggestion: string, idx: number) => (
                      <div
                        key={idx}
                        className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800"
                      >
                        <p className="text-sm text-foreground">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 详细分析 */}
                {evaluation.detailedAnalysis && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">详细分析</h4>
                    <Card className="p-4 bg-muted/50">
                      <p className="text-sm text-foreground leading-relaxed">
                        {evaluation.detailedAnalysis}
                      </p>
                    </Card>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <Sparkles className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-4">暂无AI评价</p>
                {selectedCandidateId && (
                  <Button onClick={handleGenerateEvaluation} disabled={generateEvaluation.isPending}>
                    {generateEvaluation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        生成中...
                      </>
                    ) : (
                      "生成AI评价"
                    )}
                  </Button>
                )}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
