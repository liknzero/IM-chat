<template>
  <van-popup v-model="dialogData.show" closeable>
    <div class="popClass">
      <img :src="dialogData.imgContent" />
      <div>{{dialogData.text}}</div>
      <p v-html="dialogData.contentDetails"></p>
    </div>
  </van-popup>
</template>

<script>
export default {
  name: "DialogCode",
  props: {
    dialogData: {
      default: {
        show: false,
        imgContent: "",
        text: "",
        contentDetails: "",
      },
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="less" scoped>
.popClass {
  width: 452px;
  padding: 96px 54px 54px;
  background: #fff;
  text-align: center;
  img {
    width: 240px;
    height: 240px;
  }
  div {
    font-size: 34px;
    font-weight: 600;
    color: rgba(44, 44, 51, 1);
  }
  p {
    margin: 20px 0 0;
    padding: 0;
    font-size: 24px;
    font-weight: 400;
    color: rgba(144, 144, 153, 1);
  }
}
</style>
