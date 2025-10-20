<script setup>
import { useRouter } from "vue-router";
import { useCategoryStore } from "../stores/categorys";
import { useUserStore } from "../stores/user";
import { ref } from "vue";
import { alerts, showAlert } from "../utils/alerts";


const categoryStore = useCategoryStore()
const router = useRouter();
const userStore = useUserStore()    

// Función para mostrar alerta temporal


async function guardarCategorias() {
  if (categoryStore.selected.length === 0) {
    showAlert("Por favor, selecciona al menos una categoría.","error");
    return;
  }

  try {
    await userStore.choseCategories();
    showAlert(`¡Perfecto! Has seleccionado ${categoryStore.selected.length} categorías.`,"success");
    router.push("/user");
  } catch (error) {
    showAlert("Error al guardar tus categorías.","error");
    console.error(error);
  }
}



</script>

<template>
  <div class="container">
    <header class="page-header">
      <div class="header-content">
        <h1><v-icon icon="mdi-tag"></v-icon> Selecciona tus Categorías Favoritas</h1>
<div v-if="alerts.length" id="alerts-container" class="alerts">
  <p v-for="(alert, i) in alerts" :key="i" :class="alert.type">{{ alert.msg }}</p>
</div>

        <p class="header-subtitle">
          Elige las categorías de noticias que más te interesan para personalizar tu experiencia
        </p>
      </div>
      <div class="header-stats">
        <div class="stat-card">
          <v-icon icon="mdi-layers-edit"></v-icon>
          <div class="stat-info">
            <span class="stat-number">{{ categoryStore.categories.length }}</span>
            <span class="stat-label">Categorías Totales</span>
          </div>
        </div>
        <div class="stat-card">
          <v-icon icon="mdi-check-circle"></v-icon>
          <div class="stat-info">
            <span class="stat-number">{{ categoryStore.selected.length }}</span>
            <span class="stat-label">Seleccionadas</span>
          </div>
        </div>
      </div>
    </header>

    <main class="main-content">
      <div class="categories-section">
        <div class="section-header">
          <h2><v-icon icon="mdi-clipboard-list-outline"></v-icon> Categorías Disponibles</h2>
          <p>Selecciona al menos una categoría para continuar</p>
        </div>

        <div v-if="categoryStore.categories.length" class="categories-grid">
          <div
            v-for="category in categoryStore.categories"
            :key="category"
            class="category-card"
            :class="{ selected: categoryStore.selected.includes(category) }"
          >
<input
  type="checkbox"
  class="category-checkbox"
  :id="`cat__${category}`"
  :value="category"
  v-model="categoryStore.selected"
/>
            <label :for="`cat__${category}`" class="category-label">
              <div class="category-icon">
                <v-icon icon="mdi-tag"></v-icon>
              </div>
              <div class="category-info">
                <span class="category-name">{{ category }}</span>
                <span class="category-description">
                  Noticias relacionadas con {{ category }}
                </span>
              </div>
              <div class="category-check">
                <v-icon icon="mdi-check"></v-icon>
              </div>
            </label>
          </div>
        </div>

        <div v-else class="no-categories">
          <div class="no-categories-content">
            <v-icon icon="mdi-tag"></v-icon>
            <h3>No hay categorías disponibles</h3>
            <p>En este momento no hay categorías para seleccionar.</p>
          </div>
        </div>

        <div class="form-actions">
          <button @click="guardarCategorias" type="button" class="submit-btn">
            <v-icon icon="mdi-content-save-check"></v-icon>
            <span>Guardar Selección</span>
          </button>
          <RouterLink to="/user" class="back-button">
            <v-icon icon="mdi-arrow-left"></v-icon>
            <span>Volver</span>
          </RouterLink>
        </div>
      </div>
    </main>
  </div>
</template>

<style>


.container {
    max-width: 1200px;
    margin: 0 auto;
}


@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(-20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}


/* HEADER */
.page-header {
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--border);
    position: relative;
    overflow: hidden;
}

.page-header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: var(--gradient-primary);
}

.header-content h1 {
    font-size: 2.2rem;
    font-weight: 700;
    color: var(--primary-dark);
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
}

.header-content h1 i {
    color: var(--accent);
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
}

.header-subtitle {
    font-size: 1.1rem;
    color: var(--text-secondary);
    margin-bottom: 2rem;
    line-height: 1.6;
}

.header-stats {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
}

.stat-card {
    background: linear-gradient(135deg, rgba(30, 58, 138, 0.05), rgba(37, 99, 235, 0.05));
    border: 1px solid rgba(59, 130, 246, 0.2);
    border-radius: var(--radius-md);
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: var(--transition);
}

.stat-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
    border-color: var(--accent);
}

.stat-card i {
    font-size: 2rem;
    color: var(--accent);
    background: rgba(59, 130, 246, 0.1);
    padding: 1rem;
    border-radius: 50%;
}

.stat-info {
    display: flex;
    flex-direction: column;
}

.stat-number {
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary-dark);
}

.stat-label {
    font-size: 0.9rem;
    color: var(--text-secondary);
    font-weight: 500;
}

/* MAIN CONTENT */
.main-content {
    margin-bottom: 3rem;
}

/* SECTIONS */
.categories-section {
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    border: 1px solid var(--border);
    overflow: hidden;
}

.section-header {
    padding: 2rem;
    border-bottom: 1px solid var(--border);
    text-align: center;
}

.section-header h2 {
    font-size: 1.8rem;
    font-weight: 600;
    color: var(--primary-dark);
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
}

.section-header h2 i {
    color: var(--accent);
}

.section-header p {
    color: var(--text-secondary);
    font-size: 1rem;
}

/* CATEGORIES GRID */
.categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    padding: 2rem;
}

.category-card {
    position: relative;
    transition: var(--transition);
}

.category-checkbox {
    position: absolute;
    opacity: 0;
    pointer-events: none;
}

.category-label {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background: var(--bg-secondary);
    border: 2px solid var(--border);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: var(--transition);
    position: relative;
    overflow: hidden;
}

.category-label:hover {
    border-color: var(--accent);
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
}

.category-label::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(59, 130, 246, 0.02));
    opacity: 0;
    transition: var(--transition);
}

.category-label:hover::before {
    opacity: 1;
}

.category-icon {
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.category-icon i {
    color: white;
    font-size: 1.2rem;
}

.category-info {
    flex: 1;
}

.category-name {
    font-weight: 600;
    color: var(--text-primary);
    font-size: 1.1rem;
    display: block;
    margin-bottom: 0.3rem;
}

.category-description {
    font-size: 0.85rem;
    color: var(--text-light);
    display: block;
}

.category-check {
    width: 24px;
    height: 24px;
    border: 2px solid var(--border);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
    flex-shrink: 0;
}

.category-check i {
    color: var(--success);
    font-size: 0.8rem;
    opacity: 0;
    transform: scale(0);
    transition: var(--transition);
}

/* ESTADO SELECCIONADO */
.category-card.selected .category-label {
    border-color: var(--success);
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(16, 185, 129, 0.02));
}

.category-card.selected .category-check {
    background: var(--success);
    border-color: var(--success);
}

.category-card.selected .category-check i {
    opacity: 1;
    transform: scale(1);
}

.category-card.selected .category-label::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05));
}

/* NO CATEGORIES STATE */
.no-categories {
    padding: 4rem 2rem;
    text-align: center;
}

.no-categories-content {
    max-width: 400px;
    margin: 0 auto;
}

.no-categories-content i {
    font-size: 4rem;
    color: var(--text-light);
    margin-bottom: 1.5rem;
    opacity: 0.5;
}

.no-categories-content h3 {
    font-size: 1.8rem;
    color: var(--text-secondary);
    margin-bottom: 1rem;
}

.no-categories-content p {
    color: var(--text-light);
    font-size: 1.1rem;
    line-height: 1.6;
}

/* FORM ACTIONS */
.form-actions {
    padding: 2rem;
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
}

.submit-btn {
    background: var(--gradient-primary);
    color: white;
    padding: 1rem 2rem;
    border: none;
    border-radius: var(--radius-md);
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    transition: var(--transition);
    box-shadow: var(--shadow-md);
}

.submit-btn:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-lg);
}

.submit-btn:active {
    transform: translateY(-1px);
}

.back-button {
    background: var(--bg-secondary);
    color: var(--text-primary);
    padding: 1rem 2rem;
    border: 2px solid var(--border);
    border-radius: var(--radius-md);
    text-decoration: none;
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    transition: var(--transition);
}

.back-button:hover {
    transform: translateY(-2px);
    border-color: var(--accent);
    box-shadow: var(--shadow-sm);
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(59, 130, 246, 0.02));
}

/* RESPONSIVE DESIGN */
@media (max-width: 1024px) {
    body {
        padding: 1.5rem;
    }
    
    .header-stats {
        gap: 1.5rem;
    }
    
    .categories-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.2rem;
        padding: 1.5rem;
    }
}

@media (max-width: 768px) {
    body {
        padding: 1rem;
    }
    
    .page-header {
        padding: 1.5rem;
    }
    
    .header-content h1 {
        font-size: 1.8rem;
        flex-direction: column;
        text-align: center;
        gap: 0.5rem;
    }
    
    .header-stats {
        flex-direction: column;
    }
    
    .section-header {
        padding: 1.5rem;
    }
    
    .section-header h2 {
        font-size: 1.5rem;
    }
    
    .categories-grid {
        grid-template-columns: 1fr;
        padding: 1.5rem;
    }
    
    .form-actions {
        flex-direction: column;
        text-align: center;
    }
    
    .submit-btn,
    .back-button {
        width: 100%;
        justify-content: center;
    }
}

@media (max-width: 480px) {
    body {
        padding: 0.8rem;
    }
    
    .page-header {
        padding: 1.2rem;
    }
    
    .header-content h1 {
        font-size: 1.5rem;
    }
    
    .stat-number {
        font-size: 1.5rem;
    }
    
    .category-label {
        padding: 1.2rem;
        flex-direction: column;
        text-align: center;
    }
    
    .category-info {
        order: 3;
    }
    
    .category-name {
        font-size: 1rem;
    }
}

/* ANIMACIONES ADICIONALES */
@keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
}

.category-card.selected .category-icon {
    animation: bounce 0.6s ease;
}
</style>