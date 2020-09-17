<template>
    <div class="form-list">
        <span class="form-list-title">验证码</span>
        <van-field
                v-model="code"
                type="digit"
                clearable
                :maxlength="6"
                :border="false"
                name="验证码"
                @input="onInputCode"
                placeholder="请输入验证码"
        ></van-field>
        <i class="line-ver"></i>
        <span
                :class="{'code-get': true, 'code-get-disable': isSend || isCodeDisable}"
                @click="onSendCode"
        >{{ codeInfo.codeText }}</span>
    </div>
</template>

<script>
    export default {
        name: "codeInput",
        props: {
            phone: { // 手机号码
                type: String,
                default: ''
            },
            isCodeDisable: { // 验证码按钮是否禁止点击
                type: Boolean,
                default: true
            },
            codeType: { // 发送code码的类型
                type: String,
                default: ''
            }
        },
        data () {
            return {
                codeInfo: {
                    timer: 60,
                    setTime: null,
                    codeText: '发送验证码',
                },
                code: '',
                isSend: false
            }
        },
        methods: {
            onInputCode () {
                this.$emit('input-handle', this.code)
            },
            onSendCode () {
                console.log(123123123123)
                if (this.isCodeDisable) return
                console.log(1)
                if (this.isSend) return
                console.log(2)
                if (this.getTruePhone(this.phone)) return
                console.log(3)
                this.isCodeDisable = true
                Ajax({
                    url: '/api/send-sms',
                    type: 'post',
                    data: {
                        mobile: this.phone,
                        captcha_type: this.codeType
                    }
                }).then(res => {
                    if (res.code === 0) {
                        this.isSend = true
                        this.timeDown()
                        this.$toast('验证码发送成功')
                    } else {
                        this.$toast(res.message)
                    }
                }).catch(err => {
                    this.$toast('发送失败，请稍后重试')
                    this.isCodeDisable = false
                })
            },
            // 倒计时
            timeDown () {
                if (!this.codeInfo.setTime) {
                    this.codeInfo.timer--
                    this.codeInfo.codeText = `${this.codeInfo.timer}s`
                    this.codeInfo.setTime = setInterval(() => {
                        if (this.codeInfo.timer <= 0) {
                            this.isCodeDisable = false
                            this.isSend = false
                            this.codeInfo.timer = 60
                            this.codeInfo.codeText = '重新获取'
                            clearInterval(this.codeInfo.setTime)
                            this.codeInfo.setTime = null
                        } else {
                            this.codeInfo.timer--
                            this.codeInfo.codeText = `${this.codeInfo.timer}s`
                        }
                    }, 1000)
                }
            },
            // 验证手机号
            getTruePhone (phone) {
                if ((/^1[3456789]\d{9}$/.test(phone))) {
                    return false
                } else {
                    this.$toast('请输入正确的手机号')
                    return true
                }
            }
        }
    }
</script>