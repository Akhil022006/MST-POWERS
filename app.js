// ==========================================================================
// MST POWERS - INTERACTIVE JAVASCRIPT SYSTEM
// ==========================================================================

// --- Safe Storage Wrapper with capability detection to prevent silent failures on local file:/// access ---
const SafeStorage = (() => {
    let useLocalMemory = false;
    let useSessionMemory = false;

    // Test localStorage capability
    try {
        const testKey = "__storage_test__";
        localStorage.setItem(testKey, testKey);
        if (localStorage.getItem(testKey) !== testKey) {
            useLocalMemory = true;
        }
        localStorage.removeItem(testKey);
    } catch (e) {
        useLocalMemory = true;
    }

    // Test sessionStorage capability
    try {
        const testKey = "__storage_test__";
        sessionStorage.setItem(testKey, testKey);
        if (sessionStorage.getItem(testKey) !== testKey) {
            useSessionMemory = true;
        }
        sessionStorage.removeItem(testKey);
    } catch (e) {
        useSessionMemory = true;
    }

    const localStore = {};
    const sessionStore = {};

    return {
        local: {
            getItem(key) {
                if (useLocalMemory) return localStore[key] || null;
                try {
                    return localStorage.getItem(key);
                } catch (e) {
                    return localStore[key] || null;
                }
            },
            setItem(key, value) {
                if (useLocalMemory) {
                    localStore[key] = String(value);
                    return;
                }
                try {
                    localStorage.setItem(key, value);
                } catch (e) {
                    localStore[key] = String(value);
                }
            },
            removeItem(key) {
                if (useLocalMemory) {
                    delete localStore[key];
                    return;
                }
                try {
                    localStorage.removeItem(key);
                } catch (e) {
                    delete localStore[key];
                }
            }
        },
        session: {
            getItem(key) {
                if (useSessionMemory) return sessionStore[key] || null;
                try {
                    return sessionStorage.getItem(key);
                } catch (e) {
                    return sessionStore[key] || null;
                }
            },
            setItem(key, value) {
                if (useSessionMemory) {
                    sessionStore[key] = String(value);
                    return;
                }
                try {
                    sessionStorage.setItem(key, value);
                } catch (e) {
                    sessionStore[key] = String(value);
                }
            },
            removeItem(key) {
                if (useSessionMemory) {
                    delete sessionStore[key];
                    return;
                }
                try {
                    sessionStorage.removeItem(key);
                } catch (e) {
                    delete sessionStore[key];
                }
            }
        }
    };
})();

// --- 1. Technical Specifications Database ---
const generatorDatabase = [
    { kva: 10,  kw: 8,   image: "assets/generators/10kva.jpg",   current: "14 Amps",  model: "H2G4DM15/ALG184", cylinders: 2, bhp: 19.5, fuelTank: 35,  fuelCons: 3.0,  sump: 6.0,  battery: "90 Ah",  cable: "10 sq. mm",   exhaust: 65,  weight: 676,  dimensions: "1750 x 900 x 1200" },
    { kva: 15,  kw: 12,  image: "assets/generators/15kva.jpg",   current: "21 Amps",  model: "H2G4DM15/ALG184", cylinders: 2, bhp: 19.5, fuelTank: 35,  fuelCons: 3.3,  sump: 6.0,  battery: "90 Ah",  cable: "10 sq. mm",   exhaust: 65,  weight: 676,  dimensions: "1750 x 900 x 1200" },
    { kva: 20,  kw: 16,  image: "assets/generators/20kva.jpg",   current: "28 Amps",  model: "H2G4DM15/ALG184", cylinders: 2, bhp: 19.5, fuelTank: 35,  fuelCons: 4.0,  sump: 6.0,  battery: "90 Ah",  cable: "16 sq. mm",   exhaust: 65,  weight: 676,  dimensions: "1750 x 900 x 1200" },
    { kva: 25,  kw: 20,  image: "assets/generators/25kva.jpg",   current: "35 Amps",  model: "P15G4DE25",        cylinders: 3, bhp: 33.2, fuelTank: 75,  fuelCons: 5.4,  sump: 4.5,  battery: "90 Ah",  cable: "25 sq. mm",   exhaust: 65,  weight: 750,  dimensions: "2000 x 1050 x 1200" },
    { kva: 30,  kw: 24,  image: "assets/generators/30kva.jpg",   current: "42 Amps",  model: "P15G4DE30",        cylinders: 3, bhp: 37.0, fuelTank: 75,  fuelCons: 6.0,  sump: 4.5,  battery: "90 Ah",  cable: "25 sq. mm",   exhaust: 65,  weight: 750,  dimensions: "2000 x 1050 x 1250" },
    { kva: 40,  kw: 32,  image: "assets/generators/40kva.jpg",   current: "56 Amps",  model: "H4G4DE40",        cylinders: 4, bhp: 52.0, fuelTank: 105, fuelCons: 7.7,  sump: 8.5,  battery: "90 Ah",  cable: "35 sq. mm",   exhaust: 65,  weight: 1090, dimensions: "2500 x 1200 x 1530" },
    { kva: 45,  kw: 34,  image: "assets/generators/45kva.jpg",   current: "63 Amps",  model: "H4G4DE45",        cylinders: 4, bhp: 56.5, fuelTank: 105, fuelCons: 8.4,  sump: 8.5,  battery: "90 Ah",  cable: "35 sq. mm",   exhaust: 75,  weight: 1100, dimensions: "2500 x 1200 x 1530" },
    { kva: 60,  kw: 48,  image: "assets/generators/60kva.jpg",   current: "84 Amps",  model: "H4G4DE60",        cylinders: 4, bhp: 72.0, fuelTank: 150, fuelCons: 10.5, sump: 8.5,  battery: "90 Ah",  cable: "50 sq. mm",   exhaust: 75,  weight: 1380, dimensions: "2700 x 1200 x 1510" },
    { kva: 82.5,kw: 66,  image: "assets/generators/82.5kva.jpg", current: "115 Amps", model: "H4G4DE82",        cylinders: 4, bhp: 104.0,fuelTank: 180, fuelCons: 14.7, sump: 12.0, battery: "90 Ah",  cable: "70 sq. mm",   exhaust: 75,  weight: 1417, dimensions: "2850 x 1300 x 1610" },
    { kva: 100, kw: 80,  image: "assets/generators/100kva.jpg",  current: "140 Amps", model: "H4G4DE100",       cylinders: 4, bhp: 122.0,fuelTank: 180, fuelCons: 17.0, sump: 12.0, battery: "90 Ah",  cable: "95 sq. mm",   exhaust: 100, weight: 1900, dimensions: "2850 x 1300 x 1610" },
    { kva: 125, kw: 100, image: "assets/generators/125kva.jpg",  current: "175 Amps", model: "H6G4DE125",       cylinders: 6, bhp: 154.0,fuelTank: 235, fuelCons: 22.1, sump: 18.0, battery: "90 Ah",  cable: "150 sq. mm",  exhaust: 100, weight: 2050, dimensions: "3100 x 1300 x 1610" },
    { kva: 160, kw: 128, image: "assets/generators/160kva.jpg",  current: "224 Amps", model: "H6G4DE160",       cylinders: 6, bhp: 197.0,fuelTank: 250, fuelCons: 27.5, sump: 18.0, battery: "110 Ah", cable: "240 sq. mm",  exhaust: 130, weight: 2210, dimensions: "3500 x 1400 x 1850" },
    { kva: 180, kw: 144, image: "assets/generators/180kva.jpg",  current: "252 Amps", model: "H6G4DE180",       cylinders: 6, bhp: 220.0,fuelTank: 250, fuelCons: 30.4, sump: 18.0, battery: "110 Ah", cable: "2R*120 sq. mm",exhaust: 130, weight: 2280, dimensions: "3500 x 1400 x 1850" },
    { kva: 250, kw: 200, image: "assets/generators/250kva.jpg",  current: "350 Amps", model: "A6G4DE250",       cylinders: 6, bhp: 303.0,fuelTank: 400, fuelCons: 39.3, sump: 28.0, battery: "110 Ah", cable: "2R*150 sq. mm",exhaust: 150, weight: 4500, dimensions: "4700 x 1600 x 2020" }
];

// Active index of the selected spec rating (default is index 3: 25 kVA)
let currentSpecIndex = 3;

// Appliance selection data for Load Calculator
const appliancesSelected = {};

// --- 2. Initial Setup and DOM Loading ---
document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initSpecificationSelector();
    initFullSpecsTable();
    initLoadCalculator();
    initQuoteForm();
    initAdminDashboard();
    initScrollReveal();
    initSparkParticles();
    initSavingsEstimator();
    
    // Set initial display
    updateSpecCard(currentSpecIndex);
});

// --- 3. Header & Navigation Menu Functions ---
function initNavigation() {
    const header = document.querySelector(".main-header");
    const mobileToggle = document.querySelector(".mobile-nav-toggle");
    const navLinks = document.querySelector(".nav-links");
    const links = document.querySelectorAll(".nav-link");

    // Scroll styling effect
    window.addEventListener("scroll", () => {
        if (window.scrollY > 40) {
            header.style.padding = "8px 0";
            header.style.backgroundColor = "rgba(255, 255, 255, 0.96)";
            header.style.boxShadow = "var(--shadow-md)";
        } else {
            header.style.padding = "16px 0";
            header.style.backgroundColor = "rgba(255, 255, 255, 0.85)";
            header.style.boxShadow = "var(--shadow-sm)";
        }
        highlightActiveSection();
    });

    // Mobile Hamburger Menu Click
    mobileToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        const icon = mobileToggle.querySelector("i");
        if (navLinks.classList.contains("active")) {
            icon.className = "fa-solid fa-xmark";
        } else {
            icon.className = "fa-solid fa-bars";
        }
    });

    // Close menu when link is clicked
    links.forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            mobileToggle.querySelector("i").className = "fa-solid fa-bars";
        });
    });

    // Highlight menu links on scroll
    function highlightActiveSection() {
        const sections = document.querySelectorAll("section");
        const scrollPosition = window.scrollY + 120; // Offset for header height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute("id");

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                links.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${sectionId}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }
}

// --- 4. Specification Engine (Interactive Card + Slider) ---
function initSpecificationSelector() {
    const slider = document.getElementById("kva-range-slider");
    const ticksContainer = document.getElementById("slider-ticks-container");
    const buttonRow = document.getElementById("quick-kva-buttons");
    const requestQuoteBtn = document.getElementById("btn-select-model-quote");

    // Clear and build dynamic layout elements
    ticksContainer.innerHTML = "";
    buttonRow.innerHTML = "";

    // Populate ticks and quick buttons
    generatorDatabase.forEach((item, index) => {
        // Ticks
        const tick = document.createElement("span");
        tick.className = `slider-tick ${index === currentSpecIndex ? 'active' : ''}`;
        tick.innerText = `${item.kva}`;
        tick.addEventListener("click", () => {
            slider.value = index;
            updateSpecCard(index);
        });
        ticksContainer.appendChild(tick);

        // Buttons row
        const btn = document.createElement("button");
        btn.className = `btn-kva ${index === currentSpecIndex ? 'active' : ''}`;
        btn.type = "button";
        btn.innerText = `${item.kva} kVA`;
        btn.addEventListener("click", () => {
            slider.value = index;
            updateSpecCard(index);
        });
        buttonRow.appendChild(btn);
    });

    // Listen to range slider input
    slider.addEventListener("input", (e) => {
        updateSpecCard(parseInt(e.target.value));
    });

    // Quote link button on card
    requestQuoteBtn.addEventListener("click", () => {
        const selectedGen = generatorDatabase[currentSpecIndex];
        const quoteSelect = document.getElementById("form-kva-needed");
        if (quoteSelect) {
            quoteSelect.value = selectedGen.kva.toString();
        }
        
        // Scroll to form
        const formElement = document.getElementById("calculator");
        if (formElement) {
            formElement.scrollIntoView({ behavior: "smooth" });
        }
    });
}

// Global function to programmatically select a kVA size (e.g. from footer)
window.selectKva = function(kvaVal) {
    const index = generatorDatabase.findIndex(item => item.kva === kvaVal);
    if (index !== -1) {
        const slider = document.getElementById("kva-range-slider");
        if (slider) {
            slider.value = index;
        }
        updateSpecCard(index);
    }
};

// Update all DOM elements inside the specification display card
function updateSpecCard(index) {
    currentSpecIndex = index;
    const item = generatorDatabase[index];

    // Update highlights
    document.getElementById("spec-engine-model").innerText = item.model;
    document.getElementById("spec-kva-rating").innerText = item.kva;
    document.getElementById("spec-kw-rating").innerText = `/ ${item.kw} kW`;

    // Update specific generator photo
    const specImage = document.getElementById("spec-generator-img");
    if (specImage && item.image) {
        specImage.src = item.image;
        specImage.alt = `MST Powers ${item.kva} kVA Generator`;
    }

    // Update specs columns
    document.getElementById("spec-current").innerText = item.current;
    document.getElementById("spec-cylinders").innerText = item.cylinders;
    document.getElementById("spec-bhp").innerText = `${item.bhp} BHP`;
    document.getElementById("spec-sump").innerText = `${item.sump} L`;
    document.getElementById("spec-battery").innerText = item.battery;

    document.getElementById("spec-fuel-tank").innerText = `${item.fuelTank} L`;
    document.getElementById("spec-fuel-cons").innerText = `${item.fuelCons} L/hr`;
    document.getElementById("spec-cable").innerText = item.cable;
    document.getElementById("spec-exhaust").innerText = `${item.exhaust} mm`;

    // Size & Weight
    document.getElementById("spec-weight").innerText = item.weight.toLocaleString();
    const dims = item.dimensions.split(" x ");
    document.getElementById("spec-length").innerText = `${dims[0]} mm`;
    document.getElementById("spec-width").innerText = `${dims[1]} mm`;
    document.getElementById("spec-height").innerText = `${dims[2]} mm`;

    // Update specs progress bars dynamically
    const bhpPercent = Math.min(100, Math.max(0, (item.bhp / 303.0) * 100));
    const fuelPercent = Math.min(100, Math.max(0, (item.fuelCons / 39.3) * 100));
    const weightPercent = Math.min(100, Math.max(0, (item.weight / 4500.0) * 100));

    document.getElementById("bar-bhp").style.width = `${bhpPercent}%`;
    document.getElementById("bar-fuel-cons").style.width = `${fuelPercent}%`;
    document.getElementById("bar-weight").style.width = `${weightPercent}%`;

    // Update slider visual active ticks
    const ticks = document.querySelectorAll(".slider-tick");
    ticks.forEach((tick, idx) => {
        if (idx === index) tick.classList.add("active");
        else tick.classList.remove("active");
    });

    // Update active visual button
    const buttons = document.querySelectorAll(".btn-kva");
    buttons.forEach((btn, idx) => {
        if (idx === index) btn.classList.add("active");
        else btn.classList.remove("active");
    });

    // Update ROI Savings estimates
    if (typeof recalculateSavings === "function") {
        recalculateSavings();
    }
}

// --- 5. Full Specs Table Generation & Collapse ---
function initFullSpecsTable() {
    const tableBody = document.getElementById("full-specs-table-body");
    const toggleBtn = document.getElementById("btn-toggle-all-specs");
    const tableBlock = document.getElementById("all-specs-table-block");

    // Populate rows
    generatorDatabase.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${item.kva} kVA</strong></td>
            <td>${item.kw} kW</td>
            <td>${item.current}</td>
            <td><code>${item.model}</code></td>
            <td>${item.cylinders}</td>
            <td>${item.bhp} BHP</td>
            <td>${item.fuelTank} L</td>
            <td>${item.fuelCons} L/hr</td>
            <td>${item.weight} kg</td>
            <td><small>${item.dimensions} mm</small></td>
        `;
        // Add click listener to row to load it into the interactive card
        tr.style.cursor = "pointer";
        tr.addEventListener("click", () => {
            const idx = generatorDatabase.findIndex(g => g.kva === item.kva);
            window.selectKva(item.kva);
            document.getElementById("specs").scrollIntoView({ behavior: "smooth" });
        });
        tableBody.appendChild(tr);
    });

    // Toggle Collapse
    toggleBtn.addEventListener("click", () => {
        const isCollapsed = tableBlock.classList.contains("collapsed");
        if (isCollapsed) {
            tableBlock.classList.remove("collapsed");
            toggleBtn.innerHTML = `<i class="fa-solid fa-compress"></i> Hide Technical Table`;
        } else {
            tableBlock.classList.add("collapsed");
            toggleBtn.innerHTML = `<i class="fa-solid fa-list-check"></i> Show Complete Technical Table`;
        }
    });
}

// --- 6. Load Calculator Engine ---
function initLoadCalculator() {
    const listItems = document.querySelectorAll(".appliance-item");
    const customLoadInput = document.getElementById("custom-load-input");
    const customLoadUnit = document.getElementById("custom-load-unit");

    // Initialize circular gauge SVG properties
    const circle = document.querySelector('.progress-ring__circle');
    let circumference = 0;
    
    if (circle) {
        const radius = circle.r.baseVal.value;
        circumference = radius * 2 * Math.PI;
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference;
    }
    
    // Initialize quantity clickers
    listItems.forEach(item => {
        const loadVal = parseFloat(item.getAttribute("data-load"));
        const name = item.getAttribute("data-name");
        const minusBtn = item.querySelector(".minus");
        const plusBtn = item.querySelector(".plus");
        const qtyDisplay = item.querySelector(".qty");

        appliancesSelected[name] = { load: loadVal, qty: 0 };

        plusBtn.addEventListener("click", (e) => {
            e.preventDefault();
            appliancesSelected[name].qty++;
            qtyDisplay.innerText = appliancesSelected[name].qty;
            
            // Toggle active visual card wrapper
            if (appliancesSelected[name].qty > 0) {
                item.classList.add("active");
            }
            
            recalculateLoad();
        });

        minusBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (appliancesSelected[name].qty > 0) {
                appliancesSelected[name].qty--;
                qtyDisplay.innerText = appliancesSelected[name].qty;
                
                if (appliancesSelected[name].qty === 0) {
                    item.classList.remove("active");
                }
                recalculateLoad();
            }
        });
    });

    // Custom inputs listener
    customLoadInput.addEventListener("input", recalculateLoad);
    customLoadUnit.addEventListener("change", recalculateLoad);

    function recalculateLoad() {
        let applianceSumKw = 0;
        
        // Sum from selected items
        for (const name in appliancesSelected) {
            applianceSumKw += appliancesSelected[name].load * appliancesSelected[name].qty;
        }

        // Sum from custom input
        let customVal = parseFloat(customLoadInput.value) || 0;
        let customKw = 0;
        
        if (customVal > 0) {
            if (customLoadUnit.value === "kw") {
                customKw = customVal;
            } else { // kVA to kW conversion using standard 0.8 power factor
                customKw = customVal * 0.8;
            }
        }

        const totalLoadKw = applianceSumKw + customKw;
        document.getElementById("calc-total-load").innerText = `${totalLoadKw.toFixed(2)} kW`;

        // Calculate recommended generator capacity:
        // kVA rating = (Load in kW / 0.8 power factor) * 1.2 safety factor (20% margin)
        let neededKva = 0;
        if (totalLoadKw > 0) {
            neededKva = (totalLoadKw / 0.8) * 1.2;
        }

        const recKvaDisplay = document.getElementById("calc-recommended-kva");
        const formKvaDropdown = document.getElementById("form-kva-needed");

        if (neededKva === 0) {
            recKvaDisplay.innerText = "10 kVA";
            if (formKvaDropdown) formKvaDropdown.value = "10";
            updateGauge(0, 8); // Base 10 kVA is 8 kW
            return;
        }

        // Find nearest generator capacity from DB
        let recommendedModel = generatorDatabase[0];
        let found = false;
        
        for (let i = 0; i < generatorDatabase.length; i++) {
            if (generatorDatabase[i].kva >= neededKva) {
                recommendedModel = generatorDatabase[i];
                found = true;
                break;
            }
        }

        if (found) {
            recKvaDisplay.innerText = `${recommendedModel.kva} kVA`;
            recKvaDisplay.style.color = "var(--yellow)";
            if (formKvaDropdown) {
                formKvaDropdown.value = recommendedModel.kva.toString();
            }
            // Update gauge percent relative to the recommended generator's max capacity (kW)
            const capPercent = Math.min(100, (totalLoadKw / recommendedModel.kw) * 100);
            updateGauge(capPercent, recommendedModel.kw);
        } else {
            // Exceeds 250 kVA
            recKvaDisplay.innerText = "Custom (>250 kVA)";
            recKvaDisplay.style.color = "var(--accent)";
            if (formKvaDropdown) {
                formKvaDropdown.value = "250";
            }
            updateGauge(100, 200); // Caps gauge
        }
    }

    // Update gauge offset and percentage overlay
    function updateGauge(percent, maxKw) {
        if (!circle) return;
        const offset = circumference - (percent / 100) * circumference;
        circle.style.strokeDashoffset = offset;
        document.getElementById("gauge-percent").innerText = `${Math.round(percent)}%`;
        
        // Color shifts based on load level
        if (percent > 85) {
            circle.setAttribute("stroke", "var(--accent)");
        } else if (percent > 65) {
            circle.setAttribute("stroke", "var(--yellow)");
        } else {
            circle.setAttribute("stroke", "var(--green)");
        }
    }
}

// --- 7. Form Submission Handler ---
function initQuoteForm() {
    const form = document.getElementById("quote-request-form");
    const successMsg = document.getElementById("quote-success-msg");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Get values
        const name = document.getElementById("form-name").value;
        const phone = document.getElementById("form-phone").value;
        const email = document.getElementById("form-email").value;
        const location = document.getElementById("form-location").value;
        const kva = document.getElementById("form-kva-needed").value;
        const sector = document.getElementById("form-sector").value;
        const message = document.getElementById("form-message").value;

        // Construct new customer inquiry lead object
        const newLead = {
            date: new Date().toLocaleString(),
            name: name,
            phone: phone,
            email: email,
            location: location,
            kva: kva,
            sector: sector,
            message: message || "No custom message provided."
        };

        // Save to browser's Local Storage database safely
        const leads = JSON.parse(SafeStorage.local.getItem("mst_leads") || "[]");
        leads.unshift(newLead); // Add new lead to the beginning of the list
        SafeStorage.local.setItem("mst_leads", JSON.stringify(leads));

        // Mock Submission to Console log
        console.log("--- CUSTOMER INQUIRY SAVED TO DATABASE ---", newLead);

        // Show Success msg
        successMsg.classList.remove("hidden");

        // Update admin table if it is open
        renderLeadsTable();

        // Clear Form inputs after timeout
        setTimeout(() => {
            form.reset();
            successMsg.classList.add("hidden");
            
            // Reset quantities display on load calculator
            const qtyDisplays = document.querySelectorAll(".appliance-item .qty");
            qtyDisplays.forEach(display => display.innerText = "0");
            
            // Reset selected objects
            for (const name in appliancesSelected) {
                appliancesSelected[name].qty = 0;
            }
            
            document.getElementById("calc-total-load").innerText = "0.00 kW";
            document.getElementById("calc-recommended-kva").innerText = "10 kVA";
            document.getElementById("custom-load-input").value = "";
        }, 5000); // 5 seconds display so they have time to click details link
    });
}

// --- 8. Admin Leads Dashboard Controllers ---
function initAdminDashboard() {
    const adminSection = document.getElementById("admin-dashboard");
    const loginOverlay = document.getElementById("admin-login-overlay");
    const protectedContent = document.getElementById("admin-protected-content");
    const passwordInput = document.getElementById("admin-password-input");
    const loginBtn = document.getElementById("btn-admin-login");
    const logoutBtn = document.getElementById("btn-admin-logout");
    const errorMsg = document.getElementById("login-error-msg");
    const clearBtn = document.getElementById("btn-clear-leads");
    const exportBtn = document.getElementById("btn-export-csv");

    const ADMIN_PASSWORD = "MSTadmin2026"; // Secure local dashboard password

    // Listen to hash changes in URL to show/hide the admin panel dynamically
    window.addEventListener("hashchange", checkAdminRoute);
    checkAdminRoute();

    function checkAdminRoute() {
        const hash = window.location.hash;
        if (hash === "#admin" || hash === "#admin-dashboard") {
            adminSection.classList.remove("hidden");
            adminSection.scrollIntoView({ behavior: "smooth" });
            updateAuthView();
        } else {
            adminSection.classList.add("hidden");
        }
    }

    // Toggle views based on session authentication state
    function updateAuthView() {
        const isAuthenticated = SafeStorage.session.getItem("admin_authenticated") === "true";
        if (isAuthenticated) {
            loginOverlay.classList.add("hidden");
            protectedContent.classList.remove("hidden");
            renderLeadsTable();
        } else {
            loginOverlay.classList.remove("hidden");
            protectedContent.classList.add("hidden");
            passwordInput.value = "";
            errorMsg.classList.add("hidden");
        }
    }

    // Handle authentication request
    function handleLogin() {
        const inputPass = passwordInput.value;
        const card = loginOverlay.querySelector(".login-card");
        
        // Case-insensitive password comparison
        if (inputPass && inputPass.trim().toLowerCase() === ADMIN_PASSWORD.toLowerCase()) {
            SafeStorage.session.setItem("admin_authenticated", "true");
            errorMsg.classList.add("hidden");
            updateAuthView();
        } else {
            // Shake card animation and show error
            card.classList.add("shake");
            errorMsg.classList.remove("hidden");
            
            setTimeout(() => {
                card.classList.remove("shake");
            }, 400);
        }
    }

    loginBtn.addEventListener("click", handleLogin);
    
    passwordInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            handleLogin();
        }
    });

    // Handle logout/relock board request
    logoutBtn.addEventListener("click", () => {
        SafeStorage.session.removeItem("admin_authenticated");
        updateAuthView();
    });

    // Button actions
    clearBtn.addEventListener("click", clearAllLeads);
    exportBtn.addEventListener("click", exportLeadsToCSV);
}

// Render data rows in the leads dashboard table
function renderLeadsTable() {
    const tableBody = document.getElementById("leads-table-body");
    const noLeadsNotify = document.getElementById("no-leads-notification");
    const leadsTable = document.getElementById("leads-data-table");
    
    if (!tableBody) return;

    // Get current leads list safely
    const leads = JSON.parse(SafeStorage.local.getItem("mst_leads") || "[]");

    // Clear previous rows
    tableBody.innerHTML = "";

    if (leads.length === 0) {
        noLeadsNotify.classList.remove("hidden");
        leadsTable.classList.add("hidden");
        return;
    }

    noLeadsNotify.classList.add("hidden");
    leadsTable.classList.remove("hidden");

    // Populate rows
    leads.forEach((lead, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><small>${lead.date}</small></td>
            <td><strong>${lead.name}</strong></td>
            <td><a href="tel:${lead.phone}" style="color: var(--primary-light); font-weight: 600;">${lead.phone}</a></td>
            <td><a href="mailto:${lead.email}">${lead.email}</a></td>
            <td>${lead.location}</td>
            <td><span class="badge badge-blue">${lead.kva} kVA</span></td>
            <td><span style="text-transform: capitalize;">${lead.sector}</span></td>
            <td><span style="font-size: 0.85rem; max-width: 200px; display: inline-block; word-wrap: break-word;">${lead.message}</span></td>
            <td>
                <button class="btn-delete-lead" onclick="deleteLead(${index})" title="Remove Inquiry">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

// Global reference functions for click actions
window.deleteLead = function(index) {
    if (confirm("Are you sure you want to delete this customer inquiry?")) {
        const leads = JSON.parse(SafeStorage.local.getItem("mst_leads") || "[]");
        leads.splice(index, 1);
        SafeStorage.local.setItem("mst_leads", JSON.stringify(leads));
        renderLeadsTable();
    }
};

function clearAllLeads() {
    if (confirm("WARNING: Are you sure you want to permanently clear all customer leads? This action cannot be undone.")) {
        SafeStorage.local.removeItem("mst_leads");
        renderLeadsTable();
    }
}

function exportLeadsToCSV() {
    const leads = JSON.parse(SafeStorage.local.getItem("mst_leads") || "[]");
    if (leads.length === 0) {
        alert("There are no leads available to export.");
        return;
    }

    // Build CSV Content
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date Submitted,Customer Name,Phone,Email,Location,kVA Rating,Sector,Message\r\n";

    leads.forEach(lead => {
        const row = [
            `"${lead.date}"`,
            `"${lead.name.replace(/"/g, '""')}"`,
            `"${lead.phone}"`,
            `"${lead.email.replace(/"/g, '""')}"`,
            `"${lead.location.replace(/"/g, '""')}"`,
            `"${lead.kva} kVA"`,
            `"${lead.sector}"`,
            `"${lead.message.replace(/"/g, '""')}"`
        ];
        csvContent += row.join(",") + "\r\n";
    });

    // Create Download Link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `customer_leads_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link); // Required for FF

    link.click();
    document.body.removeChild(link);
}

// --- 9. Scroll Reveal Animations (Intersection Observer) ---
function initScrollReveal() {
    const revealElements = document.querySelectorAll(".scroll-reveal");
    
    if (!revealElements.length) return;

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

// --- 10. Light / Dark Mode Swapper (Removed) ---

// --- 11. Hero Spark Particles Canvas Animation ---
function initSparkParticles() {
    const canvas = document.getElementById("hero-particles-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles = [];
    const maxParticles = 60;

    const mouse = { x: null, y: null, radius: 130 };

    window.addEventListener("resize", () => {
        if (!canvas) return;
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    });

    window.addEventListener("mousemove", (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    window.addEventListener("mouseleave", () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Spark {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.size = Math.random() * 2 + 1;
            
            const colors = [
                "rgba(245, 166, 35, 0.45)",  // Amber Gold
                "rgba(0, 112, 243, 0.4)",    // Electric Royal Blue
                "rgba(0, 180, 216, 0.35)",   // Light Aqua Blue
                "rgba(255, 0, 60, 0.35)"     // Soft Electric Red
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;

            if (mouse.x !== null && mouse.y !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    this.x += Math.cos(angle) * force * 5;
                    this.y += Math.sin(angle) * force * 5;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Spark());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(spark => {
            spark.update();
            spark.draw();
        });

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 85) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    
                    const opacity = (85 - dist) / 85 * 0.12;
                    ctx.strokeStyle = `rgba(0, 112, 243, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}

// --- 12. Monthly Cost & ROI Savings Estimator ---
let lastFuelNeeded = 0;
let lastFuelCost = 0;
let lastAnnualSavings = 0;

function initSavingsEstimator() {
    const hoursSlider = document.getElementById("run-hours-slider");
    
    if (!hoursSlider) return;

    hoursSlider.addEventListener("input", (e) => {
        document.getElementById("run-hours-val").innerText = `${e.target.value} Hours`;
        recalculateSavings();
    });
}

function recalculateSavings() {
    const hoursSlider = document.getElementById("run-hours-slider");
    if (!hoursSlider) return;

    const hours = parseInt(hoursSlider.value);
    const activeGen = generatorDatabase[currentSpecIndex];

    const fuelNeeded = Math.round(activeGen.fuelCons * hours);
    const fuelCost = fuelNeeded * 95;
    const annualSavings = Math.round(fuelCost * 0.15 * 12);

    animateValue("fuel-needed-val", lastFuelNeeded, fuelNeeded, 300, " Litres");
    animateValue("fuel-cost-val", lastFuelCost, fuelCost, 350, "₹ ");
    animateValue("annual-savings-val", lastAnnualSavings, annualSavings, 400, "₹ ");

    lastFuelNeeded = fuelNeeded;
    lastFuelCost = fuelCost;
    lastAnnualSavings = annualSavings;
}

function animateValue(id, start, end, duration, prefixSuffix) {
    const obj = document.getElementById(id);
    if (!obj) return;
    
    if (start === end) {
        if (prefixSuffix.startsWith("₹ ")) {
            obj.innerHTML = `₹ ${end.toLocaleString()}`;
        } else {
            obj.innerHTML = prefixSuffix.endsWith(" Litres") ? `${end}${prefixSuffix}` : `${prefixSuffix}${end}`;
        }
        return;
    }

    const range = end - start;
    let current = start;
    const increment = end > start ? Math.ceil(range / 20) : Math.floor(range / 20);
    const stepTime = Math.abs(Math.floor(duration / 20));
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        
        if (prefixSuffix.startsWith("₹ ")) {
            obj.innerHTML = `₹ ${current.toLocaleString()}`;
        } else if (prefixSuffix.startsWith("₹")) {
            obj.innerHTML = `₹ ${current.toLocaleString()}`;
        } else {
            obj.innerHTML = prefixSuffix.endsWith(" Litres") ? `${current}${prefixSuffix}` : `${prefixSuffix}${current}`;
        }
    }, stepTime);
}
