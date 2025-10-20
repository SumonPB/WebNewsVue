<script setup>
import LoginBG from '../components/loginBGComponent.vue';
import LoginBoxComponent from '../components/loginBoxComponent.vue';

</script>
<template>
<LoginBG/>
<LoginBoxComponent/>    
</template>

<style scoped> 
.body {
    font-family: 'Poppins', sans-serif;
    background: linear-gradient(135deg, #f0f9ff 0%, #f8fafc 100%);
    color: var(--text-primary);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow-x: hidden;
}
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
</style>