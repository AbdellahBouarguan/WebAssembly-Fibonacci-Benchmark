# WebAssembly vs JavaScript: Recursive Fibonacci Benchmark

A rigorous, academic-style benchmark comparing the performance of the V8 JavaScript engine (Interpreted/JIT) against an Ahead-of-Time (AOT) compiled WebAssembly module (C). The benchmark evaluates the classic exponential recursive Fibonacci function $\mathcal{O}(2^n)$.

## 📊 Overview

This project was built to empirically demonstrate the computational superiority of WebAssembly for heavy CPU-bound recursive tasks.

**Theoretical Highlights Demonstrated:**
1. **No JIT Warm-up:** The C code is pre-compiled to optimize binary (Wasm) format. It hits peak performance instantly, whereas JavaScript must first be interpreted before being identified as "hot" and optimized by TurboFan.
2. **Static Typing vs. Dynamic Dispatch:** Mathematical operations are purely typed (`int`) in the C/Wasm implementation, avoiding the dynamic type-checking overhead present in standard JavaScript execution.
3. **Stack Management:** Wasm handles the deep execution call stack of the $\mathcal{O}(2^n)$ algorithm with exponentially less memory footprint and traversal overhead than the heavy JavaScript execution context frames.

## ✨ Features

- **Automated Academic Benchmark Suite:** Iterates from $N=22$ to $N=45$ seamlessly.
- **Real-Time Scientific Plotting:** Integrates `Chart.js` to dynamically plot the exponential growth curves.
- **Instant Data Extraction:** Auto-calculates execution time ratios and raw milliseconds into an HTML table.

## 🚀 Setup & Installation (Cross-Platform)

### 1. Prerequisites

To compile the C code, you need **Emscripten** (the C to WebAssembly compiler toolchain).
- **Windows / macOS / Linux:** Ensure you have `git` and `python3` installed.

### 2. Emscripten Toolchain Installation

Using the terminal, clone the `emsdk` repository:

```bash
# Clone the repository
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk

# Download and install the latest SDK tools
./emsdk install latest

# Make the "latest" SDK "active" for the current user
./emsdk activate latest

# Activate PATH and other environment variables in the current terminal
source ./emsdk_env.sh
```
*(On Windows, run `emsdk.bat` and `emsdk_env.bat` instead).*

### 3. Compiling the Project

Clone this project repository and navigate into it:
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

Ensure the Emscripten environment is activated (from step 2), then compile the C code:
```bash
emcc fib.c -O3 -s EXPORTED_FUNCTIONS='["_fib"]' -s EXPORTED_RUNTIME_METHODS='["cwrap"]' -o fib.js
```
*(The `-O3` flag is critical to enable maximum performance optimizations).*

### 4. Running the Benchmark Locally

WebAssembly modules cannot be executed directly from the file system (`file://` protocol) due to browser CORS policies. You must serve the files through a local web server.

**Option A - Using Python (Recommended):**
```bash
python3 -m http.server 8000
```

**Option B - Using Node.js (http-server):**
```bash
npx http-server -p 8000
```

**Option C - Using PHP:**
```bash
php -S localhost:8000
```

Finally, open your browser and navigate to:
[http://localhost:8000](http://localhost:8000)

---
*Created as part of an academic demonstration in Computer Science / Compiler Theory.*
