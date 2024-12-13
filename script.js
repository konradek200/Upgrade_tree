        const CONVERSION_THRESHOLD = 10;
        const REBIRTH_CONVERSION_THRESHOLD = 500;
        const FRAMES_PER_SECOND = 60;

        // Definiowanie zmiennych dla fragmentów, punktów i szybkości generowania fragmentów
        let fragmentPoints = 0;
        let points = 0;
        let baseGenerationRate = 1; // Podstawowa prędkość generacji
        let fragmentPerSecond = 0;
        let multiplier = 1; // Globalny mnożnik, który będzie się zmieniał przy kupnie ulepszeń
        let pointsMultiplier = 1;
        let rebirthPoints = 0;
        let preBaseGenerationRate = 1;

        // Zmienna do przechowywania statusu, czy ulepszenia są zakupione
        let isUpgradePurchased = [false, false, false, false, false, false, false, false, false]; // Zmiana z "upgrades"
        let upgradeCosts = [5, 10, 25, 50, 100, 150, 250, 500, 1000];

        let isRebirthUpgradePurchased = [false, false, false, false];
        let rebirthUpgradeCosts = [1, 3, 7, 15];

        // Aktualizowanie liczników na stronie (Funkcja ogólna)
        function updateFragmentAndPointDisplay() {
            updateFragmentDisplay();
            updatePointsDisplay();
            updateUpgradeButtons();
            updateMultipliers();
            updatePointsMultipliers();
            updateRebirthDisplay();
        }

        function updateFragmentDisplay() {
            document.getElementById('fragmentPoints').textContent = Math.floor(fragmentPoints);
            document.getElementById('generationRate').textContent = (baseGenerationRate * multiplier * preBaseGenerationRate).toFixed(2);
        }

        function updatePointsDisplay() {
            document.getElementById('points').textContent = points;
            const convertPoints = fragmentPoints >= CONVERSION_THRESHOLD 
                ? Math.floor(Math.sqrt(fragmentPoints / 10) * pointsMultiplier) : 0;
            document.getElementById('convertPoints').textContent = convertPoints;
        }

        // Funkcja generująca fragmenty w czasie
        function generateFragments() {
            fragmentPoints += (baseGenerationRate * multiplier) / FRAMES_PER_SECOND;
            updateFragmentAndPointDisplay();
        }

        // Wyświetlanie/ukrywanie menu po kliknięciu w kółko
        document.getElementById('mainCircle').addEventListener('click', () => {
            const menu = document.getElementById('circleMenu');
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        });

        document.getElementById('rebirthCircle').addEventListener('click', () => {
            const menu = document.getElementById('rebirthMenu');
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        });

        // Sprawdzanie, czy można kupić ulepszenie
        function canPurchaseUpgrade(index, cost) {
            return points >= cost && !isUpgradePurchased[index];
        }

        function canPurchaseRebirthUpgrade(index, cost) {
            return rebirthPoints >= cost && !isUpgradePurchased[index];
        }

        // Funkcja zakupu ulepszenia
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

        // Zakup ulepszeń
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
            purchaseUpgrade(7, 500, () => pointsMultiplier *= Math.sqrt(Math.sqrt(points + 1))+1);
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

        // Funkcja sprawdzająca, czy można konwertować fragmenty na punkty
        function canConvertFragments() {
            return fragmentPoints >= CONVERSION_THRESHOLD;
        }

        // Przycisk konwertujący fragmenty na punkty
        document.getElementById('convertButton').addEventListener('click', () => {
            if (canConvertFragments()) {
                const convertPoints = Math.floor(Math.sqrt(fragmentPoints / 10) * pointsMultiplier);
                points += convertPoints;
                fragmentPoints = 0;
                updateFragmentAndPointDisplay();
            }
        });

        
        function updateRebirthDisplay() {
            document.getElementById('rebirthConvertButton').addEventListener('click', () => {
                const convertPoints = points >= REBIRTH_CONVERSION_THRESHOLD && isUpgradePurchased[8]
                    ? Math.floor(Math.log10(Math.sqrt(points / 5))) : 0;

                rebirthPoints += convertPoints; // Przypisanie wyniku konwersji
                fragmentPoints = 0;
                points = 0;
                baseGenerationRate = 1; // Reset bazowej prędkości generacji
                multiplier = 1; // Reset mnożników
                pointsMultiplier = 1; // Reset mnożników punktów
                isUpgradePurchased.fill(false); // Reset wszystkich zakupionych ulepszeń

                updateFragmentAndPointDisplay();
                updateRebirthDisplay(); // Aktualizacja wyświetlacza Rebirth Points
        });

            const convertPoints = points >= REBIRTH_CONVERSION_THRESHOLD 
                ? Math.floor(Math.log10(Math.sqrt(points / 6))) : 0;
            document.getElementById('rebirthPointsDisplay').textContent = rebirthPoints;
            document.getElementById('rebirthConvertPoints').textContent = convertPoints;
        }

        // Funkcja aktualizująca kolory przycisków ulepszeń
        function updateUpgradeButtons() {
            for (let i = 0; i < isUpgradePurchased.length; i++) {
                const button = document.getElementById(`upgrade${i + 1}`);
                if (isUpgradePurchased[i]) {
                    button.className = 'blue'; // Ulepszenie kupione
                } else if (points >= upgradeCosts[i]) {
                    button.className = 'green'; // Można kupić
                } else {
                    button.className = 'red'; // Nie można kupić
                }
            }
            for (let i = 0; i < isRebirthUpgradePurchased.length; i++) {
                const button = document.getElementById(`rebirthUpgrade${i + 1}`);
                if (isRebirthUpgradePurchased[i]) {
                    button.className = 'blue'; // Ulepszenie kupione
                } else if (rebirthPoints >= rebirthUpgradeCosts[i]) {
                    button.className = 'green'; // Można kupić
                } else {
                    button.className = 'red'; // Nie można kupić
                }
            }
        }

        // Aktualizacja mnożników co 1 sekundę
        function updateMultipliers() {
            let currentMultiplier = 1;
            if (isUpgradePurchased[1]) {
                currentMultiplier *= 1.5;
            }
            if (isUpgradePurchased[2]) {
                currentMultiplier *= Math.sqrt(points / 5)+1;
            }
            if (isUpgradePurchased[3]) {
                currentMultiplier *= Math.log10(fragmentPoints + 1)+1;
            }
            if (isUpgradePurchased[8]) {
                currentMultiplier *= Math.log10(Math.log10(points / 5))+1;
            }
            if (isRebirthUpgradePurchased[2]) {
                currentMultiplier *= Math.sqrt(Math.log10(rebirthPoints))+1;
            }
            multiplier = currentMultiplier;
        }

        function updatePointsMultipliers(){
            let currentPointsMultiplier = 1;
            if (isUpgradePurchased[4]){
                currentPointsMultiplier *= 2;
            }
            if (isUpgradePurchased[5]){
                currentPointsMultiplier *= Math.log10(points + 1)+1;
            }
            if (isUpgradePurchased[6]){
                currentPointsMultiplier *= Math.sqrt(fragmentPoints / 5)+1;
            }
            if (isUpgradePurchased[7]){
                currentPointsMultiplier *= Math.sqrt(Math.sqrt(points + 1))+1;
            }
            if (isRebirthUpgradePurchased[1]){
                currentPointsMultiplier *= 2;
            }
            if (isRebirthUpgradePurchased[3]) {
                currentPointsMultiplier *= Math.sqrt(Math.sqrt(rebirthPoints))+1;
            }
            pointsMultiplier = currentPointsMultiplier;
        }

        // Uruchomienie generacji fragmentów
        setInterval(generateFragments, 1000 / FRAMES_PER_SECOND);
