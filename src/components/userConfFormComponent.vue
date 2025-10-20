<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import router from '../router';
import { alerts, showAlert } from "../utils/alerts";
import { useBillStore } from '../stores/bills';

// Formulario reactivo
const userStore = useUserStore();
const billStore =useBillStore();
const subscriptionName = ref("");


const admin = userStore.isAdmin
const originalSubscription = ref(null)

const form = reactive({
  email: admin ? "" : userStore.user.email,
  name: admin ? "" : userStore.user.name,
  nickname: admin ? "" : userStore.user.nickname,
  password: admin ? "" : userStore.user.password
})

const buscarUsuario = async () => {
  if (!form.email) {
    showAlert("Ingresa un correo para buscar.", "error")
    return
  }
  const userData = await userStore.getUserByEmail(form.email)

  if (!userData) {
    showAlert("No se encontró un usuario con ese correo.", "error")
    return
  }

  form.name = userData.name
  form.nickname = userData.nickname
  form.password = userData.password
  const lastBill = billStore.bills.at(-1)

  subscriptionName.value = lastBill?.subscriptionName || "FREE"
  originalSubscription.value = subscriptionName.value;
  showAlert("Usuario cargado correctamente.", "success")
}
 

// Toggle mostrar/ocultar contraseña
const showPassword = ref(false)

// Validación de requisitos de contraseña

const passwordRequirements = reactive({
  length: false,
  uppercase: false,
  lowercase: false,
  number: false
})

// Watch para validar contraseña en tiempo real
watch(() => form.password, (newVal) => {
  passwordRequirements.length = newVal.length >= 8
  passwordRequirements.uppercase = /[A-Z]/.test(newVal)
  passwordRequirements.lowercase = /[a-z]/.test(newVal)
  passwordRequirements.number = /\d/.test(newVal)
})



// Validar formulario
const validateForm = () => {
  if (!form.name.trim() || !form.nickname.trim()) {
    showAlert('Por favor, completa todos los campos obligatorios.',"error")
    return false
  }
  if (form.name.length < 2) {
    showAlert('El nombre debe tener al menos 2 caracteres.',"error")
    return false
  }
  if (form.nickname.length < 3) {
    showAlert('El apodo debe tener al menos 3 caracteres.',"error")
    return false
  }

  // Si el usuario no cambió la contraseña, mantener la antigua y saltar la validación
  if (!form.password) {
    form.password = userStore.user.password
  } else {
    // Solo validar requisitos si se escribió algo
    if (!Object.values(passwordRequirements).every(v => v)) {
      showAlert('La contraseña no cumple con los requisitos mínimos.',"error")
      return false
    }
  }
  return true
}


onMounted(() => {
  if (form.password) {
    passwordRequirements.length = form.password.length >= 8
    passwordRequirements.uppercase = /[A-Z]/.test(form.password)
    passwordRequirements.lowercase = /[a-z]/.test(form.password)
    passwordRequirements.number = /\d/.test(form.password)
  }
})

// Submit del formulario
const submitForm = async(e) => {
  e.preventDefault()
  if (validateForm()) {

    const update = await userStore.updateUser(form.email,
    form.name,
    form.nickname,
    form.password,
    subscriptionName.value !== originalSubscription.value ? subscriptionName.value : null)
    if(update === true){
      showAlert('¡Perfil actualizado correctamente!',"success")
    setTimeout(async() => {
      if(!userStore.isAdmin){
      await router.push({ name: 'user' })
      }else{
        await router.push({ name: 'admin' })
      }
     
    }, 1000)
    }
    else{
      showAlert('¡Perfil no actualizado correctamente!',"error")
    }
    
  }
}
</script>

<template>
<div class="container">
  <!-- Alertas -->
  <div v-if="alerts.length" id="alerts-container" class="alerts">
  <p v-for="(alert, i) in alerts" :key="i" :class="alert.type">{{ alert.msg }}</p>
</div>
  <main class="main-content">
    <div class="profile-section">
      <div class="section-header">
        <h2><v-icon icon="mdi-account-box-edit-outline"></v-icon> Información Personal</h2>
        <p>Completa todos los campos obligatorios para actualizar tu perfil</p>
      </div>

      <form class="profile-form" @submit="submitForm">
        <div class="form-grid">
          <!-- Nombre -->
          <div class="form-group">
            <label for="name">
              <v-icon icon="mdi-account"></v-icon> Nombre Completo <span class="required">*</span>
            </label>
            <div class="input-wrapper">
              <input type="text" id="name" v-model="form.name" placeholder="Ingresa tu nombre completo" class="form-input">
              <div class="input-icon"><v-icon icon="mdi-account"></v-icon></div>
            </div>
          </div>

          <!-- Nickname -->
          <div class="form-group">
            <label for="nickname">
              <v-icon icon="mdi-at"></v-icon> Apodo/Nickname <span class="required">*</span>
            </label>
            <div class="input-wrapper">
              <input type="text" id="nickname" v-model="form.nickname" placeholder="Ingresa tu apodo" class="form-input">
              <div class="input-icon"><v-icon icon="mdi-at"></v-icon></div>
            </div>
          </div>

          <!-- Email -->
          <div class="form-group" v-if="admin">
            <label for="email">
              <v-icon icon="mdi-email"></v-icon> Correo Electrónico
            </label>
            <div class="input-wrapper">
<input type="email" 
  id="email" 
  v-model="form.email" 
  placeholder="Ingresa el correo del usuario"
  class="form-input">
              <div class="input-icon"><v-icon icon="mdi-email"></v-icon></div>
            </div>
          </div>
        <div v-if="admin" class="search-user">
  <button type="button" class="submit-btn" @click="buscarUsuario">
    <v-icon icon="mdi-account-search"></v-icon>
    Buscar Usuario
  </button>
</div>  

<!-- Subscripción -->
<div class="form-group" v-if="admin">
  <label for="subscriptionName">
    <i class="mdi mdi-card-account-details"></i>
    Tipo de suscripción
  </label>
  <div class="select-wrapper">
    <select v-model="subscriptionName" id="subscriptionName" required class="form-select">
      <option value="" disabled>Selecciona una suscripción</option>
      <option value="FREE">FREE - Acceso público</option>
      <option value="TITULAR">TITULAR - Suscripción básica</option>
      <option value="REDACCIONPlus">REDACCIÓN Plus - Suscripción premium</option>
      <option value="INSIDER">INSIDER - Acceso exclusivo</option>
    </select>
    <div class="select-icon">
      <v-icon icon="mdi-hand-pointing-down"></v-icon>
    </div>
  </div>
</div>



          <!-- Contraseña -->
          <div class="form-group">
            <label for="password">
              <v-icon icon="mdi-lock"></v-icon> Nueva Contraseña
            </label>
            <div class="input-wrapper">
              <input :type="showPassword ? 'text' : 'password'" id="password" v-model="form.password" placeholder="Ingresa una nueva contraseña" class="form-input password-input">
              <div class="input-icon"><v-icon icon="mdi-lock"></v-icon></div>
              <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                <v-icon>{{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
              </button>
            </div>
            <span class="helper-text">Deja en blanco para mantener la contraseña actual</span>
          </div>
        </div>

        <!-- Requisitos de contraseña -->
        <div class="password-requirements">
          <h4><i class="fas fa-shield-alt"></i> Requisitos de contraseña:</h4>
<ul>
  <li :class="{ valid: passwordRequirements.length }">
    <v-icon>{{ passwordRequirements.length ? 'mdi-check' : 'mdi-close' }}</v-icon>
    Mínimo 8 caracteres
  </li>
  <li :class="{ valid: passwordRequirements.uppercase }">
    <v-icon>{{ passwordRequirements.uppercase ? 'mdi-check' : 'mdi-close' }}</v-icon>
    Al menos una mayúscula
  </li>
  <li :class="{ valid: passwordRequirements.lowercase }">
    <v-icon>{{ passwordRequirements.lowercase ? 'mdi-check' : 'mdi-close' }}</v-icon>
    Al menos una minúscula
  </li>
  <li :class="{ valid: passwordRequirements.number }">
    <v-icon>{{ passwordRequirements.number ? 'mdi-check' : 'mdi-close' }}</v-icon>
    Al menos un número
  </li>
</ul>
        </div>


        <div class="form-actions">
          <button type="submit" class="submit-btn"><v-icon icon="mdi-content-save-check"></v-icon> <span>Actualizar Perfil</span></button>
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
      </form>
    </div>
  </main>
</div>
</template>



<style>
.return{
  color: black;
  text-decoration: none;
}
.container {
    max-width: 1200px;
    margin: 0 auto;
}

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


/* MAIN CONTENT */
.main-content {
    margin-bottom: 3rem;
}

/* PROFILE SECTION */
.profile-section {
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    border: 1px solid var(--border);
    overflow: hidden;
}

.section-header {
    padding: 2rem;
    border-bottom: 1px solid var(--border);
    text-align: center;
}

.section-header h2 {
    font-size: 1.8rem;
    font-weight: 600;
    color: var(--primary-dark);
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
}

.section-header h2 i {
    color: var(--accent);
}

.section-header p {
    color: var(--text-secondary);
    font-size: 1rem;
}

/* FORM STYLES */
.profile-form {
    padding: 2rem;
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
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

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.form-input {
    width: 100%;
    padding: 1rem 1rem 1rem 3rem;
    border: 2px solid var(--border);
    border-radius: var(--radius-md);
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    transition: var(--transition);
    background: var(--bg-secondary);
}
.select-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.form-select {
    width: 100%;
    padding: 1rem 1rem 1rem 1rem;
    border: 2px solid var(--border);
    border-radius: var(--radius-md);
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    background: var(--bg-secondary);
    appearance: none; /* Oculta el icono por defecto */
    transition: var(--transition);
    cursor: pointer;
}

.form-select:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.select-icon {
    position: absolute;
    right: 1rem;
    pointer-events: none;
    font-size: 1.2rem;
    color: var(--text-light);
    transition: var(--transition);
}

.form-select:hover {
    border-color: var(--primary-dark);
}

.form-select:focus + .select-icon {
    color: var(--accent);
}

.form-input:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input.readonly {
    background: #f1f5f9;
    color: var(--text-light);
    cursor: not-allowed;
}

.input-icon {
    position: absolute;
    left: 1rem;
    color: var(--text-light);
    font-size: 1.1rem;
}

.toggle-password {
    position: absolute;
    right: 1rem;
    background: none;
    border: none;
    color: var(--text-light);
    cursor: pointer;
    font-size: 1.1rem;
    transition: var(--transition);
}

.toggle-password:hover {
    color: var(--accent);
}

.helper-text {
    font-size: 0.85rem;
    color: var(--text-light);
    margin-top: 0.5rem;
    font-style: italic;
}

/* PASSWORD REQUIREMENTS */
.password-requirements {
    background: linear-gradient(135deg, rgba(30, 58, 138, 0.03), rgba(37, 99, 235, 0.03));
    border: 1px solid rgba(59, 130, 246, 0.1);
    border-radius: var(--radius-md);
    padding: 1.5rem;
    margin-bottom: 2rem;
}

.password-requirements h4 {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--primary-dark);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.8rem;
}

.password-requirements h4 i {
    color: var(--accent);
}

.password-requirements ul {
    list-style: none;
    margin: 0;
}

.password-requirements li {
    padding: 0.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    color: var(--text-secondary);
    font-size: 0.95rem;
}

.password-requirements li i {
    width: 16px;
    text-align: center;
}

.password-requirements li.valid {
    color: var(--success);
}

.password-requirements li.valid i {
    color: var(--success);
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
    padding: 1rem 2rem;
    border: none;
    border-radius: var(--radius-md);
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    font-size: 1rem;
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
    padding: 1rem 2rem;
    border: 2px solid var(--border);
    border-radius: var(--radius-md);
    text-decoration: none;
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    font-size: 1rem;
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

</style>