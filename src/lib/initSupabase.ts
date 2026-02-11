import { supabase } from './supabase';
import { BEATS_DATA } from '../data/beats';

export async function initSupabase() {
  try {
    const { count } = await supabase
      .from('beats')
      .select('*', { count: 'exact', head: true });

    if (count && count > 0) {
      console.log('Database already initialized');
      return;
    }

    const { error } = await supabase.from('beats').insert(BEATS_DATA);

    if (error) {
      console.error('Error initializing beats:', error);
    } else {
      console.log('Beats initialized successfully');
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}
