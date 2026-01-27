import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Candidate } from "@/types";
import { Briefcase, Calendar, GraduationCap, Mail, MapPin, Phone, User } from "lucide-react";

interface CandidateDetailProps {
  candidate: Candidate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CandidateDetail({ candidate, open, onOpenChange }: CandidateDetailProps) {
  if (!candidate) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b bg-muted/10">
          <div className="flex justify-between items-start">
            <div className="flex gap-5">
              <img 
                src={candidate.avatar} 
                alt={candidate.name} 
                className="w-20 h-20 rounded-xl object-cover border-4 border-background shadow-sm"
              />
              <div>
                <DialogTitle className="text-2xl font-bold mb-1">{candidate.name}</DialogTitle>
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {candidate.experience}经验</span>
                  <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" /> {candidate.education}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {candidate.location}</span>
                  {/* <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {candidate.age}岁</span> */}
                </div>
                <div className="flex gap-2">
                  <Badge variant="default" className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                    {candidate.title}
                  </Badge>
                  <Badge variant="outline" className="text-muted-foreground">
                    {candidate.status}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold font-mono text-primary mb-1">{candidate.salary}</div>
              <div className="text-sm text-muted-foreground">期望薪资</div>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-8">
            {/* 个人优势 */}
            <section>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="w-1 h-6 bg-accent rounded-full" />
                个人优势
              </h3>
              <div className="bg-muted/30 p-4 rounded-lg text-sm leading-relaxed space-y-2">
                {candidate.summary}
              </div>
            </section>

            {/* 核心技能 */}
            <section>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full" />
                核心技能
              </h3>
              <div className="flex flex-wrap gap-2">
                {candidate.details.skills.map(skill => (
                  <Badge key={skill} variant="secondary" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </section>

            {/* 项目经历 */}
            <section>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="w-1 h-6 bg-secondary-foreground rounded-full" />
                项目经历
              </h3>
              <div className="space-y-4">
                {candidate.details.workHistory.map((work, index) => (
                  <div key={index} className="relative pl-6 border-l-2 border-muted pb-4 last:pb-0">
                    <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-semibold text-base">{work.company}</h4>
                      <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
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
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-background flex justify-between items-center">
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Phone className="w-4 h-4" /> 电话沟通
            </span>
            <span className="flex items-center gap-2">
              <Mail className="w-4 h-4" /> 邮件联系
            </span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">下载简历</Button>
            <Button className="gap-2">
              <Calendar className="w-4 h-4" /> 预约面试
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
