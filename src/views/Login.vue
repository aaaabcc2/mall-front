<template>
    <div>
        <div style="height: 50px; line-height: 50px; border-bottom: 2px solid var(--colorRed); padding-left: 50px; color: var(--colorRed);">
            <b style="font-size: 24px; color: var(--colorRed);">啥都卖</b>
            <i  style="margin-left: 20px;">你没人要！？蟑螂要~老鼠要~</i>
        </div>

        <div style="width: 50%; margin: 100px auto; border-radius: 10px; box-shadow: 0 0 10px -2px rgba(0, 0, 0, .5); display: flex;">
            <div style="flex: 1; padding: 50px;">
                <img src="../assets/imgs/NFT_05喵小天.png" alt="" style="width: 100%;">
            </div>
            <div style="flex: 1; padding: 50px;">
                <div class="form-toggle">
                    <b :class="{'active': activeToggle === 'account'}" @click="toggle('account')">账号登录</b>
                    <b :class="{'active': activeToggle === 'email'}" style="margin-left: 30px;"  @click="toggle('email')">手机号登录</b>
                </div>
                <el-form ref="form" :rules="rules" :model="LoginForm" status-icon v-if="activeToggle === 'account'">
                    <el-form-item prop="account">
                        <el-input placeholder="用户名" v-model="LoginForm.account" :prefix-icon="User" style="margin: 30px 0 30px 0;"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input placeholder="密码" show-password v-model="LoginForm.password" :prefix-icon="Lock"></el-input>
                    </el-form-item>
                    <div style="margin: 20px 0 0 0; text-align: left;">
                        <el-button link @click="handleResetPassword">忘记密码？</el-button>
                    </div>
                    <el-dialog v-model="passwordVis" :close-on-click-modal="false" title="忘记密码">
                        <el-form :model="passwordForm" label-width="100px" ref="rulePasswordFormRef" :rules="passwordRules" status-icon>
                          <el-form-item label="邮箱" prop="email">
                            <el-input v-model="passwordForm.email" autocomplete="off" />
                          </el-form-item>
                          <el-form-item label="验证码" prop="emailCode">
                            <div style="display: flex;">
                                <el-input style="flex: 1;" v-model="passwordForm.emailCode" clearable></el-input>
                                <el-button style="width: 120px; margin-left: 5px;" @click="sendEmail" :disabled="time > 0">点击发送<span v-if="time">（{{time}}）</span></el-button>
                            </div>
                          </el-form-item>
                        </el-form>
                        <template #footer>
                          <span class="dialog-footer">
                            <el-button @click="passwordVis = false">Cancel</el-button>
                            <el-button type="primary" @click="resetPassword">
                              Confirm
                            </el-button>
                          </span>
                        </template>
                      </el-dialog>
                    <div style="margin: 20px 0 0 0;"><el-button type="primary" style="width: 100%;" @click="login">登录</el-button></div>
                    <div style="margin: 20px 0 0 0; text-align: right;">
                        <el-button type="primary" link @click="router.push('/register')" style="float: right;">没有账号？请注册</el-button>
                    </div>
                </el-form>

                <el-form ref="form" :rules="passwordRules" :model="passwordForm" v-else>
                    <el-form-item prop="email">
                        <el-input placeholder="手机号" v-model="passwordForm.email" :prefix-icon="User" style="margin: 30px 0 30px 0;"></el-input>
                    </el-form-item>
                    <el-form-item prop="emailCode">
                        <div style="display: flex; margin-bottom: 60px;">
                            <el-input placeholder="验证码" v-model="passwordForm.emailCode" :prefix-icon="User" style="flex: 2;"></el-input>
                            <el-button style="flex: 1; margin-left: 5px;" :disabled="time > 0" @click="sendEmail">点击发送 <span v-if="time">（{{time}}）</span></el-button>
                        </div>
                    </el-form-item>
                    
                    <div style="margin: 20px 0 0 0;"><el-button type="primary" style="width: 100%;"  @click="login">登录</el-button></div>
                    <div style="margin: 20px 0 0 0; text-align: right;">
                        <el-button type="primary" link @click="router.push('/register')" style="float: right;">没有账号？请注册</el-button>
                    </div>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { nextTick, reactive, ref } from "vue"
    import { User, Lock } from '@element-plus/icons-vue'
    import router from '@/router'
    import request from "@/utils/request"
    import { ElMessage } from "element-plus"
    import { useUserStore } from "../stores/user"   // 导入
    const ruleFormRef = ref()
    const form = ref()
    const passwordVis = ref(false)
    const LoginForm = reactive({})
    const passwordForm = reactive({})
    const passwordFormLogin = reactive({})
    const activeToggle = ref('account')
    const store = useUserStore()
    const rulePasswordFormRef = ref()
    const interval = ref(-1)
    const time = ref(0)
    const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    const rules = reactive({
        account: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
        ],
})
const passwordRules = reactive({
        email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        emailCode: [
            { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
})
    const toggle = (active) => {
        activeToggle.value = active;
    }
    const handleResetPassword = () => {
      passwordVis.value = true
      //触发表单重置
      nextTick(() => {
        rulePasswordFormRef.value.resetFields()
      })
    }
        const login = () => {
            form.value.validate(valid => {
            if(valid){
                request.post("/login", LoginForm).then(res => {
                console.log(res)
                if(res.code == '200'){
                    
                    store.$patch({user: res.data})
                    
                    ElMessage.success('登录成功')
                    router.push('/')
                }else {
                    ElMessage.error(res.msg);
                }
            })
            }
        })
        }
        const times = () => {
  // 清空定时器
  if (interval.value >= 0) {
    clearInterval(interval.value)
  }
  time.value = 10
  interval.value = setInterval(() => {
    if (time.value > 0) {
      time.value --
    }
  }, 1000)
}

    const sendEmail = () => {
        if(!reg.test(passwordForm.email)) {
            ElMessage.warning("请输入合法的邮箱")
            return
        }
        request.get("/email", { 
            params: {
                email: passwordForm.email,
                // type: "RESETPASSWORD"
                type: "RESETPASSWORD"
            }
        }).then(res => {
            times()
            if(res.code == '200'){
                    ElMessage.success('发送成功，有效期5分钟')
                }else {
                    ElMessage.error(res.msg);
                }
        })
    }

    const resetPassword = () => {
        rulePasswordFormRef.value.validate(valid => {
            if(valid){
                request.post("/password/reset", passwordForm).then(res => {
                if(res.code == '200'){
                    ElMessage.success('重置成功，您的密码为：' + res.data)
                    passwordVis.value = false
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
    .form-toggle {
        margin: 20px 0 50px 0;
        text-align: center;
    }
    .form-toggle b {
        font-size: 20px;
        cursor: pointer;
    }
    .active {
        color: var(--colorRed);
    }
</style>