import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, Clock } from "lucide-react";

export default function EvaluatorDashboard() {
  const assignments = [
    { id: 1, candidate: 'Alice Johnson', job: 'Senior Frontend Developer', due: '3 days' },
    { id: 2, candidate: 'Charlie Brown', job: 'Senior Frontend Developer', due: '5 days' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Evaluator Dashboard</h1>
        <p className="text-muted-foreground">
          Review and evaluate assigned candidates.
        </p>
      </div>
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle>Your Assignments</CardTitle>
          <CardDescription>
            You have {assignments.length} candidates to evaluate.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignments.map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-2 rounded-md">
                     <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{task.candidate}</p>
                    <p className="text-sm text-muted-foreground">{task.job}</p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Due in {task.due}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
