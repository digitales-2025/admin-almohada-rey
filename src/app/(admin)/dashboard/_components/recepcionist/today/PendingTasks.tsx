import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function PendingTasks() {
  const tasks = [
    {
      id: "TASK-001",
      title: "Limpieza de habitación 203",
      description: "Solicitado por Juan Pérez",
      requester: {
        initials: "JP",
      },
      priority: "high",
      time: "Hace 30 min",
    },
    {
      id: "TASK-002",
      title: "Toallas extra para habitación 105",
      description: "Solicitado por María García",
      requester: {
        initials: "MG",
      },
      priority: "medium",
      time: "Hace 1h",
    },
    {
      id: "TASK-003",
      title: "Solicitud de late check-out",
      description: "Solicitado por Roberto Jiménez",
      requester: {
        initials: "RJ",
      },
      priority: "medium",
      time: "Hace 2h",
    },
    {
      id: "TASK-004",
      title: "Servicio a la habitación 302",
      description: "Solicitado por Ana López",
      requester: {
        initials: "AL",
      },
      priority: "low",
      time: "Hace 3h",
    },
  ];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-500">Alta Prioridad</Badge>;
      case "medium":
        return (
          <Badge variant="outline" className="border-amber-500 text-amber-700">
            Media Prioridad
          </Badge>
        );
      case "low":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-700">
            Baja Prioridad
          </Badge>
        );
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id} className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarFallback>{task.requester.initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{task.title}</p>
                {getPriorityBadge(task.priority)}
              </div>
              <p className="text-xs text-muted-foreground">{task.description}</p>
              <p className="text-xs text-muted-foreground mt-1">{task.time}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
