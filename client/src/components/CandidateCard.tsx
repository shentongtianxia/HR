import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Candidate } from "@/types";
import { Briefcase, MapPin, Phone } from "lucide-react";

interface CandidateCardProps {
  candidate: Candidate;
  onClick: () => void;
}

export function CandidateCard({ candidate, onClick }: CandidateCardProps) {
  return (
    <Card 
      className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-transparent hover:border-l-primary group animate-in fade-in-50 slide-in-from-bottom-2"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="flex gap-4">
          <img 
            src={candidate.avatar} 
            alt={candidate.name} 
            className="w-12 h-12 rounded-full object-cover border-2 border-muted"
          />
          <div>
            <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{candidate.name}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Briefcase className="w-3 h-3" /> {candidate.experience}经验
              <span className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
              <MapPin className="w-3 h-3" /> {candidate.location}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold font-mono text-primary">{candidate.salary}</p>
          <Badge variant={candidate.matchScore >= 90 ? "default" : "secondary"} className="mt-1">
            匹配度 {candidate.matchScore}%
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-2 mb-3">
          {candidate.tags.map((tag: string) => (
            <Badge key={tag} variant="outline" className="bg-secondary/50 text-secondary-foreground border-transparent">
              {tag}
            </Badge>
          ))}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {candidate.summary}
        </p>
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-between items-center border-t bg-muted/20 mt-2">
        <span className="text-xs text-muted-foreground font-medium px-2 py-1 bg-background rounded border">
          {candidate.status}
        </span>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" className="h-8">详情</Button>
          <Button size="sm" className="h-8 gap-1">
            <Phone className="w-3 h-3" /> 沟通
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
