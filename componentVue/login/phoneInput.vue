<template>
    <div class="form-list">
        <span class="form-list-title">+86</span>
        <van-field
                v-model="phone"
                name="手机号"
                clearable
                :maxlength="11"
                type="digit"
                :border="false"
                @input="onInputHandle"
                placeholder="请输入手机号"
        ></van-field>
    </div>
</template>

<script>
    export default {
        name: "phoneInput",
        data () {
            return {
                phone: ''
            }
        },
        methods: {
            onInputHandle () {
                this.$emit('input-handle', this.phone)
            }
        }
    }
</script>

<style scoped>

</style>