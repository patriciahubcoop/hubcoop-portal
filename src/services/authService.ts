import { supabase } from '@/lib/supabase';

export const authService = {
  async signUpWithoutPassword(email: string, perfil: string, centralId?: string, cooperativaId?: string, pontoAtendimentoId?: string) {
    const metadata = {
      perfil,
      ...(centralId && { central_id: centralId }),
      ...(cooperativaId && { cooperativa_id: cooperativaId }),
      ...(pontoAtendimentoId && { ponto_atendimento_id: pontoAtendimentoId })
    };

    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        data: metadata
      }
    });

    if (error) throw error;
    return data;
  },

  async signInWithOtp(email: string) {
    const { data, error } = await supabase.auth.signInWithOtp({
      email
    });

    if (error) throw error;
    return data;
  },

  async verifyOtp(email: string, token: string) {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email'
    });

    if (error) throw error;
    return data;
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) throw error;
    return user;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;
  },

  async updateUserMetadata(metadata: any) {
    const { data, error } = await supabase.auth.updateUser({
      data: metadata
    });

    if (error) throw error;
    return data;
  }
};
