// Data
const userData = JSON.parse(localStorage.getItem("userData")) || [
  {
    data: [],
    sessionInput: [],
    recentData: [],
  },
];
// Variable
const { data, recentData } = userData[0];
const recentSession = document.querySelector(".recent-session");
const searchInput = document.querySelector('.search-input');

// Small functions
function save() {
  localStorage.setItem("userData", JSON.stringify(userData));
}

function numFormat(number) {
  return number.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function inputError(input) {
  input.classList.add("input-error");
  input.focus();

  setTimeout(() => {
    input.classList.remove("input-error");
  }, 1500);
}

function saveInput() {
  const goalInput = document.querySelector(".js-session-name");
  const timeInput = document.querySelector(".time");

  function saveSelectedValue() {
    userData[0].sessionInput[0] = {
      goalOption: goalInput.value,
      timeOption: timeInput.value,
    };

    save();
  }

  goalInput.addEventListener("change", saveSelectedValue);
  timeInput.addEventListener("change", saveSelectedValue);
}

function loadInput() {
  const savedInput = userData[0].sessionInput[0];

  if (!savedInput) return;

  document.querySelector(".js-session-name").value = savedInput.goalOption;
  document.querySelector(".time").value = savedInput.timeOption;
}

// Functions
function addGoal() {
  const goalName = document.querySelector("#goal-name");
  const targetHours = document.querySelector("#target-hours");

  if (goalName.value === "") {
    inputError(goalName);
  } else if (targetHours.value === "") {
    inputError(targetHours);
  } else {
    const goalData = {
      name: goalName.value,
      targetH: Number(targetHours.value),
      learned: 0,
      startDate: dayjs().format("DD MMM"),
    };

    userData[0].data.push(goalData);
  }
}

function addGoalProgress() {
  const duration = document.querySelector(".js-duration-input");
  const sessionName = document.querySelector(".js-session-name");
  const timeOption = document.querySelector(".time");

  if (sessionName.value === "") {
    inputError(sessionName);
  } else if (duration.value === "") {
    inputError(duration);
  } else {
    data.forEach((goalList) => {
      let time = Number(duration.value);

      if (goalList.name === sessionName.value) {
        if (timeOption.value === "min") {
          time = time / 60;
        }
        goalList.learned += Number(time);
      }
    });
  }
}

// Generate HTML Functions
function goalHTML() {
  let goalListHTML = "",
    sessionListHTML = "";

  data.forEach((goalList) => {
    const { name, targetH, learned } = goalList;
    const percent = (learned / targetH) * 100;

    if (percent >= 100) {
      goalListHTML = "";
    }
    goalListHTML += `
      <p class="goal-name"><strong>${name}: </strong> ${numFormat(learned)} / ${targetH} hours</p>
      <div class="progress-bar-contianer">
        <div class="progress-bar" style="width: ${percent}%"></div>
      </div>
    `;

    sessionListHTML += `
      <option value="${name.trim()}">${name}</option>
    `;
  });

  document.querySelector(".goal-list").innerHTML = goalListHTML;
  document.querySelector(".js-session-name").innerHTML = sessionListHTML;
  lucide.createIcons();
}

function totalHTML() {
  const totalStudyTime = document.querySelector(".total-study");
  let totalStudied = 0;

  recentData.forEach((goalList) => {
    totalStudied += goalList.learned;
  });
  data.forEach((goalList) => {
    totalStudied += goalList.learned;
  });

  totalStudyTime.innerHTML = `
    <p>
      <strong>
        Total study time: 
      </strong>
      ${numFormat(totalStudied)} hours
    </p>
  `;
}

function learnedHTML(data) {
  let learned = '';

  data.forEach((list) => {
    const { name, targetH, startDate } = list;

    learned += `
      <div class="recent-log">
        <button class="delete-btn"><i data-lucide="x"></i></button>
        <p>${name}</p>
        <p>${targetH} hours 🤯</p>
        <p>${startDate} - ${dayjs().format("DD MMM")}</p>
      </div>
    `;
  });
  return learned;
}

function addRecentHTML() {
  data.forEach((goalList, index) => {
    if (goalList.learned >= goalList.targetH) {
      userData[0].recentData.push(goalList);
      data.splice(index, 1);
    }
  });

  recentSession.innerHTML = learnedHTML(recentData);

  document.querySelectorAll('.delete-btn').forEach((delBtn, index) => {
    delBtn.addEventListener('click', () => {
      recentData.splice(index, 1);
      addRecentHTML();
      save();
      lucide.createIcons();
    });
  });
  
  lucide.createIcons();
}

function loadSearch() {
  const input = document.querySelector('.search-input').value;
  const value = input.trim().toLowerCase();

  if (input === '') return;

  const searchedItems = recentData.filter((data) => {
    return data.name.toLowerCase().includes(value);
  });

  recentSession.innerHTML = learnedHTML(searchedItems);

  document.querySelectorAll('.delete-btn').forEach((delBtn, index) => {
    delBtn.addEventListener('click', () => {
      const itemToDelete = searchedItems[index];
      const recentIndex = recentData.indexOf(itemToDelete);

      recentData.splice(recentIndex, 1);
      
      save();
      loadSearch();
      lucide.createIcons();
    });
  });

  lucide.createIcons();
}

// Event Listeners
const addGoalForm = document.querySelector("#goal-form");
addGoalForm.addEventListener("submit", (event) => {
  event.preventDefault();

  addGoal();
  goalHTML();
  save();
  addGoalForm.reset();
  loadInput();
});

const logSessionForm = document.querySelector("#session-form");
logSessionForm.addEventListener("submit", (event) => {
  event.preventDefault();

  addGoalProgress();
  totalHTML();
  addRecentHTML();
  goalHTML();
  save();
  logSessionForm.reset();
  loadInput();
});

const searchBtn = document.querySelector('.search-btn');
searchBtn.addEventListener('click', () => {
  loadSearch();
});
searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    loadSearch();
  }
});

const delSearchValue = document.querySelector('.del-search');
delSearchValue.addEventListener('click', () => {

  searchInput.value = '';
  searchInput.focus();

  addRecentHTML();
})

//Load Page Data
totalHTML();
addRecentHTML();
goalHTML();
saveInput();
loadInput();
lucide.createIcons();

