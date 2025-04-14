"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  FormLabel,
} from "@/components/ui/form";
import Loader from "@/components/Loader";
import { useSessionStore } from "@/store/sessionStore";
import { loginUser } from "@/lib/auth";

const formSchema = z.object({
  email: z
    .string({ required_error: "El correo es obligatorio" })
    .min(1, { message: "El correo es obligatorio" })
    .email({ message: "Correo inválido" }),
  password: z
    .string({ required_error: "La contraseña es obligatoria" })
    .min(1, { message: "La contraseña es obligatoria" })
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
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
              className="flex flex-col space-y-5"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input placeholder="user@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
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
