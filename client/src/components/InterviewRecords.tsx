import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, FileText, Trash2, Edit, Plus } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface InterviewRecordsProps {
  candidateId: number;
}

export function InterviewRecords({ candidateId }: InterviewRecordsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    interviewDate: "",
    interviewer: "",
    interviewType: "onsite" as "phone" | "video" | "onsite" | "technical" | "hr",
    feedback: "",
    rating: 3,
    result: "pending" as "pending" | "passed" | "failed" | "on_hold",
    notes: "",
  });

  const utils = trpc.useUtils();

  // 获取面试记录列表
  const { data: interviews, isLoading } = trpc.interviews.list.useQuery({ candidateId });

  // 创建面试记录
  const createInterview = trpc.interviews.create.useMutation({
    onSuccess: () => {
      toast.success("面试记录已添加");
      utils.interviews.list.invalidate({ candidateId });
      setDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`添加失败：${error.message}`);
    },
  });

  // 更新面试记录
  const updateInterview = trpc.interviews.update.useMutation({
    onSuccess: () => {
      toast.success("面试记录已更新");
      utils.interviews.list.invalidate({ candidateId });
      setDialogOpen(false);
      resetForm();
      setEditingInterview(null);
    },
    onError: (error) => {
      toast.error(`更新失败：${error.message}`);
    },
  });

  // 删除面试记录
  const deleteInterview = trpc.interviews.delete.useMutation({
    onSuccess: () => {
      toast.success("面试记录已删除");
      utils.interviews.list.invalidate({ candidateId });
    },
    onError: (error) => {
      toast.error(`删除失败：${error.message}`);
    },
  });

  const resetForm = () => {
    setFormData({
      interviewDate: "",
      interviewer: "",
      interviewType: "onsite",
      feedback: "",
      rating: 3,
      result: "pending",
      notes: "",
    });
  };

  const handleSubmit = () => {
    if (!formData.interviewDate) {
      toast.error("请选择面试时间");
      return;
    }

    if (editingInterview) {
      updateInterview.mutate({
        id: editingInterview.id,
        interviewDate: new Date(formData.interviewDate),
        interviewer: formData.interviewer || undefined,
        interviewType: formData.interviewType,
        feedback: formData.feedback || undefined,
        rating: formData.rating,
        result: formData.result,
        notes: formData.notes || undefined,
      });
    } else {
      createInterview.mutate({
        candidateId,
        interviewDate: new Date(formData.interviewDate),
        interviewer: formData.interviewer || undefined,
        interviewType: formData.interviewType,
        feedback: formData.feedback || undefined,
        rating: formData.rating,
        result: formData.result,
        notes: formData.notes || undefined,
      });
    }
  };

  const handleEdit = (interview: any) => {
    setEditingInterview(interview);
    setFormData({
      interviewDate: interview.interviewDate ? format(new Date(interview.interviewDate), "yyyy-MM-dd'T'HH:mm") : "",
      interviewer: interview.interviewer || "",
      interviewType: interview.interviewType || "onsite",
      feedback: interview.feedback || "",
      rating: interview.rating || 3,
      result: interview.result || "pending",
      notes: interview.notes || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("确定要删除这条面试记录吗？")) {
      deleteInterview.mutate({ id });
    }
  };

  const getInterviewTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      phone: "电话面试",
      video: "视频面试",
      onsite: "现场面试",
      technical: "技术面试",
      hr: "HR面试",
    };
    return labels[type] || type;
  };

  const getResultBadge = (result: string) => {
    const config: Record<string, { label: string; className: string }> = {
      pending: { label: "待定", className: "bg-gray-100 text-gray-800" },
      passed: { label: "通过", className: "bg-green-100 text-green-800" },
      failed: { label: "未通过", className: "bg-red-100 text-red-800" },
      on_hold: { label: "待观察", className: "bg-yellow-100 text-yellow-800" },
    };
    const { label, className } = config[result] || config.pending;
    return <Badge className={className}>{label}</Badge>;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">面试记录</h3>
        <Button
          size="sm"
          onClick={() => {
            resetForm();
            setEditingInterview(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          添加面试记录
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center text-muted-foreground py-8">加载中...</div>
      ) : interviews && interviews.length > 0 ? (
        <div className="space-y-3">
          {interviews.map((interview) => (
            <Card key={interview.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {interview.interviewDate ? format(new Date(interview.interviewDate), "yyyy-MM-dd HH:mm") : "未设置"}
                    </span>
                    <Badge variant="outline">{getInterviewTypeLabel(interview.interviewType || "onsite")}</Badge>
                    {getResultBadge(interview.result || "pending")}
                  </div>

                  {interview.interviewer && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>面试官：{interview.interviewer || "未设置"}</span>
                    </div>
                  )}

                  {interview.rating && (
                    <div className="flex items-center gap-2 text-sm">
                      <span>评分：</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className={star <= (interview.rating || 0) ? "text-yellow-500" : "text-gray-300"}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {interview.feedback && (
                    <div className="text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <FileText className="h-4 w-4" />
                        <span>面试反馈：</span>
                      </div>
                      <p className="text-foreground pl-6">{interview.feedback}</p>
                    </div>
                  )}

                  {interview.notes && (
                    <div className="text-sm text-muted-foreground pl-6">
                      <span>备注：{interview.notes}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(interview)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(interview.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-8 border rounded-lg border-dashed">
          暂无面试记录
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingInterview ? "编辑面试记录" : "添加面试记录"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>面试时间 *</Label>
                <Input
                  type="datetime-local"
                  value={formData.interviewDate}
                  onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value })}
                />
              </div>

              <div>
                <Label>面试官</Label>
                <Input
                  value={formData.interviewer}
                  onChange={(e) => setFormData({ ...formData, interviewer: e.target.value })}
                  placeholder="请输入面试官姓名"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>面试类型</Label>
                <Select
                  value={formData.interviewType}
                  onValueChange={(value: any) => setFormData({ ...formData, interviewType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phone">电话面试</SelectItem>
                    <SelectItem value="video">视频面试</SelectItem>
                    <SelectItem value="onsite">现场面试</SelectItem>
                    <SelectItem value="technical">技术面试</SelectItem>
                    <SelectItem value="hr">HR面试</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>面试结果</Label>
                <Select
                  value={formData.result}
                  onValueChange={(value: any) => setFormData({ ...formData, result: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">待定</SelectItem>
                    <SelectItem value="passed">通过</SelectItem>
                    <SelectItem value="failed">未通过</SelectItem>
                    <SelectItem value="on_hold">待观察</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>评分（1-5星）</Label>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className={`text-2xl ${star <= formData.rating ? "text-yellow-500" : "text-gray-300"}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>面试反馈</Label>
              <Textarea
                value={formData.feedback}
                onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                placeholder="请输入面试反馈..."
                rows={4}
              />
            </div>

            <div>
              <Label>备注</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="其他备注信息..."
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createInterview.isPending || updateInterview.isPending}
            >
              {(createInterview.isPending || updateInterview.isPending) && "处理中..."}
              {!createInterview.isPending && !updateInterview.isPending && (editingInterview ? "更新" : "添加")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
