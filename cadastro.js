const btn = document.getElementById('btnCadastro');

btn.onclick = function() {
  const tipo = document.getElementById('userType').value;
  const nome = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('password').value.trim();
  const msg = document.getElementById('message');


  if(nome === '' || email === '' || senha === '') {
    msg.style.color = 'red';
    msg.innerText = 'Preencha todos os campos!';
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');


  const existe = usuarios.some(u => u.email === email);

  if(existe){
    msg.style.color = 'red';
    msg.innerText = 'Email já cadastrado!';
    return;
  }

  usuarios.push({ tipo: tipo, nome: nome, email: email, senha: senha });
  localStorage.setItem('usuarios', JSON.stringify(usuarios));

  msg.style.color = 'green';
  msg.innerText = 'Cadastro feito com sucesso! Redirecionando...';


  setTimeout(() => {
    if(tipo === 'pessoa') {
      window.location.href = 'dashboard_populacao.html';
    } else if(tipo === 'policia') {
      window.location.href = 'dashboard_policia.html';
    }
  }, 1500);
};
