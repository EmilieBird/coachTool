    // Default arrays for each list (reverted to original content exactly)
const defaultLists = {
  1: [
    'Hypertension',
    'Dyslipidæmi',
    'Iskemiske hjertekar-sygdomme',
    'Hormonelle kontraceptiva',
    'Thyroidea-sygdomme',
    'Bakterieinfektion',
    'Svampeinfektion',
    'Virusinfektion',
    'Klimakteriet',
    'KOL',
    'Migræne',
    'Obstipation',
    'Osteoporose',
    'Prostatahyperplasi',
    'ADHD',
    'Akne',
    'Allergi',
    'Astma',
    'Diarré',
    'Depression',
    'Kontakteksem',
    'Atopisk eksem',
    'Epilepsi',
    'Erektil dysfunktion',
    'Forkølelse',
    'Hoste',
    'Gigt',
    'Glaukom',
    'Skizofreni',
    'Spændings-hovedpine',
    'MOH',
    'Menstruations-smerter',
    'Dyspepsi',
    'Mavesår',
    'Refluks',
    'T1 Diabetes',
    'T2 Diabetes',
    'Urininkontinens',
    'Vitaminer og mineraler'
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
      lists[listNum].push(value);
      input.value = '';
      renderList(listNum);
    }

    // Delete item from a list
    function deleteItem(listNum, index) {
      if (index === selectedIndices[listNum]) {
        selectedIndices[listNum] = null;
      } else if (index < selectedIndices[listNum]) {
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

    // Reset all lists and selections
    function resetAll() {
      for (let i = 1; i <= 4; i++) {
        resetList(i);
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