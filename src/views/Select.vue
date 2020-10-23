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
                            <b-form-radio value="1">敬亭</b-form-radio>
                            <b-form-radio value="2">新安</b-form-radio>
                        </b-radio-group>
                        <b-button @click="buildGetURL" class="select-button-submit" variant="primary">查询</b-button>
                        <b-alert :show="alerts.show" variant="danger">{{alerts.text}}</b-alert>
                    </b-tab>
                    <b-tab @click="shiftType('teacher')" class="select-tab" title="查老师">
                        <b-form-input v-model="params.teacher" placeholder="请输入教师姓名"></b-form-input>
                        <b-button @click="buildGetURL" class="select-button-submit" variant="primary">查询</b-button>
                        <b-alert :show="alerts.show" variant="danger">{{alerts.text}}</b-alert>

                    </b-tab>
                    <b-tab @click="shiftType('class')" class="select-tab" title="查课名">
                        <b-form-input v-model="params.teacher" placeholder="请输入课程名或代码"></b-form-input>
                        <b-button @click="buildGetURL" class="select-button-submit" variant="primary">查询</b-button>
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
                        </div>
                        <label>节数：</label>
                        <b-select :options="options.section" v-model="params.date.section"
                                  class="select-form-select"></b-select>
                        <b-button @click="buildGetURL" class="select-button-submit" variant="primary">查询</b-button>
                        <b-alert :show="alerts.show" variant="danger">{{alerts.text}}</b-alert>
                    </b-tab>
                </b-tabs>
            </b-card>
        </div>
        <div class="select-result" v-if="result.loaded">
            <b-card v-for="c in result.rawData.slice((page - 1) * 10, 20 * page)" :key="c.id"
                    style="margin-bottom: 2rem">
                <div class="select-result-title">
                    <h4>{{c.courseName}}</h4>
                    <h4>{{c.teacher}}</h4>
                </div>
                <div class="select-result-body">
                    <b-avatar variant="primary" :text="'学分'+c.grade" size="4rem"></b-avatar>
                    <div class="select-result-info">
                        <b-card-text>{{c.class}}</b-card-text>
                        <b-card-text>{{c.courseType}}</b-card-text>
                    </div>
                    <b-button class="select-result-button" v-b-toggle="'collapse-'+c.id"
                              variant="primary">详情
                    </b-button>
                </div>
                <b-card-footer style="color: gray">
                    {{c.courseTerm}}
                </b-card-footer>
                <b-collapse :id="'collapse-'+c.id" class="mt-2">
                    <b-card>
                        <b-card-text>课程代码: {{c.courseNumber}}</b-card-text>
                        <b-card-text>班级: {{c.class}}</b-card-text>
                        <div class="select-result-inline">
                            <b-card-text>学分: {{c.grade}}</b-card-text>
                            <b-card-text>考核: {{c.method}}</b-card-text>
                        </div>
                        <b-card-text>教师: {{c.teacher}}</b-card-text>
                        <b-card-text>教师等级: {{c.teacherLevel}}</b-card-text>
                        <div>
                            <b-card-text>时间地点:</b-card-text>
                            <div v-for="t of c.timePlace" style="margin-left: 1rem; margin-bottom: 1rem">
                                <b-card-text style="margin-bottom: unset">时间：{{t.week}}, {{t.lesson}}</b-card-text>
                                <b-card-text>地点：{{t.place}}</b-card-text>
                            </div>
                        </div>
                        <b-card-text>课程类型: {{c.courseType}}</b-card-text>
                        <b-card-text>开课学期: {{c.courseTerm}}</b-card-text>
                    </b-card>
                </b-collapse>
            </b-card>
            <b-pagination-nav :link-gen="linkGen" :number-of-pages="Math.ceil(this.result.count / 20)" use-router
                              v-model="page"></b-pagination-nav>
        </div>
    </div>
</template>

<script>
    import {num2Text, reduceObj} from "../utils";

    const axios = require('axios');

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
                page: 1,
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
                    // data: [{
                    //     courseName: "电工与电子技术B",
                    //     courseType: "学科基础和专业必修课",
                    //     courseTerm: "2020-2021学年第一学期",
                    //     studentDepartment: "环境工程学院",
                    //     method: "笔试",
                    //     class: "环境工程 19-1 班",
                    //     teacherDepartment: "环境工程学院",
                    //     teacher: "苗刚中",
                    //     teacherLevel: "副教授",
                    //     classNumber: "0400062B--004",
                    //     courseNumber: "0400062B",
                    //     studentDepartment2: "",
                    //     teacherDepartment2: "",
                    //     courseTime: "4~12周 周一 第五节~第六节;\n4~12周 周三 第三节~第四节",
                    //     courseTimePlace: "4~12周 周一 第五节~第六节 宣城校区 新安学堂222; \n4~12周 周三 第三节~第四节 宣城校区 新安学堂220",
                    //     courseTimePlaceTeacher: "4~12周 周一 第五节~第六节 宣城校区 新安学堂222 祁高飞; \n4~12周 周三 第三节~第四节 宣城校区 新安学堂220 祁高飞",
                    //     grade: "3"
                    // }]
                    rawData: undefined,
                    count: undefined
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
                    // dayTemp.value = i;
                    // dayTemp.text = `周${num2Text(i)}`;
                    dayTemp.value = dayTemp.text = `周${num2Text(i)}`;
                    day.push(dayTemp);
                }
                this.options.day = day;

                for (let i = 1; i <= 7; i += 2) {
                    const sectionTemp = new OptionsTemp();
                    // sectionTemp.value = i * 100 + i + 1;
                    // sectionTemp.text = `第${num2Text(i)}节~第${num2Text(i+1)}节`;
                    sectionTemp.value = sectionTemp.text = `第${num2Text(i)}节~第${num2Text(i + 1)}节`;
                    section.push(sectionTemp);
                }
                section.push(new OptionsTemp(9011, "第九节~第一节"));
                this.options.section = section;

            },
            shiftType(type) {
                this.alerts.show = false;
                this.result = {
                    loaded: false,
                    data: [],
                    rawData: undefined,
                    count: undefined
                }
                this.type = type;
            },
            linkGen(pageNum) {
                return pageNum === 1 ? '?' : `?page=${pageNum}`
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
            buildGetURL() {
                this.result.loaded = false;
                let getUrl;
                switch (this.type) {
                    case "classroom":
                        let building
                        switch (this.params.place) {
                            case "1":
                                building = "敬亭学堂";
                                break;
                            case "2":
                                building = "新安学堂";
                                break;
                        }
                        const roomID = building + this.params.classroomID;
                        // getUrl = `https://lesson.newxstudio.com/lesson/public/index.php/index/classroom/index/classroom/?classroom=${roomId}`;
                        getUrl = `http://127.0.0.1:8080/api/v1/class/classroom?roomID=${roomID}`;
                        break;
                    case "teacher":
                        const teacher = this.params.teacher;
                        getUrl = `http://127.0.0.1:8080/api/v1/class/teacher?teacher=${teacher}`;
                        // getUrl = `https://lesson.newxstudio.com/lesson/public/index.php/index/teacher/index/teacher/?teacher=${teacher}`;
                        break;
                    case "class":
                        getUrl = `http://127.0.0.1:8080/api/v1/class/courseName?courseName=${this.params.class}`;
                        // getUrl = `https://lesson.newxstudio.com/lesson/public/index.php/index/lesson/index/lesson/?lesson=${this.params.class}`;
                        break;
                    case "date":
                        const date = this.params.date;
                        // const _class = date.day + "0" + String(date.section);
                        // getUrl = `https://lesson.newxstudio.com/lesson/public/index.php/index/time/index/time/?week=${this.params.date.teachingWeek}&class=${_class}`;
                        getUrl = `http://127.0.0.1:8080/api/v1/class/date?teachingWeek=${date.teachingWeek}&day=${date.day}&section=${date.section}`
                }
                this.doSelectByGet(getUrl);
            },
            doSelectByGet(url) {
                axios
                    .get(url)
                    .then(resp => {
                        // this.result.data = this.parser(resp);
                        this.result.rawData = resp.data.data;
                        this.result.count = resp.data.count;
                        this.result.loaded = true;
                    })
            },
            parser(resp) {
                let result = [];
                const parserWeek = (i) => {
                    const rawWeek = String(i.week);
                    if (rawWeek.length === 4) {
                        i.week = `第${rawWeek.substring(0, 2)}-${rawWeek.substring(2).replace("0", "")}周`;
                    } else {
                        i.week = `第${rawWeek.charAt(0)}-${rawWeek.substring(1).replace("0", "")}周`;
                    }
                };
                const parserLesson = (i) => {
                    let result = [];
                    let buffer = "";
                    const rawLesson = String(i.lesson);
                    let j = 0;
                    while (j < rawLesson.length) {
                        if (rawLesson[j] === "0") {
                            result.push(buffer);
                            buffer = [];
                            j++;
                        } else {
                            buffer += rawLesson[j];
                            j++
                        }
                    }
                    if (buffer !== "") {
                        result.push(buffer);
                    }
                    i.lesson = `星期${result[0]}, 第${result[1]}-${result[2]}节`
                };
                const parserPlace = (i) => {
                    let rawPlace = String(i.place);
                    let building = "";
                    let roomId = rawPlace.substring(1);
                    if (rawPlace.charAt(0) === "1") {
                        building = "敬亭"
                    } else if (rawPlace.charAt(0) === "2") {
                        building = "新安"
                    } else {
                        building = "风雨操场";
                        roomId = ""
                    }
                    i.place = building + roomId;
                };
                for (let i of resp.data.data) {
                    for (let k of i['timePlace']) {
                        parserLesson(k);
                        parserPlace(k);
                        parserWeek(k);
                    }
                    result.push(i);
                }
                return result;

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

    .card-body {
        display: flex;
        flex-direction: column;
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
                font-size: 2.3rem;
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
            /*width: 75%;*/
            position: relative;
            padding: 8px;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            margin-top: 5rem;
            flex-direction: column;
            align-items: center;

            > .card {
                max-width: 720px;
                width: 100%;
            }

            /*.card-body {*/
            /*    flex-grow: 0;*/
            /*}*/

            h4 {
                font-size: 1rem;
            }

            &-body {
                display: flex;
                align-items: center;
            }

            &-title {
                display: flex;
                justify-content: space-between;
                flex-wrap: nowrap;
            }

            &-info {
                display: inline-flex;
                margin-left: 1rem;
                flex-direction: column;
                /*> p {*/
                /*    overflow: hidden;*/
                /*    text-overflow: ellipsis;*/
                /*    white-space: nowrap;*/
                /*    word-wrap: break-word;*/
                /*    word-break: break-all;*/
                /*}*/
                > p {
                    margin-bottom: 0;
                }
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