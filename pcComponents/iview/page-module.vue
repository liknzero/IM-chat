<template>
  <section class="section-page">
    <Page
      :total="handleData.total"
      :page-size="handleData.pageSize"
      :current="handleData.pageNum"
      :show-total="handleConfig.showTotal"
      :show-elevator="handleConfig.showElevator"
      :show-sizer="handleConfig.showSizer"
      :page-size-opts="handleConfig.pageOpts"
      :transfer="handleConfig.transfer"
      @on-change="onCurrentChange"
      @on-page-size-change="onSizeChange"
    />
  </section>
</template>

<script>
export default {
  name: 'page-module',
  props: {
    handleData: {
      type: Object,
      default: () => {
        return {
          total: 10, // 数据总条数
          pageSize: 10, // 分页
          pageNum: 1 // 当前页码
        }
      }
    },
    handleConfig: {
      type: Object,
      default: () => {
        return {
          showTotal: true, // 显示总条数
          showElevator: true, // 显示跳转功能
          showSizer: true, // 显示分页
          pageOpts: [10, 20, 50, 100],
          transfer: true
        }
      }
    }
  },
  methods: {
    onCurrentChange (page) {
      this.$emit('onCurrentChange', page)
    },
    onSizeChange (size) {
      this.$emit('onSizeChange', size)
    }
  }
}
</script>

<style lang="less" scoped>
.section-page {
  padding-bottom: 20px;
}
</style>
