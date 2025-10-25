import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import { useSession } from "@/hooks/use-session";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { BadgeCheck } from "lucide-react";
import { Navigate, useLocation } from "react-router-dom";

const Login = () => {
  const { session } = useSession();
  const location = useLocation();
  const redirectPath =
    (location.state as { from?: string } | null)?.from ?? "/";

  if (session) {
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url(/azul.png)" }}
    >
      <div className="absolute inset-0 bg-black/70" />
      <Card className="z-10 w-full max-w-md border-border/60 bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex items-center gap-2">
            <BadgeCheck className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Oficina Pro</h1>
          </div>
          <CardTitle className="text-lg font-semibold text-foreground">
            Acesse sua conta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Auth
            supabaseClient={supabase}
            providers={[]}
            localization={{
              variables: {
                sign_in: {
                  email_label: "Endereço de e-mail",
                  password_label: "Senha",
                  email_input_placeholder: "seu@email.com",
                  password_input_placeholder: "Sua senha",
                  button_label: "Entrar",
                  loading_button_label: "Entrando...",
                  link_text: "Não tem uma conta? Cadastre-se",
                },
                sign_up: {
                  email_label: "Endereço de e-mail",
                  password_label: "Senha",
                  email_input_placeholder: "seu@email.com",
                  password_input_placeholder: "Crie uma senha",
                  button_label: "Cadastrar",
                  loading_button_label: "Cadastrando...",
                  link_text: "Já tem uma conta? Entrar",
                },
                forgotten_password: {
                  email_label: "Endereço de e-mail",
                  password_label: "Senha",
                  email_input_placeholder: "seu@email.com",
                  button_label: "Enviar instruções",
                  loading_button_label: "Enviando...",
                  link_text: "Esqueceu sua senha?",
                },
                common: {
                  password_mismatch: "As senhas não coincidem",
                  empty_password: "A senha não pode estar vazia",
                },
              },
            }}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "hsl(217, 91%, 60%)",
                    brandAccent: "hsl(217, 91%, 70%)",
                    defaultButtonBackground: "hsl(224, 71%, 6%)",
                    defaultButtonBackgroundHover: "hsl(224, 71%, 8%)",
                    inputText: "white",
                    inputLabelText: "white",
                  },
                  radii: {
                    borderRadiusButton: "8px",
                    inputBorderRadius: "8px",
                  },
                },
              },
            }}
            theme="dark"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;