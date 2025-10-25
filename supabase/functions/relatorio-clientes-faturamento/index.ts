import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
}

const jsonResponse = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status,
  })

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get("Authorization")
    if (!authHeader) {
      return jsonResponse(401, { error: "Missing Authorization header" })
    }

    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    )

    const {
      data: { user },
      error: userError,
    } = await supabaseUser.auth.getUser()

    if (userError || !user?.email) {
      console.error("Auth error:", userError)
      return jsonResponse(401, { error: "Não autenticado" })
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    )

    const { data: usuario, error: usuarioError } = await supabaseAdmin
      .from("usuarios")
      .select("oficina_id")
      .eq("email", user.email)
      .single()

    if (usuarioError) {
      console.warn(
        `Não foi possível encontrar oficina para ${user.email}:`,
        usuarioError,
      )
      return jsonResponse(200, [])
    }

    const oficinaId = usuario?.oficina_id
    if (!oficinaId) {
      console.warn(`Usuário ${user.email} não possui oficina vinculada.`)
      return jsonResponse(200, [])
    }

    const { data, error } = await supabaseAdmin.rpc(
      "relatorio_clientes_maior_faturamento",
      { p_oficina_id: oficinaId },
    )

    if (error) {
      console.error("Erro na RPC relatorio_clientes_maior_faturamento:", error)
      return jsonResponse(200, [])
    }

    return jsonResponse(200, data ?? [])
  } catch (error) {
    console.error(
      "Erro inesperado na função relatorio-clientes-faturamento:",
      error,
    )
    return jsonResponse(500, { error: "Erro interno no relatório." })
  }
})