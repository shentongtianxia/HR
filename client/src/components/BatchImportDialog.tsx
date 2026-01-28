import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, Loader2, FileUp } from "lucide-react";
import { toast } from "sonner";

export function BatchImportDialog() {
  const [open, setOpen] = useState(false);
  const [batchImportFile, setBatchImportFile] = useState<File | null>(null);
  const [resumeFiles, setResumeFiles] = useState<File[]>([]);
  const [parsingResumes, setParsingResumes] = useState(false);
  const [batchImportProgress, setBatchImportProgress] = useState(0);
  const [batchImportResult, setBatchImportResult] = useState<{
    total: number;
    successCount: number;
    failureCount: number;
    results: Array<{ success: boolean; name: string; error?: string }>;
  } | null>(null);

  const utils = trpc.useUtils();

  // 解析简历文件
  const parseResume = trpc.candidates.parseResume.useMutation();

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

  // 处理简历文件上传
  const handleResumeFilesUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const validFiles = Array.from(files).filter(file => {
      const ext = file.name.toLowerCase().split('.').pop();
      return ext === 'pdf' || ext === 'doc' || ext === 'docx';
    });
    
    if (validFiles.length === 0) {
      toast.error('请上传PDF或Word格式的简历文件');
      return;
    }
    
    setResumeFiles(validFiles);
  };

  // 解析并导入简历文件
  const handleParseAndImportResumes = async () => {
    if (resumeFiles.length === 0) {
      toast.error('请先上传简历文件');
      return;
    }

    setParsingResumes(true);
    setBatchImportProgress(0);
    setBatchImportResult(null);

    try {
      const candidates = [];
      const progressStep = 80 / resumeFiles.length;

      for (let i = 0; i < resumeFiles.length; i++) {
        const file = resumeFiles[i];
        toast.info(`正在解析第 ${i + 1}/${resumeFiles.length} 份简历...`);

        try {
          // 读取文件为Base64
          const fileData = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const base64 = (reader.result as string).split(',')[1];
              resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });

          // 调用后端API解析简历
          const resumeInfo = await parseResume.mutateAsync({
            fileData,
            filename: file.name,
          });

          // 转换为导入格式
          candidates.push({
            name: resumeInfo.name,
            position: resumeInfo.position || '未知',
            email: resumeInfo.email,
            phone: resumeInfo.phone,
            location: resumeInfo.location,
            yearsOfExperience: resumeInfo.yearsOfExperience,
            expectedSalary: resumeInfo.expectedSalary,
            summary: resumeInfo.summary,
            workExperiences: resumeInfo.workExperiences,
            educations: resumeInfo.educations,
            skills: resumeInfo.skills,
          });

          setBatchImportProgress((i + 1) * progressStep);
        } catch (error) {
          console.error(`解析简历 ${file.name} 失败:`, error);
          toast.error(`解析简历 ${file.name} 失败`);
        }
      }

      if (candidates.length === 0) {
        throw new Error('没有成功解析任何简历');
      }

      // 批量导入解析后的候选人
      toast.info('正在导入候选人...');
      await batchImport.mutateAsync({ candidates });
      
      // 清空文件列表
      setResumeFiles([]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '简历解析失败');
      setBatchImportProgress(0);
    } finally {
      setParsingResumes(false);
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
        <div className="space-y-6 py-4">
          {/* JSON/CSV文件导入 */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">方式一：JSON/CSV文件导入</h3>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
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
          </div>

          {/* PDF/Word简历导入 */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">方式二：简历文件导入（PDF/Word）</h3>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <FileUp className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  上传PDF或Word简历，AI自动提取关键信息
                </p>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  multiple
                  onChange={(e) => handleResumeFilesUpload(e.target.files)}
                  className="max-w-xs mx-auto"
                />
                {resumeFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-sm font-medium">已选择 {resumeFiles.length} 份简历：</p>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {resumeFiles.map((file, index) => (
                        <div key={index} className="text-xs text-muted-foreground flex items-center justify-center gap-2">
                          <FileText className="h-3 w-3" />
                          {file.name}
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={handleParseAndImportResumes}
                      disabled={parsingResumes}
                      className="mt-2"
                    >
                      {parsingResumes ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          解析中...
                        </>
                      ) : (
                        `开始解析并导入 ${resumeFiles.length} 份简历`
                      )}
                    </Button>
                  </div>
                )}
              </div>
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
