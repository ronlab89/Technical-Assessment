import { toast } from "sonner";
import { supabase } from "./supabase";
import { Request } from "@/store/requestStore";

type FileInput = File[];

type CreateProjectParams = {
  title: string;
  description: string;
  clientId: string;
  files: FileInput;
};

const getAllRequests = async ({
  setLoading,
  setRequests,
  profile,
  sessionId,
}: {
  setLoading: (loading: boolean) => void;
  setRequests: (data: Request[] | null) => void;
  profile: string | undefined;
  sessionId: string | undefined;
}) => {
  try {
    setLoading(true);
    //PM
    if (profile === "pm") {
      const { data: projects, error } = await supabase
        .from("projects")
        .select(
          `*, client:client_id (id, full_name, email), designer:designer_id (id, full_name, email)`
        );

      if (error) {
        console.error("Error al obtener los proyectos:", error);
        toast.error("Error al obtener los proyectos");
        setLoading(false);
        return;
      } else {
        // console.log("Proyectos encontrados:", projects);
        return setRequests(projects);
      }
    }
    // Cliente
    if (profile === "client") {
      const { data: projects, error } = await supabase
        .from("projects")
        .select(
          `*, client:client_id (id, full_name, email), designer:designer_id (id, full_name, email)`
        )
        .eq("client_id", sessionId);

      if (error) {
        console.error("Error al obtener los proyectos:", error);
        toast.error("Error al obtener los proyectos");
        setLoading(false);
        return;
      } else {
        // console.log("Proyectos encontrados:", projects);
        return setRequests(projects);
      }
    }
    // Designer
    if (profile === "designer") {
      const { data: projects, error } = await supabase
        .from("projects")
        .select(
          `*, client:client_id (id, full_name, email), designer:designer_id (id, full_name, email)`
        )
        .eq("designer_id", sessionId);

      if (error) {
        console.error("Error al obtener los proyectos:", error);
        toast.error("Error al obtener los proyectos");
        setLoading(false);
        return;
      } else {
        // console.log("Proyectos encontrados:", projects);
        return setRequests(projects);
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

const createProjectWithFiles = async ({
  title,
  description,
  clientId,
  files,
}: CreateProjectParams) => {
  // Subimos los archivos al storage
  const uploadedFiles = [];

  for (const file of files) {
    const filePath = `${Date.now()}_${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("project-files")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const publicUrl = supabase.storage
      .from("project-files")
      .getPublicUrl(filePath).data.publicUrl;

    uploadedFiles.push({
      name: file.name,
      path: filePath,
      url: publicUrl,
    });
  }
  console.log("uploadedFiles", uploadedFiles);

  //Creamos el proyecto con los archivos subidos
  const { data: project, error: createError } = await supabase
    .from("projects")
    .insert([{ title, description, client_id: clientId, files: uploadedFiles }])
    .select()
    .single();

  if (createError) {
    console.log("Error al crear el proyecto: ", createError);
    toast.error("Error al crear el proyecto");
    return;
  }

  toast.success("Proyecto creado con éxito");

  return {
    ...project,
    files: uploadedFiles,
  };
};

type AssignDesignerPayload = {
  projectId: string;
  designerId: string | null;
};

export const assignDesigner = async ({
  projectId,
  designerId,
}: AssignDesignerPayload) => {
  const { error: updateError } = await supabase
    .from("projects")
    .update({ designer_id: designerId, updated_at: new Date().toISOString() })
    .eq("id", projectId)
    .select();

  if (updateError) return toast.error("Error al asignar el diseñador");
  const { data: designerProject, error: designerError } = await supabase
    .from("projects")
    .select(
      `*, client:client_id (id, full_name, email), designer:designer_id (id, full_name, email)`
    )
    .eq("id", projectId)
    .single();
  if (designerError) return toast.error("Error al obtener el proyecto");
  if (designerProject.designer_id === null) {
    toast.success("Diseñador removido");
  } else {
    toast.success("Diseñador asignado");
  }
  return designerProject;
};

const deleteProject = async (projectId: string) => {
  // Obtener lista de archivos para borrar del storage
  const { data: project, error: fetchError } = await supabase
    .from("projects")
    .select("files")
    .eq("id", projectId)
    .single();

  if (fetchError) throw fetchError;

  type FileObject = { path: string };
  const filesToDelete =
    project?.files?.map((file: FileObject) => file.path) || [];

  const { error: storageError } = await supabase.storage
    .from("project-files")
    .remove(filesToDelete);

  if (storageError) toast.error(storageError.message);

  const { data: deletedProject, error: deleteError } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId)
    .select();

  if (deleteError) return toast.error(deleteError.message);
  toast.success("Proyecto eliminado con éxito");
  return deletedProject;
};

export { getAllRequests, createProjectWithFiles, deleteProject };
