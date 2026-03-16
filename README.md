# WebAssembly vs JavaScript : Benchmark de Fibonacci Récursif

Un benchmark rigoureux et académique comparant les performances du moteur JavaScript V8 (Interprété/JIT) face à un module WebAssembly (C) compilé à l'avance (AOT). Le benchmark évalue la fonction récursive exponentielle classique de Fibonacci $\mathcal{O}(2^n)$.

## 📊 Aperçu

Ce projet a été conçu pour démontrer empiriquement la supériorité computationnelle de WebAssembly pour les tâches récursives intensives liées au processeur (CPU-bound).

**Points Théoriques Démontrés :**
1. **Pas d'échauffement JIT (No JIT Warm-up) :** Le code C est pré-compilé pour optimiser le format binaire (Wasm). Il atteint des performances maximales instantanément, tandis que JavaScript doit d'abord être interprété avant d'être identifié comme "chaud" (hot) et optimisé par TurboFan.
2. **Typage statique vs Distribution dynamique :** Les opérations mathématiques sont purement typées (`int`) dans l'implémentation C/Wasm, évitant ainsi la surcharge de vérification dynamique des types présente dans l'exécution JavaScript standard.
3. **Gestion de la pile (Stack Management) :** Wasm gère la pile d'appels d'exécution profonde de l'algorithme $\mathcal{O}(2^n)$ avec une empreinte mémoire et une surcharge de parcours exponentiellement moindres par rapport aux lourdes trames de contexte d'exécution JavaScript.

## ✨ Fonctionnalités

- **Suite de Benchmarks Académiques Automatisée :** Itère de $N=22$ à $N=45$ de manière fluide.
- **Tracé Scientifique en Temps Réel :** Intègre `Chart.js` pour tracer dynamiquement les courbes de croissance exponentielle.
- **Extraction Instantanée des Données :** Calcule automatiquement les ratios de temps d'exécution et les millisecondes brutes dans un tableau HTML.

## 🚀 Configuration & Installation (Multiplateforme)

### 1. Prérequis

Pour compiler le code C, vous avez besoin de **Emscripten** (la chaîne d'outils de compilation C vers WebAssembly).
- **Windows / macOS / Linux :** Assurez-vous d'avoir `git` et `python3` installés.

### 2. Installation de la Chaîne d'outils Emscripten

À l'aide du terminal, clonez le dépôt `emsdk` :

```bash
# Cloner le dépôt
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk

# Télécharger et installer les derniers outils du SDK
./emsdk install latest

# Rendre le SDK "latest" (le plus récent) "actif" pour l'utilisateur actuel
./emsdk activate latest

# Activer le PATH et d'autres variables d'environnement dans le terminal actuel
source ./emsdk_env.sh
```
*(Sous Windows, exécutez `emsdk.bat` et `emsdk_env.bat` à la place).*

### 3. Compilation du Projet

Clonez le dépôt de ce projet et naviguez dedans :
```bash
git clone https://github.com/AbdellahBouarguan/WebAssembly-Fibonacci-Benchmark.git
cd WebAssembly-Fibonacci-Benchmark
```

Assurez-vous que l'environnement Emscripten est activé (depuis l'étape 2), puis compilez le code C :
```bash
emcc fib.c -O3 -s EXPORTED_FUNCTIONS='["_fib"]' -s EXPORTED_RUNTIME_METHODS='["cwrap"]' -o fib.js
```
*(L'indicateur `-O3` est essentiel pour activer les optimisations de performances maximales).*

### 4. Lancement du Benchmark en Local

Les modules WebAssembly ne peuvent pas être exécutés directement depuis le système de fichiers (protocole `file://`) en raison des politiques CORS du navigateur. Vous devez servir les fichiers via un serveur web local.

**Option A - Utilisation de Python (Recommandée) :**
```bash
python3 -m http.server 8000
```

**Option B - Utilisation de Node.js (http-server) :**
```bash
npx http-server -p 8000
```

**Option C - Utilisation de PHP :**
```bash
php -S localhost:8000
```

Enfin, ouvrez votre navigateur et accédez à :
[http://localhost:8000](http://localhost:8000)

---
*Créé dans le cadre d'une démonstration académique en Informatique / Théorie de la Compilation.*
