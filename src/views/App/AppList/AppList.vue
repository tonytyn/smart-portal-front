<script setup lang="ts">
import { ref } from 'vue'
import { ContentWrap } from '@/components/ContentWrap'
import { Dialog } from '@/components/Dialog'
const msg =
  '应用使用形式1：所有人无需申请即可使用2：用户自己申请，管理员同意后可以使用3：管理员邀请后可以使用'
const desc =
  '这里是应用的简要介绍，应该让用户简洁直观的了解应用的大致功能。文字不要太多，超出后会隐藏'
// const bodyStyle = {
//   height: '100px'
// }
const tabName = ref('authorized')
const dialogVisible = ref(false)
const viewDetail = () => {
  dialogVisible.value = true
}
const enter = () => {
  console.log(123)
}
</script>
<template>
  <el-tabs v-model="tabName" type="border-card">
    <el-tab-pane label="已授权" name="authorized">
      <ContentWrap title="常用">
        <el-row :gutter="30">
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="3">
            <el-card shadow="hover" class="mycard">
              <el-space wrap fill>
                <span class="title"> 系统名称不能超过一行不然就 </span>
                <span class="brief">{{ desc }}</span>
                <span>
                  <el-link type="primary" @click="viewDetail">详情</el-link>
                </span>
                <el-button @click="enter" type="primary" plain>进入应用</el-button>
              </el-space>
            </el-card>
          </el-col>
          <el-col v-for="index of 7" :key="index" :xs="24" :sm="12" :md="6" :lg="6" :xl="3">
            <el-card shadow="hover" class="mycard">
              <el-space wrap fill>
                <span class="title"> 考勤系统 </span>
                <span class="brief">{{ desc }}</span>
                <span>
                  <el-link type="primary" @click="viewDetail">详情</el-link>
                </span>
                <el-button @click="enter" type="primary">进入应用</el-button>
              </el-space>
            </el-card>
          </el-col>
        </el-row>
      </ContentWrap>
      <ContentWrap title="不常用">
        <el-row>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="3">
            <el-card shadow="hover" class="mycard">
              <el-space wrap fill>
                <span class="title"> 设备点检系统 </span>
                <span class="brief">{{ desc }}</span>
                <span>
                  <el-link type="primary" @click="viewDetail">详情</el-link>
                </span>
                <el-button @click="enter" type="primary">进入应用</el-button>
              </el-space>
            </el-card>
          </el-col>
        </el-row>
      </ContentWrap>
    </el-tab-pane>
    <el-tab-pane label="未授权" name="unauthorized" style="padding: 20px">
      <el-row :gutter="30">
        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="3">
          <el-card shadow="hover" class="mycard">
            <el-space wrap fill>
              <span class="title"> 这个应用您还没有使用权限 </span>
              <span class="brief">{{ desc }}</span>
              <span>
                <el-link type="primary" @click="viewDetail">详情</el-link>
              </span>
              <el-button @click="enter" type="primary" plain>申请使用</el-button>
            </el-space>
          </el-card>
        </el-col>
      </el-row>
    </el-tab-pane>
  </el-tabs>
  <Dialog v-model="dialogVisible" title="应用详情">
    <ul>
      <li>应用功能：人力资源部</li>
      <li>目标用户：集团所有正式员工</li>
      <li>创建人：张三</li>
      <li>负责部门：人力资源部</li>
      <li>联系方式：钉钉搜索12345677654321，电话：138888438</li>
      <li>{{ msg }}</li>
    </ul>
    <template #footer>
      <ElButton @click="dialogVisible = false"> 关闭 </ElButton>
    </template>
  </Dialog>
</template>
<style lang="less" scoped>
.mycard {
  margin-bottom: 20px;
  border-radius: 20px;
  transition: all 0.5s;

  .title {
    display: -webkit-box;
    /* 超出范围隐藏 */
    overflow: hidden;
    font-weight: bolder;
    /* 文字超出用省略号 */
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }

  .brief {
    display: -webkit-box;
    overflow: hidden;
    font-size: smaller;
    color: slategray;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }
}

.mycard:hover {
  transform: scale(1.1);
}
</style>
