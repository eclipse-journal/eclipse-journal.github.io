const SUPABASE_URL = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.0.0/dist/umd/supabase.min.js';

async function loadSupabaseScript() {
  let cachedScript = localStorage.getItem('supabaseScript');

  if (!cachedScript) {
    const response = await fetch(SUPABASE_URL);
    cachedScript = await response.text();
    localStorage.setItem('supabaseScript', cachedScript);
    window.location.reload();
  }

  const script = document.createElement('script');
  script.text = cachedScript;
  document.head.appendChild(script);
}

loadSupabaseScript();

const supabaseUrl = "https://szzslijzpkujryqivoxn.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6enNsaWp6cGt1anJ5cWl2b3huIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4ODQwMTMsImV4cCI6MjA2NDQ2MDAxM30.VviA_VHddsxH_KrrdmHaX_4DqzQiQ2c1XwQfMzMIkq0";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);