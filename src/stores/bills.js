  import axios from "axios";
  import { defineStore } from "pinia";
  import { ref,computed } from "vue";
  import { useUserStore } from "./user";

  export const useBillStore = defineStore("bill", () => {
    const bills = ref([]);
    

    const createBill = (newBill) => {
      bills.value.push(newBill);
    };

    const setBills = (billList) => {
      bills.value = billList;
    };
    
    const getBills = () => {
      return bills.value;
    };
    
    const fetchBills = async () => {
      const userStore = useUserStore();
          const response = await axios.get("https://client-1kej.onrender.com/seeAllBills",{
            params: {email: userStore.user.email}
          })
          setBills(response.data)
    }

    const fetchBillsAdmin = async () => {
      const response = await axios.get("https://payment-uylw.onrender.com/GetAllPayments");
      setBills(response.data);
    };

    // Estadísticas calculadas automáticamente
    const porMes = computed(() => {
      const res = {};
      bills.value.forEach(b => {
        const date = new Date(b.startSubscription);
        const mes = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2,'0')}`;
        res[mes] = (res[mes] || 0) + 1;
      });
      return res;
    });

    const porTipo = computed(() => {
      const res = {};
      bills.value.forEach(b => {
        res[b.subscriptionName] = (res[b.subscriptionName] || 0) + 1;
      });
      return res;
    });

    const totalGanancias = computed(() => bills.value.reduce((acc, b) => acc + (b.amount || 0), 0));

    const activas = computed(() => {
      const now = new Date();
      return bills.value.filter(b => new Date(b.endSubscription) > now).length;
    });

    const meses = computed(() => new Set(Object.keys(porMes.value)));


    return { createBill, bills, setBills, getBills, fetchBills, porMes, porTipo, totalGanancias, activas, meses, fetchBillsAdmin};
  });


