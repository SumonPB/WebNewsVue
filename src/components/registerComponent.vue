<script setup>
import { ref, reactive, watch } from "vue";
import { useUserStore } from "../stores/user";
import router from "../router";
import { alerts, showAlert } from "../utils/alerts";

const userStore = useUserStore();

// Datos del formulario
const form = reactive({
  name: "",
  nickname: "",
  email: "",
  password: "",
  acceptedTerms: false,
});

// Mostrar/ocultar contraseña
const showPassword = ref(false);

// Requisitos de contraseña
const passwordRequirements = reactive({
  length: false,
  uppercase: false,
  lowercase: false,
  number: false,
});

// Watch para validar la contraseña en tiempo real
watch(
  () => form.password,
  (newVal) => {
    passwordRequirements.length = newVal.length >= 8;
    passwordRequirements.uppercase = /[A-Z]/.test(newVal);
    passwordRequirements.lowercase = /[a-z]/.test(newVal);
    passwordRequirements.number = /\d/.test(newVal);
  }
);

// Validación del formulario
const validateForm = () => {
  if (!form.name.trim() || !form.nickname.trim() || !form.email.trim() || !form.password.trim()) {
    showAlert("Por favor, completa todos los campos obligatorios.", "error");
    return false;
  }

  if (form.name.length < 2) {
    showAlert("El nombre debe tener al menos 2 caracteres.", "error");
    return false;
  }

  if (form.nickname.length < 3) {
    showAlert("El apodo debe tener al menos 3 caracteres.", "error");
    return false;
  }

  if (!Object.values(passwordRequirements).every((v) => v)) {
    showAlert("La contraseña no cumple con los requisitos mínimos.", "error");
    return false;
  }

  if (!form.acceptedTerms) {
    showAlert("Debes aceptar los términos y condiciones para continuar.", "error");
    return false;
  }

  return true;
};

const regis = async () => {
  if (!validateForm()) return;
try {
  const responseCon = await userStore.createUser(form.name, form.nickname, form.email, form.password);

  if (responseCon.includes("Usuario creado correctamente")) {
      showAlert(responseCon, "success");
      setTimeout(() => router.push({ name: "Login" }), 2000);
  } else {
      showAlert(responseCon, "error");
  }
} catch (error) {
    showAlert(error.response?.data || "Error al registrar usuario", "error");
}

};

</script>

<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <div class="logo">
          <v-icon icon="mdi-account-plus-outline"></v-icon>
        </div>
        <h1>Crear Cuenta</h1>
        <p class="subtitle">Únete a nuestra comunidad de lectores</p>

        <form @submit.prevent="regis" class="register-form">
          <div class="form-section">
            <h3><v-icon icon="mdi-account"></v-icon> Información Personal</h3>

            <!-- Nombre -->
            <div class="input-group">
              <label for="name">
                <v-icon icon="mdi-account"></v-icon>
                Nombre Completo
                <span class="required">*</span>
              </label>
              <div class="input-wrapper">
                <input
                  v-model="form.name"
                  type="text"
                  id="name"
                  placeholder="Ingresa tu nombre completo"
                  class="form-input"
                  required
                />
              </div>
              <span class="helper-text">Tu nombre será visible para otros usuarios</span>
            </div>

            <!-- Nickname -->
            <div class="input-group">
              <label for="nickname">
                <v-icon icon="mdi-account-tag"></v-icon>
                Nombre de Usuario
                <span class="required">*</span>
              </label>
              <div class="input-wrapper">
                <input
                  v-model="form.nickname"
                  type="text"
                  id="nickname"
                  placeholder="Elige un nombre de usuario único"
                  class="form-input"
                  required
                />
              </div>
              <span class="helper-text">Será tu identificador único en la plataforma</span>
            </div>
          </div>

          <div class="form-section">
            <h3><v-icon icon="mdi-lock"></v-icon> Acceso</h3>

            <!-- Email -->
            <div class="input-group">
              <label for="email">
                <v-icon icon="mdi-email"></v-icon>
                Correo Electrónico
                <span class="required">*</span>
              </label>
              <div class="input-wrapper">
                <input
                  v-model="form.email"
                  type="email"
                  id="email"
                  placeholder="Ingresa tu correo electrónico"
                  class="form-input"
                  required
                />
              </div>
              <span class="helper-text">Usaremos este correo para confirmar tu cuenta</span>
            </div>

            <!-- Contraseña -->
            <div class="input-group">
              <label for="password">
                <v-icon icon="mdi-lock"></v-icon>
                Contraseña
                <span class="required">*</span>
              </label>
              <div class="password-container">
                <v-icon icon="mdi-lock" class="password_icon"></v-icon>
                <input
                  id="password"
                  :type="showPassword ? 'text' : 'password'"
                  v-model="form.password"
                  placeholder="Crea una contraseña segura"
                  class="password-input"
                  required
                />
                <button type="button" class="toggle-btn" @click="showPassword = !showPassword">
                  <v-icon>{{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
                </button>
              </div>

              <!-- Requisitos dinámicos -->
              <ul class="password-requirements">
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
          </div>

          <div v-if="alerts.length" id="alerts-container" class="alerts">
  <p v-for="(alert, i) in alerts" :key="i" :class="alert.type">{{ alert.msg }}</p>
</div>
          <!-- Aceptar términos -->
          <div class="terms-agreement">
            <label class="checkbox-container">
              <input type="checkbox" v-model="form.acceptedTerms" required />
              <span class="checkmark"></span>
              <span class="terms-text">
                Acepto los
                <a href="#" class="terms-link">Términos de Servicio</a> y
                <a href="#" class="terms-link">Política de Privacidad</a>
              </span>
            </label>
          </div>

          <!-- Botones -->
          <button class="register-button">
            <v-icon icon="mdi-account-plus-outline"></v-icon>
            <span>Crear Cuenta</span>
          </button>

          <v-btn class="login-button" to="/login" variant="flat" elevation="0">
            <v-icon icon="mdi-account"></v-icon>
            <span>Ya tengo Cuenta</span>
          </v-btn>
        </form>
      </div>
    </div>
  </div>
</template>


<style>
.register-container {
  position: absolute;
  top: 30px;                
  left: 50%;               
  transform: translateX(-50%);
  width: 100%;
  max-width: 550px;
  padding: 1.5rem;         
  z-index: 10;
}

.register-card {
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--border);
    overflow: hidden;
    position: relative;
    animation: slideUp 0.6s ease-out;
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

.register-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: var(--gradient-primary);
}

/* REGISTER HEADER */
.register-header {
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

.register-header h1 {
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
@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

.logo {
    animation: pulse 2s infinite;
}

.register-form {
    padding: 2rem;
}
.form-section {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--border);
}

.form-section:last-child {
    border-bottom: none;
    margin-bottom: 1.5rem;
}

.form-section h3 {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--primary-dark);
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--accent);
}

.form-section h3 i {
    color: var(--accent);
}

.input-group {
    margin-bottom: 1.5rem;
}

.input-group:last-child {
    margin-bottom: 0;
}

.input-group label {
    display: block;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.8rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.input-group label i {
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

.input-icon {
    position: absolute;
    left: 1.2rem;
    color: var(--text-light);
    font-size: 1.2rem;
}
.helper-text {
    font-size: 0.85rem;
    color: var(--text-light);
    margin-top: 0.5rem;
    font-style: italic;
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
.password_icon {
  position: absolute;
  left: 0.4rem;
  top: 100%;
  transform: translateY(-10%);
  color: var(--text-light);
  pointer-events: none;
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


.terms-agreement {
    margin-bottom: 2rem;
}

.checkbox-container {
    display: flex;
    align-items: flex-start;
    gap: 0.8rem;
    cursor: pointer;
}

.checkbox-container input[type="checkbox"] {
    display: none;
}

.checkmark {
    width: 20px;
    height: 20px;
    border: 2px solid var(--border);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
    flex-shrink: 0;
    margin-top: 2px;
}

.checkbox-container input[type="checkbox"]:checked + .checkmark {
    background: var(--accent);
    border-color: var(--accent);
}

.checkbox-container input[type="checkbox"]:checked + .checkmark::after {
    content: '✔';
    font-family: 'Font Awesome 6 Free';
    font-weight: 900;
    color: white;
    font-size: 0.7rem;
}

.terms-text {
    color: var(--text-secondary);
    font-size: 0.9rem;
    line-height: 1.5;
}

.terms-link {
    color: var(--accent);
    text-decoration: none;
    font-weight: 600;
}

.terms-link:hover {
    text-decoration: underline;
}

.register-button,
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
}

.register-button:hover,
.login-button {
    transform: translateY(-3px);
    box-shadow: var(--shadow-lg);
}

.register-button:active,
.login-button {
    transform: translateY(-1px);
}
/* PASSWORD REQUIREMENTS */
.password-requirements {
    margin-top: 5%;
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
/* === TU ESTILO ORIGINAL (sin cambios) === */
/* Todo tu código anterior va aquí arriba */

/* === ESTILOS RESPONSIVOS === */
@media (max-width: 1024px) {
  .register-container {
    top: 20px;
    padding: 1rem;
  }

  .register-card {
    max-width: 480px;
  }

  .register-header h1 {
    font-size: 1.8rem;
  }

  .form-section h3 {
    font-size: 1.1rem;
  }
}

@media (max-width: 768px) {
  .register-container {
    width: 90%;
    padding: 1rem;
  }

  .register-card {
    box-shadow: var(--shadow-md);
  }

  .register-header {
    padding: 2rem 1rem 1rem;
  }

  .logo {
    width: 70px;
    height: 70px;
  }

  .register-header h1 {
    font-size: 1.6rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .form-section {
    margin-bottom: 1.2rem;
  }

  .form-input {
    padding: 1rem 3rem 1rem 3rem;
    font-size: 0.95rem;
  }

  .password-container {
    max-width: 100%;
  }

  .register-button,
  .login-button {
    font-size: 1rem;
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .register-container {
    top: 10px;
    width: 95%;
    padding: 0.5rem;
  }

  .register-card {
    border-radius: var(--radius-md);
  }

  .register-header {
    padding: 1.5rem 1rem 1rem;
  }

  .logo {
    width: 60px;
    height: 60px;
  }

  .register-header h1 {
    font-size: 1.4rem;
  }

  .subtitle {
    font-size: 0.9rem;
  }

  .form-section h3 {
    font-size: 1rem;
  }

  .form-input {
    font-size: 0.9rem;
    padding: 0.9rem 2.5rem 0.9rem 2.5rem;
  }

  .checkbox-container {
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
  }

  .terms-text {
    font-size: 0.85rem;
  }

  .register-button,
  .login-button {
    padding: 0.9rem;
    font-size: 0.95rem;
  }

  .password-requirements {
    padding: 1rem;
  }

  .password-requirements li {
    font-size: 0.85rem;
  }
}
</style>