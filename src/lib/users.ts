import { User } from "@/store/usersStore";
import { supabase } from "./supabase";
import { toast } from "sonner";

/**
 * This TypeScript function fetches all users with the profile name "designer" from a database using
 * Supabase and updates the state with the retrieved data.
 * @param  - The `getAllDesigners` function is an asynchronous function that retrieves all users with
 * the profile name "designer" from a Supabase database. It takes two parameters:
 * @returns The function `getAllDesigners` returns a list of users who have the profile name set as
 * "designer". This list is then passed to the `setUsers` function to update the state with the
 * filtered designers. If there is an error during the process, an error message is logged and the
 * loading state is set to false.
 */
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
      // console.log(error);
      toast.error("Error al obtener los usuarios");
      setLoading(false);
      return;
    }
    const designers = data.filter((user) => user.profile.name === "designer");
    setUsers(designers);
    if (error) {
      // console.log(error);
      return;
    }
  } catch (error) {
    // console.log(error);
  } finally {
    setLoading(false);
  }
};

export { getAllDesigners };
