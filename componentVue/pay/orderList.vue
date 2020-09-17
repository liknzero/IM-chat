<template>
    <div class="order-list">
        <div class="order-list-title">{{ orderArr.org_name }}</div>
        <div
                class="collection-cell course-id"
                @click="linkTo(item)"
                v-for="(item, index) in orderArr.data"
                :data-courseid="item.course_id"
                :key="index"
        >
            <img
                    class="order-cover"
                    :src="item.cover_url"
                    mode="aspectFill"
                    alt=""
            >
            <div class="collec-cell-rt">
                <div class="cell-rt-title">{{ item.name }}</div>
                <span class="cell-rt-num">
                    <span v-if="item.current_price < item.original_price">¥{{ item.current_price / 100 }}</span>&nbsp;
                    <span :class="{'cell-num-out': item.current_price < item.original_price}">¥{{item.original_price / 100}}</span>
                </span>
            </div>
        </div>
        <div class="order-all-num">小计：¥{{ orderArr.amount / 100 }}</div>
    </div>
</template>

<script>
    export default {
        name: "orderList",
        props: [ 'orders' ],
        data () {
            return {
                orderArr: {}
            }
        },
        created () {
            this.orderArr = JSON.parse(this.orders)
            console.log(this.orderArr)
        },
        methods: {
            linkTo () {

            }
        }
    }
</script>

<style lang="less" scoped>

</style>