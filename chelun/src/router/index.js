import Vue from 'vue'
import Router from 'vue-router'
// import Index from '../components/Index.vue'

const Index = () =>
    import ("../components/Index.vue");
const Detail = () =>
    import ("../components/Detail.vue");
const Imgs = () =>
    import ("../components/Imgs.vue");
const routes = [{
        path: '/',
        name: 'Index',
        component: Index
    },
    {
        path: "/detail",
        name: Detail,
        component: Detail
    },
    {
        path: "/Imgs",
        name: Imgs,
        component: Imgs
    }
]

Vue.use(Router)
export default new Router({
    routes
})