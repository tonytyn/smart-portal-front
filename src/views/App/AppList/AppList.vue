<script setup lang="ts">
import { ElRow, ElCol, ElCard, ElLink } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
const msg =
  '应用使用形式1：所有人无需申请即可使用2：用户自己申请，管理员同意后可以使用3：管理员邀请后可以使用'
const desc = '这里是应用的简要介绍，应该让用户简洁直观的了解应用的大致功能'
// const bodyStyle = {
//   height: '100px'
// }
const viewDetail = () => {
  console.log(123)
}
</script>
<template>
  <h2>{{ msg }}</h2>
  <ContentWrap title="我的应用">
    <el-row :gutter="20">
      <el-col
        v-for="index of 7"
        :key="index"
        :xs="24"
        :sm="12"
        :md="6"
        :lg="4"
        :xl="1"
        style="margin-bottom: 10px"
      >
        <el-card header="考勤系统">
          <p>{{ desc }}</p>
          <el-row>
            <el-col :span="12" style="text-align: center">
              <el-link type="primary" @click="viewDetail">应用详情</el-link>
            </el-col>
            <el-col :span="12" style="text-align: center">
              <el-link type="primary">进入应用</el-link>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </ContentWrap>
  <ContentWrap title="应用列表">
    <el-row>
      <el-col :xs="24" :sm="12" :md="6" :lg="4" :xl="1" style="margin-bottom: 10px">
        <el-card header="设备点检系统">
          <p>{{ desc }}</p>
          <el-link type="primary">进入应用</el-link>
        </el-card>
      </el-col>
    </el-row>
  </ContentWrap>
</template>
