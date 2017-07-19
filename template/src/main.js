// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'whatwg-fetch'
import 'fetch-jsonp'
import 'babel-polyfill'
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'
import config from './app.config'
import App from './App'
import routes from './router'
import utils from 'utils'
import components from './components/global'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

import directive from './common/directives'
import mixin from './common/mixins'
directive.init()
mixin.init()

Vue.config.productionTip = false
Vue.config.errorHandler = config.errorHandler || new Function()

components.forEach(function (component) {
  Vue.component(component.name, component)
})

Vue.use(VueRouter)
Vue.use(ElementUI)

const router = new VueRouter({
  mode: 'history',
  linkActiveClass: 'is-active',
  routes,
  scrollBehavior(to, from, savedPosition){
    if (savedPosition) {
      return savedPosition
    } else {
      let position = {}
      // new navigation.
      // scroll to anchor by returning the selector
      if (to.hash) {
        position.selector = to.hash
      }
      // check if any matched route config has meta that requires scrolling to top
      if (to.matched.some(m => m.meta.scrollToTop)) {
        // cords will be used if no selector is provided,
        // or if the selector didn't match any element.
        position.x = 0
        position.y = 0
      }
      // if the returned position is falsy or an empty object,
      // will retain current scroll position.
      return position
    }
  }
})

let userInfo = utils.getUserInfoFromCache()

//登录超时判断
const loginTimeout = function () {
  return utils.getLoginRemainingTime() <= 0
}

//路由权限判断
const hasPermission = function (routeName) {
  let userInfo = utils.getUserInfoFromCache()
  let permissions = userInfo.permissions || []
  return permissions.indexOf(routeName) !== -1
}

//刷新时重建登录信息store
if (userInfo) {
  if (!loginTimeout()) {
    store.commit('LOGIN', userInfo)
  } else {
    utils.removeUserInfoFromCache()
    store.commit('LOGOUT')
  }
} else {
  store.commit('LOGOUT')
}

NProgress.configure({
  showSpinner: false
});

router.beforeEach((to, from, next) => {
  console.log('即将访问路由：' + to.name)
  NProgress.start()
  // 5s后如果还没加载完成，进度条直接跳转到最后
  setTimeout(() => {
    NProgress.done()
  }, 5000)

  let meta = to.meta || {}
  let auth = config.defaultAuth || false
  if(meta.auth !== undefined) {
    auth = meta.auth
  }
  userInfo = utils.getUserInfoFromCache()
  if (auth) {
    //1.需要登录
    if (!userInfo || loginTimeout()) {
      //2.没有登录信息或者登录已经超时
      next({name: config.loginName})
    } else {
      //2.正常登录状态
      if (to.name === config.loginName) {
        //3.访问登录页时
        if (hasPermission(config.indexName)) {
          //4.如果有首页权限，则直接跳转到首页
          next({name: config.indexName})
        } else {
          //4.没有首页权限，则继续停留在登录页
          next()
        }
      } else {
        //3.访问非登录页
        if (hasPermission(to.name)) {
          //4.如果有权限，则直接访问
          next()
        } else {
          //4.无权限则访问401
          console.log('无权访问路由：' + to.name + ' ，请联系管理员添加！')
          next({name: '401'})
        }
      }
    }
  } else {
    // 1.不需要登录
    if (to.name === config.loginName) {
      // 2.如果访问的是登录页，且登录超时，则直接访问
      if (loginTimeout()) {
        // 3.登录已经超时了
        next()
      } else {
        // 3.登录未超时
        if (hasPermission(config.indexName)) {
          // 4.有访问首页的权限则跳到首页
          next({name: config.indexName})
        } else {
          // 4.没有就继续访问登录页
          next()
        }
      }
    } else {
      // 2.不是登录页直接访问
      next()
    }
  }
})

router.afterEach(() => {
  NProgress.done();
});

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})
