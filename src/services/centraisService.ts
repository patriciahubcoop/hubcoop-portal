import { supabase } from '@/lib/supabase';

export const centraisService = {
  async list() {
    const { data, error } = await supabase
      .from('centrais')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('centrais')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async create(central: any) {
    const { data, error } = await supabase
      .from('centrais')
      .insert([central])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, central: any) {
    const { data, error } = await supabase
      .from('centrais')
      .update(central)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('centrais')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
