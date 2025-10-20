    import { defineStore } from "pinia";
    import { ref } from "vue";
    import axios from "axios";
    import { useNewsStore } from "../stores/news";
    import { nextTick } from 'vue';
    import { useCategoryStore } from "../stores/categorys";
import { useBillStore } from "./bills";
import router from "../router"; 
    export const useUserStore = defineStore(
        "user", ()=>{

  const user = ref({
    name: "",
    email: "",
    password: "",
    subscription: false,
    nickname: "",
    categorys: []
  });
const isAdmin = ref(false);  
const isLoading = ref(false);

const createUser = async (name, nickname, email, password) => {
  const response = await axios.post("https://client-1kej.onrender.com/InsertClient", {
    name,
    nickname,
    email,
    password,
  })
  return response.data;
};


    const validation = async (email, password) => {
    try {
      const responseAdm = await axios.get("https://client-1kej.onrender.com/validateAdmin", {
        params: { email, password }
      });
      if(responseAdm.data === true){
        isAdmin.value = true;
        await getData(email);
        router.push({name: "admin"})
        return true;
      }
        const responseCli = await axios.get("https://client-1kej.onrender.com/validate", {
        params: { email, password }
      });
        if(responseCli.data === true){
        await getData(email);
        router.push({name: "user"})
          return true;
        }

        return false
    } catch (error) {
      return false;
    }
  };

const getData = async(email)=>  {
        const billStore = useBillStore();  
  const [response2, response3] = await Promise.all([
    axios.get("https://client-1kej.onrender.com/GetClientByEmail", { params: { email } }),
    axios.get("https://client-1kej.onrender.com/seeAllBills", { params: { email } })
  ]);

  billStore.setBills(response3.data);
  user.value = response2.data;
}



const searchedUser = ref({
  name: "",
  email: "",
  subscription: false,
  nickname: "",
  categorys: []
})


const getUserByEmail = async (email) => {
  try {
    const billStore = useBillStore();
    const [resUser, resBills] = await Promise.all([
      axios.get("https://client-1kej.onrender.com/GetClientByEmail", { params: { email } }),
      axios.get("https://client-1kej.onrender.com/seeAllBills", { params: { email } })
    ]);
    searchedUser.value = resUser.data; 
    billStore.setBills(resBills.data);
    return searchedUser.value;
  } catch (error) {
    console.error("Error obteniendo datos del usuario buscado:", error)
    return null;
  }
}


const buySubscription = async (subscriptionName, methodPay) => {
  try {
    isLoading.value = true;
    const response = await axios.post(
      "https://client-1kej.onrender.com/buySubscription",
      null, // cuerpo vacío
      {
        params: {
          email: user.value.email,
          subscriptionName,
          methodPay,
        },
      }
    );

    user.value = response.data;
    await nextTick();
    const newsStore = useNewsStore();
    await newsStore.fetchNews();

    const billStore = useBillStore();
    await billStore.fetchBills();  

  } catch (error) {

    throw error;
  }finally {
    isLoading.value = false;
  }
};

  const choseCategories = async () => {
    const categoryStore = useCategoryStore();
    try {
      const response = await axios.post(
        "https://client-1kej.onrender.com/choseCategories",
        null, // no body, porque van como parámetros
        {
          params: {
            email: user.value.email,
            categories: categoryStore.selected,
          },
        }
      );
      user.value = response.data;

      await nextTick();
      const newsStore = useNewsStore();
      await newsStore.fetchNews();
    } catch (error) {
      throw error;
    }
  };
      
  const updateUser = async(email,name,nickname,password,subscriptionName=null) => {
    let response; 
    if(isAdmin.value){
        console.log(" Paso por Admin")
    response = await axios.post("https://client-1kej.onrender.com/updateCli", {
    name,
    nickname,
    email,
    password,
    ...(subscriptionName ? { subscriptionName } : {})
  })
    }else{
         response = await axios.post("https://client-1kej.onrender.com/updateClient", {
    name,
    nickname,
    email,
    password,
  })
      user.value.email=email;
      user.value.nickname=nickname;
      user.value.name= name;
      }
      return response.data;
    }
      

    return {
        validation,user,updateUser,buySubscription,choseCategories,createUser,isAdmin,getUserByEmail
    }
        }
    );