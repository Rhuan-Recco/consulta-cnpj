async function consultarCNPJ() {
  let cnpj = document.getElementById("cnpj").value;
  cnpj = cnpj.replace(/\D/g, ""); // remove pontos, barras e traços
  
  const url = `https://publica.cnpj.ws/cnpj/${cnpj}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Erro HTTP: " + response.status);
    
    const json = await response.json();
    mostrarDados(json);
  } catch (error) {
    alert("Erro ao consultar CNPJ: " + error.message);
  }
}

function mostrarDados(json) {
  const resultado = document.getElementById("resultado");
  resultado.innerHTML = ""; // limpa antes
  
  const dados = {
    "Razão Social": json.razao_social,
    "Nome Fantasia": json.estabelecimento.nome_fantasia,
    "Situação Cadastral": json.estabelecimento.situacao_cadastral,
    "CEP": json.estabelecimento.cep.padStart(8, "0"),
    "Logradouro": `${json.estabelecimento.tipo_logradouro} ${json.estabelecimento.logradouro}`,
    "Número": json.estabelecimento.numero,
    "Bairro": json.estabelecimento.bairro,
    "Cidade": json.estabelecimento.cidade.nome,
    "Estado": json.estabelecimento.estado.sigla,
    "Telefone": `(${json.estabelecimento.ddd1}) ${json.estabelecimento.telefone1}`,
    "Email": json.estabelecimento.email,
    "IBGE": json.estabelecimento.cidade.ibge_id
  };
  
  for (const [campo, valor] of Object.entries(dados)) {
    const div = document.createElement("div");
    div.className = "campo";
    div.innerHTML = `<span>${campo}:</span> ${valor} 
                     <button onclick="copiar('${valor}')">Copiar</button>`;
    resultado.appendChild(div);
  }
  
  // Inscrições estaduais
  if (json.estabelecimento.inscricoes_estaduais?.length > 0) {
    json.estabelecimento.inscricoes_estaduais.forEach(ie => {
      const status = ie.ativo ? "Ativa" : "Baixada";
      const div = document.createElement("div");
      div.className = "campo";
      div.innerHTML = `<span>Inscrição Estadual:</span> ${ie.inscricao_estadual} - ${ie.estado.sigla} (${status})
                       <button onclick="copiar('${ie.inscricao_estadual}')">Copiar</button>`;
      resultado.appendChild(div);
    });
  }
}

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
    setTimeout(() => aviso.remove(), 1500); // desaparece em 1,5s
  });
}