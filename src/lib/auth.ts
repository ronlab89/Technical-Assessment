import { parse } from "cookie";
import { NextRequest } from "next/server";
import { supabase } from "./supabase";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

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
  router: AppRouterInstance,
  resetSession: () => void
) {
  try {
    // Cerrar sesión en Supabase
    await supabase.auth.signOut();

    // Limpiar el estado de sesión en Zustand
    resetSession();

    // Eliminar el token de las cookies
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    // Redirigir al usuario a la página de inicio
    router.push("/");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
}
