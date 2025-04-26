let stats = {
    sega: 0,
    ditalino: 0,
    scopata: 0,
    preliminari: 0
  };
  
  let lastAwardTime = localStorage.getItem('lastAwardTime') || 0;
  
  function saveEvent() {
    const date = document.getElementById('date').value;
    const event = document.getElementById('event').value;
  
    if (!date || !event) {
      alert('Compila tutti i campi!');
      return;
    }
  
    const eventsList = document.getElementById('eventsList');
  
    const eventText = {
      sega: '🖐️ Ho fatto una sega',
      ditalino: '👩‍🦰 Lei ha fatto un ditalino',
      scopata: '🍑 Abbiamo scopato',
      preliminari: '🛁 Preliminari'
    };
  
    const newItem = document.createElement('li');
    newItem.innerHTML = `${date}: ${eventText[event]} <span class="delete" onclick="deleteEvent(this)">❌</span>`;
  
    eventsList.appendChild(newItem);
  
    stats[event]++;
    updateStats();
    saveToLocalStorage();
    updateChart();  // Assicurati che questa funzione venga chiamata per aggiornare il grafico
    checkBadges();
  }
  
  function deleteEvent(element) {
    const item = element.parentElement;
    const text = item.textContent;
  
    if (text.includes('sega')) stats.sega--;
    if (text.includes('ditalino')) stats.ditalino--;
    if (text.includes('scopato')) stats.scopata--;
    if (text.includes('preliminari')) stats.preliminari--;
  
    item.remove();
    updateStats();
    saveToLocalStorage();
    updateChart();  // Assicurati che questa funzione venga chiamata per aggiornare il grafico
  }
  
  function updateStats() {
    document.getElementById('segaCount').textContent = stats.sega;
    document.getElementById('ditalinoCount').textContent = stats.ditalino;
    document.getElementById('scopataCount').textContent = stats.scopata;
    document.getElementById('preliminariCount').textContent = stats.preliminari;
  }
  
  function saveToLocalStorage() {
    const listItems = document.querySelectorAll('#eventsList li');
    const events = [];
    listItems.forEach(item => events.push(item.innerHTML));
    localStorage.setItem('hotCalendarEvents', JSON.stringify(events));
    localStorage.setItem('hotCalendarStats', JSON.stringify(stats));
    localStorage.setItem('lastAwardTime', lastAwardTime);
  }
  
  function loadFromLocalStorage() {
    const events = JSON.parse(localStorage.getItem('hotCalendarEvents')) || [];
    const eventsList = document.getElementById('eventsList');
    events.forEach(eventHTML => {
      const newItem = document.createElement('li');
      newItem.innerHTML = eventHTML;
      eventsList.appendChild(newItem);
    });
  
    stats = JSON.parse(localStorage.getItem('hotCalendarStats')) || stats;
    lastAwardTime = localStorage.getItem('lastAwardTime') || 0;
    updateStats();
  }
  
  let chart;
  function createChart() {
    const ctx = document.getElementById('chart').getContext('2d');
    chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Seghe', 'Ditalini', 'Scopate', 'Preliminari'],
        datasets: [{
          data: [stats.sega, stats.ditalino, stats.scopata, stats.preliminari],
          backgroundColor: ['#ff9999', '#ff66b2', '#ff33cc', '#ffcc66']
        }]
      }
    });
  }
  
  function updateChart() {
    if (chart) {
      chart.data.datasets[0].data = [stats.sega, stats.ditalino, stats.scopata, stats.preliminari]; // Correggi questa riga
      chart.update();
    }
  }
  
  function checkBadges() {
    const badgeContainer = document.getElementById('badgeContainer');
    const badgeMessage = document.getElementById('badgeMessage');
    const rewardSound = document.getElementById('rewardSound');
  
    const totalEvents = stats.sega + stats.ditalino + stats.scopata + stats.preliminari;
  
    let badgeText = '';
    let showBadge = false;
  
    if (totalEvents === 1) {
      badgeText = `🎉 Primo passo verso la gloria!`;
      showBadge = true;
    } else if (stats.sega > 0 && stats.sega % 10 === 0) {
      badgeText = `🖐️ Leggenda della Resistenza! (${stats.sega} seghe!)`;
      showBadge = true;
    } else if (stats.ditalino > 0 && stats.ditalino % 5 === 0) {
      badgeText = `👩‍🦰 Maestro del Ditalino! (${stats.ditalino} ditalini!)`;
      showBadge = true;
    } else if (stats.scopata > 0 && stats.scopata % 3 === 0) {
      badgeText = `🍑 Macchina del Piacere! (${stats.scopata} scopate!)`;
      showBadge = true;
    } else if (stats.preliminari > 0 && stats.preliminari % 7 === 0) {
      badgeText = `🛁 Guru dei Preliminari! (${stats.preliminari} preliminari!)`;
      showBadge = true;
    } else if (totalEvents > 0 && totalEvents % 50 === 0) {
      badgeText = `🏆 Campione Supremo del Calendario Hot! (${totalEvents} eventi registrati!)`;
      showBadge = true;
    }
  
    const currentTime = Date.now();
  
    if (currentTime - lastAwardTime > 3600000 && showBadge) {
      lastAwardTime = currentTime;
      localStorage.setItem('lastAwardTime', lastAwardTime);
      rewardSound.play();
    }
  
    if (showBadge) {
      badgeContainer.classList.remove('hidden');
      badgeMessage.textContent = badgeText;
      badgeContainer.classList.add('animate-badge');
    } else {
      badgeContainer.classList.add('hidden');
    }
  }
  
  window.onload = () => {
    loadFromLocalStorage();
    createChart();
    checkBadges();
  };
  