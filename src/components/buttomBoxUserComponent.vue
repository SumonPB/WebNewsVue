<script setup>
import { useRoute } from 'vue-router';
import router from '../router';
const route = useRoute();
import { useNewsStore } from '../stores/news';
import { nextTick } from 'vue';
import { useUserStore } from '../stores/user';
import { computed } from 'vue';
import { useBillStore } from '../stores/bills';

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


const userPagConfig = () => {
        router.push({
            name:"userConfig",
        })
}

const userPagBuySubscription = () => {
        router.push({
            name:"userBuySubscription",
        })
}

const userPagChooseCategorys = () => {
        router.push({
            name:"userChooseCategorys",
        })
}
const userPageSeeBills = ()=>{
          router.push({
            name:"userSeeBills",
        })
}
//// admin
const adminPagInsertNew = ()=>{
          router.push({
            name:"adminInsertNew",
        })
}

const adminPagUpdateUser = ()=>{
            router.push({
            name:"adminConfigUser",
        })
}
const adminPagStadistics = ()=>{
            router.push({
            name:"adminStadistics",
        })
}

const logout = async () => {
  const userStore = useUserStore();  
  const newsStore = useNewsStore();
  userStore.user = {
    name: "",
    email: "",
    password: "",
    subscription: false,
    nickname: "",
    categorys: []
  };
  userStore.isAdmin = false;
  await nextTick();
  newsStore.fetchNews();
  await router.push({ name: "Home" }); 
};




</script>

<template>
  <div class="action-buttons">
    <div class="button-grid">

      
      <template v-if="!userStore.isAdmin">
        <form @submit.prevent="userPagConfig" class="login-form">
          <button class="action-btn">
            <v-icon icon="mdi-cog"></v-icon>
            <span>Configurar perfil</span>
          </button>
        </form>

        <form @submit.prevent="userPagBuySubscription">
          <button type="submit" class="action-btn premium">
            <v-icon icon="mdi-chess-queen"></v-icon>
            <span>Comprar Subscripción</span>
          </button>
        </form>

        <form @submit.prevent="userPagChooseCategorys" class="login-form">
          <button 
            type="submit" 
            class="action-btn"
            :disabled="!formattedEnd"
          >
            <v-icon icon="mdi-tag-multiple"></v-icon>
            <span>Escoger Categorías</span>
          </button>
        </form>

        <form @submit.prevent="userPageSeeBills" class="login-form">
          <button type="submit" class="action-btn">
            <v-icon icon="mdi-invoice-list-outline"></v-icon>
            <span>Ver Facturas</span>
          </button>
        </form>
      </template>

      <template v-else>
        <form @submit.prevent="adminPagInsertNew" class="login-form">
          <button type="submit" class="action-btn">
            <v-icon icon="mdi-newspaper-plus"></v-icon>
            <span>Ingresar Noticia</span>
          </button>
        </form>


        <form @submit.prevent="adminPagUpdateUser" class="login-form">
          <button type="submit" class="action-btn">
            <v-icon icon="mdi-account-edit-outline"></v-icon>
            <span>Modificar Usuario</span>
          </button>
        </form>

        <form @submit.prevent="adminPagStadistics" class="login-form">
          <button type="submit" class="action-btn">
            <v-icon icon="mdi-chart-line"></v-icon>
            <span>Historial de  Subscripciones</span>
          </button>
        </form>
      </template>

      <a class="log">
        <v-btn class="action-btn logout" @click="logout" :style="{ all: 'unset' }">   
          <v-icon icon="mdi-logout"></v-icon>
          <span>Salir</span>
        </v-btn>
      </a>

    </div>
  </div>
</template>

<style>
.action-buttons {
    margin-bottom: 3rem;
    margin-left: 10%;
}

.button-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
}

.action-btn {
    background: var(--bg-secondary);
    border: 2px solid var(--border);
    border-radius: 16px;
    padding: 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.8rem;
    box-shadow: var(--shadow-sm);
    position: relative;
    overflow: hidden;
}

.action-btn:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
    border-color: var(--accent);
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(59, 130, 246, 0.1));
}

.action-btn i {
    font-size: 2rem;
    color: var(--accent);
    transition: var(--transition);
}

.action-btn:hover i {
    transform: scale(1.1);
}

.action-btn.premium {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(249, 115, 22, 0.1));
    border: 2px solid rgba(245, 158, 11, 0.3);
}

.action-btn.premium i {
    color: var(--warning);
}

.action-btn.premium:hover {
    border-color: var(--warning);
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(249, 115, 22, 0.2));
}

.action-btn.logout {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05));
    border: 2px solid rgba(239, 68, 68, 0.2);
}

.action-btn.logout i {
    color: var(--danger);
}

.action-btn.logout:hover {
    border-color: var(--danger);
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1));
}

.log{
    position: absolute;       /* contenedor base */
    height: 35px; 
    right: 5%;
    top: 10%;
    font-size: 1rem;
    font-weight: 600;
}

</style>
