<script setup>
import { onMounted, computed } from "vue";
import { useBillStore } from "../stores/bills";
import { RouterLink } from "vue-router";

const billStore = useBillStore();

// Computed para obtener bills
const userBills = computed(() => billStore.getBills());

// Total de facturas
const totalBills = computed(() => userBills.value.length);

// Total de montos
const totalAmount = computed(() =>
  userBills.value.reduce((acc, bill) => acc + bill.amount, 0).toFixed(2)
);

</script>

<template>
  <div class="bills-container">
    <!-- HEADER -->
    <header class="bills-header">
      <h2><v-icon icon="mdi-cash-multiple"></v-icon>Historial de Facturas</h2>

      <!-- Totales -->
      <div class="bills-stats">
        <div class="stat-card">
          <v-icon icon="mdi-file-document-outline" size="30"></v-icon>
          <div>
            <p class="stat-label">Total Facturas</p>
            <p class="stat-value">{{ totalBills }}</p>
          </div>
        </div>

        <div class="stat-card">
          <v-icon icon="mdi-cash" size="30" color="green"></v-icon>
          <div>
            <p class="stat-label">Total Pagado</p>
            <p class="stat-value text-green">${{ totalAmount }}</p>
          </div>
        </div>
      </div>
    </header>

    <!-- LISTADO DE FACTURAS -->
    <main>
      <div v-if="userBills.length" class="bills-grid">
        <div v-for="bill in userBills" :key="bill.id" class="bill-card">
          <div class="bill-header">
            <v-icon icon="mdi-file-document" size="24"></v-icon>
            <h3>{{ bill.subscriptionName }}</h3>
          </div>

          <div class="bill-body">
            <div class="bill-row">
              <v-icon icon="mdi-pound"></v-icon>
              <span><strong>ID:</strong> {{ bill.id }}</span>
            </div>
              <div class="bill-row">
              <v-icon icon="mdi-package-variant-plus"></v-icon>
              <span><strong>Subscripcion:</strong> {{ bill.subscriptionName }}</span>
            </div>
            <div class="bill-row">
              <v-icon icon="mdi-credit-card-outline"></v-icon>
              <span><strong>Pago:</strong> {{ bill.paymentMethod }}</span>
            </div>
            <div class="bill-row">
              <v-icon icon="mdi-currency-usd"></v-icon>
              <span><strong>Monto:</strong> ${{ bill.amount }}</span>
            </div>
            <div class="bill-row">
              <v-icon icon="mdi-calendar-start"></v-icon>
              <span><strong>Inicio:</strong> {{ bill.startSubscription }}</span>
            </div>
            <div class="bill-row">
              <v-icon icon="mdi-calendar-end"></v-icon>
              <span><strong>Fin:</strong> {{ bill.endSubscription }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="no-bills">
        <v-icon icon="mdi-alert-circle"></v-icon>
        <p>No tienes facturas registradas.</p>
      </div>
    </main>

    <!-- Botón de regreso -->
    <footer class="bills-footer">
      <RouterLink to="/user" class="back-btn">
        <v-icon icon="mdi-arrow-left"></v-icon>
        Volver
      </RouterLink>
    </footer>
  </div>
</template>

<style scoped>
.bills-container {
  padding: 20px;
}

.bills-header {
  margin-bottom: 20px;
  text-align: center;
}

.bills-header h2 {
  margin-bottom: 15px;
  font-size: 1.8rem;
  font-weight: bold;
  color: green;
}

.bills-stats {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

/* CARD DE STATS */
.stat-card {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 15px 20px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  flex: 1 1 200px; /* Flexible y mínimo 200px */
  justify-content: center;
  text-align: center;
}

.stat-label {
  font-size: 0.9rem;
  color: #555;
}

.stat-value {
  font-size: 1.4rem;
  font-weight: bold;
}

.text-green {
  color: green;
}

/* GRID DE FACTURAS */
.bills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.bill-card {
  background: white;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.bill-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.bill-header {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  color: white;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  font-size: 1.1rem;
}

.bill-body {
  padding: 16px;
}

.bill-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 6px 0;
  font-size: 0.95rem;
}

.bill-row v-icon {
  color: #2563eb;
}

/* Sin facturas */
.no-bills {
  text-align: center;
  color: #666;
  margin-top: 30px;
}

/* Footer */
.bills-footer {
  margin-top: 30px;
  text-align: center;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  background: #007bff;
  color: white;
  border-radius: 10px;
  text-decoration: none;
  transition: background 0.2s;
  font-size: 1rem;
}

.back-btn:hover {
  background: #0056b3;
}

/* --- RESPONSIVE --- */
@media (max-width: 768px) {
  .bills-header h2 {
    font-size: 1.4rem;
  }

  .bills-stats {
    flex-direction: column;
    align-items: center;
  }

  .stat-card {
    width: 100%;
    max-width: 320px;
  }

  .bill-header {
    font-size: 1rem;
    padding: 10px 12px;
  }

  .bill-body {
    padding: 12px;
  }

  .bill-row {
    font-size: 0.9rem;
  }

  .back-btn {
    width: 90%;
    max-width: 300px;
    justify-content: center;
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .bills-header h2 {
    font-size: 1.2rem;
  }

  .bill-row {
    font-size: 0.85rem;
  }

  .stat-value {
    font-size: 1.2rem;
  }
}
</style>
