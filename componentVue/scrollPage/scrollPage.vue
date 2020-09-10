<template>
    <van-pull-refresh v-model="isLoadingRefresh" :success-text="this.successTxt" @refresh="onRefresh">
        <van-list :style="{minHeight: minHeight}" v-if="!isEmpty" v-model="isLoadingMore" :finished="moreFinished" :finished-text="finishTxt" @load="onLoadMore">
            <slot></slot>
        </van-list>
        <empty-img
                v-else
                :img="emptyImg"
                :txt="emptyTxt"
                :min-height="minHeight"
                :showBtn="showEmptyBtn"
                :btnTxt="emptyBtnTxt"
                @empty-btn="$emit('empty-btn')"
        ></empty-img>
    </van-pull-refresh>
</template>

<script>
    import EmptyImg from '../../componentVue/emptyImg'
    export default {
        name: "scrollPage",
        data () {
            return {
                isLoadingRefresh : false,
                isLoadingMore: false,
                moreFinished: false,
                listArr: [],
                isEmpty: false,
                page: {
                    page: 1,
                    pageSize: 15,
                }
            }
        },
        props: {
            // 请求方法中需要传入的额外参数
            params: {
                type: Object,
                default: () => {return {}}
            },
            // 请求方式get/post
            requireOpt: {
                type: Object,
                default: () => {
                    return {
                        url: '',
                        type: 'get'
                    }
                }
            },
            // 空状态图片
            emptyImg: {
                type: String,
                default: '/waps/images/icon-empty-collection.png'
            },
            // 空状态文字描述
            emptyTxt: {
                type: String,
                default: '无收藏'
            },
            // 是否显示空状态按钮
            showEmptyBtn: {
                type: Boolean,
                default: false
            },
            // 空状态按钮文字
            emptyBtnTxt: {
                type: String,
                default: ''
            },
            successTxt: {
                type: String,
                default: '刷新成功'
            },
            finishTxt: {
                type: String,
                default: '没有更多了'
            },
            minHeight: {
                type: String,
                default: 'calc(100vh - 54PX)'
            }
        },
        components: {
            EmptyImg
        },
        watch: {
            isLoadingMore (status) {
                console.log('status', status)
            }
        },
        methods: {
            onRefresh () {
                console.log('下拉刷新了')
                // 重置父组件的状态
                this.page.page = 1
                this.isEmpty = false
                this.moreFinished = true
                this.isLoadingMore = false
                this.onGetCollection({ ...this.page, ...this.params })
            },
            onLoadMore () {
                console.log('上拉加载更多')
                if (this.isEmpty) return false
                this.onGetCollection({ ...this.page, ...this.params })
            },
            onGetCollection (params) {
                console.log(params)
                Ajax({
                    url: this.requireOpt.url,
                    type: this.requireOpt.type,
                    data: params
                }).then(res => {
                    let meta = res.data.meta
                    const data = res.data.data
                    if (meta && !meta.pagination.has_next) {
                        if (meta.pagination.total === 0) {
                            this.isEmpty = true
                        }
                        this.moreFinished = true
                    } else {
                        // this.moreFinished = false
                    }
                    if (this.page.page === 1) {
                        this.listArr = data
                    } else {
                        this.listArr = [...data, ...this.listArr]
                    }
                    // 返回给父组件请求回的数据
                    this.$emit('on-get-list', this.listArr)
                    this.page.page += 1
                }).catch(err => {
                    this.moreFinished = true
                    this.$toast(err.message)
                }).finally(() => {
                    this.isLoadingMore = false
                    this.isLoadingRefresh = false
                })
            },
        }
    }
</script>

<style lang="less" scoped>
    /*.empty {*/
        /*position: relative!important;*/
        /*height: 1300px!important;*/
    /*}*/
</style>