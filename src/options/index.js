import Vue from 'vue'
import root from './root.vue'
Vue.config.productionTip = false

new Vue({ // eslint-disable-line no-new
  el: '#root',
  render: h => h(root)
})
