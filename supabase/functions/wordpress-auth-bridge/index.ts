
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { action, token, user } = await req.json()

    console.log('WordPress auth bridge called with action:', action)

    if (action === 'set_token') {
      // Here you would typically sync the token with WordPress
      // For now, we'll just return success
      console.log('Setting token for user:', user?.email)
      
      return new Response(
        JSON.stringify({ success: true, message: 'Token set successfully' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    if (action === 'clear_token') {
      // Here you would typically clear the token from WordPress
      console.log('Clearing token')
      
      return new Response(
        JSON.stringify({ success: true, message: 'Token cleared successfully' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  } catch (error) {
    console.error('Error in wordpress-auth-bridge:', error)
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
