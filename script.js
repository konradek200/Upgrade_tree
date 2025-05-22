const CONVERSION_THRESHOLD = 10;
const REBIRTH_CONVERSION_THRESHOLD = 500;
const PRESTIGE_CONVERSION_THRESHOLD = 10;
const FRAMES_PER_SECOND = 60;

let fragmentPoints = 0;
let points = 0;
let baseGenerationRate = 1;
let multiplier = 1;
let pointsMultiplier = 1;
let rebirthPoints = 0;
let preBaseGenerationRate = 1;
let prestigePoints = 0;
let rebirthMultiplier = 1;

let isUpgradePurchased = Array(9).fill(false);
let upgradeCosts = [5, 10, 25, 50, 100, 150, 250, 500, 1000];

let isRebirthUpgradePurchased = Array(4).fill(false);
let rebirthUpgradeCosts = [1, 3, 7, 15];

let isPrestigeUpgradePurchased = Array(3).fill(false);
let prestigeUpgradeCosts = [1, 2, 4];

// === UI Updates ===
function updateFragmentDisplay() {
  document.getElementById('fragmentPoints').textContent = Math.floor(fragmentPoints);
  document.getElementById('generationRate').textContent = (baseGenerationRate * multiplier * preBaseGenerationRate).toFixed(2);
}

function updatePointsDisplay() {
  document.getElementById('points').textContent = Math.floor(points);
  let convertPoints = fragmentPoints >= CONVERSION_THRESHOLD ? convertFragmentsToPoints(fragmentPoints * pointsMultiplier) : 0;
  document.getElementById('convertPoints').textContent = convertPoints.toFixed(2);
}

function updateRebirthDisplay() {
  let convertPoints = points >= REBIRTH_CONVERSION_THRESHOLD && isUpgradePurchased[8] ? convertPointsToRebirth(points * rebirthMultiplier) : 0;
  document.getElementById('rebirthPointsDisplay').textContent = rebirthPoints.toFixed(2);
  document.getElementById('rebirthConvertPoints').textContent = convertPoints.toFixed(2);
}

function updatePrestigeDisplay() {
  let convertPoints = rebirthPoints >= PRESTIGE_CONVERSION_THRESHOLD && isRebirthUpgradePurchased[3] ? convertRebirthToMega(rebirthPoints * rebirthMultiplier) : 0;
  document.getElementById('prestigePointsDisplay').textContent = prestigePoints.toFixed(2);
  document.getElementById('prestigeConvertPoints').textContent = convertPoints.toFixed(2);
}

function updateUpgradeButtons() {
  for (let i = 0; i < isUpgradePurchased.length; i++) {
    const btn = document.getElementById(`upgrade${i + 1}`);
    if (isUpgradePurchased[i]) {
      btn.className = 'blue';
      btn.disabled = true;
    } else {
      btn.className = points >= upgradeCosts[i] ? 'green' : 'red';
      btn.disabled = points < upgradeCosts[i];
    }
  }

  for (let i = 0; i < isRebirthUpgradePurchased.length; i++) {
    const btn = document.getElementById(`rebirthUpgrade${i + 1}`);
    if (isRebirthUpgradePurchased[i]) {
      btn.className = 'blue';
      btn.disabled = true;
    } else {
      btn.className = rebirthPoints >= rebirthUpgradeCosts[i] ? 'green' : 'red';
      btn.disabled = rebirthPoints < rebirthUpgradeCosts[i];
    }
  }

  for (let i = 0; i < isPrestigeUpgradePurchased.length; i++) {
    const btn = document.getElementById(`prestigeUpgrade${i + 1}`);
    if (isPrestigeUpgradePurchased[i]) {
      btn.className = 'blue';
      btn.disabled = true;
    } else {
      btn.className = prestigePoints >= prestigeUpgradeCosts[i] ? 'green' : 'red';
      btn.disabled = prestigePoints < prestigeUpgradeCosts[i];
    }
  }
}

// === Conversion Logic ===
function convertFragmentsToPoints(fragments) {
  let result = 0;
  let cost = 10;
  let increment = 4;
  while (fragments >= cost) {
    result++;
    fragments -= cost;
    cost += increment;
    increment += 2;
  }
  return result;
}

function convertPointsToRebirth(points) {
  let result = 0;
  let cost = 3000;
  let increment = 1000;
  while (points >= cost) {
    result++;
    cost += increment;
    increment += 200;
  }
  return result;
}

function convertRebirthToMega(rebirthPoints) {
  let result = 0;
  let cost = 10;
  let increment = 10;
  while (rebirthPoints >= cost) {
    result++;
    cost += increment;
    increment += 8;
  }
  return result;
}

// === Multipliers ===
function updateMultipliers() {
  let m = 1;
  if (isUpgradePurchased[1]) m *= 1.5;
  if (isUpgradePurchased[2]) m *= Math.sqrt(points / 5) + 1;
  if (isUpgradePurchased[3]) m *= Math.log10(fragmentPoints + 1) + 1;
  if (isUpgradePurchased[8] && points > 5) m *= Math.log10(Math.log10(points / 5 + 1) + 1) + 1;
  if (isRebirthUpgradePurchased[2]) m *= Math.sqrt(Math.log10(rebirthPoints + 1)) + 1;
  if (isPrestigeUpgradePurchased[1]) m *= 10;
  multiplier = m;
}

function updatePointsMultipliers() {
  let m = 1;
  if (isUpgradePurchased[4]) m *= 2;
  if (isUpgradePurchased[5]) m *= Math.log10(points + 1) + 1;
  if (isUpgradePurchased[6]) m *= Math.sqrt(fragmentPoints / 5) + 1;
  if (isUpgradePurchased[7]) m *= Math.sqrt(Math.sqrt(points + 1)) + 1;
  if (isRebirthUpgradePurchased[1]) m *= 2;
  if (isRebirthUpgradePurchased[3]) m *= Math.sqrt(Math.sqrt(rebirthPoints + 1)) + 1;
  if (isPrestigeUpgradePurchased[0]) m *= 3;
  pointsMultiplier = m;
}

function updateRebirthMultipliers() {
  rebirthMultiplier = isPrestigeUpgradePurchased[2] ? 3 : 1;
}

// === Game Loop Logic ===
function generateFragments() {
  fragmentPoints += (baseGenerationRate * multiplier * preBaseGenerationRate) / FRAMES_PER_SECOND;
}

function updateAll() {
  updateMultipliers();
  updatePointsMultipliers();
  updateRebirthMultipliers();
  updateFragmentDisplay();
  updatePointsDisplay();
  updateRebirthDisplay();
  updatePrestigeDisplay();
  updateUpgradeButtons();
}

// === Purchases ===
function purchaseUpgrade(index, cost, effect) {
  if (points >= cost && !isUpgradePurchased[index]) {
    points -= cost;
    effect();
    isUpgradePurchased[index] = true;
    updateAll();
  }
}

function purchaseRebirthUpgrade(index, cost, effect) {
  if (rebirthPoints >= cost && !isRebirthUpgradePurchased[index]) {
    rebirthPoints -= cost;
    effect();
    isRebirthUpgradePurchased[index] = true;
    updateAll();
  }
}

function purchasePrestigeUpgrade(index, cost, effect) {
  if (prestigePoints >= cost && !isPrestigeUpgradePurchased[index]) {
    prestigePoints -= cost;
    effect();
    isPrestigeUpgradePurchased[index] = true;
    updateAll();
  }
}

// === Menu Toggles with single visible menu logic ===

const menus = ["circleMenu", "rebirthMenu", "prestigeMenu"];

function isAnyMenuVisible() {
  return menus.some(id => {
    const el = document.getElementById(id);
    return el.style.display === "block";
  });
}

function toggleMenu(menuId) {
  const menu = document.getElementById(menuId);
  if (menu.style.display === "block") {
    // Zamknij jeśli jest otwarte
    menu.style.display = "none";
  } else {
    // Pokaż menu jeśli żadne inne nie jest widoczne
    if (!isAnyMenuVisible()) {
      menu.style.display = "block";
    }
  }
}

document.getElementById('mainCircle').addEventListener('click', () => {
  toggleMenu('circleMenu');
});
document.getElementById('rebirthCircle').addEventListener('click', () => {
  toggleMenu('rebirthMenu');
});
document.getElementById('prestigeCircle').addEventListener('click', () => {
  toggleMenu('prestigeMenu');
});

// === Conversion Buttons ===
document.getElementById('convertButton').addEventListener('click', () => {
  if (fragmentPoints >= CONVERSION_THRESHOLD) {
    points += convertFragmentsToPoints(fragmentPoints * pointsMultiplier);
    fragmentPoints = 0;
    updateAll();
  }
});

document.getElementById('rebirthConvertButton').addEventListener('click', () => {
  if (points >= REBIRTH_CONVERSION_THRESHOLD && isUpgradePurchased[8]) {
    rebirthPoints += convertPointsToRebirth(points * rebirthMultiplier);
    resetAfterRebirth();
    updateAll();
  }
});

document.getElementById('prestigeConvertButton').addEventListener('click', () => {
  if (rebirthPoints >= PRESTIGE_CONVERSION_THRESHOLD && isRebirthUpgradePurchased[3]) {
    prestigePoints += convertRebirthToMega(rebirthPoints * rebirthMultiplier);
    resetAfterPrestige();
    updateAll();
  }
});

document.getElementById('infoButton').addEventListener('click', () => {
  const modal = document.getElementById('infoModal');
  modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
});

function resetAfterRebirth() {
  fragmentPoints = 0;
  points = 0;
  baseGenerationRate = 1;
  multiplier = 1;
  pointsMultiplier = 1;
  isUpgradePurchased.fill(false);
}

function resetAfterPrestige() {
  resetAfterRebirth();
  rebirthPoints = 0;
  isRebirthUpgradePurchased.fill(false);
}

// === Upgrade Buttons Setup ===
const upgradeEffects = [
  () => baseGenerationRate *= 2,
  () => multiplier *= 1.5,
  () => multiplier *= Math.sqrt(points / 5 + 1),
  () => multiplier *= Math.log10(fragmentPoints + 1) + 1,
  () => pointsMultiplier *= 2,
  () => pointsMultiplier *= Math.log10(points + 1) + 1,
  () => pointsMultiplier *= Math.sqrt(fragmentPoints / 5) + 1,
  () => pointsMultiplier *= Math.sqrt(Math.sqrt(points + 1)) + 1,
  () => multiplier *= Math.log10(Math.log10(points / 5 + 1) + 1) + 1,
];

upgradeEffects.forEach((effect, i) => {
  document.getElementById(`upgrade${i + 1}`).addEventListener('click', () =>
    purchaseUpgrade(i, upgradeCosts[i], effect));
});

const rebirthEffects = [
  () => baseGenerationRate *= 3,
  () => pointsMultiplier *= 2,
  () => multiplier *= Math.sqrt(Math.log10(rebirthPoints + 1)) + 1,
  () => pointsMultiplier *= Math.sqrt(Math.sqrt(rebirthPoints + 1)) + 1,
];

rebirthEffects.forEach((effect, i) => {
  document.getElementById(`rebirthUpgrade${i + 1}`).addEventListener('click', () =>
    purchaseRebirthUpgrade(i, rebirthUpgradeCosts[i], effect));
});

const prestigeEffects = [
  () => pointsMultiplier *= 3,
  () => multiplier *= 10,
  () => rebirthMultiplier *= 3,
];

prestigeEffects.forEach((effect, i) => {
  document.getElementById(`prestigeUpgrade${i + 1}`).addEventListener('click', () =>
    purchasePrestigeUpgrade(i, prestigeUpgradeCosts[i], effect));
});

// === Game Loop Start ===
setInterval(() => {
  generateFragments();
  updateAll();
}, 1000 / FRAMES_PER_SECOND);

// Initial UI Sync
updateAll();
