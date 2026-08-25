// Data ---------------------------------------------

const appData = JSON.parse(localStorage.getItem('webData')) || 
  {
    goals: [],
    previousSelect: {
      goal: '',
      time: ''
    }
  };

// functions ---------------------------------------------

function save() {
  localStorage.setItem('webData', JSON.stringify(appData))
}

function inputError(input) {
  if (input.value.trim() === '') {
    input.focus();
    input.classList.add('input-error');

    setTimeout(() => {
      input.classList.remove('input-error');
    }, 1000);

    return true;
  }
  return false;
}

function saveSelectedOptions() {
  const goalSelect = document.querySelector('.added-session-js');
  const timeSelect = document.querySelector('.time');

  goalSelect.addEventListener('change', () => {
    appData.previousSelect.goal = goalSelect.value;
    save();
  });

  timeSelect.addEventListener('change', () => {
    appData.previousSelect.time = timeSelect.value;
    save();
  });
}

function renderGoal() {
  let goalList = '';
  let selectList = '';

  appData.goals.forEach((goal) => {
    const percent = Math.min((goal.studiedHours / goal.targetHours) * 100, 100);

    goalList += `
      <p class="goal-name">
        <strong>${goal.name}: </strong>
        ${goal.studiedHours.toFixed(2)} / ${goal.targetHours} hrs</p>
      <div class="progress-bar-contianer">
        <div class="progress-bar" style="width:${percent}%"></div>
      </div>
    `;
    selectList += `
      <option value="${goal.name}">${goal.name}</option>
    `;
  });
  
  document.querySelector('.goal-list')
    .innerHTML = goalList;

  document.querySelector('.added-session-js')
    .innerHTML = selectList;

  const goalSelect = document.querySelector(".added-session-js");
  const timeSelect = document.querySelector(".time");

  goalSelect.value = appData.previousSelect.goal;
  timeSelect.value = appData.previousSelect.time;
}

// Main Functions ---------------------------------------------

function addGoal() {
  const goalName = document.querySelector('#goal-name');
  const targetHours = document.querySelector('#target-hours');

  const form = document.querySelector('#goal-form');
  
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (inputError(goalName)) {
      return;
    }
    if (inputError(targetHours)) {
      return;
    };

    appData.goals.push({
      name: goalName.value,
      targetHours: Number(targetHours.value),
      studiedHours: 0
    });

    save();
    form.reset();
    renderGoal();
  });
}


function addSession() {
  const form = document.querySelector('#session-form');
  const goalSelect = document.querySelector('.added-session-js');
  const durationInput = document.querySelector('.duration-input-js');
  const timeSelect = document.querySelector('.time');
  
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (inputError(durationInput)) {
      return;
    }

    const selectedGoal = appData.goals.find((goal) => {
      return goal.name === goalSelect.value;
    });

    const duration = Number(durationInput.value);

    const sessionHours = timeSelect.value === 'min' ? duration / 60 : duration;

    selectedGoal.studiedHours = Math.min(selectedGoal.studiedHours + sessionHours, selectedGoal.targetHours);
    
    totalStudied();
    addRecent();
    save();
    form.reset();
    renderGoal();
  });
}

function totalStudied() {
  let total = 0;

  appData.goals.forEach((goal) => {
    total += goal.studiedHours;
  });

  document.querySelector('.total-study')
    .innerHTML = `
      <p>
        <strong>
          Total study time: 
        </strong>
        ${total.toFixed(2)} hours
      </p>
    `;
}

function addRecent() {
  const today = dayjs().format('MMM, D');

  let recent = '';

  appData.goals.forEach((goal) => {

    if (goal.studiedHours === goal.targetHours) {
      recent += `
        <div class="recent-log">
          <button class="delete-btn"><i data-lucide="x"></i></button>
          <p>${today}</p>
          <p><s>${goal.name}</s></p>
        </div>
      `;
    }
  });

  document.querySelector('.recent-session')
    .innerHTML = recent;

  lucide.createIcons();
}

// Opertation Code ---------------------------------------------

totalStudied();
addGoal();
addSession();
saveSelectedOptions();
addRecent();
renderGoal();

