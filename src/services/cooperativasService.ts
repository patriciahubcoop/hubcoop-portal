import { supabase } from '@/lib/supabase';

export const cooperativasService = {
  async list() {
    const { data, error } = await supabase
      .from('cooperativas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('cooperativas')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async create(cooperativa: any) {
    const { data, error } = await supabase
      .from('cooperativas')
      .insert([cooperativa])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, cooperativa: any) {
    const { data, error } = await supabase
      .from('cooperativas')
      .update(cooperativa)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('cooperativas')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
