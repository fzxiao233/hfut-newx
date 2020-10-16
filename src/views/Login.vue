<template>
    <div class="login">
        <div class="login-title">
            <h1>登录到 NEWX</h1>
        </div>
        <b-card>
            <div class="login-form">
                <div>
                    <p>学号:</p>
                    <b-form-input placeholder="请在这输入您的学号" v-model="username"></b-form-input>
                </div>
                <div>
                    <p>密码:</p>
                    <b-form-input placeholder="请输入您的密码" v-model="password"></b-form-input>
                </div>
                <div>
                    <b-button class="login-form-button" variant="primary" @click="login">登入</b-button>
                </div>
                <b-alert :show="alerts.show" variant="danger">{{alerts.text}}</b-alert>

            </div>
        </b-card>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                username: "",
                password: "",
                alerts: {
                    show: false,
                    text: ""
                }
            }
        },
        methods: {
            login() {
                if (this.username === "") {
                    this.alerts = {
                        show: true,
                        text: "请输入学号"
                    };
                    return
                } else if (this.password === "") {
                    this.alerts = {
                        show: true,
                        text: "请输入密码"
                    };
                    return;
                }
                //  这里是鉴权
                this.$store.commit("login");
                this.$router.push('/select');
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../assets/primary";

    .card {
        max-width: 584px;
        width: 100%;
    }

    .login {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;

        &-title {
            margin-bottom: 15px;
            > h1 {
                font-size: 24px;
                font-weight: 300;
            }
        }
    }

    .login-form {
        display: flex;
        justify-content: flex-start;
        flex-direction: column;

        > div {
            margin-bottom: 20px;

            > p {
                font-size: $important-font-size;
            }
        }
    }

    .login-form-button {
        align-self: center;
        width: 100%;
        font-size: $important-font-size;
    }
</style>