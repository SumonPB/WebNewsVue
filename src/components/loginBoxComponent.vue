<script setup>
import { reactive, ref} from 'vue';
import { useUserStore } from "../stores/user";
import router from '../router';
import { alerts, showAlert } from "../utils/alerts";


const user = reactive({
    email:"",
    password:"",
    subscriptionOn:""
})
const userStore = useUserStore();
const incorrect = ref(false)

const password = ref("")
const showPassword = ref(false);

const validation = async () => {
  try {
    const val = await userStore.validation(user.email, user.password);

    if (val) {
      showAlert("Usuario y contraseña correctos", "success");
    } else {
      showAlert("Usuario o contraseña incorrectos", "error");
    }

  } catch (error) {
    console.error("Error durante la validación:", error);
    showAlert("Ocurrió un error en el servidor", "error");
  }
};


</script>
<template>
<div class="login-container">
    <div class="login-card">
            <div class="login-header">
                <div class="logo">
                    <v-icon icon="mdi-account" min-width="50" height="50"></v-icon>
                    <v-icon icon="mdi-newspaper"></v-icon>
                </div>
                <h1>Bienvenido</h1>
                <p class="subtitle">Inicia sesión para continuar</p>
            </div>
            <div class="form_login">
                <form @submit.prevent="validation" class="login-form">
                    <div class="input-group">
                        <label for="email">
                        <v-icon icon="mdi-email"></v-icon>
                        Correo electrónico
                    </label>
                    
                    <div class="input-wrapper">
                    <input v-model="user.email" type="email" id="email" class="form-input" placeholder="Email" required>
                    </div>
                    </div>
                    <div class="input-group">
                                            <label for="password">
                    <v-icon icon="mdi-lock"></v-icon>
                    Contraseña
                        <span class="required">*</span>
                        </label>
                    </div>

  <div class="password-container">
    
    <input
    id="password"   
      :type="showPassword ? 'text' : 'password'"
      v-model="user.password"
      placeholder="Password"
      class="password-input"
    />
    <button type="button" class="toggle-btn" @click="showPassword = !showPassword">
      <v-icon>{{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
    </button>
  </div>
                    
                    <button class="login-button">Ingresar</button>
                                <div v-if="alerts.length" id="alerts-container" class="alerts">
  <p v-for="(alert, i) in alerts" :key="i" :class="alert.type">{{ alert.msg }}</p>
</div>
                </form>

                <div class="divider">
                <span>o continúa con</span>
            </div>
                        <div class="social-login">
                        <v-btn icon="mdi-facebook" min-width="50" height="50" class="social-button facebook"> </v-btn>
                        <v-btn icon="mdi-google" min-width="50" height="50" class="social-button google"></v-btn>
                        <v-btn icon="mdi-twitter" min-width="50" height="50" class="social-button twitter"></v-btn>
            </div>

            <div class="register-link">
                <p>
                    ¿No tienes una cuenta? Regístrate
                    <RouterLink class="link" to="/register">aquí</RouterLink>
                </p>
                
            </div>

            </div>


            </div>
</div>
</template>

<style>
.login-container {
  position: absolute;
  top: 30px;                
  left: 50%;               
  transform: translateX(-50%);
  width: 100%;
  max-width: 450px;
  padding: 1.5rem;         
  z-index: 10;
}

.login-card {
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--border);
    overflow: hidden;
    position: relative;
    animation: slideUp 0.6s ease-out;
}
.alerts {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 400px;
  margin: 1rem auto;
}


@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.login-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: var(--gradient-primary);
}

/* LOGIN HEADER */
.login-header {
    text-align: center;
    padding: 2.5rem 2rem 1.5rem;
    background: linear-gradient(135deg, rgba(30, 58, 138, 0.03), rgba(37, 99, 235, 0.03));
    border-bottom: 1px solid var(--border);
}

.logo {
    width: 80px;
    height: 80px;
    background: var(--gradient-primary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
    box-shadow: var(--shadow-md);
}

.logo i {
    font-size: 2.5rem;
    color: white;
}

.login-header h1 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary-dark);
    margin-bottom: 0.5rem;
}

.subtitle {
    color: var(--text-secondary);
    font-size: 1.1rem;
    line-height: 1.6;
}
.form_login{
    display: flex;
    flex: auto;
    align-items: center;
    flex-direction: column;
}
.form{
  
  display: flex;
  flex-direction: column;

}

login-form {
    padding: 2rem;
}

.input-group {
    margin-bottom: 1.5rem;
}

.input-group label {
    display: block;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.8rem;
    display: flex;
    align-items: start;
    gap: 0.5rem;
}

.input-group label i {
    color: var(--accent);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.password-container {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 0 0.5rem;
  background: #fff;
  width: 100%;
  max-width: 400px;
}

.password-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 0.7rem;
  font-size: 1rem;
  background: transparent;
}

.toggle-btn {
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

.toggle-btn:hover {
  color: var(--accent, #007bff);
}

.form-input {
    width: 100%;
    padding: 1.2rem 3.5rem 1.2rem 3.5rem;
    border: 2px solid var(--border);
    border-radius: var(--radius-md);
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    transition: var(--transition);
    background: var(--bg-secondary);
}

.form-input:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.login-button {
    width: 100%;
    background: var(--gradient-primary);
    color: white;
    padding: 1.2rem;
    border: none;
    border-radius: var(--radius-md);
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    font-size: 1.1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
    transition: var(--transition);
    box-shadow: var(--shadow-md);
    margin-top: 20px;
}

.login-button:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-lg);
}

.login-button:active {
    transform: translateY(-1px);
}
.error-message{
    display: flex;
    justify-content: center;
    margin: 2px;
    font-size: 1.1rem;
    color: red;
}

.divider {
    text-align: center;
    position: relative;
    margin: 2rem 0;
    color: var(--text-light);
    font-size: 0.9rem;
}

.divider::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: var(--border);
    z-index: 1;
}

.divider span {
    background: var(--bg-secondary);
    position: relative;
    z-index: 2;
    padding: 0 1rem;
}
/* SOCIAL LOGIN */
.social-login {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin: 2rem 0;
}

.social-button {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 2px solid var(--border);
    background: var(--bg-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    transition: var(--transition);
}

.social-button:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
}

.social-button.google:hover {
    border-color: #db4437;
    color: #db4437;
}

.social-button.facebook:hover {
    border-color: #4267B2;
    color: #4267B2;
}

.social-button.twitter:hover {
    border-color: #1DA1F2;
    color: #1DA1F2;
}

.register-link {
    text-align: center;
    padding: 2rem;
    border-top: 1px solid var(--border);
    background: linear-gradient(135deg, rgba(30, 58, 138, 0.02), rgba(37, 99, 235, 0.02));
}

.register-link p {
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
}

.register-link RouterLink {
    color: var(--accent);
    text-decoration: none;
    font-weight: 600;
    transition: var(--transition);
}

.register-link a:hover {
    color: var(--primary-dark);
    text-decoration: underline;
}
.required {
    color: var(--danger);
    font-size: 1.2rem;
}
</style>