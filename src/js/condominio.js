
import { supabase } from "./supabase.js";

document.getElementById("formCondo").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const endereco = document.getElementById("endereco").value;

  const btn = e.target.querySelector('button[type="submit"]');
  const originalContent = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-circle-notch animate-spin"></i> Processando...';

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      alert("Sessão expirada. Por favor, faça login novamente.");
      window.location.href = "index.html";
      return;
    }

    // 1. Inserir o condomínio com status TRIAL
    const { data: condo, error: condoError } = await supabase
      .from("condominios")
      .insert([{
        nome,
        endereco,
        sindico_id: user.id,
        status_assinatura: 'trial',
        plano_ativo: 'Essencial'
      }])
      .select()
      .single();

    if (condoError) {
      throw new Error("Erro ao criar condomínio: " + condoError.message);
    }

    // 2. Atualizar o perfil do usuário
    const { error: updateError } = await supabase
      .from("usuarios")
      .update({
        condominio_id: condo.id,
        tipo: "sindico"
      })
      .eq("id", user.id);

    if (updateError) {
      console.warn("Condomínio criado, mas erro ao atualizar seu perfil:", updateError.message);
    }

    alert("✅ Condomínio criado com sucesso! Período de teste ativado.");
    window.location.href = "dashboard.html";

  } catch (err) {
    alert("❌ " + err.message);
    btn.disabled = false;
    btn.innerHTML = originalContent;
  }
});
