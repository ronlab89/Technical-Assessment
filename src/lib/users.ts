import { User } from "@/store/usersStore";
import { supabase } from "./supabase";
import { toast } from "sonner";

const getAllDesigners = async ({
  setLoading,
  setUsers,
}: {
  setLoading: (loading: boolean) => void;
  setUsers: (data: User[] | null) => void;
}) => {
  try {
    setLoading(true);
    const { data, error } = await supabase.from("users").select(`
        *,
        profile:profile_id (id, name)
      `);
    if (error) {
      console.log(error);
      toast.error("Error al obtener los usuarios");
      setLoading(false);
      return;
    }
    const designers = data.filter((user) => user.profile.name === "designer");
    setUsers(designers);
    if (error) {
      console.log(error);
      return;
    }
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

export { getAllDesigners };
