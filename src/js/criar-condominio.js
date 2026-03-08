
import { supabase } from "./supabase.js";

const form = document.getElementById("formCondo");

form.addEventListener("submit", async (e) => {

  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const endereco = document.getElementById("endereco").value;

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    alert("Sessão expirada. Faça login.");
    location.href = "login.html";
    return;
  }

  // Cria condomínio com status de teste ativado
  const { data, error } = await supabase
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

  if (error) {
    alert("Erro: " + error.message);
    return;
  }

  // Liga usuário ao condomínio
  await supabase
    .from("usuarios")
    .update({
      condominio_id: data.id,
      tipo: 'sindico'
    })
    .eq("id", user.id);

  alert("Condomínio criado com sucesso! Teste grátis liberado.");

  location.href = "painel.html";

});
