"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { loginUser } from "@/lib/auth";
import { useState } from "react";
import Loader from "./Loader";

// const formSchema = z.object({
//   email: z.string().email({ message: "Correo inválido" }),
//   password: z.string().min(6, { message: "Mínimo 6 caracteres" }),
// });

const formSchema = z.object({
  email: z
    .string({ required_error: "El correo es obligatorio" }) // Campo obligatorio
    .email({ message: "Correo inválido" }), // Formato de correo válido
  password: z
    .string({ required_error: "La contraseña es obligatoria" }) // Campo obligatorio
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }), // Mínimo 8 caracteres
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

  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (values: FormValues) => {
    await loginUser(
      setLoading,
      values.email,
      values.password,
      setSession,
      setUser,
      setProfile,
      router
    );
  };
  return (
    <>
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
      {loading ? <Loader type="" text="" /> : null}
    </>
  );
};

export default Login;
