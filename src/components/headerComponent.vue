<script setup>

</script>
<template>
  <header class="header">
    <h1 class="page-title">Tu Información al Instante</h1>
    <div class="header-buttons">
      <v-btn icon="mdi-account" to="/login" class="header-btn"></v-btn>
      <v-btn icon="mdi-account-arrow-right" to="/register" class="header-btn"></v-btn>
    </div>
  </header>
</template>

<style>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--gradient-secondary);
  padding: 1rem 2rem;
  color: white;
  position: relative;
  flex-wrap: wrap;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 700;
  text-align: center;
  flex: 1;
}

.header-buttons {
  display: flex;
  gap: 1rem;
}

.header-btn {
  color: white;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  transition: transform 0.2s ease, background 0.2s ease;
}

.header-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 480px) {
  .header {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
  .page-title {
    font-size: 1.5rem;
  }
  .header-buttons {
    justify-content: center;
  }
}
</style>
