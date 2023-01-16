<template>
    <!-- <img src="../assets/imgs/NFT_05喵小天.png" alt="" style="width: 100%;"> -->
    <div style="height: 100vh; overflow: hidden; position: relative;">
        <div style="height: 50px; line-height: 50px; border-bottom: 2px solid var(--colorRed); padding-left: 50px; color: var(--colorRed);">
            <b style="font-size: 24px; color: var(--colorRed);">啥都卖</b>
            <i  style="margin-left: 20px;">你没人要！？蟑螂要~老鼠要~</i>
        </div>
        <div class="form-box">
            <div style="flex: 1; padding: 50px;">
                <img src="../assets/imgs/增加购买力.png" alt="" style="width: 100%; padding-top: 90px;">
            </div>
          <div style="flex: 1; padding: 50px;">
            <el-form ref="ruleFormRef" :rules="rules" :model="form" status-icon>
                <h2 style="text-align: center;">注册</h2>
                <el-form-item prop="account">
                  <el-input v-model="form.account" placeholder="请输入账号" :prefix-icon="User"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input v-model="form.password" show-password placeholder="请输入密码"
                    autocomplete="new-password" :prefix-icon="Lock"></el-input>
                </el-form-item>
                <el-form-item prop="confirm">
                  <el-input v-model="form.confirm" show-password placeholder="请确认密码"
                    autocomplete="new-password" :prefix-icon="Lock"></el-input>
                </el-form-item>
                <el-form-item prop="email">
                    <el-input v-model="form.email" show-password placeholder="请输入邮箱" :prefix-icon="Message"></el-input>
                </el-form-item>
                <el-form-item prop="emailCode">
                    <div style="display: flex;">
                        <el-input style="flex: 1;" v-model="form.emailCode"></el-input>
                        <el-button style="width: 120px; margin-left: 5px;" @click="sendEmail" :disabled="time > 0">点击发送<span v-if="time">（{{time}}）</span></el-button>
                    </div>
                </el-form-item>
                <el-form-item prop="phone">
                    <el-input v-model="form.phone" placeholder="请输入手机号" :prefix-icon="UserFilled"></el-input>
                </el-form-item>
                <div style="margin-bottom: 0.83em">
                  <el-button style="width: 100%" type="primary" @click="register">注册</el-button>
                </div>
              </el-form>
          </div>
          <div style="text-align: right;">
            <el-button type="primary" link @click="router.push('/login')">已有账号？请登录</el-button>
        </div>
        </div>
      </div>
</template>

<script setup>
    import { reactive, ref } from "vue"
    import { User, Lock, UserFilled, Message } from '@element-plus/icons-vue'
    import router from '@/router'
    import request from "@/utils/request"
    import { ElMessage } from "element-plus"
    import { useUserStore } from "../stores/user"   // 导入
    const ruleFormRef = ref()
    
    const form = reactive({})
    const store = useUserStore()
    const time = ref(0)
    const interval = ref(-1)

    const confirmPassword = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请输入确认密码'))
        } 
        if(value !== form.password){
            callback(new Error('两次密码不一致'))
        }
        callback()
    }
    const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const checkEmail = (rule, value, callback) => {
        if(!reg.test(value)) {
            return callback(new Error("邮箱格式不合法"))
        }
        callback()
    }

    const rules = reactive({
        account: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        emailCode: [
            { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        confirm: [
            { validator: confirmPassword, trigger: 'blur' }
        ],
        email: [
            { validator: checkEmail, trigger: 'blur' }
        ],
})

    const sendEmail = () => {
        if(!reg.test(form.email)) {
            ElMessage.warning("请输入合法的邮箱")
            return
        }
        //清空定时器
        if(interval.value >= 0) {
            clearInterval(interval.value)
        }
        time.value = 10
        interval.value = setInterval(() => {
                if(time.value > 0) {
                    time.value--
                }
            }, 1000)
        request.get("/email", { 
            params: {
                email: form.email,
                type: "REGISTER"
            }
        }).then(res => {
            
            if(res.code == 200){
                    ElMessage.success('发送成功，有效期5分钟')
                }else {
                    ElMessage.error(res.msg);
                }
        })
    }


    const register = () => {
        ruleFormRef.value.validate(valid => {
            if(valid){
                request.post("/register", form).then(res => {
                if(res.code == 200){
                    ElMessage.success('注册成功')
                    router.push('/login')
                }else {
                    ElMessage.error(res.msg);
                }
            })
            }
        })
    }
    console.log(store.user)
</script>

<style scoped>
.form-box {
    width: 50%; margin: 100px auto; border-radius: 10px; box-shadow: 0 0 10px -2px rgba(0, 0, 0, .5); display: flex;
    /* background-image: url(../assets/imgs/NFT_05喵小天.png); */
    padding: 50px;
    position: absolute; top: 30%; left: 50%; transform: translateX(-50%) translateY(-50%);
}
</style>