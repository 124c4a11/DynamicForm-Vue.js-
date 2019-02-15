import Vue from 'vue'
import App from './App.vue'
import vuelidate from 'vuelidate'

Vue.config.productionTip = false

Vue.use(vuelidate)

new Vue({
  render: h => h(App)
}).$mount('#app')
