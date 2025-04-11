"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSessionStore } from "@/store/sessionStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email({ message: "Correo inválido" }),
  password: z.string().min(6, { message: "Mínimo 6 caracteres" }),
});

type FormValues = z.infer<typeof formSchema>;

const Login = () => {
  const router = useRouter();
  const setSession = useSessionStore((state) => state.setSession);
  const setUser = useSessionStore((state) => state.setUser);
  const setProfile = useSessionStore((state) => state.setProfile);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: FormValues) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    console.log("Supabase res_", { data, error });

    if (error) {
      toast(error.message);
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
    }
  };
  return (
    <Card className="w-md max-w-lg h-auto mx-auto mt-20">
      <CardHeader>
        <CardTitle className="text-2xl text-center mb-2 font-bold">
          Inicia Sesión
        </CardTitle>
        <CardDescription className="text-sm text-balance text-center font-medium">
          Ingresa el correo electrónico y la contraseña proporcionada para
          iniciar sesión
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-2"
          >
            <Label htmlFor="email">Correo electrónico</Label>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="user@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Label htmlFor="password" className="mt-5">
              Contraseña
            </Label>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full mt-5 cursor-pointer">
              Iniciar sesión
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Login;
