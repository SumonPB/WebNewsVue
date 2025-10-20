<script setup></script>
<template>
        <div class="login-background">
        <div class="background-overlay"></div>
        <div class="floating-elements">
            <div class="floating-element"></div>
            <div class="floating-element"></div>
            <div class="floating-element"></div>
        </div>
    </div>
</template>

<style>

.login-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;      /* ancho de la ventana */
  height: 100vh;     /* altura de la ventana */
  z-index: -1;
  overflow: hidden;
}

.background-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(30, 58, 138, 0.9), rgba(37, 99, 235, 0.8));
}

.floating-elements {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.floating-element {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    animation: float 6s ease-in-out infinite;
}

.floating-element:nth-child(1) {
    width: 100px;
    height: 100px;
    top: 20%;
    left: 10%;
    animation-delay: 0s;
}

.floating-element:nth-child(2) {
    width: 150px;
    height: 150px;
    top: 60%;
    right: 10%;
    animation-delay: 2s;
}

.floating-element:nth-child(3) {
    width: 80px;
    height: 80px;
    bottom: 20%;
    left: 20%;
    animation-delay: 4s;
}

@keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
}
</style>