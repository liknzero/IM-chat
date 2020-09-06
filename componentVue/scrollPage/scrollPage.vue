<template>
    <van-pull-refresh v-model="isLoadingRefresh" :success-text="this.successTxt" @refresh="onRefresh">
        <van-list v-if="!isEmpty" v-model="isLoadingMore" :finished="moreFinished" :finished-text="finishTxt" @load="onLoadMore">
            <slot></slot>
        </van-list>
        <empty-img v-else :img="this.emptyImg" :txt="this.emptyTxt"></empty-img>
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
            params: {
                type: Object,
                default: () => {return {}}
            },
            requireOpt: {
                type: Object,
                default: () => {
                    return {
                        url: '',
                        type: 'get'
                    }
                }
            },
            emptyImg: {
                type: String,
                default: '/waps/images/icon-empty-collection.png'
            },
            emptyTxt: {
                type: String,
                default: '无收藏'
            },
            successTxt: {
                type: String,
                default: '刷新成功'
            },
            finishTxt: {
                type: String,
                default: '没有更多了'
            }
        },
        components: {
            EmptyImg
        },
        methods: {
            onRefresh () {
                console.log('下拉刷新了')
                // 重置父组件的状态
                this.page.page = 1
                this.isEmpty = false
                this.moreFinished = false
                this.isLoadingMore = true
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
                    }
                    if (this.page.page === 1) {
                        this.listArr = data
                    } else {
                        this.listArr = [...data, ...this.listArr]
                    }
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
    .empty {
        position: relative!important;
        height: 1300px!important;
    }
</style>