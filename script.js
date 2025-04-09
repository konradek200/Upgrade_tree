const CONVERSION_THRESHOLD = 10;
const REBIRTH_CONVERSION_THRESHOLD = 500;
const FRAMES_PER_SECOND = 60;
const PRESTIGE_CONVERSION_THRESHOLD = 10;

let fragmentPoints = 0;
let points = 0;
let baseGenerationRate = 1;
let multiplier = 1;
let pointsMultiplier = 1;
let rebirthPoints = 0;
let preBaseGenerationRate = 1;
let prestigePoints = 0;
let rebirthMultiplier = 1;

let isUpgradePurchased = [false, false, false, false, false, false, false, false, false];
let upgradeCosts = [5, 10, 25, 50, 100, 150, 250, 500, 1000];

let isRebirthUpgradePurchased = [false, false, false, false];
let rebirthUpgradeCosts = [1, 3, 7, 15];
let isRebirthMilestoneAchieved = [false];
let requiringRebirthMilestone = [100];

let isPrestigeUpgradePurchased = [false, false, false];
let prestigeUpgradeCosts = [1, 2, 4];

function updateFragmentAndPointDisplay() {
    updateFragmentDisplay();
    updatePointsDisplay();
    updateUpgradeButtons();
    updateMultipliers();
    updatePointsMultipliers();
    updateRebirthDisplay();
    updatePrestigeDisplay();
    rebirthMilestone();
}

function rebirthMilestone() {
    if (rebirthPoints >= requiringRebirthMilestone[0]){
        if (!isRebirthMilestoneAchieved[0]) {
            isRebirthMilestoneAchieved[0] = true;
            document.getElementById('rebirthMilestone1Status').textContent = "Achived";   
        }
    }
    if (isRebirthMilestoneAchieved[0]) {
        generatePoints()
    }
    if (rebirthPoints >= requiringRebirthMilestone[1]) {
        if (!isRebirthMilestoneAchieved[1]) {
            isRebirthMilestoneAchieved[1] = true;
            document.getElementById('rebirthMilestone2Status').textContent = "Achived";
        }
    }
}

function updateFragmentDisplay() {
    document.getElementById('fragmentPoints').textContent = Math.floor(fragmentPoints);
    document.getElementById('generationRate').textContent = (baseGenerationRate * multiplier * preBaseGenerationRate).toFixed(2);
}

function convertFragmentsToPoints(fragmentPoints) {
    let points = 0;
    let requiredFragments = 10;
    let increment = 4;

    while (fragmentPoints >= requiredFragments) {
        points += 1;
        requiredFragments += increment;
        increment += 2;
    }
    
    return parseFloat(points).toFixed(2);
}

function convertPointsToRebirth(points) {
    let rebirthPoints = 0;
    let requiredPoints = 3000;
    let increment = 1000;

    while (points >= requiredPoints) {
        rebirthPoints += 1;
        requiredPoints += increment;
        increment += 200;
    }
    
    return parseFloat(rebirthPoints).toFixed(2);
}

function convertRebirthToMega(rebirthPoints) {
    let prestigePoints = 0;
    let requiredPoints = 10;
    let increment = 10;

    while (rebirthPoints >= requiredPoints) {
        prestigePoints += 1;
        requiredPoints += increment;
        increment += 8;
    }
    
    return parseFloat(prestigePoints).toFixed(2);
}

function updatePointsDisplay() {
    document.getElementById('points').textContent = points.toFixed(2);
    const convertPoints = fragmentPoints >= CONVERSION_THRESHOLD
        ? convertFragmentsToPoints(fragmentPoints) * pointsMultiplier : 0;
    document.getElementById('convertPoints').textContent = convertPoints.toFixed(2);
}

function generateFragments() {
    fragmentPoints += (baseGenerationRate * multiplier) / FRAMES_PER_SECOND;
    updateFragmentAndPointDisplay();
}

function generatePoints() {
    setInterval(points = points + convertFragmentsToPoints((fragmentPoints * pointsMultiplier)) * 0.01, 500000 / FRAMES_PER_SECOND)
}

document.getElementById('mainCircle').addEventListener('click', () => {
    const menu = document.getElementById('circleMenu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
});

document.getElementById('rebirthCircle').addEventListener('click', () => {
    const menu = document.getElementById('rebirthMenu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
});

document.getElementById('prestigeCircle').addEventListener('click', () => {
    const menu = document.getElementById('prestigeMenu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
});

function canPurchaseUpgrade(index, cost) {
    return points >= cost && !isUpgradePurchased[index];
}

function canPurchaseRebirthUpgrade(index, cost) {
    return rebirthPoints >= cost && !isRebirthUpgradePurchased[index];
}

function canPurchasePrestigeUpgrade(index, cost) {
    return prestigePoints >= cost && !isPrestigeUpgradePurchased[index];
}

function purchaseUpgrade(index, cost, effect) {
    if (canPurchaseUpgrade(index, cost)) {
        points -= cost;
        effect();
        isUpgradePurchased[index] = true;
        updateFragmentAndPointDisplay();
    }
}

function purchaseRebirthUpgrade(index, cost, effect) {
    if (canPurchaseRebirthUpgrade(index, cost)) {
        rebirthPoints -= cost;
        effect();
        isRebirthUpgradePurchased[index] = true;
        updateFragmentAndPointDisplay();
    }
}

function purchasePrestigeUpgrade(index, cost, effect) {
    if (canPurchasePrestigeUpgrade(index, cost)) {
        prestigePoints -= cost;
        effect();
        isPrestigeUpgradePurchased[index] = true;
        updateFragmentAndPointDisplay();
    }
}

document.getElementById('upgrade1').addEventListener('click', () => {
    purchaseUpgrade(0, 5, () => baseGenerationRate += 1);
});

document.getElementById('upgrade2').addEventListener('click', () => {
    purchaseUpgrade(1, 10, () => multiplier *= 1.5);
});

document.getElementById('upgrade3').addEventListener('click', () => {
    purchaseUpgrade(2, 25, () => multiplier *= Math.sqrt(points / 5));
});

document.getElementById('upgrade4').addEventListener('click', () => {
    purchaseUpgrade(3, 50, () => multiplier *= Math.log10(fragmentPoints + 1));
});

document.getElementById('upgrade5').addEventListener('click', () => {
    purchaseUpgrade(4, 100, () => pointsMultiplier *= 2);
});

document.getElementById('upgrade6').addEventListener('click', () => {
    purchaseUpgrade(5, 150, () => pointsMultiplier *= Math.log10(points + 1));
});

document.getElementById('upgrade7').addEventListener('click', () => {
    purchaseUpgrade(6, 250, () => pointsMultiplier *= Math.sqrt(fragmentPoints / 5));
});

document.getElementById('upgrade8').addEventListener('click', () => {
    purchaseUpgrade(7, 500, () => pointsMultiplier *= Math.sqrt(Math.sqrt(points + 1)) + 1);
});

document.getElementById('upgrade9').addEventListener('click', () => {
    purchaseUpgrade(8, 1000, () => multiplier *= Math.log10(Math.log10(points / 5)));
});

document.getElementById('rebirthUpgrade1').addEventListener('click', () => {
    purchaseRebirthUpgrade(0, 1, () => preBaseGenerationRate *= 2);
});

document.getElementById('rebirthUpgrade2').addEventListener('click', () => {
    purchaseRebirthUpgrade(1, 3, () => pointsMultiplier *= 2);
});

document.getElementById('rebirthUpgrade3').addEventListener('click', () => {
    purchaseRebirthUpgrade(2, 7, () => multiplier *= Math.log10(Math.sqrt(rebirthPoints)));
});

document.getElementById('rebirthUpgrade4').addEventListener('click', () => {
    purchaseRebirthUpgrade(3, 15, () => pointsMultiplier *= Math.sqrt(Math.log10(Math.sqrt(rebirthPoints))));
});

document.getElementById('prestigeUpgrade1').addEventListener('click', () => {
    purchasePrestigeUpgrade(0, 1, () => pointsMultiplier *= 3);
});

document.getElementById('prestigeUpgrade2').addEventListener('click', () => {
    purchasePrestigeUpgrade(1, 2, () => multiplier *= 10);
});

document.getElementById('prestigeUpgrade3').addEventListener('click', () => {
    purchasePrestigeUpgrade(2, 4, () => rebirthMultiplier *= 2);
});

function canConvertFragments() {
    return fragmentPoints >= CONVERSION_THRESHOLD;
}

document.getElementById('convertButton').addEventListener('click', () => {
    if (canConvertFragments()) {
        const convertPoints = convertFragmentsToPoints((fragmentPoints * pointsMultiplier));
        points += convertPoints;
        fragmentPoints = 0;
    }
});

function updateRebirthDisplay() {
    document.getElementById('rebirthConvertButton').addEventListener('click', () => {
        const convertPoints = points >= REBIRTH_CONVERSION_THRESHOLD && isUpgradePurchased[8]
            ? convertPointsToRebirth((points * rebirthMultiplier)) : 0;

        rebirthPoints += convertPoints;
        fragmentPoints = 0;
        points = 0;
        baseGenerationRate = 1;
        multiplier = 1;
        pointsMultiplier = 1;
        isUpgradePurchased.fill(false);
        if (isRebirthMilestoneAchieved[1]) {
            for (i = 0; i < 2; i++) {
                isUpgradePurchased[i] = true;
            }
            points = 1;
            fragmentPoints = 1;
        }
    });

    const convertPoints = points >= REBIRTH_CONVERSION_THRESHOLD
        ? convertPointsToRebirth((points * pointsMultiplier)) : 0;
    document.getElementById('rebirthPointsDisplay').textContent = parseFloat(rebirthPoints).toFixed(2);
    document.getElementById('rebirthConvertPoints').textContent = parseFloat(convertPoints).toFixed(2);
}

function updatePrestigeDisplay() {
    document.getElementById('prestigeConvertButton').addEventListener('click', () => {
        const convertPoints = rebirthPoints >= PRESTIGE_CONVERSION_THRESHOLD && isRebirthUpgradePurchased[3]
            ? convertRebirthToMega((rebirthPoints * rebirthMultiplier)) : 0;

        prestigePoints += convertPoints;
        rebirthPoints = 0;
        fragmentPoints = 0;
        points = 0;
        baseGenerationRate = 1;
        multiplier = 1;
        pointsMultiplier = 1;
        isRebirthUpgradePurchased.fill(false);
        isUpgradePurchased.fill(false)
        
    });

    const convertPoints = rebirthPoints >= PRESTIGE_CONVERSION_THRESHOLD
        ? convertRebirthToMega(rebirthPoints * rebirthMultiplier) : 0;
    document.getElementById('prestigePointsDisplay').textContent = parseFloat(prestigePoints).toFixed(2);
    document.getElementById('prestigeConvertPoints').textContent = parseFloat(convertPoints).toFixed(2);
}

function updateUpgradeButtons() {
    for (let i = 0; i < isUpgradePurchased.length; i++) {
        const button = document.getElementById(`upgrade${i + 1}`);
        if (isUpgradePurchased[i]) {
            button.className = 'blue';
        } else if (points >= upgradeCosts[i]) {
            button.className = 'green';
        } else {
            button.className = 'red';
        }
    }
    for (let i = 0; i < isRebirthUpgradePurchased.length; i++) {
        const button = document.getElementById(`rebirthUpgrade${i + 1}`);
        if (isRebirthUpgradePurchased[i]) {
            button.className = 'blue';
        } else if (rebirthPoints >= rebirthUpgradeCosts[i]) {
            button.className = 'green';
        } else {
            button.className = 'red';
        }
    }
    for (let i = 0; i < isPrestigeUpgradePurchased.length; i++) {
        const button = document.getElementById(`prestigeUpgrade${i + 1}`);
        if (isPrestigeUpgradePurchased[i]) {
            button.className = 'blue';
        } else if (prestigePoints >= canPurchasePrestigeUpgrade[i]) {
            button.className = 'green';
        } else {
            button.className = 'red';
        }
    }
}

function updateMultipliers() {
    let currentMultiplier = 1;
    if (isUpgradePurchased[1]) {
        currentMultiplier *= 1.5;
    }
    if (isUpgradePurchased[2]) {
        currentMultiplier *= Math.sqrt(points / 5) + 1;
    }
    if (isUpgradePurchased[3]) {
        currentMultiplier *= Math.log10(fragmentPoints + 1) + 1;
    }
    if (isUpgradePurchased[8]) {
        currentMultiplier *= Math.log10(Math.log10(points / 5)) + 1;
    }
    if (isRebirthUpgradePurchased[2]) {
        currentMultiplier *= Math.sqrt(Math.log10(rebirthPoints)) + 1;
    }
    if (isPrestigeUpgradePurchased[1]) {
        currentMultiplier *= 10;
    }
    multiplier = currentMultiplier;
}

function updatePointsMultipliers() {
    let currentPointsMultiplier = 1;
    if (isUpgradePurchased[4]) {
        currentPointsMultiplier *= 2;
    }
    if (isUpgradePurchased[5]) {
        currentPointsMultiplier *= Math.log10(points + 1) + 1;
    }
    if (isUpgradePurchased[6]) {
        currentPointsMultiplier *= Math.sqrt(fragmentPoints / 5) + 1;
    }
    if (isUpgradePurchased[7]) {
        currentPointsMultiplier *= Math.sqrt(Math.sqrt(points + 1)) + 1;
    }
    if (isRebirthUpgradePurchased[1]) {
        currentPointsMultiplier *= 2;
    }
    if (isRebirthUpgradePurchased[3]) {
        currentPointsMultiplier *= Math.sqrt(Math.sqrt(rebirthPoints)) + 1;
    }
    if (isPrestigeUpgradePurchased[0]) {
        currentPointsMultiplier *= 3;
    }
    pointsMultiplier = currentPointsMultiplier;
}

function updateRebirthMultipliers() {
    let currentRebirthMultiplier = 1;
    if (isPrestigeUpgradePurchased[2]) {
        currentRebirthMultiplier *= 3;
    }
    rebirthMultiplier = currentRebirthMultiplier;
}

setInterval(generateFragments, 1000 / FRAMES_PER_SECOND);
