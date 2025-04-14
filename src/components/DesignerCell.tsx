import { useSessionStore } from "@/store/sessionStore";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { PencilRuler } from "lucide-react";
import AssingDesigner from "./AssingDesigner";

type ProjectWithOptionalDesigner = {
  id: string;
  designer_id: string | null;
  designer?: {
    full_name: string;
  };
};

const DesignerCell = ({
  project,
}: {
  project: ProjectWithOptionalDesigner;
}) => {
  const profile = useSessionStore((state) => state.profile);

  return (
    <div className="flex items-center gap-2">
      <span>
        {project.designer_id !== null
          ? `Asignado a: ${project?.designer?.full_name}`
          : "Sin asignar"}
      </span>
      {profile?.role === "pm" && (
        <Popover>
          <PopoverTrigger>
            <PencilRuler className="w-[16px] cursor-pointer" />
          </PopoverTrigger>
          <PopoverContent>
            <AssingDesigner projectId={project.id} />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default DesignerCell;
