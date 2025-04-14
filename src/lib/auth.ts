import { parse } from "cookie";
import { NextRequest } from "next/server";
import { supabase } from "./supabase";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "sonner";
import { Profile, Session, User } from "@/store/sessionStore";

/**
 * The function `loginUser` handles the login process for a user, including authentication, retrieving
 * user and profile data, setting session information, and redirecting the user to a specific page.
 * @param setLoading - The `setLoading` parameter is a function that takes a boolean value as an
 * argument and is used to update the loading state in your application interface. When
 * `setLoading(true)` is called, it indicates that a loading state is in progress, and when
 * `setLoading(false)` is called, it
 * @param {string} email - The `email` parameter in the `loginUser` function represents the email
 * address entered by the user for logging in. It is a string value that is used as part of the
 * authentication process to verify the user's identity.
 * @param {string} password - The `password` parameter in the `loginUser` function is a string that
 * represents the password input provided by the user when attempting to log in. This password is used
 * along with the email to authenticate the user's credentials during the login process.
 * @param setSession - The `setSession` parameter in the `loginUser` function is a function that will
 * be used to update the session information in your application. It takes an object with properties
 * like `access_token`, `expires_at`, `expires_in`, `refresh_token`, and `token_type` as its argument
 * @param setUser - The `setUser` parameter in the `loginUser` function is a function that will be used
 * to update the user state in your application. When the user successfully logs in, you will use this
 * function to set the user data in your application state.
 * @param setProfile - The `setProfile` parameter in the `loginUser` function is a function that takes
 * a `profile` object as an argument and sets the profile state in the application. In this case, it is
 * used to update the profile state with the role information of the user after a successful login.
 * @param {AppRouterInstance} router - The `router` parameter in the `loginUser` function is an
 * instance of the AppRouter. It is used for navigating to different pages/routes within the
 * application. In the provided code snippet, after a successful login, the function uses the `router`
 * instance to navigate the user to the "/requests
 * @returns The `loginUser` function returns nothing (`void`). It performs asynchronous operations to
 * log in a user, set session data, user data, profile data, and then redirects the user to the
 * "/requests" page.
 */
const loginUser = async (
  setLoading: (loading: boolean) => void,
  email: string,
  password: string,
  setSession: (session: Session | null) => void,
  setUser: (user: User | null) => void,
  setProfile: (profile: Profile | null) => void,
  router: AppRouterInstance
) => {
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
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.session.user.id)
      .maybeSingle();

    if (userError) {
      // console.error("Error al obtener el usuario:", userError);
      toast("Error al obtener el perfil del usuario");
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.profile_id)
      .maybeSingle();

    if (profileError) {
      // console.error("Error al obtener el role:", profileError);
      toast("Error al cargar el perfil del usuario");
      setLoading(false);
      return;
    }

    document.cookie = `token=${data.session.access_token}; path=/; max-age=3600; secure; SameSite=Lax`;

    setSession({
      access_token: "",
      expires_at: data.session.expires_at,
      expires_in: data.session.expires_in,
      refresh_token: data.session.refresh_token,
      token_type: data.session.token_type,
    });
    setUser({
      id: user.id,
      aud: data.session.user.aud,
      full_name: user.full_name,
      email: user.email,
      created_at: data.session.user.created_at,
    });
    setProfile({
      role: profile?.name,
    });
    router.push("/requests");
    setLoading(false);
  }
};

/**
 * The function `getCurrentSession` extracts the access token from the cookie header of a request in
 * TypeScript.
 * @param {NextRequest} request - The `request` parameter in the `getCurrentSession` function is of
 * type `NextRequest`. It is used to access information about the incoming HTTP request, such as
 * headers, cookies, and other request details.
 * @returns The `getCurrentSession` function returns an object with the `access_token` property set to
 * the value of the `token` cookie extracted from the request headers. If there is no `cookie` header
 * or no `token` cookie found, it returns `null`.
 */
const getCurrentSession = (request: NextRequest) => {
  const cookieHeader = request.headers.get("cookie");

  if (!cookieHeader) {
    return null;
  }

  const cookies = parse(cookieHeader);
  const token = cookies["token"];

  if (!token) {
    return null;
  }

  return { access_token: token };
};

/**
 * The function `signOutUser` signs out the user, resets session data, clears cookies, and navigates to
 * the home page.
 * @param setLoading - The `setLoading` parameter is a function that takes a boolean value as an
 * argument and is used to update the loading state in the user interface. It is typically used to show
 * a loading spinner or indicator while an asynchronous operation is in progress.
 * @param {AppRouterInstance} router - The `router` parameter in the `signOutUser` function is an
 * instance of the AppRouter class. It is used for routing within the application, such as navigating
 * to different pages or routes. In the provided code snippet, the `router` is used to redirect the
 * user to the home page
 * @param resetSession - The `resetSession` function is used to clear or reset any session-related data
 * or state in your application. This could include clearing user authentication tokens, resetting user
 * session data, or any other session-related information that needs to be cleared when a user signs
 * out.
 * @param resetRequest - The `resetRequest` function is a function that is called to reset any
 * request-related data or state in your application. This could include clearing out any request
 * headers, resetting request-related variables, or any other necessary cleanup related to requests
 * made by the user during their session.
 * @param resetUser - The `resetUser` function is a callback function that is used to reset the
 * user-related data or state in the application. It is typically called when a user signs out to clear
 * any user-specific information stored in the application.
 */
const signOutUser = async (
  setLoading: (loading: boolean) => void,
  router: AppRouterInstance,
  resetSession: () => void,
  resetRequest: () => void,
  resetUser: () => void
) => {
  try {
    setLoading(true);
    await supabase.auth.signOut();

    resetSession();
    resetRequest();
    resetUser();

    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    router.push("/");
    setLoading(false);
  } catch (error) {
    // console.error("Error al cerrar sesión:", error);
  }
};

export { loginUser, getCurrentSession, signOutUser };
