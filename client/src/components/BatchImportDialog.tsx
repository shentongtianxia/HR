import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function BatchImportDialog() {
  const [open, setOpen] = useState(false);
  const [batchImportFile, setBatchImportFile] = useState<File | null>(null);
  const [batchImportProgress, setBatchImportProgress] = useState(0);
  const [batchImportResult, setBatchImportResult] = useState<{
    total: number;
    successCount: number;
    failureCount: number;
    results: Array<{ success: boolean; name: string; error?: string }>;
  } | null>(null);

  const utils = trpc.useUtils();

  // 批量导入候选人
  const batchImport = trpc.candidates.batchImport.useMutation({
    onSuccess: (result) => {
      setBatchImportResult(result);
      setBatchImportProgress(100);
      toast.success(`批量导入完成！成功 ${result.successCount} 人，失败 ${result.failureCount} 人`);
      utils.candidates.list.invalidate();
    },
    onError: (error) => {
      toast.error("批量导入失败：" + error.message);
      setBatchImportProgress(0);
    },
  });

  // 处理CSV文件
  const parseCSV = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      throw new Error('CSV文件格式错误，至少需要表头和一行数据');
    }

    const headers = lines[0].split(',').map(h => h.trim());
    const candidates = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const candidate: any = {};

      headers.forEach((header, index) => {
        const value = values[index] || '';
        if (header === 'name') candidate.name = value;
        else if (header === 'email') candidate.email = value;
        else if (header === 'phone') candidate.phone = value;
        else if (header === 'position') candidate.position = value;
        else if (header === 'yearsOfExperience') candidate.yearsOfExperience = parseInt(value) || 0;
        else if (header === 'location') candidate.location = value;
        else if (header === 'expectedSalary') candidate.expectedSalary = value;
        else if (header === 'summary') candidate.summary = value;
      });

      if (candidate.name && candidate.position) {
        candidates.push(candidate);
      }
    }

    return candidates;
  };

  // 处理文件上传
  const handleFileUpload = async (file: File) => {
    setBatchImportFile(file);
    setBatchImportProgress(0);
    setBatchImportResult(null);

    try {
      const text = await file.text();
      let candidates;

      if (file.name.endsWith('.json')) {
        const data = JSON.parse(text);
        candidates = Array.isArray(data) ? data : [data];
      } else if (file.name.endsWith('.csv')) {
        candidates = parseCSV(text);
      } else {
        throw new Error('不支持的文件格式，请上传JSON或CSV文件');
      }

      if (candidates.length === 0) {
        throw new Error('文件中没有有效的候选人数据');
      }

      setBatchImportProgress(50);
      await batchImport.mutateAsync({ candidates });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '文件解析失败');
      setBatchImportProgress(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          批量导入
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>批量导入候选人</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                支持JSON或CSV格式文件，单次最多导入100人
              </p>
              <Input
                type="file"
                accept=".json,.csv"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                className="max-w-xs mx-auto"
              />
            </div>
          </div>

          {batchImportProgress > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>导入进度</span>
                <span>{batchImportProgress}%</span>
              </div>
              <Progress value={batchImportProgress} />
            </div>
          )}

          {batchImportResult && (
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">
                    导入完成：总计 {batchImportResult.total} 人，
                    成功 {batchImportResult.successCount} 人，
                    失败 {batchImportResult.failureCount} 人
                  </p>
                  {batchImportResult.failureCount > 0 && (
                    <div className="text-xs space-y-1">
                      <p className="font-medium text-destructive">失败记录：</p>
                      {batchImportResult.results
                        .filter((r) => !r.success)
                        .map((r, i) => (
                          <p key={i}>
                            {r.name}: {r.error}
                          </p>
                        ))}
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
            <p className="font-medium">文件格式说明：</p>
            <div className="space-y-1 text-muted-foreground">
              <p><strong>JSON格式：</strong></p>
              <pre className="bg-background p-2 rounded text-xs overflow-x-auto">
{`[
  {
    "name": "张三",
    "position": "销售经理",
    "email": "zhangsan@example.com",
    "phone": "13800138000",
    "yearsOfExperience": 5,
    "location": "北京",
    "expectedSalary": "20-30K",
    "summary": "5年销售经验..."
  }
]`}
              </pre>
              <p className="mt-2"><strong>CSV格式：</strong></p>
              <pre className="bg-background p-2 rounded text-xs overflow-x-auto">
name,position,email,phone,yearsOfExperience,location,expectedSalary,summary
张三,销售经理,zhangsan@example.com,13800138000,5,北京,20-30K,5年销售经验...
              </pre>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setOpen(false);
                setBatchImportFile(null);
                setBatchImportProgress(0);
                setBatchImportResult(null);
              }}
            >
              关闭
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
