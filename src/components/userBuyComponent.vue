<script setup>
import { ref } from "vue"
import { useBillStore } from "../stores/bills"
import { useUserStore } from "../stores/user";

import router from '../router';
import { useNewsStore } from "../stores/news";
import { alerts, showAlert } from "../utils/alerts";
const useStore = useBillStore()
const userStore = useUserStore();
const newsStore = useNewsStore();


// Estado
const activeCardId = ref(null)

// Datos del formulario
const form = ref({
  subscriptionName: "",
  methodPay: "creditCard",
  cardNumber: "",
  cvv: "",
  expiry: ""
})

// Flips de las tarjetas
function flipCard(cardId) {
  activeCardId.value = activeCardId.value === cardId ? null : cardId
  form.value.subscriptionName = cardId
}

// Reset
function resetCards() {
  activeCardId.value = null
  form.value = {
    subscriptionName: "",
    methodPay: "creditCard",
    cardNumber: "",
    cvv: "",
    expiry: ""
  }
}

// Validación de expiración
function isExpired(expiry) {
  if (!expiry) return true;
  const [year, month] = expiry.split("-").map(Number);
  const now = new Date();
  const expDate = new Date(year, month, 0); 
  return expDate < now;
}


// Validación del formulario
function validateForm() {
  const { cardNumber, cvv, expiry } = form.value;
  if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ""))) {
    showAlert("Número de tarjeta inválido. Debe tener 16 dígitos.", "error");
    return false;
  }
  if (!/^\d{3}$/.test(cvv)) {
    showAlert("CVV inválido. Debe tener 3 dígitos.", "error");
    return false;
  }
  if (isExpired(expiry)) {
    showAlert("La tarjeta está expirada.", "error");
    return false;
  }
  return true;
}

// Submit
async function submitForm() {
  if (!validateForm()) return;
  try {
    await userStore.buySubscription(form.value.subscriptionName,form.value.methodPay)
    showAlert("Pago realizado con éxito", "success");
    resetCards();
    setTimeout(() => router.push({ name: 'user'}), 1500);
  } catch (err) {
    console.error(err);
    showAlert("Error al procesar el pago", "error");
  }
}
</script>
<template>
  <div>
    <h2 class="title"><v-icon icon="mdi-crown"></v-icon> Elige tu subscripción</h2>

    <!-- ALERTAS -->
<div v-if="alerts.length" id="alerts-container" class="alerts">
  <p v-for="(alert, i) in alerts" :key="i" :class="alert.type">{{ alert.msg }}</p>
</div>
<div v-if="isLoading" class="loading-overlay">
  <v-icon icon="mdi-loading" spin size="48"></v-icon>
  <p>Procesando tu compra...</p>
</div>

    <div class="card-container">
      <!-- TITULAR -->
      <div class="card" :id="'card-titular'" :class="{ flip: activeCardId==='TITULAR' }">
        <div class="card-inner">
          <div class="card-front">
            <div class="card-header">
              <v-icon icon="mdi-newspaper-variant-multiple" class="newspaper-icon"></v-icon>
              <h3>TITULAR</h3>
            </div>
            <ul>
              <li><v-icon icon="mdi-newspaper"></v-icon>Noticias generales</li>
              <li><v-icon icon="mdi-heart"></v-icon> 2 categorías favoritas</li>
              <li><v-icon icon="mdi-close-circle-outline"></v-icon> Sin contenido exclusivo</li>
            </ul>
            <p class="price"><v-icon icon="mdi-tag"></v-icon> $1.99 / mes</p>
            <button @click="flipCard('TITULAR')">
              <v-icon icon="mdi-cart-outline"></v-icon> Comprar
            </button>
          </div>
          <div class="card-back">
            <form @submit.prevent="submitForm">
              <input type="hidden" v-model="form.subscriptionName" value="TITULAR" />
              <div class="card-type">
                <v-icon icon="mdi-credit-card"></v-icon>
                <span>Tarjeta de crédito</span>
              </div>
              <div class="input-group">
                <v-icon icon="mdi-credit-card" class="input-icon"></v-icon>
                <input v-model="form.cardNumber" type="text" placeholder="Número de tarjeta" maxlength="19" required />
              </div>
              <div class="input-group">
                <v-icon icon="mdi-lock" class="input-icon"></v-icon>
                <input v-model="form.cvv" type="text" placeholder="CVV" maxlength="3" required />
              </div>
              <div class="input-group">
                <v-icon icon="mdi-calendar" class="input-icon"></v-icon>
                <input v-model="form.expiry" type="month" required />
              </div>
              <div class="button-group">
                <button type="submit">
                  <v-icon icon="mdi-check"></v-icon> Pagar
                </button>
                <button type="button" @click="resetCards">
                  <v-icon icon="mdi-window-close"></v-icon> Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- REDACCIÓN+ -->
      <div class="card" :id="'card-redaccion'" :class="{ flip: activeCardId==='REDACCIONPlus' }">
        <div class="card-inner">
          <div class="card-front">
            <div class="card-header">
              <v-icon icon="mdi-star" class="star-icon"></v-icon>
              <h3>REDACCIÓN+</h3>
            </div>
            <ul>
              <li><v-icon icon="mdi-book-open-variant"></v-icon> Acceso a todas las categorías</li>
              <li><v-icon icon="mdi-lock"></v-icon> Contenido exclusivo</li>
              <li><v-icon icon="mdi-multimedia"></v-icon> Multimedia y recomendaciones</li>
            </ul>
            <p class="price"><i class="fas fa-tag"></i> $3.99 / mes</p>
            <button @click="flipCard('REDACCIONPlus')">
              <v-icon icon="mdi-cart-outline"></v-icon> Comprar
            </button>
          </div>
          <div class="card-back">
            <form @submit.prevent="submitForm">
              <input type="hidden" v-model="form.subscriptionName" value="TITULAR" />
              <div class="card-type">
                <v-icon icon="mdi-credit-card"></v-icon>
                <span>Tarjeta de crédito</span>
              </div>
              <div class="input-group">
                <v-icon icon="mdi-credit-card" class="input-icon"></v-icon>
                <input v-model="form.cardNumber" type="text" placeholder="Número de tarjeta" maxlength="19" required />
              </div>
              <div class="input-group">
                <v-icon icon="mdi-lock" class="input-icon"></v-icon>
                <input v-model="form.cvv" type="text" placeholder="CVV" maxlength="3" required />
              </div>
              <div class="input-group">
                <v-icon icon="mdi-calendar" class="input-icon"></v-icon>
                <input v-model="form.expiry" type="month" required />
              </div>
              <div class="button-group">
                <button type="submit">
                  <v-icon icon="mdi-check"></v-icon> Pagar
                </button>
                <button type="button" @click="resetCards">
                  <v-icon icon="mdi-window-close"></v-icon> Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- INSIDER -->
      <div class="card" :id="'card-insider'" :class="{ flip: activeCardId==='INSIDER' }">
        <div class="card-inner">
          <div class="card-front">
            <div class="card-header">
              <v-icon icon="mdi-crown" class="premium-icon"></v-icon>
              <h3>INSIDER</h3>
            </div>
            <ul>
              <li><v-icon icon="mdi-lightning-bolt"></v-icon> Contenido anticipado</li>
              <li><v-icon icon="mdi-newspaper"></v-icon> Reportajes especiales</li>
              <li><v-icon icon="mdi-calendar"></v-icon> Eventos digitales</li>
            </ul>
            <p class="price"><i class="fas fa-tag"></i> $6.99 / mes</p>
            <button @click="flipCard('INSIDER')">
              <v-icon icon="mdi-cart-outline"></v-icon> Comprar
            </button>
          </div>
          <div class="card-back">
            <form @submit.prevent="submitForm">
              <input type="hidden" v-model="form.subscriptionName" value="TITULAR" />
              <div class="card-type">
                <v-icon icon="mdi-credit-card"></v-icon>
                <span>Tarjeta de crédito</span>
              </div>
              <div class="input-group">
                <v-icon icon="mdi-credit-card" class="input-icon"></v-icon>
                <input v-model="form.cardNumber" type="text" placeholder="Número de tarjeta" maxlength="19" required />
              </div>
              <div class="input-group">
                <v-icon icon="mdi-lock" class="input-icon"></v-icon>
                <input v-model="form.cvv" type="text" placeholder="CVV" maxlength="3" required />
              </div>
              <div class="input-group">
                <v-icon icon="mdi-calendar" class="input-icon"></v-icon>
                <input v-model="form.expiry" type="month" required />
              </div>
              <div class="button-group">
                <button type="submit">
                  <v-icon icon="mdi-check"></v-icon> Pagar
                </button>
                <button type="button" @click="resetCards">
                  <v-icon icon="mdi-window-close"></v-icon> Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

<v-btn
  class="back-btn"
  prepend-icon="mdi-arrow-left"
  :to="`/user`"
  variant="outlined"
  color="primary"
>
  Volver
</v-btn>
  </div>
</template>


<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  z-index: 9999;
}


h2 {
  font-weight: 800;
  font-size: 2.4rem;
  margin-bottom: 2.5rem;
  color: var(--primary-color);
  letter-spacing: -0.5px;
}
.title{
    display: flex;
    justify-content: center;
    margin-top: 5%;
    align-items: center;
    content:normal;

}

.card-front {
  z-index: 2;
}

.card-back {
  transform: rotateY(180deg);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--accent-color);
}

.card-header h3 {
  margin: 0;
}

.card-front ul {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}

.card-front ul li {
  margin: 0.3rem 0;
  color: var(--text-light);
}

.price {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
}

button {
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: background 0.3s ease;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.card-front button {
  background: var(--accent-color);
  color: white;
}

.card-front button:hover {
  background: var(--accent-hover);
}

.button-group {
  display: flex;
  gap: 0.8rem;
  margin-top: 1rem;
}

.button-group button[type="submit"] {
  background: var(--accent-color);
  color: #fff;
}

.button-group button[type="button"] {
  background: #e5e7eb;
  color: #374151;
}

.back-btn {
  margin: 5% auto 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1rem;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  transition: all 0.3s ease;
  width: 200px;
  max-width: 90%;
}

.back-btn:hover {
  background-color: #1976d2;
  color: #fff;
}

/* ✏️ Inputs */
.input-group {
  position: relative;
  margin: 1rem 0;
}

.input-group input {
  width: 100%;
  padding: 0.7rem 0.7rem 0.7rem 2.2rem;
  border-radius: var(--border-radius);
  border: 1px solid #d1d5db;
  outline: none;
  transition: border-color 0.3s;
}

.input-group input:focus {
  border-color: var(--accent-color);
}

.input-icon {
  position: absolute;
  left: 0.7rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-light);
}

.premium-icon {
  color: #fbbf24;
  text-shadow: 0 2px 4px rgba(251, 191, 36, 0.3);
}

.star-icon {
  color: #3b82f6;
  text-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
}

.newspaper-icon {
  color: #6b7280;
  text-shadow: 0 2px 4px rgba(107, 114, 128, 0.3);
}
.card-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10%;
  margin: 5rem 0;
  padding: 0 1rem;
  
}
.card {
  perspective: 1000px;
  width: 280px;     
  max-width: 90vw; 
  aspect-ratio: 5 / 6; 
  flex-shrink: 0;
}

.card-front, .card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background: var(--card-bg);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

.card.flip .card-inner {
  transform: rotateY(180deg);
}

/* Responsive */
@media (max-width: 1024px) {
  .card {
    width: 220px;
  }
}

@media (max-width: 768px) {
      .back-btn {
    width: 60%;
    padding: 0.7rem 1rem;
    font-size: 0.95rem;
  }
  .card-container {
    flex-direction: column;
    align-items: center;
  }
  .card {
    width: 90%;
  }
  .button-group {
    flex-direction: column;
    gap: 0.5rem;
  }
  button {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
      .back-btn {
    width: 80%;
    padding: 0.6rem 0.8rem;
    font-size: 0.9rem;
  }
  .card {
    width: 95%;
  }
}
</style>
