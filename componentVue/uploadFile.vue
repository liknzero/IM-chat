<template>
    <van-uploader
            :preview-image="false"
            :preview-full-image="false"
            :deletable="false"
            :max-size="maxSize * 1024 * 1024"
            @oversize="onOverSize"
            :before-read="onFileLoadBefore"
            :after-read="onFileLoadAfter"
    >
        <slot></slot>
    </van-uploader>
</template>

<script>
    export default {
        name: "uploadFile",
        props: {
            maxSize: {
                type: Number,
                default: 5
            },
            fileType: {
                type: String,
                default: 'image'
            }
        },
        methods: {
            onOverSize ({ file: { name } }) {
                this.$toast(`${name}过大，请将图片大小控制在${this.maxSize}Mb以内`)
            },
            onFileLoadBefore (file) {
                console.log(2, file.type, file.type === 'image/jpeg')
                if (file.type === 'image/jpeg' || file.type === 'image/png') {
                    return true
                }
                this.$toast('请上传jpeg/png格式图片')
                return false
            },
            onFileLoadAfter ({ file }) {
                console.log(3, file)
                console.log(`${window.APP_UPLOAD}/api/file/oss/upload`)
                let formData = new FormData
                formData.append('fileType',this.fileType)
                formData.append('files',file)

                Ajax({
                    url: `${window.APP_UPLOAD}/api/file/oss/upload`,
                    type: 'post',
                    isLoading: true,
                    processData: false,
                    contentType: false,
                    data: formData
                }).then(res => {
                    this.$emit('on-upload', res.data)
                }).catch(err => {
                    this.$toast(err.message)
                })
            },
        }
    }
</script>

<style scoped>

</style>