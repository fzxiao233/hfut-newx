<template>
    <div class="select">
        <div class="select-select">
            <div class="select-brand">
                <h1>NEWX • 课程查询系统</h1>
            </div>
            <b-card no-body>
                <b-tabs card>
                    <b-tab @click="shiftType('classroom')" class="select-tab" title="查教室">
                        <b-form-input v-model="params.classroomID" class="select-input"
                                      placeholder="教室编号"></b-form-input>
                        <b-radio-group v-model="params.place">
                            <b-form-radio value="0">敬亭</b-form-radio>
                            <b-form-radio value="1">新安</b-form-radio>
                        </b-radio-group>
                        <b-button @click="buildPostData" class="select-button-submit" variant="primary">查询</b-button>
                        <b-alert :show="alerts.show" variant="danger">{{alerts.text}}</b-alert>
                    </b-tab>
                    <b-tab @click="shiftType('teacher')" class="select-tab" title="查老师">
                        <b-form-input v-model="params.teacher" placeholder="请输入教师姓名"></b-form-input>
                        <b-button @click="buildPostData" class="select-button-submit" variant="primary">查询</b-button>
                        <b-alert :show="alerts.show" variant="danger">{{alerts.text}}</b-alert>

                    </b-tab>
                    <b-tab @click="shiftType('class')" class="select-tab" title="查课名">
                        <b-form-input v-model="params.teacher" placeholder="请输入课程名或代码"></b-form-input>
                        <b-button @click="buildPostData" class="select-button-submit" variant="primary">查询</b-button>
                        <b-alert :show="alerts.show" variant="danger">{{alerts.text}}</b-alert>

                    </b-tab>
                    <b-tab @click="shiftType('date')" class="select-tab" title="查时间">
                        <div class=select-form-selects>
                            <label>周次：</label>
                            <b-select :options="options.teachingWeek" v-model="params.date.teachingWeek"
                                      class="select-form-select"></b-select>
                            <label>星期：</label>
                            <b-select :options="options.day" v-model="params.date.day"
                                      class="select-form-select"></b-select>
                            <label>节数：</label>
                            <b-select :options="options.section" v-model="params.date.section"
                                      class="select-form-select"></b-select>
                        </div>
                        <b-button @click="buildPostData" class="select-button-submit" variant="primary">查询</b-button>
                        <b-alert :show="alerts.show" variant="danger">{{alerts.text}}</b-alert>

                    </b-tab>
                </b-tabs>
            </b-card>
        </div>
        <div class="select-result" v-if="result.loaded">
            <b-card v-for="c in result.data" :key="c.classNumber">
                <b-card-title>
                    <label>{{c.courseName}}</label>
                    <label class="select-result-title">教师：{{c.teacher}}</label>
                </b-card-title>
                <b-card-body>
                    <div class="select-result-body">
                        <b-avatar variant="primary" :text="'学分'+c.grade" size="4rem"></b-avatar>
                        <div class="select-result-info">
                            <b-card-text>{{c.class}}</b-card-text>
                            <b-card-text>{{c.courseType}}</b-card-text>
                        </div>
                        <b-button class="select-result-button" v-b-toggle="'collapse-'+c.courseNumber"
                                  variant="primary">详情
                        </b-button>
                    </div>
                </b-card-body>
                <b-card-footer>
                    {{c.courseTerm}}
                </b-card-footer>
                <b-collapse :id="'collapse-'+c.courseNumber" class="mt-2">
                    <b-card>
                        <b-card-text>课程代码: {{c.courseNumber}}</b-card-text>
                        <b-card-text>班级: {{c.class}}</b-card-text>
                        <div class="select-result-inline">
                            <b-card-text>学分: {{c.grade}}</b-card-text>
                            <b-card-text>考核: {{c.method}}</b-card-text>
                        </div>
                        <b-card-text>教师: {{c.teacher}}</b-card-text>
                        <b-card-text>教师等级: {{c.teacherLevel}}</b-card-text>
                        <b-card-text>时间地点: {{c.courseTimePlace}}</b-card-text>
                        <b-card-text>课程类型: {{c.courseType}}</b-card-text>
                        <b-card-text>开课学期: {{c.courseTerm}}</b-card-text>
                    </b-card>
                </b-collapse>
            </b-card>
        </div>
    </div>
</template>

<script>
    import {num2Text, reduceObj} from "../utils";

    export default {
        name: "Select",
        data() {
            return {
                options: {
                    teachingWeek: [],
                    day: [],
                    section: []
                },
                type: "classroom",
                params: {
                    place: "",
                    classroomID: "",
                    teacher: "",
                    class: "",
                    date: {
                        teachingWeek: "",
                        day: "",
                        section: ""
                    }
                },
                result: {
                    loaded: false,
                    data: [{
                        courseName: "电工与电子技术B",
                        courseType: "学科基础和专业必修课",
                        courseTerm: "2020-2021学年第一学期",
                        studentDepartment: "环境工程学院",
                        method: "笔试",
                        class: "环境工程 19-1 班",
                        teacherDepartment: "环境工程学院",
                        teacher: "苗刚中",
                        teacherLevel: "副教授",
                        classNumber: "0400062B--004",
                        courseNumber: "0400062B",
                        studentDepartment2: "",
                        teacherDepartment2: "",
                        courseTime: "4~12周 周一 第五节~第六节;\n4~12周 周三 第三节~第四节",
                        courseTimePlace: "4~12周 周一 第五节~第六节 宣城校区 新安学堂222; \n4~12周 周三 第三节~第四节 宣城校区 新安学堂220",
                        courseTimePlaceTeacher: "4~12周 周一 第五节~第六节 宣城校区 新安学堂222 祁高飞; \n4~12周 周三 第三节~第四节 宣城校区 新安学堂220 祁高飞",
                        grade: "3"
                    }]
                },
                alerts: {
                    show: false,
                    text: ""
                }
            }
        },
        mounted() {
            this.buildOptions();
        },
        methods: {
            buildOptions() {
                let teachingWeek = [];
                let day = [];
                let section = [];

                function OptionsTemp(value, text) {
                    this.value = value;
                    this.text = text;
                }

                for (let i = 1; i <= 20; i++) {
                    const weekTemp = new OptionsTemp();
                    weekTemp.value = i;
                    weekTemp.text = `第${num2Text(i)}周`;
                    teachingWeek.push(weekTemp);
                }
                this.options.teachingWeek = teachingWeek;

                for (let i = 1; i <= 7; i++) {
                    const dayTemp = new OptionsTemp();
                    dayTemp.value = i;
                    dayTemp.text = `星期${num2Text(i)}`;
                    day.push(dayTemp);
                }
                this.options.day = day;

                for (let i = 1; i <= 7; i += 2) {
                    const sectionTemp = new OptionsTemp();
                    sectionTemp.value = i;
                    sectionTemp.text = `第${String(i)}~${String(i + 1)}节`;
                    section.push(sectionTemp);
                }
                section.push(new OptionsTemp(8, "第9~11节"));
                this.options.section = section;

            },
            shiftType(type) {
                this.type = type;
            },
            showAlert(text) {
                this.alerts = {
                    show: true,
                    text: text
                }
            },
            validateData(dataObj) {
                let allProps = reduceObj(dataObj);
                let isEmpty = false;
                for (let i of allProps) {
                    if (i === "") {
                        isEmpty = true;
                        return
                    }
                }
                return !isEmpty;
            },
            buildPostData() {
                let postData;
                switch (this.type) {
                    case "classroom":
                        postData = {
                            type: this.type,
                            params: {
                                place: this.params.place,
                                classroomID: this.params.classroomID
                            }
                        };
                        break;
                    case "teacher":
                        postData = {
                            type: this.type,
                            params: {
                                teacher: this.params.teacher
                            }
                        };
                        break;
                    case "class":
                        postData = {
                            type: this.type,
                            params: {
                                class: this.params.class
                            }
                        };
                        break;
                    case "data":
                        postData = {
                            type: this.type,
                            params: {
                                date: this.params.date
                            }
                        };
                        break;
                }
                if (!this.validateData(postData)) {
                    this.showAlert("请完整填写查询条件");
                    return;
                }
                this.alerts.show = false;
                this.doSelect(postData)
            },
            doSelect(postData) {
                // 接口请求
                this.result.loaded = true;
            }
        }
    }
</script>

<style scoped lang="scss">
    .card-footer {
        background-color: white;
        padding-bottom: 0;
        text-align: center;
    }

    .select {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;

        &-select {
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;

            > .card {
                max-width: 586px;
                width: 100%;
            }
        }

        &-brand {
            margin-bottom: 20px;

            > h1 {
                font-weight: 300;

            }
        }

        &-tab {
            > * {
                margin-bottom: 15px;
            }
        }

        &-button-submit {
            width: 100%;
        }

        &-input {
        }

        &-form-select {
            display: inline;
            width: auto;
        }

        &-form-selects {
            display: flex;
            justify-content: space-evenly;
            align-items: center;
        }

        &-result {
            width: 75%;
            margin-top: 5rem;

            &-body {
                display: flex;

            }

            &-title {
                float: inline-end;
            }

            &-info {
                display: inline-flex;
                margin-left: 4rem;
                flex-direction: column;
            }

            &-button {
                margin-left: auto;
            }

            &-inline {
                display: flex;

                > p {
                    margin-right: 16px;
                    white-space: pre-line;
                }
            }
        }
    }

</style>