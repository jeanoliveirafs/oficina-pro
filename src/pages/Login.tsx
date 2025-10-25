import { Button } from "@/components/ui/button";
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
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 lg:flex-row">
        <Card className="flex-1 border-none bg-primary text-primary-foreground shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <BadgeCheck className="h-8 w-8" />
              <CardTitle className="text-2xl font-bold">
                Oficina Pro
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-primary-foreground/80">
            <p className="text-lg font-semibold">
              Gestão completa de oficinas em um só lugar.
            </p>
            <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed">
              <li>Controle de vendas, estoque e financeiro em tempo real.</li>
              <li>Interface intuitiva e responsiva para qualquer dispositivo.</li>
              <li>Segurança garantida com Supabase Auth e RLS.</li>
            </ul>
            <div className="mt-6">
              <Button
                variant="secondary"
                size="lg"
                className="pointer-events-none opacity-90"
              >
                Acelere sua oficina agora
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900">
              Acesse sua conta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Auth
              supabaseClient={supabase}
              providers={[]}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: "#1E40AF",
                      brandAccent: "#1D4ED8",
                    },
                    borderRadiusButton: "8px",
                  },
                },
              }}
              theme="light"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;