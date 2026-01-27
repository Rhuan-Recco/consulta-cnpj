async function consultarCNPJ() {
  const cnpj = document.getElementById("cnpj").value.replace(/\D/g, "");
  const resultado = document.getElementById("resultado");
  resultado.innerHTML = "Consultando...";

  try {
    const resposta = await fetch(`https://publica.cnpj.ws/cnpj/${cnpj}`);
    const dados = await resposta.json();

    if (!dados.razao_social) {
      resultado.innerHTML = "CNPJ não encontrado.";
      return;
    }

    resultado.innerHTML = "";

    // Campos principais
    const campos = {
      "Nome (empresarial)": dados.razao_social,
      "Nome (fantasia)": dados.estabelecimento?.nome_fantasia,
      "Status": dados.estabelecimento?.situacao_cadastral,
      "CEP": dados.estabelecimento?.cep,
      "Logradouro": dados.estabelecimento?.tipo_logradouro&&dados.estabelecimento?.logradouro
              ? `${dados.estabelecimento.tipo_logradouro} ${dados.estabelecimento.logradouro}`
              : null,
      "Número": dados.estabelecimento?.numero,
      "Bairro": dados.estabelecimento?.bairro,
      "Cidade": dados.estabelecimento?.cidade?.nome?.toUpperCase(),
      "Estado": dados.estabelecimento?.estado?.sigla,
      "Telefone": dados.estabelecimento?.ddd1&&dados.estabelecimento?.telefone1 
              ? `(${dados.estabelecimento.ddd1})${dados.estabelecimento.telefone1}` 
              : null,
      "E-mail": dados.estabelecimento?.email,
      "Código Municipal": dados.estabelecimento?.cidade?.ibge_id
    };

    // Renderiza os campos principais
    for (const [chave, valor] of Object.entries(campos)) {
      if (valor) {
        const linha = document.createElement("div");
        linha.className = "linha";

        const titulo = document.createElement("span");
        titulo.className = "titulo";
        titulo.textContent = `${chave}:`;

        const dado = document.createElement("span");
        dado.className = "valor";
        dado.textContent = valor;

        const botao = document.createElement("button");
        botao.textContent = "Copiar";
        botao.onclick = () => copiar(valor);

        linha.appendChild(titulo);
        linha.appendChild(dado);
        linha.appendChild(botao);
        resultado.appendChild(linha);
      }
    }




// Renderiza TODAS as inscrições estaduais
if (dados.estabelecimento?.inscricoes_estaduais?.length > 0) {
  dados.estabelecimento.inscricoes_estaduais.forEach((ie, index) => {
    const linha = document.createElement("div");
    linha.className = "linha";

    const titulo = document.createElement("span");
    titulo.className = "titulo";
    titulo.textContent = `Inscrição Estadual ${index + 1}:`;

    const dado = document.createElement("span");
    dado.className = "valor";
    dado.textContent = `${ie.inscricao_estadual} - ${ie.ativo ? "Ativa" : "Baixada"} - ${ie.estado?.sigla}`;

    // 🔹 Se estiver ativa E o estado for igual ao do CNPJ → aplica classe azul, negrito e sublinhado
    if (ie.ativo && ie.estado?.sigla === dados.estabelecimento?.estado?.sigla) {
      dado.classList.add("valor-ativo");
    }

    linha.appendChild(titulo);
    linha.appendChild(dado);

    // Só cria botão se estiver ativa
    if (ie.ativo) {
      const botao = document.createElement("button");
      botao.textContent = "Copiar";
      botao.onclick = () => copiar(`${ie.inscricao_estadual} - Ativa - ${ie.estado?.sigla}`);
      linha.appendChild(botao);
    }

    resultado.appendChild(linha);
  });
}

  } catch (erro) {
    resultado.innerHTML = "Erro ao consultar CNPJ.";
    console.error(erro);
  }
}

// Função genérica para copiar qualquer texto
function copiar(texto) {
  navigator.clipboard.writeText(texto).then(() => {
    const aviso = document.createElement("div");
    aviso.textContent = "Copiado!";
    aviso.style.position = "fixed";
    aviso.style.bottom = "20px";
    aviso.style.left = "50%";
    aviso.style.transform = "translateX(-50%)";
    aviso.style.background = "#4caf50";
    aviso.style.color = "white";
    aviso.style.padding = "8px 12px";
    aviso.style.borderRadius = "5px";
    aviso.style.zIndex = "1000";
    document.body.appendChild(aviso);
    setTimeout(() => aviso.remove(), 1500);
  }).catch(err => {
    console.error("Erro ao copiar: ", err);
  });
}

// Função específica para copiar o CNPJ digitado
function copiarCNPJ() {
  const campo = document.getElementById("cnpj");
  const cnpj = campo.value.trim();

  if (cnpj) {
    copiar(cnpj); // chama a função genérica
  } else {
    alert("Digite um CNPJ antes de copiar!");
  }
}