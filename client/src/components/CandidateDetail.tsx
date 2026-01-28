import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Candidate } from "@/types";
import { Bot, Briefcase, GraduationCap, MapPin, User } from "lucide-react";

interface CandidateDetailProps {
  candidate: Candidate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CandidateDetail({ candidate, open, onOpenChange }: CandidateDetailProps) {
  if (!candidate) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-4">
              <img
                src={candidate.avatar}
                alt={candidate.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-border"
              />
              <div>
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  {candidate.name}
                  <Badge variant={candidate.status === "active" ? "default" : "secondary"}>
                    {candidate.status === "active" ? "活跃" : candidate.status}
                  </Badge>
                </DialogTitle>
                <div className="text-muted-foreground mt-1 flex items-center gap-3 text-sm">
                  <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {candidate.title}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {candidate.location}</span>
                  <span className="flex items-center gap-1"><User className="w-3 h-3" /> {candidate.experience}</span>
                  <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3" /> {candidate.education}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{candidate.matchScore}%</div>
              <div className="text-xs text-muted-foreground">匹配度</div>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-8">
            
            {/* 第一部分：核心关键词 */}
            <section>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-primary">
                <span className="w-1 h-6 bg-primary rounded-full"></span>
                核心关键词
              </h3>
              <div className="flex flex-wrap gap-2">
                {candidate.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="px-3 py-1 text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
                    {tag}
                  </Badge>
                ))}
                {candidate.details.skills.map((skill) => (
                  <Badge key={skill} variant="outline" className="px-3 py-1 text-sm text-muted-foreground">
                    {skill}
                  </Badge>
                ))}
              </div>
            </section>

            <Separator />

            {/* 第二部分：详细简历信息 */}
            <section className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-primary">
                  <span className="w-1 h-6 bg-primary rounded-full"></span>
                  工作经历
                </h3>
                <div className="space-y-6 relative pl-4 border-l-2 border-muted">
                  {candidate.details.workHistory.map((work, index) => (
                    <div key={index} className="relative">
                      <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-primary border-2 border-background"></div>
                      <div className="font-medium text-base">{work.company}</div>
                      <div className="text-sm text-muted-foreground flex justify-between mt-1 mb-2">
                        <span>{work.role}</span>
                        <span>{work.period}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed bg-muted/30 p-3 rounded-md">
                        {work.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-primary">
                  <span className="w-1 h-6 bg-primary rounded-full"></span>
                  教育背景
                </h3>
                <div className="space-y-4">
                  {candidate.details.education.map((edu, index) => (
                    <Card key={index} className="shadow-sm">
                      <CardContent className="p-4">
                        <div className="font-medium">{edu.school}</div>
                        <div className="text-sm text-muted-foreground mt-1">{edu.degree}</div>
                        <div className="text-xs text-muted-foreground mt-2">{edu.period}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            <Separator />

            {/* 第三部分：AI 面试评价 */}
            <section>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-purple-600">
                <Bot className="w-6 h-6" />
                AI 智能评价
              </h3>
              
              <Card className="bg-purple-50/50 border-purple-100 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <Bot className="w-32 h-32 text-purple-600" />
                </div>
                <CardContent className="p-6 relative z-10">
                  <div className="mb-6">
                    <div className="text-sm font-medium text-purple-800 mb-2">综合评价</div>
                    <p className="text-purple-900 leading-relaxed font-medium">
                      {candidate.aiEvaluation.summary}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <div className="text-sm font-medium text-green-700 mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        优势分析
                      </div>
                      <ul className="space-y-2">
                        {candidate.aiEvaluation.pros.map((pro, i) => (
                          <li key={i} className="text-sm text-green-800 bg-green-50 px-3 py-2 rounded-md border border-green-100">
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-orange-700 mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                        潜在风险
                      </div>
                      <ul className="space-y-2">
                        {candidate.aiEvaluation.cons.map((con, i) => (
                          <li key={i} className="text-sm text-orange-800 bg-orange-50 px-3 py-2 rounded-md border border-orange-100">
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-purple-100 shadow-sm">
                    <div className="text-sm font-medium text-purple-800 mb-1">面试建议</div>
                    <p className="text-sm text-muted-foreground">
                      {candidate.aiEvaluation.suggestion}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-muted/10 shrink-0 flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>关闭</Button>
          <Button className="bg-primary hover:bg-primary/90">发起沟通</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
