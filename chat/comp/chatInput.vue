<template>
    <div class="chat-input-box">
        <div class="chat-controls">
            <upload-img
                :upload-url="uploadUrl"
                @onupload="onAddGoodsImg"
            >
                <i class="el-icon-picture"></i>
            </upload-img>
        </div>
        <!-- <div class="chat-input" contenteditable="true" @keyup="onInputBox"></div> -->
        <el-input
            ref="textareaBox"
            class="chat-input"
            type="textarea"
            autofocus
            :rows="5"
            placeholder="请输入留言"
            v-model="chatInputContent"
            @keydown.enter.native="onInputBox"
        >
        </el-input>
        <div class="chat-bottom-btn">
            <span class="tip">按Enter键发送，按Shift+Enter键换行</span>
            <button type="button" @click="onInputBox" class="btn btn-outline-primary" :class="{'btn-can-enter': chatInputContent !== ''}">发送</button>
        </div>
    </div>
</template>

<script>
import UploadImg from '../../uploadFile/index'
export default {
    data () {
        return {
            autofocus: true,
            chatInputContent: '',
            uploadUrl: window.uploadUrl
        }
    },
    components: {
        UploadImg
    },
    mounted () {
        console.log(process)
    },
    updated () {
        console.log('autofocus')
    },
    methods: {
        onInputBox (event) {
            let e = event || window.event || arguments.callee.caller.arguments[0];
            if (e.ctrlKey || e.shiftKey) return  false
            e.preventDefault();
            if (!this.chatInputContent.length) return false
            this.$emit('on-sent-msg', this.chatInputContent, 'TEXT')
            this.chatInputContent = ''
        },
        onAddGoodsImg (data) {
            this.$emit('on-sent-msg', data.fileUrl, 'IMAGE')
        }
    }
}
</script>

<style lang="less" scoped>
@import "../../../../static/css/base.less";
/*/deep/.el-upload {*/
    /*border: none;*/
    /*.el-upload-dragger {*/
        /*width: initial;*/
        /*height: initial;*/
    /*}*/
/*}*/
/deep/.el-upload {
    border: none!important;
    width: 40px;
    height: 40px;
    .el-upload-dragger {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        &>.el-icon-picture {
            width: 40px;
            height: 40px;
        }
    }
}
.chat-input-box {
    position: relative;
    bottom: 0;
    width: 100%;
    height: 205px;
    padding: 50px 25px 30px;
    border-top: 2px solid #F4F4F5;
    .chat-controls {
        height: 50px;
        position: absolute;
        top: 0;
        display: flex;
        align-items: center;
        a {
            display: inline-block;
            font-size: 25px;
            color: #969699;
        }
    }
    .chat-input {
        height: 120px;
        overflow: auto;
        user-select: none;
        color: #000;
        outline: none;
        .el-textarea__inner {
            padding: 0;
            border: none;
            resize: none;
            .scroll-style();
        }
    }
    .chat-bottom-btn {
        position: relative;
        bottom: 16px;
        text-align: right;
        .tip {
            padding-right: 20px;
            color: #d1d4db;
        }
        .btn {
            width:112px;
            height:36px;
            border-radius:18px;
            padding: 0;
            color: #AFAFB3;
            border: 1px solid #C8C8CC;
            outline:none!important;
            box-shadow: none!important;
            &:hover {
                background: #ffffff;
            }
            
        }
        .btn-can-enter {
            color: #ffffff;
            background: @color-main-btn;
            border-color: @color-main-btn;
            &:hover {
                background: #F18BAE;
                border-color: #F18BAE;
            }
            &:focus {
                background: #F18BAE;
            }
        }
    }
}
</style>