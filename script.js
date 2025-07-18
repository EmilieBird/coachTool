// Default arrays for each list (original content)
const defaultLists = {
  1: [
    "ADHD", "Adipositas", "Akne", "Allergi", "Allergisk kontakteksem", "Angst", "Astma",
    "Atopisk eksem", "Bakterieinfektion", "Demens", "Depression", "Diarré", "Dyslipidæmi",
    "Dyspepsi", "Epilepsi", "Ernæring", "Erektil dysfunktion", "Fysiske kontraceptiva",
    "Forkølelse", "Glaukom", "Hoste", "Hormonelle kontraceptiva", "Hypertension",
    "Hæmorider", "Irritativ kontakteksem", "Iskæmiske hjertekar-sygdomme", "Klimakteriet",
    "KOL", "Leddegigt", "Mavesår", "Menstruations-smerter", "Migræne", "MOH",
    "Neuropatiske smerter", "Obstipation", "Osteoporose", "Prostatahyperplasi", "Psoriasis",
    "Refluks", "Rygestop", "Skizofreni", "Slidgigt", "Spændings-hovedpine", "Svampeinfektion",
    "Søvnbesvær", "T1 Diabetes", "T2 Diabetes", "Thyroidea-sygdomme", "Transportsyge",
    "Tørre øjne", "Urininkontinens", "Urinsyregigt", "Vitaminer og mineraler", "Virusinfektion"
  ],
  2: [
    'Barn under 2 år', 'Barn over 2 år', 'Teenager', 'Voksen', 'Ældre', 'Gravid', 'Ammende'
  ],
  3: [
    'Recept', 'Håndkøb'
  ],
  4: [
    'Bivirkninger', 'Anvendelse', 'Dosering', 'Forsigtighedsregler', 'Opbevaring',
    'Behandlingsvarighed', 'Interaktioner'
  ]
};

const yearGroups = {
  "1år": new Set([
    "Vitaminer og mineraler", "Ernæring", "Diarré", "Obstipation", "Hæmorider", "Refluks",
    "Dyspepsi", "Mavesår", "Akne", "Psoriasis", "Atopisk eksem", "Irritativ kontakteksem",
    "Allergisk kontakteksem", "Virusinfektion", "Svampeinfektion", "Bakterieinfektion",
    "Spændings-hovedpine", "MOH", "Menstruations-smerter", "Migræne", "Allergi"
  ]),
  "2år": new Set([
    "Transportsyge", "Astma", "KOL", "Rygestop", "Tørre øjne", "Glaukom", "T1 Diabetes",
    "T2 Diabetes", "Adipositas", "Klimakteriet", "Hormonelle kontraceptiva",
    "Fysiske kontraceptiva", "Hypertension", "Slidgigt", "Leddegigt", "Urinsyregigt",
    "Osteoporose", "Dyslipidæmi"
  ]),
  "3år": new Set([
    "Iskæmiske hjertekar-sygdomme", "Neuropatiske smerter", "Erektil dysfunktion",
    "Urininkontinens", "Prostatahyperplasi", "Epilepsi", "Thyroidea-sygdomme", "Angst",
    "Depression", "Demens", "ADHD"
  ])
};

// Current topics based on active year groups
let currentTopics = new Set();

// Track which year buttons are toggled (all active on load)
let activeGroups = {
  "1år": true,
  "2år": true,
  "3år": true
};

// Current lists and selected indices
let lists = {
  1: [], // Will initialize below
  2: [...defaultLists[2]],
  3: [...defaultLists[3]],
  4: [...defaultLists[4]]
};

let selectedIndices = {
  1: null,
  2: null,
  3: null,
  4: null
};

// Helper: build currentTopics from activeGroups
function buildCurrentTopicsFromActiveGroups() {
  let topics = new Set();
  for (const groupId in activeGroups) {
    if (activeGroups[groupId]) {
      for (const topic of yearGroups[groupId]) {
        topics.add(topic);
      }
    }
  }
  return topics;
}

// Toggle year group button & update emner list accordingly
function toggleYearGroup(groupId) {
  activeGroups[groupId] = !activeGroups[groupId];

  const button = document.getElementById(groupId);
  if (button) {
    button.classList.toggle("active", activeGroups[groupId]);
    button.setAttribute('aria-pressed', activeGroups[groupId]);
  }

  // Rebuild currentTopics
  currentTopics = buildCurrentTopicsFromActiveGroups();

  // If no year groups active, emner list empty
  lists[1] = [...currentTopics].sort();

  selectedIndices[1] = null;
  renderList(1);
}

// Reset everything: clear emner list, deactivate all year buttons, clear inputs
function resetAll() {
  // Reset activeGroups and update buttons visually
  for (const key in activeGroups) {
    activeGroups[key] = false;
    const btn = document.getElementById(key);
    if (btn) {
      btn.classList.remove("active");
      btn.setAttribute('aria-pressed', 'false');
    }
  }

  // Clear emner list and currentTopics
  currentTopics = new Set();
  lists[1] = [];
  selectedIndices[1] = null;

  // Reset other lists to defaults
  for (let i = 2; i <= 4; i++) {
    lists[i] = [...defaultLists[i]];
    selectedIndices[i] = null;
  }

  // Clear all input fields for adding items
  for (let i = 1; i <= 4; i++) {
    const input = document.getElementById('input' + i);
    if (input) input.value = '';
  }
  renderAll();
  updateSelectedText();
}

// Render a specific list to the UI
function renderList(listNum) {
  const container = document.getElementById('items' + listNum);
  container.innerHTML = '';

  lists[listNum].forEach((item, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.textContent = item;
    itemDiv.setAttribute('role', 'button');
    itemDiv.setAttribute('tabindex', '0');
    itemDiv.setAttribute('aria-pressed', selectedIndices[listNum] === index ? 'true' : 'false');

    if (selectedIndices[listNum] === index) {
      itemDiv.classList.add('selected');
    }

    itemDiv.onclick = () => selectItem(listNum, index);
    itemDiv.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectItem(listNum, index);
      }
    };

    // Add delete button
    const delBtn = document.createElement('button');
    delBtn.textContent = '×';
    delBtn.title = 'Slet element';
    delBtn.onclick = (e) => {
      e.stopPropagation();
      deleteItem(listNum, index);
    };
    itemDiv.appendChild(delBtn);

    container.appendChild(itemDiv);
  });

  updateSelectedText();
}

function selectItem(listNum, index) {
  if (selectedIndices[listNum] === index) {
    selectedIndices[listNum] = null;
  } else {
    selectedIndices[listNum] = index;
  }
  renderList(listNum);
}

function addItem(listNum) {
  const input = document.getElementById('input' + listNum);
  const value = input.value.trim();
  if (value === '') return;

  const exists = lists[listNum].some(item => item.toLowerCase() === value.toLowerCase());
  if (exists) {
    input.value = '';
    return;
  }
  lists[listNum].push(value);
  lists[listNum].sort();
  input.value = '';
  renderList(listNum);
}

function deleteItem(listNum, index) {
  if (index === selectedIndices[listNum]) {
    selectedIndices[listNum] = null;
  } else if (selectedIndices[listNum] !== null && index < selectedIndices[listNum]) {
    selectedIndices[listNum]--;
  }
  lists[listNum].splice(index, 1);
  renderList(listNum);
}

function pickRandom(listNum) {
  if (lists[listNum].length === 0) {
    selectedIndices[listNum] = null;
  } else {
    selectedIndices[listNum] = Math.floor(Math.random() * lists[listNum].length);
  }
  renderList(listNum);
}

function resetList(listNum) {
  lists[listNum] = [...defaultLists[listNum]];
  selectedIndices[listNum] = null;
  renderList(listNum);
}

function updateSelectedText() {
  for (let i = 1; i <= 4; i++) {
    const selected = selectedIndices[i] !== null ? lists[i][selectedIndices[i]] : '-';
    document.getElementById('selected' + i).textContent =
      (i === 1 ? 'Emne: ' :
       i === 2 ? 'Målgruppe: ' :
       i === 3 ? 'Type ekspedition: ' :
                 'Informationspligt: ') + selected;
  }
}

function randomizeAll() {
  for (let i = 1; i <= 4; i++) {
    pickRandom(i);
  }
}

function renderAll() {
  for (let i = 1; i <= 4; i++) {
    renderList(i);
  }
}

// Initial setup on page load
window.onload = () => {
  // Initialize currentTopics with all yearGroups active
  currentTopics = buildCurrentTopicsFromActiveGroups();
  lists[1] = [...currentTopics].sort();

  // Set year buttons to active visually
  for (const key in activeGroups) {
    const btn = document.getElementById(key);
    if (btn) {
      btn.classList.add("active");
      btn.setAttribute('aria-pressed', 'true');
    }
  }

  renderAll();
  updateSelectedText();
};

window.onload = () => {
  console.log('Page loaded, running initial render');
  renderAll();
  updateSelectedText();
};