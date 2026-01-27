import { CandidateCard } from "@/components/CandidateCard";
import { CandidateDetail } from "@/components/CandidateDetail";
import { Sidebar } from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { candidates } from "@/lib/data";
import { Candidate } from "@/types";
import { Filter, LayoutGrid, List, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleCandidateClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsDetailOpen(true);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        {/* Header Section */}
        <header className="flex justify-between items-center mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">候选人管理</h1>
            <p className="text-muted-foreground">
              当前共有 <span className="font-mono font-bold text-primary">{candidates.length}</span> 位活跃候选人
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="w-4 h-4" /> 筛选视图
            </Button>
            <Button className="gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
              <Search className="w-4 h-4" /> 智能搜索
            </Button>
          </div>
        </header>

        {/* Filter & Search Bar */}
        <div className="bg-card border rounded-xl p-4 mb-8 shadow-sm flex flex-wrap gap-4 items-center justify-between animate-in fade-in slide-in-from-top-5 duration-700 delay-100">
          <div className="flex gap-4 flex-1 min-w-[300px]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="搜索姓名、技能、职位..." className="pl-9 bg-secondary/30 border-transparent focus:bg-background transition-all" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有状态</SelectItem>
                <SelectItem value="new">新候选人</SelectItem>
                <SelectItem value="interviewing">面试中</SelectItem>
                <SelectItem value="offer">已发 Offer</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="score">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="排序" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score">匹配度最高</SelectItem>
                <SelectItem value="newest">最新活跃</SelectItem>
                <SelectItem value="salary">薪资最低</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2 border-l pl-4">
            <Button 
              variant={viewMode === "grid" ? "secondary" : "ghost"} 
              size="icon" 
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button 
              variant={viewMode === "list" ? "secondary" : "ghost"} 
              size="icon" 
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          {candidates.map((candidate) => (
            <CandidateCard 
              key={candidate.id} 
              candidate={candidate} 
              onClick={() => handleCandidateClick(candidate)} 
            />
          ))}
          
          {/* Placeholder Card for Add New */}
          <div className="border-2 border-dashed border-muted rounded-xl flex flex-col items-center justify-center p-8 text-muted-foreground hover:border-primary/50 hover:bg-accent/5 transition-all cursor-pointer group min-h-[280px]">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Filter className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="font-medium">从简历库导入</p>
            <p className="text-sm mt-1 opacity-70">支持 PDF/Word 批量解析</p>
          </div>
        </div>
      </main>

      <CandidateDetail 
        candidate={selectedCandidate} 
        open={isDetailOpen} 
        onOpenChange={setIsDetailOpen} 
      />
    </div>
  );
}
