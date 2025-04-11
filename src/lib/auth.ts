import { parse } from "cookie";
import { NextRequest } from "next/server";
import { supabase } from "./supabase";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "sonner";
import { Profile, Session, User } from "@/store/sessionStore";

export async function loginUser(
  setLoading: (loading: boolean) => void,
  email: string,
  password: string,
  setSession: (session: Session | null) => void,
  setUser: (user: User | null) => void,
  setProfile: (profile: Profile | null) => void,
  router: AppRouterInstance
) {
  setLoading(true);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    toast(error.message);
    setLoading(false);
    return;
  }

  if (data.session) {
    // Obtener el perfil desde la tabla 'profiles'
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.session.user.id)
      .single();

    if (profileError) {
      console.error("Error al obtener el perfil:", profileError);
      toast("Error al cargar el perfil del usuario");
      setLoading(false);
      return;
    }

    document.cookie = `token=${data.session.access_token}; path=/; max-age=3600; secure; SameSite=Lax`;

    setSession({
      access_token: data.session.access_token,
      expires_at: data.session.expires_at,
      expires_in: data.session.expires_in,
      refresh_token: data.session.refresh_token,
      token_type: data.session.token_type,
    });
    setUser({
      id: data.session.user.id,
      aud: data.session.user.aud,
      email: data.session.user.email,
      created_at: data.session.user.created_at,
    });
    setProfile({
      role: profile?.role,
    });
    router.push("/dashboard");
    setLoading(false);
  }
}

export function getCurrentSession(request: NextRequest) {
  // Obtener las cookies de la solicitud
  const cookieHeader = request.headers.get("cookie");

  if (!cookieHeader) {
    return null;
  }

  // Parsear las cookies
  const cookies = parse(cookieHeader);
  const token = cookies["token"];

  if (!token) {
    return null;
  }

  // Aquí podrías validar el token (por ejemplo, verificar si está expirado)
  return { access_token: token };
}

export async function signOutUser(
  setLoading: (loading: boolean) => void,
  router: AppRouterInstance,
  resetSession: () => void
) {
  try {
    setLoading(true);
    // Cerrar sesión en Supabase
    await supabase.auth.signOut();

    // Limpiar el estado de sesión en Zustand
    resetSession();

    // Eliminar el token de las cookies
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    // Redirigir al usuario a la página de inicio
    router.push("/");
    setLoading(false);
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
}
