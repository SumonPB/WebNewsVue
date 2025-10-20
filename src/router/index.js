import { createRouter,createWebHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";
import LoginPage from "../views/LoginPage.vue";
import RegisterPage from "../views/RegisterPage.vue";
import UserPage from "../views/UserPage.vue";
import ConfigUser from "../views/ConfigUser.vue";
import UserBuySubscription from "../views/UserBuySubscription.vue";
import UserCategoryChoose from "../views/UserCategoryChoose.vue";
import UserBills from "../views/UserBills.vue";
import AdminPage from "../views/AdminPage.vue";
import InsertNew from "../views/InsertNew.vue";
import Stadistics from "../views/stadistics.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "Home",
            component: HomePage
        },
        {
            path: "/login",
            name: "Login",
            component: LoginPage
        },
        {
            path: "/register",
            name: "Register",
            component: RegisterPage
        },
        {
            path: "/user/",
            name: "user",
            component: UserPage
        },
        {
            path: "/user/config",
            name: "userConfig",
            component:ConfigUser
        },
        {
            path:"/user/buysubscription",
            name: "userBuySubscription",
            component: UserBuySubscription
        },
        {
            path:"/user/choosecategorys",
            name:"userChooseCategorys",
            component: UserCategoryChoose
        },
        {
            path: "/user/bills",
            name: "userSeeBills",
            component: UserBills
        },
        {
            path: "/admin/",
            name: "admin",
            component: AdminPage
        },
        {
            path:"/admin/insertnew",
            name:"adminInsertNew",
            component: InsertNew
        },
        {
            path: "/admin/news/edit/:id",
            name: "adminEditNew",
            component: InsertNew
        },
        {
            path: "/admin/configuser",
            name: "adminConfigUser",
            component:ConfigUser
        },
        {
            path: "/admin/stadistics",
            name: "adminStadistics",
            component: Stadistics
        }

    ]
});

export default router;