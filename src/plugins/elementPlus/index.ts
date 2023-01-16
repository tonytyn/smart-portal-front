import type { App } from 'vue'

// 需要全局引入一些组件，如ElScrollbar，不然一些下拉项样式有问题
import {
  ElLoading,
  ElMessage,
  ElScrollbar,
  ElTabs,
  ElTabPane,
  ElDivider,
  ElRow,
  ElCol,
  ElCard,
  ElSpace,
  ElLink,
  ElButton,
  ElTag
} from 'element-plus'

const plugins = [ElLoading, ElMessage]

const components = [
  ElScrollbar,
  ElTabs,
  ElTabPane,
  ElDivider,
  ElRow,
  ElCol,
  ElCard,
  ElSpace,
  ElLink,
  ElButton,
  ElTag
]

export const setupElementPlus = (app: App<Element>) => {
  plugins.forEach((plugin) => {
    app.use(plugin)
  })

  components.forEach((component) => {
    app.component(component.name, component)
  })
}
