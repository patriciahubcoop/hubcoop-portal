import { supabase } from '@/lib/supabase';

export const pontosAtendimentoService = {
  async list() {
    const { data, error } = await supabase
      .from('pontos_atendimento')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('pontos_atendimento')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async create(ponto: any) {
    const { data, error } = await supabase
      .from('pontos_atendimento')
      .insert([ponto])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, ponto: any) {
    const { data, error } = await supabase
      .from('pontos_atendimento')
      .update(ponto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('pontos_atendimento')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
