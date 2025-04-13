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
        .select("*");

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
        .select("*")
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
        .select("*")
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
  // Primero creamos el proyecto sin archivos
  const { data: project, error: createError } = await supabase
    .from("projects")
    .insert([{ title, description, client_id: clientId }])
    .select()
    .single();

  if (createError) {
    console.log("Error al crear el proyecto: ", createError);
    toast.error("Error al crear el proyecto");
    return;
  }

  const projectId = project.id;
  const uploadedFiles = [];

  for (const file of files) {
    const filePath = `${projectId}/${Date.now()}_${file.name}`;

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
  // Actualizamos el proyecto con los archivos subidos
  const { error: updateError } = await supabase
    .from("projects")
    .update({ files: uploadedFiles })
    .eq("id", projectId);

  if (updateError) {
    console.log(
      "Error al actualizar el proyecto con los archivos: ",
      updateError
    );
    toast.error("Error al actualizar el proyecto con los archivos");
    return;
  }
  toast.success("Proyecto creado con éxito");

  return {
    ...project,
    files: uploadedFiles,
  };
};

export { getAllRequests, createProjectWithFiles };
