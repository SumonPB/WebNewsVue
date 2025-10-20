<script setup></script>
<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-contact">
        <h4>
          <v-icon icon="mdi-email" min-width="30" height="30"></v-icon>
          Contacto
        </h4>
      </div>
      <div class="footer-info">
        <p>
          <v-icon icon="mdi-email"></v-icon>
          contacto@tuinformacionalinstante.com
        </p>
        <p>
          <v-icon icon="mdi-map-marker"></v-icon>
          Quito, Ecuador
        </p>
        <p>
          <v-icon icon="mdi-phone"></v-icon>
          +593 99 999 9999
        </p>
      </div>
    </div>
    <div class="footer-copy">
      <v-icon icon="mdi-copyright"></v-icon>
      2025 Tu Información al Instante. Todos los derechos reservados.
    </div>
  </footer>
</template>

<style>
.footer {
  background: var(--gradient-secondary);
  color: white;
  padding: 1rem 1rem 1rem 1rem;
  text-align: center;
  font-family: 'Poppins', sans-serif;
}

.footer-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1rem;
}

.footer-contact h4 {
  display: flex;
  margin-top: 25%;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.3rem;

}

.footer-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

.footer-info p {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}

.footer-copy {
  font-size: 0.85rem;
  opacity: 0.8;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.3rem;
  flex-wrap: wrap;
}


@media (max-width: 480px) {
  .footer-container {
    flex-direction: column;
    gap: 1rem;
  }
  .footer-contact h4 {
    margin-top: 30%;
    font-size: 0.9rem;
  }
}
</style>
