<script setup>
import { computed, onMounted } from 'vue';
import { useNewsStore } from '../stores/news';
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const newsStore = useNewsStore();
onMounted(() => {
  newsStore.fetchNews();
});

const noticias = computed(() => newsStore.getNews(userStore.user.categorys || []));
const newsCount = computed(() => newsStore.newsLis.length);



</script>
<template>
    <div>
            <!-- HERO SECTION -->
    <section class="hero-section">
    <div class="hero-content">
      <p class="hero-subtitle">
        Noticias actualizadas y confiables para mantenerte siempre informado
      </p>
      <div class="hero-stats">
        <div class="stat-item">
          <v-icon icon="mdi-newspaper"></v-icon>
          <span class="stat-number">{{ newsCount }}</span>
          <span class="stat-label">Noticias</span>
        </div>
        <div class="stat-item">
          <v-icon icon="mdi-newspaper"></v-icon>
          <span class="stat-number">10K+</span>
          <span class="stat-label">Lectores</span>
        </div>
        <div class="stat-item">
          <v-icon icon="mdi-sync"></v-icon>
          <span class="stat-number">24/7</span>
          <span class="stat-label">Actualización</span>
        </div>
      </div>
    </div>
  </section>

    </div>
        <section class="news-section">
        <h3 class="msg_cent"><v-icon icon="mdi-newspaper-variant-multiple-outline"></v-icon> Noticias Recomendadas</h3>
        
        <div class="news-grid">
            <div v-for="newI in noticias" :key="newI.id" class="news-card">
<v-btn
class="btn-editCont"
  v-if="userStore.isAdmin"
  :to="{ name: 'adminEditNew', params: { id: newI.id } }"
  style="all: unset; width: 20px; height: 20px; display: flex; align-items: end; justify-content: end; margin-left: 90%;"
>
  <v-icon icon="mdi-tools" class="btn-edit"></v-icon>
</v-btn>

                <div class="news-header">
                    <h4 class="news-title">{{ newI.title }}</h4>
                </div>
                <div class="news-meta">
                    <div class="author-info">
                        <v-icon icon="mdi-account" min-width="40" height="40" color="black"></v-icon>
                        <span>{{ newI.author }}</span>
                    </div>
                    <span class="category-badge">{{ newI.category}}</span>
                </div>
                <p class="news-content">{{newI.content}}</p>
                <img :src="newI.imgUrl" class="imageNew">

            </div>
        </div>
    </section>


</template>


<style>
.news-section {
    margin-bottom: 3rem;
}

.news-section h3 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 2rem;
    color: var(--primary-dark);
    display: flex;
    align-items: center;
    gap: 1rem;
}

.news-section h3 i {
    color: var(--accent);
}

.news-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.news-card {
    background: var(--bg-secondary);
    border-radius: 16px;
    padding: 2rem;
    box-shadow: var(--shadow-md);
    border: 1px solid var(--border);
    transition: var(--transition);
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.news-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: var(--gradient-primary);
    transform: scaleX(0);
    transform-origin: left;
    transition: var(--transition);
}

.news-card:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-lg);
    border-color: rgba(59, 130, 246, 0.3);
}

.news-card:hover::before {
    transform: scaleX(1);
}

.news-header {
    margin-bottom: 1rem;
}

.news-title {
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--primary-dark);
    line-height: 1.3;
    margin-bottom: 0.5rem;
}

.news-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    color: var(--text-secondary);
}

.author-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.category-badge {
    background: var(--gradient-primary);
    color: white;
    padding: 0.3rem 0.8rem;
    border-radius: 999px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
}

.news-content {
    color: var(--text-secondary);
    line-height: 1.6;
    font-size: 0.95rem;
    margin-bottom: 1rem;
}

/* Imagen de la noticia */
.imageNew {
  width: 100%;        /* ocupa todo el ancho */
  height: 180px;      /* altura uniforme */
  object-fit: cover;  /* escala y recorta para llenar la caja */
  border-radius: 8px; 
  margin-bottom: 1rem;
  transition: transform 0.3s ease;
}

.news-card:hover .imageNew {
  transform: scale(1.05);
}

/* Hero y estadísticas */
.hero-section {
    background: var(--gradient-primary);
    color: white;
    text-align: center;
    position: relative;
    overflow: hidden;
    padding: 2rem 1rem;
}

.hero-section::before {
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

.hero-content {
    max-width: 800px;
    margin: 0 auto;
    position: relative;
    z-index: 2;
}

.hero-title {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1rem;
    text-shadow: 0 2px 4px rgba(0,0,0,0.2);
    animation: slideInUp 0.8s ease-out;
}

.hero-subtitle {
    font-size: 1.2rem;
    margin-bottom: 3rem;
    opacity: 0.9;
    animation: slideInUp 0.8s ease-out 0.2s both;
    justify-content: center;
}
.msg_cent{
    font-size: 1.2rem;
    margin-top: 3rem;
    opacity: 0.7;
    animation: slideInUp 0.8s ease-out 0.2s both;
    justify-content: center; 
}

.hero-stats {
    display: flex;
    justify-content: center;
    gap: 3rem;
    flex-wrap: wrap;
    animation: slideInUp 0.8s ease-out 0.4s both;
}

.stat-item {
    text-align: center;
    background: rgba(255, 255, 255, 0.1);
    padding: 1.5rem;
    border-radius: var(--radius-md);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-item i {
    font-size: 2rem;
    margin-bottom: 1rem;
    display: block;
}

.stat-number {
    font-size: 2rem;
    font-weight: 700;
    display: block;
    margin-bottom: 0.5rem;
}

.stat-label {
    font-size: 0.9rem;
    opacity: 0.8;
}
.btn-edit{  

    color: rgb(56, 56, 165);
}
.btn-editCont{
    
}
@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Responsive */
@media (max-width: 480px) {
    .hero-title {
        font-size: 1.8rem;
    }
    
    .hero-subtitle {
        font-size: 1rem;
    }
    
    .hero-stats {
        flex-direction: column;
        gap: 1rem;
    }
    
    .stat-item {
        width: 100%;
    }
    
    .news-card {
        padding: 1.5rem;
    }
    
    .news-title {
        font-size: 1.2rem;
    }
    
    .news-footer {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }
    
    .read-more-btn {
        width: 100%;
        justify-content: center;
    }
}

</style>