function getSessions() {
  return JSON.parse(localStorage.getItem('ss_sessions') || '[]');
}
function saveSessions(sessions) {
  localStorage.setItem('ss_sessions', JSON.stringify(sessions));
}
function getGoal() {
  return parseFloat(localStorage.getItem('ss_goal') || '0');
}
function saveGoal(val) {
  localStorage.setItem('ss_goal', val);
}
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' });
}
function showToast(msg, isError = false) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.style.borderColor = isError ? 'var(--accent-3)' : 'var(--accent)';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}
function calcStreak(sessions) {
  if (!sessions.length) return 0;
  const days = [...new Set(sessions.map(s => s.date))].sort().reverse();
  let streak = 0;
  let check = todayStr();
  for (let d of days) {
    if (d === check) {
      streak++;
      const dt = new Date(check + 'T00:00:00');
      dt.setDate(dt.getDate() - 1);
      check = dt.toISOString().split('T')[0];
    } else if (d < check) { break; }
  }
  return streak;
}
function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function renderDashboard() {
  const sessions = getSessions();
  const goal = getGoal();
  const today = todayStr();
  const todaySessions = sessions.filter(s => s.date === today);
  const todayHours = todaySessions.reduce((sum, s) => sum + s.duration, 0);
  document.getElementById('streak-count').textContent = calcStreak(sessions);
  document.getElementById('today-hours').textContent = todayHours.toFixed(1);
  document.getElementById('total-sessions').textContent = sessions.length;
  document.getElementById('goal-display').textContent = goal > 0 ? goal.toFixed(1) : '—';
  const barSection = document.getElementById('goal-bar-section');
  if (goal > 0) {
    barSection.style.display = 'block';
    const pct = Math.min((todayHours / goal) * 100, 100);
    document.getElementById('goal-bar-fill').style.width = pct + '%';
    document.getElementById('goal-bar-text').textContent = `${todayHours.toFixed(1)} / ${goal.toFixed(1)} hrs`;
  } else {
    barSection.style.display = 'none';
  }
  const list = document.getElementById('sessions-list');
  if (!sessions.length) {
    list.innerHTML = '<p class="empty-state">No sessions logged yet. Start studying! 📚</p>';
    return;
  }
  const sorted = [...sessions].sort((a, b) => b.id - a.id).slice(0, 8);
  list.innerHTML = sorted.map(s => `
    <div class="session-item" data-id="${s.id}">
      <div class="session-info">
        <div class="session-subject">${escHtml(s.subject)}</div>
        <div class="session-meta">${formatDate(s.date)}${s.notes ? ' · ' + escHtml(s.notes.slice(0, 60)) : ''}</div>
      </div>
      <div class="session-right">
        <div class="session-duration">${s.duration.toFixed(1)}h</div>
        <button class="btn-delete" onclick="deleteSession(${s.id})">✕</button>
      </div>
    </div>
  `).join('');
}
function deleteSession(id) {
  let sessions = getSessions();
  sessions = sessions.filter(s => s.id !== id);
  saveSessions(sessions);
  renderDashboard();
  renderCharts();
  showToast('Session removed.');
}
function setupLogForm() {
  document.getElementById('session-date').value = todayStr();
  document.getElementById('log-btn').addEventListener('click', () => {
    const subject  = document.getElementById('subject').value.trim();
    const duration = parseFloat(document.getElementById('duration').value);
    const date     = document.getElementById('session-date').value;
    const notes    = document.getElementById('notes').value.trim();
    ['subject','duration','date'].forEach(f => {
      document.getElementById(f + '-error').textContent = '';
    });
    document.getElementById('subject').classList.remove('error');
    document.getElementById('duration').classList.remove('error');
    document.getElementById('session-date').classList.remove('error');
    let valid = true;
    if (!subject) {
      document.getElementById('subject-error').textContent = 'Subject is required.';
      document.getElementById('subject').classList.add('error');
      valid = false;
    }
    if (!duration || duration < 0.25 || duration > 12) {
      document.getElementById('duration-error').textContent = 'Enter a duration between 0.25 and 12 hours.';
      document.getElementById('duration').classList.add('error');
      valid = false;
    }
    if (!date) {
      document.getElementById('date-error').textContent = 'Date is required.';
      document.getElementById('session-date').classList.add('error');
      valid = false;
    }
    if (!valid) return;
    const sessions = getSessions();
    sessions.push({ id: Date.now(), subject, duration, date, notes });
    saveSessions(sessions);
    document.getElementById('subject').value = '';
    document.getElementById('duration').value = '';
    document.getElementById('session-date').value = todayStr();
    document.getElementById('notes').value = '';
    showToast('Session logged! 🎉');
    renderDashboard();
    renderCharts();
    switchSection('dashboard');
  });
}
function setupGoalsForm() {
  const goal = getGoal();
  if (goal > 0) {
    document.getElementById('daily-goal').value = goal;
    document.getElementById('current-goal-text').textContent = `Current goal: ${goal} hrs/day`;
  }
  document.getElementById('save-goal-btn').addEventListener('click', () => {
    const val = parseFloat(document.getElementById('daily-goal').value);
    document.getElementById('goal-error').textContent = '';
    if (!val || val < 0.5 || val > 16) {
      document.getElementById('goal-error').textContent = 'Enter a goal between 0.5 and 16 hours.';
      return;
    }
    saveGoal(val);
    document.getElementById('current-goal-text').textContent = `Current goal: ${val} hrs/day`;
    showToast('Goal saved! 🎯');
    renderDashboard();
  });
}
function getWeekSessions() {
  const sessions = getSessions();
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const weekAgo = new Date();
  weekAgo.setDate(today.getDate() - 6);
  weekAgo.setHours(0, 0, 0, 0);
  return sessions.filter(s => {
    const d = new Date(s.date + 'T00:00:00');
    return d >= weekAgo && d <= today;
  });
}
function renderCharts() {
  const weekSessions = getWeekSessions();
  const subjectMap = {};
  weekSessions.forEach(s => { subjectMap[s.subject] = (subjectMap[s.subject] || 0) + s.duration; });
  const labels = Object.keys(subjectMap);
  const data   = Object.values(subjectMap);
  const palette = ['#7c6bff','#00e5b0','#ff6b6b','#60a5fa','#ffb347','#a78bfa','#34d399','#f472b6','#38bdf8','#fb923c'];
  const colors = labels.map((_, i) => palette[i % palette.length]);
  const barCtx = document.getElementById('barChart').getContext('2d');
  if (barChartInstance) barChartInstance.destroy();
  barChartInstance = new Chart(barCtx, {
    type: 'bar',
    data: { labels: labels.length ? labels : ['No data'], datasets: [{ label: 'Hours', data: data.length ? data : [0], backgroundColor: colors, borderRadius: 6, borderSkipped: false }] },
    options: { responsive: true, plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ${ctx.parsed.y.toFixed(1)} hrs` } } }, scales: { x: { grid: { color: '#1a1d27' }, ticks: { color: '#6b7280', font: { family: 'DM Mono' } } }, y: { grid: { color: '#1a1d27' }, ticks: { color: '#6b7280', font: { family: 'DM Mono' } }, beginAtZero: true } } }
  });
  const dCtx = document.getElementById('doughnutChart').getContext('2d');
  if (doughnutChartInstance) doughnutChartInstance.destroy();
  doughnutChartInstance = new Chart(dCtx, {
    type: 'doughnut',
    data: { labels: labels.length ? labels : ['No data'], datasets: [{ data: data.length ? data : [1], backgroundColor: colors, borderColor: '#0d0f14', borderWidth: 3 }] },
    options: { responsive: true, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { color: '#6b7280', font: { family: 'DM Mono', size: 11 }, padding: 14 } }, tooltip: { callbacks: { label: ctx => ` ${ctx.parsed.toFixed(1)} hrs` } } } }
  });
}
function switchSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.getElementById(id).classList.remove('hidden');
  document.querySelector(`.nav-link[href="#${id}"]`).classList.add('active');
  if (id === 'progress') renderCharts();
}
function setupNav() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      switchSection(link.getAttribute('href').replace('#', ''));
    });
  });
}
function setDateDisplay() {
  const el = document.getElementById('date-display');
  if (el) el.textContent = new Date().toLocaleDateString('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
document.addEventListener('DOMContentLoaded', () => {
  setDateDisplay();
  setupNav();
  setupLogForm();
  setupGoalsForm();
  renderDashboard();
});
