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

type AssignDesignerPayload = {
  projectId: string;
  designerId: string | null;
};

/**
 * The function `getAllRequests` retrieves projects based on the user's profile type (pm, client,
 * designer) and sets them in the state while handling loading states and errors.
 * @param  - The `getAllRequests` function is an asynchronous function that retrieves requests based on
 * the user's profile and session ID. Here's an explanation of the parameters:
 * @returns In the `getAllRequests` function, the `setRequests(projects)` is being returned when the
 * projects are successfully fetched based on the user's profile type (pm, client, designer).
 */
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
        // console.error("Error al obtener los proyectos:", error);
        toast.error("Error al obtener los proyectos");
        setLoading(false);
        return;
      } else {
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
        // console.error("Error al obtener los proyectos:", error);
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
        // console.error("Error al obtener los proyectos:", error);
        toast.error("Error al obtener los proyectos");
        setLoading(false);
        return;
      } else {
        // console.log("Proyectos encontrados:", projects);
        return setRequests(projects);
      }
    }
  } catch (error) {
    // console.log(error);
  } finally {
    setLoading(false);
  }
};

/**
 * The function `createProjectWithFiles` uploads files to storage and creates a project with the
 * uploaded files in a database.
 * @param {CreateProjectParams}  - The `createProjectWithFiles` function is an asynchronous function
 * that takes in an object with the following parameters:
 * @returns The function `createProjectWithFiles` returns an object that includes the project data and
 * the uploaded files. The structure of the returned object includes the project details such as title,
 * description, client_id, and an array of files with their name, path, and public URL.
 */
const createProjectWithFiles = async ({
  title,
  description,
  clientId,
  files,
}: CreateProjectParams) => {
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

  const { data: project, error: createError } = await supabase
    .from("projects")
    .insert([{ title, description, client_id: clientId, files: uploadedFiles }])
    .select()
    .single();

  if (createError) {
    // console.log("Error al crear el proyecto: ", createError);
    toast.error("Error al crear el proyecto");
    return;
  }

  toast.success("Proyecto creado con éxito");

  return {
    ...project,
    files: uploadedFiles,
  };
};

/**
 * The function `assignDesigner` updates a project with a new designer and returns the updated project
 * details.
 * @param {AssignDesignerPayload}  - The `assignDesigner` function is an asynchronous function that
 * takes in an object with two properties: `projectId` and `designerId`. These properties are used to
 * update a project in a database with the specified designer ID and update the `updated_at` field with
 * the current date and time.
 * @returns The `assignDesigner` function is returning the `designerProject` data object after updating
 * the designer for a specific project.
 */
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

/**
 * The `deleteProject` function deletes a project from a database along with its associated files from
 * storage.
 * @param {string} projectId - The `projectId` parameter in the `deleteProject` function is a string
 * that represents the unique identifier of the project that needs to be deleted. This identifier is
 * used to fetch the project details from the database, including the list of files associated with the
 * project that need to be deleted.
 * @returns The `deleteProject` function returns the deleted project data if successful, or it throws
 * an error message if there was an error during the deletion process. If the deletion is successful,
 * it also displays a success message using a toast notification.
 */
const deleteProject = async (projectId: string) => {
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
  toast.success("Proyecto eliminado.");
  return deletedProject;
};

export { getAllRequests, createProjectWithFiles, deleteProject };
