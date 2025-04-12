import { supabase } from "./supabase";

type FileInput = File[];

type CreateProjectParams = {
  title: string;
  description: string;
  userId: string;
  files: FileInput;
};

const getAllRequests = async () => {
  try {
    const { data, error } = await supabase.from("projects").select();
    console.log("requests__", { data });
    if (error) {
      console.log(error);
      return;
    }
  } catch (error) {
    console.log(error);
  }
};

const createProjectWithFiles = async ({
  title,
  description,
  files,
}: CreateProjectParams) => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) throw new Error("Usuario no autenticado");

  const clientId = userData.user.id;

  // Primero creamos el proyecto sin archivos
  const { data: project, error: createError } = await supabase
    .from("projects")
    .insert([{ title, description, client_id: clientId }])
    .select()
    .single();

  if (createError) throw createError;

  const projectId = project.id;
  const uploadedFiles = [];

  for (const file of files) {
    const filePath = `${projectId}/${Date.now()}_${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("project_files")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const publicUrl = supabase.storage
      .from("project_files")
      .getPublicUrl(filePath).data.publicUrl;

    uploadedFiles.push({
      name: file.name,
      path: filePath,
      url: publicUrl,
    });
  }

  // Actualizamos el proyecto con los archivos subidos
  const { error: updateError } = await supabase
    .from("projects")
    .update({ files: uploadedFiles })
    .eq("id", projectId);

  if (updateError) throw updateError;

  return {
    ...project,
    files: uploadedFiles,
  };
};

export { getAllRequests, createProjectWithFiles };
