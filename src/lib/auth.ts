import { parse } from "cookie";
import { NextRequest } from "next/server";

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
