import { supabase } from '@/lib/supabase';

export const cooperadosService = {
  async list() {
    const { data, error } = await supabase
      .from('cooperados')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('cooperados')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async create(cooperado: any) {
    const { data, error } = await supabase
      .from('cooperados')
      .insert([cooperado])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, cooperado: any) {
    const { data, error } = await supabase
      .from('cooperados')
      .update(cooperado)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('cooperados')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
