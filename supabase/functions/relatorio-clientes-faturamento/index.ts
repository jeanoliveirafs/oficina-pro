import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function getOficinaId(supabase: SupabaseClient): Promise<string> {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    if (!user || !user.email) throw new Error("User not authenticated or email is missing");

    const { data: usuario, error: usuarioError } = await supabase
        .from('usuarios')
        .select('oficina_id')
        .eq('email', user.email)
        .single();

    if (usuarioError) {
        console.error("Error fetching from 'usuarios' table:", usuarioError);
        throw new Error(`Could not fetch user profile. Is a user with email ${user.email} registered in the 'usuarios' table?`);
    }
    if (!usuario || !usuario.oficina_id) {
        throw new Error("Oficina ID not found for the current user.");
    }

    return usuario.oficina_id;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const oficinaId = await getOficinaId(supabase);

    const { data, error } = await supabase.rpc('relatorio_clientes_maior_faturamento', { p_oficina_id: oficinaId })

    if (error) {
      throw error
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})