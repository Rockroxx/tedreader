
import Home from './home/home.vue';
import About from './about/about.vue';
import Search from './ted/index.vue';
import View from './ted/show.vue';
import Sitemap from './sitemap/sitemap.vue';
import Disclaimer from './disclaimer/disclaimer.vue';


export default [
    { path: '/', component: Home},
    { path: '/about', component: About},
    { path: '/search', component: Search},
    { path: '/view/:slug', component: View},
    { path: '/sitemap', component: Sitemap},
    { path: '/disclaimer', component: Disclaimer}
];