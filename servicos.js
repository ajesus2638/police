// Navegação
function voltarDashboard(){ window.location.href='police.html'; }
function logout(){ alert('Logout realizado!'); window.location.href='index.html'; }

// Modal
function abrirModal(tipo){
  const modal = document.getElementById('modal');
  const body = document.getElementById('modalBody');
  body.innerHTML = ''; 

  if(tipo==='boletim'){
    body.innerHTML = `
      <h3>Registrar Ocorrência</h3>
      <input type="text" id="tipoOcorrencia" placeholder="Tipo de ocorrência">
      <textarea id="descOcorrencia" placeholder="Descrição"></textarea>
      <button class="add-btn" onclick="adicionarOcorrencia()">Registrar</button>
    `;
  } else if(tipo==='veiculos'){
    body.innerHTML = `
      <h3>Consultar Veículos</h3>
      <input type="text" id="placaVeiculo" placeholder="Digite a placa">
      <button class="add-btn" onclick="consultarVeiculo()">Pesquisar</button>
      <div id="resultadoVeiculo" style="margin-top:10px;"></div>
    `;
  } else if(tipo==='delegacias'){
    body.innerHTML = `<h3>Contatos de Delegacias</h3>
      <ul>
        <li>Delegacia Central - (11) 1234-5678</li>
        <li>Delegacia Norte - (11) 2345-6789</li>
        <li>Delegacia Sul - (11) 3456-7890</li>
      </ul>`;
  } else if(tipo==='ocorrencias'){
    body.innerHTML = `<h3>Ocorrências Recentes</h3><div class="ocorrencias-list">`;
    const ocorrencias = JSON.parse(localStorage.getItem('ocorrencias')||'[]');
    if(ocorrencias.length===0){
      body.innerHTML += `<p>Nenhuma ocorrência registrada.</p>`;
    } else {
      ocorrencias.forEach(o=>{
        body.innerHTML += `<div class="ocorrencia-item"><strong>${o.tipo}</strong>: ${o.descricao}</div>`;
      });
    }
    body.innerHTML += `</div>`;
  }

  modal.style.display = 'flex';
}

function fecharModal(){ document.getElementById('modal').style.display='none'; }
function clickForaModal(e){
  if(e.target.id==='modal') fecharModal();
}

// Funções extras
function adicionarOcorrencia(){
  const tipo = document.getElementById('tipoOcorrencia').value.trim();
  const desc = document.getElementById('descOcorrencia').value.trim();
  if(!tipo || !desc){ alert('Preencha todos os campos'); return; }
  const ocorrencias = JSON.parse(localStorage.getItem('ocorrencias')||'[]');
  ocorrencias.push({tipo, descricao: desc});
  localStorage.setItem('ocorrencias', JSON.stringify(ocorrencias));
  alert('Ocorrência registrada!');
  fecharModal();
}

function consultarVeiculo(){
  const placa = document.getElementById('placaVeiculo').value.trim().toUpperCase();
  const resultado = document.getElementById('resultadoVeiculo');
  if(!placa){ resultado.innerHTML='Digite a placa!'; return; }
  resultado.innerHTML = `<p>Veículo ${placa} - Situação: Regular</p>`;
}
