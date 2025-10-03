
setInterval(() => {
  const clock = document.getElementById('clock');
  if (clock) clock.innerText = new Date().toLocaleTimeString();
}, 1000);


function enterUser() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('userContent').style.display = 'flex';
}


function showPoliceLogin() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('policeContent').style.display = 'block';
}


function showCartilha() {
  const modal = document.getElementById('cartilhaModal');
  modal.style.display = 'flex';


  modal.addEventListener('click', e => {
    if (e.target === modal) closeCartilha();
  });

  
  document.addEventListener('keydown', e => {
    if (e.key === "Escape") closeCartilha();
  });
}
function closeCartilha() {
  document.getElementById('cartilhaModal').style.display = 'none';
}


function callNumber(n) {
  window.location.href = 'tel:' + n;
}


function getAlerts() {
  return JSON.parse(localStorage.getItem('alerts') || '[]');
}
function saveAlerts(arr) {
  localStorage.setItem('alerts', JSON.stringify(arr));
}


function sendAlert(tipo) {
  const nome = document.getElementById('userName').value.trim();
  if (!nome) { alert('Preencha seu nome'); return; }
  if (!navigator.geolocation) { alert('Geolocalização não disponível'); return; }

  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    const alerts = getAlerts();
    alerts.push({ tipo, nome, data: new Date().toLocaleString(), lat, lon });
    saveAlerts(alerts);

    showToast("✅ Alerta enviado com sucesso!");
    renderHistory();
    renderMap();
  }, err => {
    alert("Não foi possível capturar sua localização.");
  });
}


function exportCSV() {
  const alerts = getAlerts();
  if (alerts.length === 0) { alert('Sem dados.'); return; }

  let csv = 'Tipo,Nome,Data,Latitude,Longitude\n';
  alerts.forEach(a => csv += `${a.tipo},${a.nome},${a.data},${a.lat},${a.lon}\n`);

  const blob = new Blob([csv], { type: 'text/csv' });
  downloadFile(blob, "historico.csv");
}

function exportJSON() {
  const alerts = getAlerts();
  if (alerts.length === 0) { alert('Sem dados.'); return; }

  const blob = new Blob([JSON.stringify(alerts, null, 2)], { type: 'application/json' });
  downloadFile(blob, "historico.json");
}

function downloadFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}


let map;
function initMap() {
  map = L.map('map').setView([-18.59, -46.51], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
}
function renderMap() {
  if (!map) initMap();
  const alerts = getAlerts();
  map.eachLayer(l => { if (l instanceof L.Marker) map.removeLayer(l); });
  alerts.forEach(a => {
    L.marker([a.lat, a.lon]).addTo(map).bindPopup(`${a.tipo} - ${a.nome} (${a.data})`);
  });
}


function renderHistory() {
  const el = document.getElementById('history');
  if (!el) return;
  const alerts = getAlerts();
  if (alerts.length === 0) { el.innerText = 'Nenhum alerta ainda.'; return; }

  el.innerHTML = '';
  alerts.forEach(a => {
    const div = document.createElement('div');
    div.textContent = `${a.tipo} - ${a.nome} (${a.data})`;
    el.appendChild(div);
  });
}


function loginPolice() {
  const u = document.getElementById('policeUser').value.trim();
  const p = document.getElementById('policePass').value;
  const errorEl = document.getElementById('error');

  if (u === 'policia' && p === '1234') {
    errorEl.innerText = '';
    sessionStorage.setItem('policeAuth', 'true');
    sessionStorage.setItem('policeUser', u);
    window.location.href = 'police.html';
  } else {
    errorEl.innerText = 'Usuário ou senha incorretos';
  }
}


function showToast(msg) {
  const toast = document.createElement('div');
  toast.textContent = msg;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.background = '#10b981';
  toast.style.color = '#fff';
  toast.style.padding = '10px 16px';
  toast.style.borderRadius = '6px';
  toast.style.boxShadow = '0 4px 10px rgba(0,0,0,0.4)';
  toast.style.zIndex = '3000';
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}


if (document.getElementById('map')) {
  initMap();
  renderHistory();
  renderMap();
}


document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
  }

  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
  });
});
