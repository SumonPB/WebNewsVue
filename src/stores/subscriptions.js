import { defineStore } from "pinia";
import { ref } from "vue";

export const useSubscriptionStore = defineStore(
    "subscription",()=>{
        const subscriptions = ref([
            {

            },
            {

            },
            {

            }
        ])

      return {subscriptions}  
    }

)