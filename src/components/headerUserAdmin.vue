<script setup>
import { computed } from 'vue';
import { useBillStore } from '../stores/bills';
import { useUserStore } from '../stores/user';

const userStore = useUserStore();
const user = userStore.user
const billStore = useBillStore();


const bills = billStore.bills.at(-1);
const formattedEnd = computed(() => {

  if (!bills || bills.subscriptionName === "FREE") return "";

  const endDate = new Date(bills.endSubscription);
  const today = new Date();

  if (endDate < today) return "";

  const day = String(endDate.getDate()).padStart(2, "0");
  const month = endDate.toLocaleString("es-ES", { month: "long" });

  return `${day} de ${month}`;
});

const activeAdmin = ()=>{
  if(userStore.isAdmin===true){
    return "status-active"
  }
    return "status-inactive"  
}


</script>

<template>
  <header class="user-header">
    <div class="welcome-section">
      <h2>
        <v-icon icon="mdi-account"></v-icon>
        <v-icon icon="mdi-security" v-if="userStore.isAdmin" size="40"></v-icon>
        Bienvenido, <span class="user-email">{{ user.nickname }}</span>
      </h2>
      <div class="subscription-status">
        <div :class="activeAdmin()" v-if="!formattedEnd">
  <span v-if="!userStore.isAdmin"><v-icon icon="mdi-message-alert"></v-icon>No posee subscripción activa</span>
      
    <span v-else>
      <v-icon icon="mdi-check-circle"></v-icon> Consola de Administracion
    </span> 
</div>

<div class="status-active" v-else>
  <span>
    <v-icon icon="mdi-check-circle"></v-icon>
    Su subscripción {{bills.subscriptionName}} expira el: 
    <strong>{{ formattedEnd }}</strong>
  </span>
        </div>

      </div>
    </div>
  </header>
</template>

<style>
.user-header {
  background: var(--bg-secondary);
  border-radius: 20px;
  padding: 2rem;
  margin: 3%;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border);
  position: relative;
  overflow: hidden;
}

.user-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: var(--gradient-primary);
}

.welcome-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.welcome-section h2 {
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--primary-dark);
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap; /* evita desbordes en pantallas pequeñas */
}

.user-email {
  color: var(--accent);
  font-weight: 600;
  word-break: break-word;
}

.subscription-status {
  margin-top: 0.5rem;
}

.status-active,
.status-inactive {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-weight: 500;
  font-size: 1.1rem;
  animation: slideIn 0.5s ease-out;
  flex-wrap: wrap;
}

.status-active {
  background: linear-gradient(
    135deg,
    rgba(16, 185, 129, 0.1),
    rgba(16, 185, 129, 0.05)
  );
  color: var(--success);
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.status-inactive {
  background: linear-gradient(
    135deg,
    rgba(239, 68, 68, 0.1),
    rgba(239, 68, 68, 0.05)
  );
  color: var(--danger);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

/* Animación */
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

@media (max-width: 1024px) {
  .welcome-section h2 {
    font-size: 1.8rem;
  }

  .status-active,
  .status-inactive {
    font-size: 1rem;
    padding: 0.8rem 1rem;
  }
}

@media (max-width: 768px) {
  .user-header {
    padding: 1.5rem;
  }

  .welcome-section h2 {
    font-size: 1.5rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .subscription-status {
    margin-top: 0.8rem;
  }
}

@media (max-width: 480px) {
  .user-header {
    padding: 1rem;
    border-radius: 12px;
  }

  .welcome-section h2 {
    font-size: 1.2rem;
  }

  .status-active,
  .status-inactive {
    font-size: 0.9rem;
    padding: 0.6rem 0.8rem;
  }
}
</style>
