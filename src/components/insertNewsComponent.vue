<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useCategoryStore } from "../stores/categorys";
import { alerts, showAlert } from "../utils/alerts";
import { useNewsStore } from "../stores/news";
import { useRoute } from "vue-router";
import router from '../router';
const route = useRoute();

const categoryStore = useCategoryStore()
const newsStore = useNewsStore();
/*-----------------------------------------------*/

const isEditMode = ref(false);
const newsId = route.params.id || null;

onMounted(async () => {
  if (newsId) {
    isEditMode.value = true;
    const existingNews = newsStore.newsLis.find(n => n.id === newsId);
    if (existingNews) {
      title.value = existingNews.title;
      content.value = existingNews.content;
      author.value = existingNews.author;
      category.value = existingNews.category;
      subscriptionName.value = existingNews.subscriptionName;
      imagePreview.value = existingNews.imgUrl;
    }
  }
});
/*-----------------------------------------------*/



const title = ref("");
const content = ref("");
const author = ref("");
const category = ref("");
const subscriptionName = ref("");
const publishDate = ref("");
const imageFile = ref(null);
const imagePreview = ref(null);

const titleCount = computed(() => title.value.length);
const wordCount = computed(() => content.value.trim() ? content.value.trim().split(/\s+/).length : 0);
const charCount = computed(() => content.value.length);

const previewTitle = computed(() => title.value || "Título de la noticia aparecerá aquí");
const previewContent = computed(() => content.value || "El contenido de la noticia aparecerá aquí...");
const previewAuthor = computed(() => author.value ? `Por ${author.value}` : "Por Autor");
const previewCategory = computed(() => category.value || "Categoría");
const previewSubscription = computed(() => subscriptionName.value || "Tipo de suscripción");

const ImageData = ref(null);

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  imageFile.value = file;
  ImageData.value = file; // esto es lo que envías al store
  imagePreview.value = URL.createObjectURL(file);
}



onMounted(() => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  publishDate.value = `${year}-${month}-${day}T${hours}:${minutes}`;
});


function validateForm() {
  if (!title.value || !content.value || !author.value || !category.value || !subscriptionName.value) {
    showAlert("Por favor, completa todos los campos obligatorios.","error");
    return false;
  }
  if (title.value.length < 5) {
    showAlert("El título debe tener al menos 5 caracteres.","error");
    return false;
  }
  if (content.value.length < 20) {
    showAlert("El contenido debe tener al menos 20 caracteres.","error");
    return false;
  }
  if (author.value.length < 3) {
    showAlert("El nombre del autor debe tener al menos 3 caracteres.","error");
    return false;
  }
  return true;
}



async function handleSubmit() {
  if (!validateForm()) return;

  try {
    const responseInsertNews = await newsStore.insertNews(
      title.value,
      content.value,
      author.value,
      category.value,
      subscriptionName.value,
      imageFile.value // aquí envías el File
    );
    showAlert("¡Noticia publicada correctamente!", "success");

    // Limpiar formulario si quieres
    title.value = "";
    content.value = "";
    author.value = "";
    category.value = "";
    subscriptionName.value = "";
    imageFile.value = null;
    imagePreview.value = null;
    setTimeout(async() => {
     await router.push({ name: 'admin' })
    }, 1500)
  } catch (error) {
    console.error("Error al insertar la noticia:", error);
    showAlert("Error al publicar la noticia", "error");
  }
}

//-------------------------------------------------
async function handleUpdate() {
  try {
    await newsStore.updateNew(
      newsId,
      title.value,
      content.value,
      author.value,
      category.value,
      subscriptionName.value,
      imageFile.value
    );
    showAlert("Noticia actualizada correctamente", "success");
    title.value = "";
    content.value = "";
    author.value = "";
    category.value = "";
    subscriptionName.value = "";
    imageFile.value = null;
    imagePreview.value = null;
      setTimeout(async() => {
     await router.push({ name: 'admin' })
    }, 1500)
  } catch (error) {
    showAlert("Error al actualizar la noticia", "error");
  }
}


</script>

<template>
  <div class="container">
    <!-- ALERTAS -->
<div v-if="alerts.length" id="alerts-container" class="alerts">
  <p v-for="(alert, i) in alerts" :key="i" :class="alert.type">{{ alert.msg }}</p>
</div>

    <div class="news-card">
      <div class="card-header">
        <div class="header-icon">
          <v-icon icon="mdi-newspaper"></v-icon>
        </div>
        <h1>Ingresar Nueva Noticia</h1>
        <p class="header-subtitle">
          Completa todos los campos para publicar una nueva noticia en la plataforma
        </p>
      </div>

      <div class="publish-stats">
        <div class="stat-item">
          <v-icon icon="mdi-file-document-outline"></v-icon>
          <div class="stat-info">
            <span class="stat-number">{{ wordCount }}</span>
            <span class="stat-label">Palabras</span>
          </div>
        </div>
        <div class="stat-item">
          <v-icon icon="mdi-clock-outline"></v-icon>
          <div class="stat-info">
            <span class="stat-number">{{ charCount }}</span>
            <span class="stat-label">Caracteres</span>
          </div>
        </div>
        <div class="stat-item">
          <v-icon icon="mdi-layers-triple"></v-icon>
          <div class="stat-info">
            <span class="stat-number">{{ categoryStore.categories.length }}</span>
            <span class="stat-label">Categorías</span>
          </div>
        </div>
      </div>

      <form class="news-form" @submit.prevent="isEditMode ? handleUpdate() : handleSubmit()">
        <div class="form-grid">
          <div class="form-group full-width">
            <label for="title">
              <v-icon icon="mdi-format-title"></v-icon> Título de la Noticia <span class="required">*</span>
            </label>
            <div class="input-wrapper">
              <input
                v-model="title"
                type="text"
                id="title"
                required
                placeholder="Ingresa un título llamativo y descriptivo"
                class="form-input"
                maxlength="200"
              />
              <div class="input-icon"><v-icon icon="mdi-format-title"></v-icon></div>
              <div class="char-counter"><span>{{ titleCount }}</span>/200</div>
            </div>
            <span class="helper-text">Máximo 200 caracteres. Sé claro y conciso</span>
          </div>

          <div class="form-group full-width">
            <label for="content">
              <v-icon icon="mdi-format-align-left"></v-icon> Contenido de la Noticia <span class="required">*</span>
            </label>
            <div class="textarea-wrapper">
              <textarea
                v-model="content"
                id="content"
                rows="8"
                required
                placeholder="Escribe el contenido completo de la noticia aquí..."
                class="form-textarea"
              ></textarea>
              <div class="textarea-icon"><v-icon icon="mdi-format-align-left"></v-icon></div>
            </div>
            <div class="content-stats">
              <span class="words-counter">
                <v-icon icon="mdi-format-font"></v-icon> {{ wordCount }} palabras
              </span>
              <span class="chars-counter">
                <v-icon icon="mdi-format-text-rotation-none"></v-icon> {{ charCount }} caracteres
              </span>
            </div>
            <span class="helper-text">Escribe un contenido bien estructurado y verificado</span>
          </div>

          <div class="form-group">
            <label for="author">
              <v-icon icon="mdi-account-edit"></v-icon> Autor <span class="required">*</span>
            </label>
            <div class="input-wrapper">
              <input
                v-model="author"
                type="text"
                id="author"
                required
                placeholder="Nombre del autor"
                class="form-input"
              />
              <div class="input-icon"><v-icon icon="mdi-account-edit"></v-icon></div>
            </div>
            <span class="helper-text">Nombre completo del periodista o autor</span>
          </div>

          <div class="form-group">
            <label for="category">
              <v-icon icon="mdi-tag-multiple"></v-icon> Categoría <span class="required">*</span>
            </label>
            <div class="select-wrapper">
              <select v-model="category" id="category" required class="form-select">
                <option value="" disabled>Selecciona una categoría</option>
                <option v-for="c in categoryStore.categories" :key="c" :value="c">{{ c }}</option>
              </select>
              <div class="select-icon"><v-icon icon="mdi-tag-multiple"></v-icon></div>
            </div>
            <span class="helper-text">Selecciona la categoría más apropiada</span>
          </div>

          <div class="form-group">
            <label for="subscriptionName">
              <v-icon icon="mdi-crown"></v-icon> Tipo de Suscripción <span class="required">*</span>
            </label>
            <div class="select-wrapper">
              <select v-model="subscriptionName" id="subscriptionName" required class="form-select">
                <option value="" disabled>Selecciona una suscripción</option>
                <option value="FREE">FREE - Acceso público</option>
                <option value="TITULAR">TITULAR - Suscripción básica</option>
                <option value="REDACCIONPlus">REDACCIÓN Plus - Suscripción premium</option>
                <option value="INSIDER">INSIDER - Acceso exclusivo</option>
              </select>
              <div class="select-icon"><v-icon icon="mdi-hand-pointing-down"></v-icon></div>
            </div>
            <span class="helper-text">Define quién puede leer esta noticia</span>
          </div>

          <div class="form-group">
            <label for="publishDate">
              <v-icon icon="mdi-calendar"></v-icon> Fecha de Publicación
            </label>
            <div class="input-wrapper">
              <input v-model="publishDate" type="datetime-local" id="publishDate" class="form-input" />
              <div class="input-icon"><v-icon icon="mdi-calendar"></v-icon></div>
            </div>
            <span class="helper-text">Dejar en blanco para publicar ahora</span>
          </div>

          <div class="form-group full-width">
            <label for="image">
              <v-icon icon="mdi-image"></v-icon> Imagen de la Noticia
            </label>
            <div class="input-wrapper">
              <input type="file" id="image" accept="image/*" class="form-input" @change="handleImageUpload" />
              <div class="input-icon"><v-icon icon="mdi-upload-box"></v-icon></div>
            </div>
            <span class="helper-text">Sube una imagen representativa para la noticia</span>
          </div>
        </div>

        <div class="preview-section">
          <h3><v-icon icon="mdi-eye"></v-icon> Vista Previa</h3>
          <div class="news-preview">
            <div class="preview-header">
              <span class="preview-category">{{ previewCategory }}</span>
              <h4 class="preview-title">{{ previewTitle }}</h4>
            </div>
            <div class="preview-content">
              <img v-if="imagePreview" :src="imagePreview" alt="Vista previa" class="preview-image" />
              <p class="preview-text">{{ previewContent }}</p>
            </div>
            <div class="preview-footer">
              <span class="preview-author">{{ previewAuthor }}</span>
              <span class="preview-subscription">{{ previewSubscription }}</span>
            </div>
          </div>
        </div>

        <div class="form-actions">
<button v-if="!isEditMode" type="submit" class="submit-btn">
  <v-icon icon="mdi-send"></v-icon> Publicar Noticia
</button>

<button v-else type="submit" class="submit-btn edit">
    <v-icon icon="mdi-pencil"></v-icon> Actualizar Noticia
  </button>


          <RouterLink to="/admin" class="back-button">
            <v-icon icon="mdi-arrow-left"></v-icon>
            <span>Volver al Panel</span>
          </RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.container {
    max-width: 1200px;
    margin: 0 auto;
}
.preview-image {
  width: 100%;
  max-height: 250px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
}
/* NEWS CARD */
.news-card {
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--border);
    overflow: hidden;
    animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.card-header {
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    color: white;
    padding: 2.5rem 2rem;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.card-header::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    animation: rotate 20s linear infinite;
}

@keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.header-icon {
    width: 80px;
    height: 80px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
    backdrop-filter: blur(10px);
}

.header-icon i {
    font-size: 2.5rem;
    color: white;
}

.card-header h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
}

.header-subtitle {
    font-size: 1.1rem;
    opacity: 0.9;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
}

/* PUBLISH STATS */
.publish-stats {
    display: flex;
    justify-content: center;
    gap: 2rem;
    padding: 1.5rem;
    background: linear-gradient(135deg, rgba(30, 58, 138, 0.03), rgba(37, 99, 235, 0.03));
    border-bottom: 1px solid var(--border);
    flex-wrap: wrap;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
    transition: var(--transition);
    
}

.stat-item:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
}

.stat-item i {
    font-size: 1.5rem;
    color: var(--accent);
    background: rgba(59, 130, 246, 0.1);
    padding: 0.8rem;
    border-radius: 50%;
}

.stat-info {
    display: flex;
    flex-direction: column;
}

.stat-number {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary-dark);
}

.stat-label {
    font-size: 0.85rem;
    color: var(--text-light);
    font-weight: 500;
}

/* FORM STYLES */
.news-form {
    padding: 2rem;
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
}

.form-group.full-width {
    grid-column: 1 / -1;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group label {
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.8rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.form-group label i {
    color: var(--accent);
}

.required {
    color: var(--danger);
    font-size: 1.2rem;
}

/* INPUT STYLES */
.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.form-input {
    width: 100%;
    padding: 1.2rem 1.2rem 1.2rem 3.5rem;
    border: 2px solid var(--border);
    border-radius: var(--radius-md);
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    transition: var(--transition);
    background: var(--bg-secondary);
}

.form-input:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-icon {
    position: absolute;
    left: 1.2rem;
    color: var(--text-light);
    font-size: 1.2rem;
}

.char-counter {
    position: absolute;
    right: 1.2rem;
    color: var(--text-light);
    font-size: 0.85rem;
    background: rgba(255, 255, 255, 0.8);
    padding: 0.2rem 0.5rem;
    border-radius: var(--radius-sm);
}

/* TEXTAREA STYLES */
.textarea-wrapper {
    position: relative;
}

.form-textarea {
    width: 100%;
    padding: 1.2rem 1.2rem 1.2rem 3.5rem;
    border: 2px solid var(--border);
    border-radius: var(--radius-md);
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    transition: var(--transition);
    background: var(--bg-secondary);
    resize: vertical;
    min-height: 150px;
}

.form-textarea:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.textarea-icon {
    position: absolute;
    left: 1.2rem;
    top: 1.2rem;
    color: var(--text-light);
    font-size: 1.2rem;
}

.content-stats {
    display: flex;
    justify-content: space-between;
    margin-top: 0.5rem;
    font-size: 0.85rem;
    color: var(--text-light);
}

.content-stats i {
    margin-right: 0.3rem;
}

/* SELECT STYLES */
.select-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.form-select {
    width: 100%;
    padding: 1.2rem 3rem 1.2rem 3.5rem;
    border: 2px solid var(--border);
    border-radius: var(--radius-md);
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    transition: var(--transition);
    background: var(--bg-secondary);
    appearance: none;
    cursor: pointer;
}

.form-select:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.select-icon {
    position: absolute;
    right: 1.2rem;
    color: var(--text-light);
    font-size: 1rem;
    pointer-events: none;
}

/* HELPER TEXT */
.helper-text {
    font-size: 0.85rem;
    color: var(--text-light);
    margin-top: 0.5rem;
    font-style: italic;
}

/* PREVIEW SECTION */
.preview-section {
    margin: 2rem 0;
    padding: 2rem;
    background: linear-gradient(135deg, rgba(30, 58, 138, 0.02), rgba(37, 99, 235, 0.02));
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
}

.preview-section h3 {
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--primary-dark);
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.8rem;
}

.preview-section h3 i {
    color: var(--accent);
}

.news-preview {
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
    padding: 1.5rem;
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
}

.preview-header {
    margin-bottom: 1rem;
}

.preview-category {
    background: linear-gradient(135deg, var(--accent), #60a5fa);
    color: white;
    padding: 0.3rem 0.8rem;
    border-radius: 999px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: inline-block;
    margin-bottom: 0.8rem;
}

.preview-title {
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--primary-dark);
    line-height: 1.3;
    margin: 0;
}

.preview-content {
    margin: 1.5rem 0;
}

.preview-text {
    color: var(--text-secondary);
    line-height: 1.6;
    margin: 0;
}

.preview-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1rem;
    border-top: 1px solid var(--border);
    font-size: 0.9rem;
}

.preview-author {
    color: var(--text-secondary);
    font-weight: 500;
}

.preview-subscription {
    background: linear-gradient(135deg, var(--warning), #f97316);
    color: white;
    padding: 0.2rem 0.6rem;
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    font-weight: 600;
}

/* FORM ACTIONS */
.form-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    padding-top: 2rem;
    border-top: 1px solid var(--border);
}

.submit-btn {
    background: var(--gradient-primary);
    color: white;
    padding: 1.2rem 2.5rem;
    border: none;
    border-radius: var(--radius-md);
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    font-size: 1.1rem;
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
    padding: 1.2rem 2.5rem;
    border: 2px solid var(--border);
    border-radius: var(--radius-md);
    text-decoration: none;
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    font-size: 1.1rem;
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
    
    .publish-stats {
        gap: 1rem;
    }
    
    .stat-item {
        padding: 0.8rem;
    }
    
    .stat-number {
        font-size: 1.2rem;
    }
}

@media (max-width: 768px) {
    body {
        padding: 1rem;
    }
    
    .news-card {
        margin: 1rem;
    }
    
    .card-header {
        padding: 2rem 1.5rem;
    }
    
    .card-header h1 {
        font-size: 1.8rem;
    }
    
    .header-subtitle {
        font-size: 1rem;
    }
    
    .publish-stats {
        flex-direction: column;
        align-items: center;
    }
    
    .news-form {
        padding: 1.5rem;
    }
    
    .form-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
    
    .form-input,
    .form-textarea,
    .form-select {
        padding: 1rem 1rem 1rem 3rem;
    }
    
    .input-icon,
    .textarea-icon {
        left: 1rem;
        font-size: 1rem;
    }
    
    .form-select {
        padding-right: 2.5rem;
    }
    
    .select-icon {
        right: 1rem;
    }
    
    .char-counter {
        right: 1rem;
        font-size: 0.8rem;
    }
    
    .preview-footer {
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;
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
    
    .news-card {
        margin: 0.5rem;
        border-radius: var(--radius-md);
    }
    
    .card-header {
        padding: 1.5rem 1rem;
    }
    
    .card-header h1 {
        font-size: 1.5rem;
    }
    
    .header-icon {
        width: 60px;
        height: 60px;
    }
    
    .header-icon i {
        font-size: 2rem;
    }
    
    .stat-item {
        width: 100%;
        justify-content: center;
    }
    
    .news-form {
        padding: 1rem;
    }
    
    .preview-section {
        padding: 1rem;
    }
    
    .preview-title {
        font-size: 1.2rem;
    }
    
    .submit-btn,
    .back-button {
        padding: 1rem 1.5rem;
        font-size: 1rem;
    }
}

/* ANIMACIONES ADICIONALES */
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.form-input:invalid:not(:focus):not(:placeholder-shown),
.form-textarea:invalid:not(:focus):not(:placeholder-shown),
.form-select:invalid:not(:focus) {
    border-color: var(--danger);
    animation: shake 0.5s ease-in-out;
}

.form-input:valid,
.form-textarea:valid,
.form-select:valid {
    border-color: var(--success);
}

/* PULSE ANIMATION */
@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

.header-icon {
    animation: pulse 2s infinite;
}

</style>
