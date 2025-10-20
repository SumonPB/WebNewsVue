import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useUserStore } from "./user";

export const useCategoryStore = defineStore("category", () => {
  const userStore = useUserStore();

  const categories = ref([
    "TECNOLOGIA",
    "POLITICA",
    "ENTRETENIMIENTO",
    "SALUD",
  ]);

  // Inicializa selected con las categorías del usuario si existen
  const selected = ref(userStore.user.category ? [...userStore.user.category] : []);

  // Mantener selected actualizado si cambia el usuario
  watch(() => userStore.user.category, (newCategories) => {
    selected.value = newCategories ? [...newCategories] : [];
  });

  function toggleCategory(category) {
    if (selected.value.includes(category)) {
      selected.value = selected.value.filter(c => c !== category);
    } else {
      selected.value.push(category);
    }
    userStore.user.categorys = [...selected.value];
  }

  return {
    categories,
    selected,
    toggleCategory,
  };
});
