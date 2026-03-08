
import { supabase } from "./supabase.js";

/**
 * Inicializa o dashboard buscando os dados do usuário e do condomínio.
 */
async function initDashboard() {
  // 1. Verificar se o usuário está autenticado
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    console.warn("Usuário não autenticado ou sessão expirada.");
    window.location.href = "index.html";
    return;
  }

  // 2. Buscar perfil do usuário na tabela 'usuarios'
  try {
    const { data: profile, error: profileError } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profile && !profileError) {
      document.getElementById("user-name").innerText = profile.nome || user.email;
      document.getElementById("user-role").innerText = profile.tipo || "Acesso";
      document.getElementById("user-photo").src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.nome || user.email)}&background=4f46e5&color=fff`;
      
      // Se for morador e já tiver um condomínio vinculado, tenta buscar por esse ID
      if (profile.condominio_id && profile.tipo === 'morador') {
          fetchCondoById(profile.condominio_id);
      }
    }
  } catch (err) {
    console.error("Erro ao carregar perfil:", err);
  }

  // 3. Buscar condomínio onde o usuário é síndico
  try {
    const { data: condoData, error: condoError } = await supabase
      .from("condominios")
      .select("*")
      .eq("sindico_id", user.id)
      .single();

    if (condoData && !condoError) {
      document.getElementById("condominio").innerText = "Condomínio: " + condoData.nome;
    } else {
        // Caso não seja síndico ou não encontre, mas o elemento ainda exiba "Carregando..."
        const condoEl = document.getElementById("condominio");
        if (condoEl && condoEl.innerText.includes("Carregando")) {
             condoEl.innerText = "Bem-vindo ao CondoSmart AI";
        }
    }
  } catch (err) {
    console.error("Erro ao buscar condomínio:", err);
  }
}

/**
 * Busca dados do condomínio pelo ID (útil para moradores)
 */
async function fetchCondoById(id) {
    const { data, error } = await supabase
        .from("condominios")
        .select("nome")
        .eq("id", id)
        .single();
    
    if (data && !error) {
        const condoEl = document.getElementById("condominio");
        if (condoEl) {
            condoEl.innerText = "Condomínio: " + data.nome;
        }
    }
}

/**
 * Função global de Logout
 */
window.logout = async function() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    alert("Erro ao sair: " + error.message);
  } else {
    window.location.href = "index.html";
  }
};

// Executa a inicialização
initDashboard();
