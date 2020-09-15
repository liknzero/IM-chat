<template>
    <div class="ys-float-btn"
         :style="{'width': itemWidth+'px','height': itemHeight+'px','left': left+'px','top': top+'px'}"
         ref="div"
        @touchstart.stop.prevent="(e) => {dragStart(e)}"
        @touchend.stop.prevent="(e) => {dragEnd(e)}"
        @touchmove.stop.prevent="(e) => {dragProgress(e)}"
    >
        <img class="menu-icon" src="/waps/images/icon-cate.png" />
    </div>
</template>

<script>
    export default {
        name: "floatCard",
        data () {
            return {
                clientWidth: 0,
                clientHeight: 0,
                left: 0,
                top: 0,
                gapWidth: 10,
                itemWidth: 40, // 图标的宽度
                itemHeight: 40 // 图标的高度
            }
        },
        created() {
            this.clientWidth = document.documentElement.clientWidth;
            this.clientHeight = document.documentElement.clientHeight;
            this.left = this.clientWidth - this.itemWidth - this.gapWidth;
            this.top = this.clientHeight*0.8;
        },
        methods: {
            dragStart(e) {
                this.$refs.div.style.transition = 'none';
            },
            dragEnd(e) {
                this.$refs.div.style.transition = 'all 0.3s';
                if (this.left > this.clientWidth/2) {
                    this.left = this.clientWidth - this.itemWidth - this.gapWidth;
                } else {
                    this.left = this.gapWidth;
                }
            },
            dragProgress(e) {
                if (e.targetTouches.length === 1) {
                    let touch = event.targetTouches[0];
                    this.left = touch.clientX - this.itemWidth/2;
                    this.top = touch.clientY - this.itemHeight/2;
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .ys-float-btn {
        color: #666;
        z-index: 2000;
        transition: all 0.3s;
        position: fixed;
        bottom: 20vw;
        width: 120px;
        white-space: nowrap;
        .menu-icon {
            width: 40Px;
            height: 40Px;
        }
        .ys-menu {
            position: absolute;
            right: 0;
            top: 0;
        }
    }
</style>