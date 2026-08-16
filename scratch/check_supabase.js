const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://iecitkkdesukjiuuywsh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllY2l0a2tkZXN1a2ppdXV5d3NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MDcxODUsImV4cCI6MjA5ODM4MzE4NX0.HezQoI5Xqs7trQFyD-54NPR9K91RlCNj7aLwo_dx4pk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const tables = ['hero', 'materials', 'reviews', 'settings', 'pricing'];
  for (const t of tables) {
    console.log(`Checking table '${t}'...`);
    const { data, error } = await supabase.from(t).select('*');
    if (error) {
      console.log(`Table '${t}' error:`, error.message);
    } else {
      console.log(`Table '${t}' exists with rows:`, data.length);
      if (data.length > 0) {
        console.log(`Sample row from '${t}':`, data[0]);
      }
    }
  }
}

run();
