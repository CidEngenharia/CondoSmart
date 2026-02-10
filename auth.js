import { supabase } from "./supabase.js";

/**
 * Função para verificar o vínculo do usuário com um condomínio
 * e redirecionar para a página correta.
 */
async function verificarCondominio() {
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data, error } = await supabase
    .from("usuarios")
    .select("condominio_id")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Erro ao recuperar perfil do usuário:", error);
    return;
  }

  if (!data || !data.condominio_id) {
    window.location.href = "criar-condominio.html";
  } else {
    window.location.href = "painel.html";
  }
}

window.login = async function() {
  const emailInput = document.getElementById("email");
  const senhaInput = document.getElementById("senha");
  
  const email = emailInput.value;
  const senha = senhaInput.value;

  if (!email || !senha) {
    alert("Preencha todos os campos.");
    return;
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password: senha.trim(),
  });

  if (error) {
    alert("Erro no login: " + error.message);
  } else {
    await verificarCondominio();
  }
};

window.register = async function() {
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const tipo = document.getElementById("tipo").value;

  if (!nome || !email || !senha) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: senha.trim(),
      options: {
        data: {
          full_name: nome.trim(),
          role: tipo
        }
      }
    });

    if (error) {
        if (error.message.toLowerCase().includes("already registered") || error.status === 400) {
            alert("Este e-mail já está cadastrado. Tente fazer login.");
            window.location.href = "index.html";
            return;
        }
        throw error;
    }

    if (data.user) {
      const { error: dbError } = await supabase.from("usuarios").upsert({
        id: data.user.id,
        nome: nome.trim(),
        tipo: tipo
      });

      if (dbError) console.error("Erro ao salvar perfil no banco:", dbError);

      alert("Conta criada com sucesso! Verifique seu e-mail para confirmar a conta.");
      window.location.href = "index.html";
    }
  } catch (err) {
    alert("Erro no cadastro: " + err.message);
  }
};

window.logout = async function() {
  await supabase.auth.signOut();
  window.location.href = "index.html";
};

supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && session) {
    verificarCondominio();
  }
});