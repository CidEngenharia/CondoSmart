import { supabase } from "./supabase.js";

/**
 * PROTEÇÃO DO PAINEL
 * Verifica se o usuário está logado e se possui um condomínio vinculado.
 */
async function protegerPainel() {
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    // Redireciona para index.html (onde reside o login) se não houver usuário
    location.href = "index.html";
    return;
  }

  const { data, error } = await supabase
    .from("usuarios")
    .select("condominio_id, nome, tipo")
    .eq("id", user.id)
    .single();

  if (error || !data || !data.condominio_id) {
    // Se não tiver condomínio, redireciona para a página de criação
    location.href = "criar-condominio.html";
    return;
  }

  // Se passou na proteção, inicializa os dados visuais
  initDashboardData(user, data);
}

/**
 * INICIALIZAÇÃO DE DADOS
 * Carrega as informações do usuário e do condomínio na interface.
 */
async function initDashboardData(user, profile) {
  try {
    // Atualiza elementos do perfil do usuário
    const userNameEl = document.getElementById("user-name");
    const userRoleEl = document.getElementById("user-role");
    const userPhotoEl = document.getElementById("user-photo");

    if (userNameEl) userNameEl.innerText = profile.nome || user.email;
    if (userRoleEl) userRoleEl.innerText = profile.tipo || "Usuário";
    if (userPhotoEl) {
      userPhotoEl.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.nome || user.email)}&background=6366f1&color=fff`;
    }

    // Busca dados do condomínio vinculado
    const { data: condo, error: condoError } = await supabase
      .from("condominios")
      .select("nome")
      .eq("id", profile.condominio_id)
      .single();

    if (condo && !condoError) {
      const condoEl = document.getElementById("condominio");
      if (condoEl) {
        condoEl.innerText = "Condomínio: " + condo.nome;
      }
    }
  } catch (err) {
    console.error("Erro ao carregar dados do painel:", err);
  }
}

/**
 * LOGOUT
 */
window.logout = async function() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    alert("Erro ao sair: " + error.message);
  } else {
    window.location.href = "index.html";
  }
};

// Executa a proteção ao carregar o script
protegerPainel();
