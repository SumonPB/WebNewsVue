<script setup>
import { useUserStore } from '../stores/user';
const userStore = useUserStore();
const user = userStore.user;
</script>

<template>
  <header class="page-header">
    <div class="header-content">
      <h1><v-icon icon="mdi-account-cog"></v-icon> Configurar Perfil</h1>
      <p class="header-subtitle">Actualiza tu información personal y mantén tu cuenta segura</p>
    </div>
    <div class="profile-preview">
      <div class="avatar-placeholder">
        <v-icon icon="mdi-account-badge"></v-icon>
      </div>
      <div class="profile-info">
        <h3>{{ user.nickname }}</h3>
        <p class="profile-email">{{ user.email }}</p>
        <span class="profile-status">Miembro</span>
      </div>
    </div>
  </header>
</template>

<style>
.page-header {
    margin-top: 3%;
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    padding: 2rem;
    margin-bottom: 2rem;
    margin-left: 6%;
    margin-right: 6%;
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--border);
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 2rem;
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
    font-size: 2.5rem;
    font-weight: 800;
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
    line-height: 1.6;
}

.profile-preview {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    background: linear-gradient(135deg, rgba(30, 58, 138, 0.05), rgba(37, 99, 235, 0.05));
    padding: 1.5rem;
    border-radius: var(--radius-md);
    border: 1px solid rgba(59, 130, 246, 0.2);
    flex-wrap: wrap;
}

.avatar-placeholder {
    width: 70px;
    height: 70px;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.avatar-placeholder i {
    color: white;
    font-size: 1.8rem;
}

.profile-info h3 {
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--primary-dark);
    margin-bottom: 0.3rem;
    word-break: break-word;
}

.profile-email {
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    word-break: break-word;
}

.profile-status {
    background: linear-gradient(135deg, var(--accent), #60a5fa);
    color: white;
    padding: 0.2rem 0.8rem;
    border-radius: 999px;
    font-size: 0.8rem;
    font-weight: 600;
}

@media (max-width: 1024px) {
  .header-content h1 {
    font-size: 2rem;
  }
  .header-subtitle {
    font-size: 1rem;
  }
  .profile-info h3 {
    font-size: 1.1rem;
  }
  .profile-email {
    font-size: 0.85rem;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 1.5rem;
  }
  .header-content h1 {
    font-size: 1.8rem;
    flex-wrap: wrap;
  }
  .profile-preview {
    width: 100%;
    justify-content: flex-start;
    padding: 1rem;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .header-content h1 {
    font-size: 1.5rem;
  }
  .header-subtitle {
    font-size: 0.9rem;
  }
  .profile-info h3 {
    font-size: 1rem;
  }
  .profile-email {
    font-size: 0.8rem;
  }
  .avatar-placeholder {
    width: 50px;
    height: 50px;
  }
  .avatar-placeholder i {
    font-size: 1.3rem;
  }
}
</style>
