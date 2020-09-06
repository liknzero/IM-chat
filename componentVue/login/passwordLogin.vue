<template>
    <div class="form-list">
        <span class="form-list-title">{{ label }}</span>
        <van-field
                v-model="password"
                :type="inputType"
                clearable
                :border="false"
                :maxlength="20"
                :name="label"
                @input="onInputHandle"
                placeholder="设置6-20位密码"
        ></van-field>
        <van-icon name="eye-o" size="16px" color="#CCCCCC" v-if="inputType === 'text'" @click="inputType = 'password'"></van-icon>
        <van-icon name="closed-eye" size="16px" color="#CCCCCC" v-else @click="inputType = 'text'"></van-icon>
    </div>
</template>

<script>
    export default {
        name: "passwordLogin",
        data () {
            return {
                password: '',
                inputType: 'password'
            }
        },
        props: {
            label: {
                type: String,
                default: '密码'
            }
        },
        methods: {
            onInputHandle () {
                this.$emit('input-handle', this.password)
            }
        }
    }
</script>

<style scoped>

</style>