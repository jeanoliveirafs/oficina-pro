import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function getOficinaId(supabase: SupabaseClient): Promise<string> {
    const { data: oficina, error: oficinaError } = await supabase
        .from('oficinas')
        .select('id')
        .limit(1)
        .single();

    if (oficinaError) throw new Error(`Could not fetch oficina: ${oficinaError.message}`);
    if (!oficina) throw new Error("Oficina not found");

    return oficina.id;
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

    const { data, error } = await supabase.rpc('relatorio_produtos_mais_vendidos', { p_oficina_id: oficinaId })

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