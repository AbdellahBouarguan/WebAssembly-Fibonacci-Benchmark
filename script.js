// Configuration
const N_START = 22;
const N_END = 45;

let fibWasm = null;

// The JS version of recursive fibonacci
function fibJS(n) {
    if (n <= 1) return n;
    return fibJS(n - 1) + fibJS(n - 2);
}

// Elements
const btnRunSuite = document.getElementById('btn-runSuite');
const progressBar = document.getElementById('progress-bar');
const statusText = document.getElementById('status-text');
const resultsBody = document.getElementById('results-body');
const ctx = document.getElementById('perfChart').getContext('2d');

let chartInstance = null;

// Setup Chart
function initChart() {
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], // N values
            datasets: [
                {
                    label: 'JavaScript (V8)',
                    data: [],
                    borderColor: '#f59f00',
                    backgroundColor: 'rgba(245, 159, 0, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'WebAssembly (AOT C)',
                    data: [],
                    borderColor: '#4c6ef5',
                    backgroundColor: 'rgba(76, 110, 245, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Execution Time vs N (Recursive Fibonacci)',
                    font: { size: 16, family: 'Roboto' }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function (context) {
                            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)} ms`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: { display: true, text: 'N (Fibonacci Sequence Index)', font: { weight: 'bold' } }
                },
                y: {
                    title: { display: true, text: 'Time (ms)', font: { weight: 'bold' } },
                    beginAtZero: true
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

// Wait for Emscripten runtime to initialize
if (typeof Module !== 'undefined') {
    Module.onRuntimeInitialized = () => {
        fibWasm = Module.cwrap('fib', 'number', ['number']);
        btnRunSuite.textContent = `Run Benchmark Suite (N=${N_START} to ${N_END})`;
        btnRunSuite.disabled = false;
    };
} else {
    window.addEventListener('load', () => {
        if (typeof Module === 'undefined') {
            btnRunSuite.textContent = 'Wasm Load Failed';
            statusText.textContent = 'Error: Emscripten Module (fib.js) is not defined.';
        }
    });
}

// Async delay to let UI render
function yieldToUI() {
    return new Promise(resolve => setTimeout(resolve, 20)); // Small delay
}

async function runBenchmarkSuite() {
    btnRunSuite.disabled = true;
    resultsBody.innerHTML = ''; // Selectively clear table if run again

    if (!chartInstance) initChart();

    // Reset Data
    chartInstance.data.labels = [];
    chartInstance.data.datasets[0].data = []; // JS
    chartInstance.data.datasets[1].data = []; // WASM
    chartInstance.update();

    const totalSteps = N_END - N_START + 1;
    let currentStep = 0;

    // Loop through N
    for (let n = N_START; n <= N_END; n++) {
        statusText.textContent = `Computing N=${n} ... (Warming up memory lines)`;
        await yieldToUI();

        // JS Measurement
        let jStart = performance.now();
        fibJS(n);
        let jEnd = performance.now();
        let jsTime = jEnd - jStart;

        // Wasm Measurement
        let wStart = performance.now();
        fibWasm(n);
        let wEnd = performance.now();
        let wasmTime = wEnd - wStart;

        // Ensure we don't divide by zero
        let ratio = wasmTime > 0 ? (jsTime / wasmTime).toFixed(2) : "∞";

        // Update arrays
        chartInstance.data.labels.push(n);
        chartInstance.data.datasets[0].data.push(jsTime);
        chartInstance.data.datasets[1].data.push(wasmTime);
        chartInstance.update();

        // Update Progress
        currentStep++;
        let percent = (currentStep / totalSteps) * 100;
        progressBar.style.width = `${percent}%`;

        // We specifically add entries to the table for select N values (e.g., jumps of 2, plus the final N) to keep table readable
        if (n % 2 === 0 || n === N_END) {
            let tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${n}</td>
                <td style="color: #d9480f">${jsTime.toFixed(2)}</td>
                <td style="color: #364fc7">${wasmTime.toFixed(2)}</td>
                <td><b>${ratio}x</b></td>
            `;
            resultsBody.appendChild(tr);
        }

        statusText.textContent = `Finished N=${n}. JS: ${jsTime.toFixed(0)}ms | Wasm: ${wasmTime.toFixed(0)}ms`;
        await yieldToUI();
    }

    statusText.textContent = `Benchmark Complete. N=${N_START} to ${N_END} finished.`;
    btnRunSuite.disabled = false;
}

btnRunSuite.addEventListener('click', runBenchmarkSuite);
// Init chart early for visual scaffolding
window.addEventListener('load', () => {
    initChart();
});
