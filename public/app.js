
async function loadData() {
  const response = await fetch('data/public_results.json');
  return response.json();
}

function statCard(label, value) {
  return `<article class="stat-card"><div class="stat-label">${label}</div><div class="stat-value">${value}</div></article>`;
}

function rankRow(item, index) {
  return `
    <div class="rank-row">
      <div class="rank-number">${index + 1}</div>
      <div>
        <div class="rank-name">${item.name}</div>
        <div class="rank-meta">${item.sub_group} • ${item.place}</div>
      </div>
    </div>
  `;
}

function groupRow(item) {
  return `
    <div class="group-row">
      <div>
        <strong>${item.group}</strong>
      </div>
      <div class="group-meta">Full scorers: <strong>${item.full_scorers}</strong></div>
      <div class="group-meta">First completion: ${item.first_completion_label}</div>
      <div><button class="ghost-btn" data-group="${item.group}">View full scorers</button></div>
    </div>
  `;
}

function groupDetailRow(item) {
  return `
    <div class="rank-row">
      <div class="rank-number">${item.order}</div>
      <div>
        <div class="rank-name">${item.name}</div>
        <div class="rank-meta">${item.sub_group} • ${item.place}</div>
      </div>
    </div>
  `;
}

async function sha256(text) {
  const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function normalizeMobile(value) {
  return (value || '').replace(/\D/g, '');
}

async function lookupMobile() {
  const output = document.getElementById('lookupResult');
  const raw = document.getElementById('mobileInput').value;
  const mobile = normalizeMobile(raw);

  if (!mobile) {
    output.classList.remove('empty');
    output.innerHTML = 'Please enter a valid mobile number.';
    return;
  }

  output.classList.remove('empty');
  output.innerHTML = 'Checking result...';

  const hash = await sha256(mobile);

  try {
    const res = await fetch('/api/lookup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hash })
    });

    const data = await res.json();
    if (!res.ok || data.error) {
      output.innerHTML = data.error || 'Result not found.';
      return;
    }

    output.innerHTML = `
      <strong>Name:</strong> ${data.name}<br>
      <strong>Group:</strong> ${data.sub_group}<br>
      <strong>Place:</strong> ${data.place}
    `;
  } catch (err) {
    output.innerHTML = 'API not connected in static preview. After deployment, connect the included function for protected mobile lookup.';
  }
}

function bindGroupDialog(groupDetails) {
  const dialog = document.getElementById('groupDialog');
  const title = document.getElementById('dialogTitle');
  const content = document.getElementById('dialogContent');
  const closeBtn = document.getElementById('closeDialog');

  document.getElementById('groups-table').addEventListener('click', (event) => {
    const btn = event.target.closest('[data-group]');
    if (!btn) return;
    const group = btn.getAttribute('data-group');
    const rows = groupDetails[group] || [];
    title.textContent = `${group} - Full Scorers`;
    content.innerHTML = rows.length
      ? rows.map(groupDetailRow).join('')
      : '<p class="muted">No full scorers available for this group.</p>';
    dialog.showModal();
  });

  closeBtn.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    const inside = rect.top <= event.clientY && event.clientY <= rect.top + rect.height &&
                   rect.left <= event.clientX && event.clientX <= rect.left + rect.width;
    if (!inside) dialog.close();
  });
}

loadData().then(data => {
  const stats = data.summary;
  document.getElementById('stats').innerHTML = [
    statCard('Published participants', stats.published_participants),
    statCard('Full scorers', stats.full_scorers),
    statCard('Ladies full scorers', stats.ladies_full_scorers),
    statCard('Gents full scorers', stats.gents_full_scorers),
    statCard('Groups with full scorers', stats.groups_with_full_scorers),
  ].join('');

  document.getElementById('top-ladies').innerHTML = data.top_ladies.map(rankRow).join('');
  document.getElementById('top-gents').innerHTML = data.top_gents.map(rankRow).join('');
  document.getElementById('groups-table').innerHTML = data.groups.map(groupRow).join('');

  document.getElementById('questions-list').innerHTML = data.questions.map((item, i) => `
    <details class="qa-item" ${i === 0 ? 'open' : ''}>
      <summary>Q${i + 1}. ${item.question}</summary>
      <div class="qa-answer"><strong>Answer:</strong> ${item.answer}</div>
    </details>
  `).join('');

  document.getElementById('youtube-links').innerHTML = data.youtube_links.map(item => `
    <article class="resource-card">
      <h3>${item.title}</h3>
      <p>Watch the class directly from the published results page.</p>
      <a class="btn btn-primary" href="${item.url}" target="_blank" rel="noopener">Open YouTube</a>
    </article>
  `).join('');

  document.getElementById('footer-meta').textContent = `Updated ${data.updated_at}`;
  bindGroupDialog(data.group_details);
});

document.getElementById('lookupBtn').addEventListener('click', lookupMobile);
document.getElementById('mobileInput').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') lookupMobile();
});
