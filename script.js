// ✅ CONFIGURA SUPABASE
const supabaseUrl = 'https://cdffrolmhlhbmmskkzav.supabase.co';  // Il tuo URL Supabase
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';  // La tua chiave supabase

// Crea il client Supabase, facciamolo solo dopo aver caricato il cdn
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// ✅ VARIABILI
let stats = { sega: 0, ditalino: 0, scopata: 0, preliminari: 0 };
let eventsArray = [];
let chart;

// ✅ FUNZIONE SALVA EVENTO
async function saveEvent() {
  const date = document.getElementById('date').value;
  const eventType = document.getElementById('event').value;
  const note = document.getElementById('note').value;

  if (!date || !eventType) {
    alert('Compila tutti i campi!');
    return;
  }

  const { data, error } = await supabase
    .from('events')
    .insert([{ date, eventType, note }]);

  if (error) {
    alert('Errore nel salvataggio!');
    console.error(error);
  } else {
    alert('Evento salvato!');
    fetchEvents();
  }
}

// ✅ PRENDI EVENTI
async function fetchEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  eventsArray = data;
  renderEvents();
  updateStats();
  updateChart();
  checkBadges();
}

// ✅ RENDERIZZA EVENTI
function renderEvents() {
  const eventsList = document.getElementById('eventsList');
  eventsList.innerHTML = '';

  eventsArray.forEach(event => {
    const emojiMap = {
      sega: '🖐️',
      ditalino: '👩‍🦰',
      scopata: '🍑',
      preliminari: '🛁'
    };
    const li = document.createElement('li');
    li.innerHTML = `${event.date} - ${emojiMap[event.eventType]} ${event.eventType} ${event.note ? `- Nota: ${event.note}` : ''}`;
    eventsList.appendChild(li);
  });
}

// ✅ AGGIORNA STATISTICHE
function updateStats() {
  stats = { sega: 0, ditalino: 0, scopata: 0, preliminari: 0 };
  eventsArray.forEach(event => {
    stats[event.eventType]++;
  });
  document.getElementById('segaCount').textContent = stats.sega;
  document.getElementById('ditalinoCount').textContent = stats.ditalino;
  document.getElementById('scopataCount').textContent = stats.scopata;
  document.getElementById('preliminariCount').textContent = stats.preliminari;
}

// ✅ CREA GRAFICO
function createChart() {
  const ctx = document.getElementById('chart').getContext('2d');
  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Seghe', 'Ditalini', 'Scopate', 'Preliminari'],
      datasets: [{
        data: [0, 0, 0, 0],
        backgroundColor: ['#ff9999', '#ff66b2', '#ff33cc', '#ffccff']
      }]
    }
  });
}

// ✅ AGGIORNA GRAFICO
function updateChart() {
  if (chart) {
    chart.data.datasets[0].data = [
      stats.sega,
      stats.ditalino,
      stats.scopata,
      stats.preliminari
    ];
    chart.update();
  }
}

// ✅ CONTROLLA BADGES
function checkBadges() {
  const badgeContainer = document.getElementById('badgeContainer');
  const badgeMessage = document.getElementById('badgeMessage');
  badgeContainer.classList.add('hidden');

  if (stats.sega >= 10 && stats.sega % 10 === 0) {
    badgeContainer.classList.remove('hidden');
    badgeMessage.textContent = `🖐️ ${stats.sega} Seghe fatte!`;
  } else if (stats.ditalino >= 5 && stats.ditalino % 5 === 0) {
    badgeContainer.classList.remove('hidden');
    badgeMessage.textContent = `👩‍🦰 ${stats.ditalino} Ditalini fatti!`;
  } else if (stats.scopata >= 3 && stats.scopata % 3 === 0) {
    badgeContainer.classList.remove('hidden');
    badgeMessage.textContent = `🍑 ${stats.scopata} Scopate fatte!`;
  } else if (stats.preliminari >= 5 && stats.preliminari % 5 === 0) {
    badgeContainer.classList.remove('hidden');
    badgeMessage.textContent = `🛁 ${stats.preliminari} Preliminari completati!`;
  }
}

// ✅ AL CARICAMENTO PAGINA
window.onload = async () => {
  createChart();
  await fetchEvents();
  document.getElementById('saveButton').addEventListener('click', saveEvent);
};
