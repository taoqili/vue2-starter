/**
 * Created by Webstorm.
 * @author taoqili
 * @date 2017/7/3
 */
export default {
  // 应用名称
  appName: '非常可乐',
  // 布局配置
  layout: {
    topbar: 2,  //0 hidden; 1 show; 2 fixed
    sidebar: 1  //0 hidden; 1 show;
  },
  // 侧边栏风格
  sidebarTheme: 'light',  // light; dark
  // session有效时间 ms
  sessionDuration: 30 * 60 * 1000,
  // 修改请求头
  headers: {
    'Content-Type': 'application/json'
  },
  // 默认是否开启权限校验
  defaultAuth: false,
  // 首页路由名称
  indexName: 'indexHome',
  // 登录页路由名称
  loginName: 'userLogin',
  // 预渲染路由列表
  preRenderRouters: [],
  // 渲染错误处理
  errorHandler(e){
    console.log('捕获到了错误：' + e)
  }
}