import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { useUserStore } from "./user";

export const useNewsStore = defineStore("news", () => {
  const newsLis = ref([]);

const fetchNews = async () => {
    try {
      const userStore = useUserStore();

      let response;
      if (userStore.user && userStore.user.email) {
        response = await axios.get("https://client-1kej.onrender.com/seeNewsOnLog", {
          params: { email: userStore.user.email }
        });
      } else {
        response = await axios.get("https://client-1kej.onrender.com/seeNewsNoLog");
      }

      newsLis.value = response.data;
    } catch (error) {
      console.error("Error al cargar noticias:", error);
    }
  };

  const getNews = (categories) => {
    const cats = Array.isArray(categories) ? categories : [];
    if (cats.length === 0) return newsLis.value;
    return newsLis.value.filter(news => cats.includes(news.categoria));
  };

const insertNews = async (title, content, author, category, subscriptionName, image) => {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("author", author);
    formData.append("category", category);
    formData.append("subscriptionName", subscriptionName);
    if (image) formData.append("image", image); // Solo si hay imagen

    const response = await axios.post(
      "https://news-uy96.onrender.com/InsertNew",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error al insertar la noticia:", error);
    throw error;
  }
};
const updateNew = async(id,title, content, author, category, subscriptionName, image) => {
  try{
    const formData = new FormData();
    formData.append("id",id);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("author", author);
    formData.append("category", category);
    formData.append("subscriptionName", subscriptionName);
    if (image) formData.append("image", image);
    const response = await axios.post(
      "https://news-uy96.onrender.com/ModifyNews",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al insertar la noticia:", error);
    throw error;
  }
}


  
  return { newsLis, getNews, fetchNews, insertNews,updateNew};
});
