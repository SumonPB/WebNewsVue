<script setup>
import FooterComponent from '../components/footerComponent.vue';
import HeaderComponent from '../components/headerComponent.vue';
import NewComponent from '../components/newComponent.vue';

</script>
<template>
    <div class="app-container">
    <HeaderComponent/>
    <NewComponent/>
    <FooterComponent/>
    </div>

</template>
<style>
.app-container {
  margin: 0;
  width: 100%;
  min-height: 100vh;
}
main, header, footer {
  margin: 0;
  padding: 0;
}
</style>