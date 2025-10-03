document.addEventListener('DOMContentLoaded', () => {
  let alertas = JSON.parse(localStorage.getItem('alertas') || '[]');


  const map = L.map('map').setView([-18.5815, -46.5186], 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

 
  const alertClasses = {
    "Pânico": "alert-card alert-panic",
    "Acidente": "alert-card alert-accident",
    "Suspeito": "alert-card alert-suspect",
    "Médica": "alert-card alert-medical"
  };

  function desenharAlertas(tipo = 'Todos') {

    map.eachLayer(layer => {
      if (layer instanceof L.Marker) map.removeLayer(layer);
    });

    const dashboard = document.getElementById('dashboard');
    dashboard.innerHTML = '';

    let stats = { 'Pânico': 0, 'Acidente': 0, 'Suspeito': 0, 'Médica': 0 };

    alertas.forEach(a => {
      if (tipo === 'Todos' || a.tipo === tipo) {
   
        L.marker([a.lat, a.lng]).addTo(map)
          .bindPopup(`<b>${a.tipo}</b><br>${a.nome}<br>${a.local}<br>${a.hora}`);

      
        const div = document.createElement('div');
        div.className = alertClasses[a.tipo] || "alert-card";
        div.innerHTML = `<b>${a.tipo}</b><br>${a.nome}<br>${a.local}<br>${a.hora}`;
        dashboard.appendChild(div);

        if (stats[a.tipo] !== undefined) stats[a.tipo]++;
      }
    });


    const statsDiv = document.getElementById('stats');
    statsDiv.innerHTML = `
      <ul>
        <li>🚨 Pânico: <b>${stats['Pânico']}</b></li>
        <li>💥 Acidente: <b>${stats['Acidente']}</b></li>
        <li>👤 Suspeito: <b>${stats['Suspeito']}</b></li>
        <li>🩺 Médica: <b>${stats['Médica']}</b></li>
        <li>Total: <b>${alertas.length}</b></li>
      </ul>
    `;


    const badge = document.getElementById('alertBadge');
    if (badge) badge.innerHTML = `<span class="badge">${alertas.length}</span>`;
  }


  window.exportarCSV = function () {
    let csv = 'Tipo,Nome,Local,Hora,Lat,Lng\n';
    alertas.forEach(a => {
      csv += `${a.tipo},${a.nome},${a.local},${a.hora},${a.lat},${a.lng}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'alertas.csv';
    link.click();
  };

  window.logout = function () {
    sessionStorage.removeItem('policeAuth');
    sessionStorage.removeItem('policeUser');
    window.location.href = 'index.html';
  };


  window.filtrar = desenharAlertas;


  const policeName = document.getElementById('policeName');
  if (sessionStorage.getItem('policeUser') && policeName) {
    policeName.textContent = "👮 " + sessionStorage.getItem('policeUser');
  }

  desenharAlertas();
});
