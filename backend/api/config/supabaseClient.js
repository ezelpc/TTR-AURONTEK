import { createClent} from '@supabase/supabase-js';

const SUPABASE_URL ='https://bldusvbylatgrtjnrnpi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsZHVzdmJ5bGF0Z3J0am5ybnBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNjgxNjEsImV4cCI6MjA2Nzg0NDE2MX0.QLoWh3udsdHK1IozaFIdLT8MQ2agSaGA599PflhZDJY';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;
