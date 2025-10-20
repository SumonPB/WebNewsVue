import { ref } from "vue";

export const alerts = ref([]);

export function showAlert(msg, type = "error", duration = 2000) {
  alerts.value.push({ msg, type });

  setTimeout(() => {
    const alertContainer = document.getElementById("alerts-container");
    if (alertContainer) {
      alertContainer.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, 30);

  setTimeout(() => {
    alerts.value.shift();
  }, duration);
}
