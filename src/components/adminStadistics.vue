<script setup>
import { nextTick, onMounted, ref, watch } from 'vue'
import { useBillStore } from "../stores/bills";
import Chart from 'chart.js/auto'

const billStore = useBillStore()

// refs de canvas
const subscripcionesPorMes = ref(null)
const subscripcionesPorTipo = ref(null)
const gananciasTotales = ref(null)
const subsActivas = ref(null)

// Estadísticas reactivas
const totalBills = ref(0)
const totalRevenue = ref(0)
const activeSubs = ref(0)
const monthsCount = ref(0)
const loading = ref(true)

// Función para inicializar charts
const initCharts = () => {
  if (!subscripcionesPorMes.value) return // previene error si el canvas aún no existe

  new Chart(subscripcionesPorMes.value, {
    type: 'line',
    data: {
      labels: Object.keys(billStore.porMes),
      datasets: [{
        label: 'Subscripciones por Mes',
        data: Object.values(billStore.porMes),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      }]
    }
  })

  new Chart(subscripcionesPorTipo.value, {
    type: 'doughnut',
    data: {
      labels: Object.keys(billStore.porTipo),
      datasets: [{
        data: Object.values(billStore.porTipo),
        backgroundColor: ['red','blue','green','yellow']
      }]
    }
  })

  new Chart(gananciasTotales.value, {
    type: 'bar',
    data: {
      labels: ['Total'],
      datasets: [{
        label: 'Ganancias Totales',
        data: [billStore.totalGanancias],
        backgroundColor: 'green'
      }]
    }
  })

  new Chart(subsActivas.value, {
    type: 'pie',
    data: {
      labels: ['Activas','Inactivas'],
      datasets: [{
        data: [billStore.activas, billStore.bills.length - billStore.activas],
        backgroundColor: ['green','grey']
      }]
    }
  })
}

onMounted(async () => {
  await billStore.fetchBillsAdmin() // trae todas las facturas
  totalBills.value = billStore.bills.length
  totalRevenue.value = billStore.totalGanancias
  activeSubs.value = billStore.activas
  monthsCount.value = billStore.meses.size
  loading.value = false

await nextTick()
  initCharts() // solo después de que el DOM está renderizado
})

// Si cambian las facturas, actualizar datos
watch(() => billStore.bills, async () => {
  totalBills.value = billStore.bills.length
  totalRevenue.value = billStore.totalGanancias
  activeSubs.value = billStore.activas
  monthsCount.value = billStore.meses.size

  await nextTick()
  initCharts()
})
</script>



<template>
  <div class="container">
    <div class="page-header">
      <div class="header-icon">
        <v-icon icon="mdi-chart-line"></v-icon>
      </div>
      <h1>Estadísticas de Subscripciones</h1>
      <p class="header-subtitle">Análisis detallado del rendimiento de subscripciones y facturación</p>
    </div>

    <div class="stats-overview">
      <div class="stat-card">
        <div class="stat-icon">
          <v-icon icon="mdi-invoice-text-check"></v-icon>
        </div>
        <div class="stat-number">{{ totalBills }}</div>
        <div class="stat-label">Facturas Totales</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <v-icon icon="mdi-currency-usd"></v-icon>
        </div>
        <div class="stat-number">${{ totalRevenue.toFixed(2) }}</div>
        <div class="stat-label">Ingresos Totales</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <v-icon icon="mdi-check-circle-outline"></v-icon>
        </div>
        <div class="stat-number">{{ activeSubs }}</div>
        <div class="stat-label">Subs Activas</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <v-icon icon="mdi-calendar"></v-icon>
        </div>
        <div class="stat-number">{{ monthsCount }}</div>
        <div class="stat-label">Meses Analizados</div>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <v-icon icon="mdi-loading"></v-icon>
      <p>Cargando estadísticas...</p>
    </div>

    <div v-else>
      <div class="full-width-chart">
        <div class="chart-header">
          <h3><v-icon icon="mdi-calendar"></v-icon> Subscripciones por Mes</h3>
          <p>Tendencia de crecimiento mensual</p>
        </div>
        <div class="chart-container">
          <canvas ref="subscripcionesPorMes"></canvas>
        </div>
      </div>
      <div class="charts-container">
        <div class="chart-card">
          <div class="chart-header">
            <h3><v-icon icon="mdi-tag-multiple"></v-icon> Subscripciones por Tipo</h3>
            <p>Distribución por categorías de subscripción</p>
          </div>
          <div class="chart-container">
            <canvas ref="subscripcionesPorTipo"></canvas>
          </div>
        </div>

        <div class="chart-card">
          <div class="chart-header">
            <h3><v-icon icon="mdi-trophy-variant"></v-icon> Ganancias Totales</h3>
            <p>Ingresos acumulados por subscripciones</p>
          </div>
          <div class="chart-container">
            <canvas ref="gananciasTotales"></canvas>
          </div>
        </div>

        <div class="chart-card">
          <div class="chart-header">
            <h3><v-icon icon="mdi-list-status"></v-icon> Estado de Subscripciones</h3>
            <p>Activas vs Inactivas</p>
          </div>
          <div class="chart-container">
            <canvas ref="subsActivas"></canvas>
          </div>
        </div>
      </div>

      <div class="action-button">
        <router-link to="/admin" class="back-button">
          <v-icon icon="mdi-arrow-left-bold"></v-icon>
          <span>Volver al Panel</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
    max-width: 1400px;
    margin: 0 auto;
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
    text-align: center;
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

.header-icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
}

.header-icon i {
    font-size: 2.5rem;
    color: white;
}

.page-header h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--primary-dark);
    margin-bottom: 0.5rem;
}

.header-subtitle {
    font-size: 1.2rem;
    color: var(--text-secondary);
    max-width: 600px;
    margin: 0 auto 2rem;
    line-height: 1.6;
}

/* STATS CARDS */
.stats-overview {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.stat-card {
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
    padding: 1.5rem;
    box-shadow: var(--shadow-md);
    border: 1px solid var(--border);
    transition: var(--transition);
    text-align: center;
}

.stat-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
}

.stat-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
    font-size: 1.5rem;
}

.stat-card:nth-child(1) .stat-icon {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.2));
    color: var(--accent);
}

.stat-card:nth-child(2) .stat-icon {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.2));
    color: var(--success);
}

.stat-card:nth-child(3) .stat-icon {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.2));
    color: var(--warning);
}

.stat-card:nth-child(4) .stat-icon {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.2));
    color: var(--danger);
}

.stat-number {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
}

.stat-label {
    font-size: 1rem;
    color: var(--text-secondary);
    font-weight: 500;
}

/* CHARTS CONTAINER */
.charts-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
}

.chart-card {
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    padding: 2rem;
    box-shadow: var(--shadow-md);
    border: 1px solid var(--border);
    transition: var(--transition);
}

.chart-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-lg);
}

.chart-header {
    text-align: center;
    margin-bottom: 1.5rem;
}

.chart-header h3 {
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--primary-dark);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
}

.chart-header h3 i {
    color: var(--accent);
}

.chart-container {
    position: relative;
    height: 300px;
    width: 100%;
}

/* FULL WIDTH CHART */
.full-width-chart {
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    padding: 2rem;
    box-shadow: var(--shadow-md);
    border: 1px solid var(--border);
    margin-bottom: 2rem;
}

.full-width-chart .chart-header {
    margin-bottom: 2rem;
}

.full-width-chart .chart-container {
    height: 400px;
}

/* ACTION BUTTON */
.action-button {
    text-align: center;
    margin-top: 2rem;
}

.back-button {
    background: var(--gradient-primary);
    color: white;
    padding: 1.2rem 2.5rem;
    border: none;
    border-radius: var(--radius-md);
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    font-size: 1.1rem;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.8rem;
    transition: var(--transition);
    box-shadow: var(--shadow-md);
}

.back-button:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-lg);
}

/* LOADING STATE */
.loading {
    text-align: center;
    padding: 3rem;
    color: var(--text-secondary);
}

.loading i {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: var(--accent);
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

/* RESPONSIVE DESIGN */
@media (max-width: 1200px) {
    .charts-container {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    body {
        padding: 1rem;
    }

    .page-header {
        padding: 1.5rem;
    }

    .page-header h1 {
        font-size: 2rem;
    }

    .header-subtitle {
        font-size: 1rem;
    }

    .stats-overview {
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    .stat-number {
        font-size: 1.5rem;
    }

    .charts-container {
        gap: 1.5rem;
    }

    .chart-card {
        padding: 1.5rem;
    }

    .chart-container {
        height: 250px;
    }
}

@media (max-width: 480px) {
    body {
        padding: 0.8rem;
    }

    .page-header {
        padding: 1rem;
    }

    .page-header h1 {
        font-size: 1.5rem;
    }

    .header-icon {
        width: 60px;
        height: 60px;
        font-size: 2rem;
    }

    .stats-overview {
        grid-template-columns: 1fr;
    }

    .chart-card {
        padding: 1rem;
    }

    .chart-header h3 {
        font-size: 1.1rem;
    }

    .chart-container {
        height: 200px;
    }
}

/* ANIMATIONS */
@keyframes pulse {

    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.05);
    }
}

.header-icon {
    animation: pulse 2s infinite;
}
</style>
