import { useRequestStore } from "@/store/requestStore";
import { useSessionStore } from "@/store/sessionStore";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { FileX2 } from "lucide-react";
import { Button } from "./ui/button";
import { deleteProject } from "@/lib/request";

type ProjectWithOptionalDesigner = {
  id: string;
  designer_id: string | null;
  designer?: {
    full_name: string;
  };
};

const ActionsCell = ({ project }: { project: ProjectWithOptionalDesigner }) => {
  const profile = useSessionStore((state) => state.profile);
  const requests = useRequestStore((state) => state.requests);
  const setRequests = useRequestStore((state) => state.setRequests);
  return (
    <>
      {profile?.role === "pm" && (
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger>
              <FileX2 className="w-[16px] cursor-pointer hover:text-slate-700" />
            </PopoverTrigger>
            <PopoverContent className="w-fit">
              <span className="text-xs text-balance block mb-2 w-fit">
                ¿Estás seguro de que quieres eliminar este proyecto?
              </span>
              <Button
                onClick={() => {
                  deleteProject(project.id).then((deletedProject) => {
                    if (deletedProject) {
                      const updatedRequests = requests
                        ? requests.filter((req) => req.id !== project.id)
                        : [];
                      setRequests(updatedRequests);
                    }
                  });
                }}
                variant="destructive"
                className="w-fit cursor-pointer"
              >
                Eliminar
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </>
  );
};

export default ActionsCell;
