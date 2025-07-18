    // Default arrays for each list (reverted to original content exactly)
const defaultLists = {
  1: [
  "ADHD",
  "Adipositas",
  "Akne",
  "Allergi",
  "Allergisk kontakteksem",
  "Angst",
  "Astma",
  "Atopisk eksem",
  "Bakterieinfektion",
  "Demens",
  "Depression",
  "Diarré",
  "Dyslipidæmi",
  "Dyspepsi",
  "Epilepsi",
  "Ernæring",
  "Erektil dysfunktion",
  "Fysiske kontraceptiva",
  "Forkølelse",
  "Glaukom",
  "Hoste",
  "Hormonelle kontraceptiva",
  "Hypertension",
  "Hæmorider",
  "Irritativ kontakteksem",
  "Iskæmiske hjertekar-sygdomme",
  "Klimakteriet",
  "KOL",
  "Leddegigt",
  "Mavesår",
  "Menstruations-smerter",
  "Migræne",
  "MOH",
  "Neuropatiske smerter",
  "Obstipation",
  "Osteoporose",
  "Prostatahyperplasi",
  "Psoriasis",
  "Refluks",
  "Rygestop",
  "Skizofreni",
  "Slidgigt",
  "Spændings-hovedpine",
  "Svampeinfektion",
  "Søvnbesvær",
  "T1 Diabetes",
  "T2 Diabetes",
  "Thyroidea-sygdomme",
  "Transportsyge",
  "Tørre øjne",
  "Urininkontinens",
  "Urinsyregigt",
  "Vitaminer og mineraler",
  "Virusinfektion"
  ],
  2: [
    'Barn under 2 år',
    'Barn over 2 år',
    'Teenager',
    'Voksen',
    'Ældre',
    'Gravid',
    'Ammende'
  ],
  3: [
    'Recept',
    'Håndkøb'
  ],
  4: [
    'Bivirkninger',
    'Anvendelse',
    'Dosering',
    'Forsigtighedsregler',
    'Opbevaring',
    'Behandlingsvarighed',
    'Interaktioner'
  ]
};
const yearGroups = {
  "1år": new Set([
    "Vitaminer og mineraler", "Ernæring", "Diarré", "Obstipation", "Hæmorider", "Refluks", "Dyspepsi",
    "Mavesår", "Akne", "Psoriasis", "Atopisk eksem", "Irritativ kontakteksem", "Allergisk kontakteksem",
    "Virusinfektion", "Svampeinfektion", "Bakterieinfektion", "Spændings-hovedpine", "MOH",
    "Menstruations-smerter", "Migræne", "Allergi"
  ]),
  "2år": new Set([
    "Transportsyge", "Astma", "KOL", "Rygestop", "Tørre øjne", "Glaukom", "T1 Diabetes", "T2 Diabetes",
    "Adipositas", "Klimakteriet", "Hormonelle kontraceptiva", "Fysiske kontraceptiva", "Hypertension",
    "Slidgigt", "Leddegigt", "Urinsyregigt", "Osteoporose", "Dyslipidæmi"
  ]),
  "3år": new Set([
    "Iskæmiske hjertekar-sygdomme", "Neuropatiske smerter", "Erektil dysfunktion", "Urininkontinens",
    "Prostatahyperplasi", "Epilepsi", "Thyroidea-sygdomme", "Angst", "Depression", "Demens", "ADHD"
  ])
};

// Current topics selected (starts with all from default)
let currentTopics = new Set(defaultLists[1]);

// Track which year buttons are toggled
let activeGroups = {
  "1år": false,
  "2år": false,
  "3år": false
};


function toggleYearGroup(groupId) {
  activeGroups[groupId] = !activeGroups[groupId];

  const button = document.getElementById(groupId);
  if (button) {
    button.classList.toggle("active", activeGroups[groupId]);
	button.setAttribute('aria-pressed', activeGroups[groupId]);

  }

 // If no buttons are active, show full default list
const anyActive = Object.values(activeGroups).some(val => val);

if (!anyActive) {
  currentTopics = new Set(defaultLists[1]);
} else {
  currentTopics = new Set();
  for (const key in activeGroups) {
    if (activeGroups[key]) {
      for (const item of yearGroups[key]) {
        currentTopics.add(item);
      }
    }
  }
}


  lists[1] = [...currentTopics].sort();
  selectedIndices[1] = null;
  renderList(1);
}



function resetAll() {
  lists = {
    1: [...defaultLists[1]],
    2: [...defaultLists[2]],
    3: [...defaultLists[3]],
    4: [...defaultLists[4]]
  };

  selectedIndices = {
    1: null,
    2: null,
    3: null,
    4: null
  };

  currentTopics = new Set(defaultLists[1]);

  // Reset year group buttons
  for (const key in activeGroups) {
    activeGroups[key] = false;
    const btn = document.getElementById(key);
    if (btn) btn.classList.remove("active");
  }

  renderAll();
  updateSelectedText(); // just in case
}





    // Current lists (start as deep copies of defaults)
    let lists = {
      1: [...defaultLists[1]],
      2: [...defaultLists[2]],
      3: [...defaultLists[3]],
      4: [...defaultLists[4]]
    };

    // Selected indices for each list; null if none selected
    let selectedIndices = {
      1: null,
      2: null,
      3: null,
      4: null
    };

    // Render the lists to the UI
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

    // Select an item in a list
    function selectItem(listNum, index) {
      if (selectedIndices[listNum] === index) {
        selectedIndices[listNum] = null; // deselect if already selected
      } else {
        selectedIndices[listNum] = index;
      }
      renderList(listNum);
    }

    // Add item to a list
    function addItem(listNum) {
      const input = document.getElementById('input' + listNum);
      const value = input.value.trim();
      if (value === '') return;
        // Prevent duplicates (case-insensitive)
	  const exists = lists[listNum].some(item => item.toLowerCase() === value.toLowerCase());
	  if (exists) {
		input.value = '';
		return;
	  } 
	  lists[listNum].push(value);
	  lists[listNum].sort(); // Alphabetical sorting
      input.value = '';
      renderList(listNum);
    }

    // Delete item from a list
    function deleteItem(listNum, index) {
      if (index === selectedIndices[listNum]) {
        selectedIndices[listNum] = null;
      } else if (selectedIndices[listNum] !== null && index < selectedIndices[listNum]) {
        selectedIndices[listNum]--;
      }
      lists[listNum].splice(index, 1);
      renderList(listNum);
    }

    // Pick random item from a list and select it
    function pickRandom(listNum) {
      if (lists[listNum].length === 0) {
        selectedIndices[listNum] = null;
      } else {
        selectedIndices[listNum] = Math.floor(Math.random() * lists[listNum].length);
      }
      renderList(listNum);
    }

    // Reset a single list to defaults and clear selection
    function resetList(listNum) {
      lists[listNum] = [...defaultLists[listNum]];
      selectedIndices[listNum] = null;
      renderList(listNum);
    }

    // Update the selected results text area
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

    // Randomize all lists: pick one random item from each list
    function randomizeAll() {
      for (let i = 1; i <= 4; i++) {
        pickRandom(i);
      }
    }

    // Export lists as JSON and prompt user to copy
function exportLists() {
  const exportData = JSON.stringify(lists, null, 2);
  const blob = new Blob([exportData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'lister.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}


function triggerFileInput() {
  document.getElementById('fileInput').click();
}

function handleFileImport(event) {
  const file = event.target.files[0];
  const errorDiv = document.getElementById('importError');
  if (!file) {
    errorDiv.textContent = 'Ingen fil valgt.';
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      for (let i = 1; i <= 4; i++) {
        if (Array.isArray(imported[i])) {
          lists[i] = imported[i];
          selectedIndices[i] = null;
        } else {
          throw new Error('Forkert format i liste ' + i);
        }
      }
      errorDiv.textContent = '';
      renderAll();
    } catch (err) {
      errorDiv.textContent = 'Fejl ved import af fil: ' + err.message;
    }
  };
  reader.readAsText(file);
  event.target.value = ''; // Reset so same file can be re-selected
}


    // Render all lists
    function renderAll() {
      for (let i = 1; i <= 4; i++) {
        renderList(i);
      }
    }

    // Initial render on page load
    window.onload = () => {
      renderAll();
      updateSelectedText();
    };
	