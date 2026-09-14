/* eslint-disable @typescript-eslint/no-explicit-any */
// Ambient type declarations for Supabase Edge Functions (Deno runtime)
// Enables TypeScript in IDEs without the Deno extension to resolve URL imports and Deno globals.

declare module 'https://deno.land/std@0.168.0/http/server.ts' {
  export function serve(
    handler: (req: Request) => Promise<Response> | Response
  ): void;
}

declare module 'https://esm.sh/@supabase/supabase-js@2' {
  export function createClient(
    supabaseUrl: string,
    supabaseKey: string,
    options?: Record<string, unknown>
  ): any;
}

declare module 'https://*' {
  const content: unknown;
  export default content;
}

declare namespace Deno {
  namespace env {
    function get(key: string): string | undefined;
  }
}
