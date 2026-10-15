import Vue from 'vue'
import uView from '@/uni_modules/uview-ui'
import App from './App'
import store from "./store";
import MyScroll from '@/components/my-scroll.vue'
import MyTitle from '@/components/my-title.vue'
import MyTitle2 from '@/components/my-title2.vue'
import MyHeadline from '@/components/headline/index.vue'
import MyHeadlineSelect from '@/components/headline/select.vue'
import MyDropMenu from "@/components/drop-menu.vue"
import MySelect from '@/components/my-select/index.vue'
import MyScanBtn from '@/components/my-scan-btn.vue'
import MyTable from '@/components/my-table/index.vue'
import MyToolNav from '@/components/my-tool-nav/index.vue'

import {
	navBarHeight,
	tabbarHeight
} from '@/config/index.js'

import {
	getRootFontSize,
	px2rem,
	px2rem2pxNumber
} from './utils/rootFontSize.js'


Vue.config.productionTip = false
App.mpType = 'app'

// 屏蔽警告 主要原因是 微信小程序 vfor内渲染 vslot 造成控制台卡死 暂屏蔽
console.warn = function() {}

Vue.use(uView);
Vue.component('my-scroll', MyScroll)
Vue.component('my-title', MyTitle)
Vue.component('my-title2', MyTitle2)
Vue.component("my-headline", MyHeadline)
Vue.component("my-headline-select", MyHeadlineSelect)
Vue.component("my-drop-menu", MyDropMenu)
Vue.component("my-select", MySelect)
Vue.component("my-scan-btn", MyScanBtn)
Vue.component("my-table", MyTable)
Vue.component("my-tool-nav", MyToolNav)

// vuex
Vue.prototype.$store = store;
// meta rem 自适应
Vue.prototype.getRootFontSize = getRootFontSize
Vue.prototype.px2rem = px2rem
Vue.prototype.px2rem2pxNumber = px2rem2pxNumber
// 高度
Vue.prototype.navBarHeight = navBarHeight
Vue.prototype.tabbarHeight = tabbarHeight

const app = new Vue({
	...App,
})
app.$mount()