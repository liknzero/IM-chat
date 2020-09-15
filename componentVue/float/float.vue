<template>
    <div>
        <div class="ys-float-btn"
             :style="{'left': left+'px', 'top': top + 'px'}"
             ref="div"
             v-show="isShowFloat && !isShowMenu"
            @touchstart.stop.prevent="(e) => {dragStart(e)}"
            @touchend.stop.prevent="(e) => {dragEnd(e)}"
            @touchmove.stop.prevent="(e) => {dragProgress(e)}"
        >
            <div class="menu-close" @click="isShowMenu = !isShowMenu">
                <img class="menu-icon" src="/waps/images/icon-list-nav.png" />
            </div>
        </div>
        <div class="ys-float-btn"
             :style="{'left': left+'px', 'top': top + 'px'}"
             v-show="isShowFloat && isShowMenu"
        >
            <div class="menu-close" @click="isShowMenu = !isShowMenu">
                <img class="menu-icon" src="/waps/images/icon-close.png" />
            </div>
            <div class="ys-menu">
                <a href="/wap" class="ys-link">
                    <img class="menu-icon" src="/waps/images/icon-home.png" alt="">
                    首页
                </a>
                <a href="/wap/classification-details" class="ys-link">
                    <img class="menu-icon" src="/waps/images/icon-cate.png" alt="">
                    分类
                </a>
                <a href="/wap/studies" class="ys-link">
                    <img class="menu-icon" src="/waps/images/icon-my-learn.png" alt="">
                    学习
                </a>
                <a href="/wap/users/show" class="ys-link">
                    <img class="menu-icon" src="/waps/images/icon-mine.png" alt="">
                    我的
                </a>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "floatCard",
        data () {
            return {
                touchTime: 0,
                isShowFloat: true, // 是否显示float
                isShowMenu: false, // 是否展开菜单
                scrollNow: 0, // 记录滚动位置
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
            window.addEventListener('scroll', this.onScroll, false)
        },
        beforeDestroy () {
            window.removeEventListener('scroll', this.onScroll)
        },
        methods: {
            onScroll () {
                let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
                if (scrollTop > this.scrollNow) {
                    this.isShowFloat = false
                    this.isShowMenu = false
                } else {
                    this.isShowFloat = true
                }
                this.scrollNow = scrollTop
            },
            dragStart(e) {
                this.touchTime = new Date().getTime()
                this.$refs.div.style.transition = 'none';
            },
            dragEnd(e) {
                const end = new Date().getTime()
                if (end -this.touchTime < 150) {
                    this.isShowMenu = !this.isShowMenu
                }
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
                    if (this.top > this.clientHeight - this.itemHeight) {
                        this.top = this.clientHeight - this.itemHeight
                    } else if (this.top < this.itemHeight) {
                        this.top = this.itemHeight
                    }
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .ys-float-btn {
        width: 88px;
        height: 88px;
        color: #666;
        z-index: 2000;
        transition: all 0.3s;
        position: fixed;
        bottom: 20vw;
        white-space: nowrap;
        .menu-icon {
            width: 36px;
            height: 36px;
        }
        .menu-close {
            width: 100%;
            height: 100%;
            z-index: 1;
            position: relative;
            border-radius: 50%;
            background: #FFFFFF;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0px 2px 11px 0px rgba(184, 184, 184, 0.5);
        }
        .ys-menu {
            position: absolute;
            right: 0;
            bottom: 0;
            background: #FFFFFF;
            box-shadow: 0px 0px 7px 0px rgba(173, 169, 169, 0.5);
            border-radius: 100px;
            padding: 25px 0 88px 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            .ys-link {
                width: 88px;
                height: 88px;
                display: inline-flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                font-size: 12PX;
                color: #909099;
            }
        }
    }
</style>