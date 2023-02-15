Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

// document.addEventListener("click", function name(params) {
//     gsap.to($(".day-box").children('li'), {
//         x: 0,
//         duration: 0.5
//     })

// })

import {
    ElMessage
} from 'element-plus';
import Color from 'color-js';
// import DBItems from "../components/DBItems.vue";
import {
    db
} from "./js/db";

import {
    liveQuery
} from "dexie";
import {
    useObservable
} from "@vueuse/rxjs";

import imgAssets from '@/util/pub-use.ts'

// 导入资源
// const req1 = import.meta.glob('/static/*.*', {eager: true})
// const req2 = import.meta.glob('/static/categoryicon/*.*', {eager: true})
// console.log('req1', req1)
// console.log('req2', req2)

var pieChart, barChart;
var sortArr;
var thisItems = [];
export default {
    // components: {
    //     DBItems: DBItems,
    // },
    data() {
        return {
            // slider
            imgAssets: imgAssets,

            today: new Date().Format("yyyy-MM-dd"),
            items: [],
            changingItem: {},
            changingIndex: new Array(2),
            changingDom: "",

            deletingItem: {},

            sumPrice: {
                dailySum: [
                    // {
                    //     date: "12月9日 今天",
                    //     total: 0
                    // },
                    // {
                    //     date: "12月8日 昨天",
                    //     total: 0
                    // },
                ],
                monthlySum: [],
                yearlySum: []
            },
            dailySumTest: [],

            pageshow: [true, false, false],

            selectedMonth: new Date().Format("yyyy-MM"),
            selectedDay: new Date().Format("yyyy-MM-dd"),

            flow: 'out',

            active: null,
            show: false,
            NUM: '',

            category: {
                in: [{
                        eng: "salary",
                        ch: "工资",
                    },
                    {
                        eng: "transfer",
                        ch: "收转账",
                    },
                ],
                out: [{
                        eng: "catering",
                        ch: "餐饮",
                    },
                    {
                        eng: "clothing",
                        ch: "衣服",
                    },
                    {
                        eng: "daily",
                        ch: "日用",
                    },
                    {
                        eng: "drug",
                        ch: "药品",
                    },
                    {
                        eng: "home",
                        ch: "家用",
                    },
                    {
                        eng: "love",
                        ch: "恋爱",
                    },
                    {
                        eng: "traffic",
                        ch: "交通",
                    },
                    {
                        eng: "other",
                        ch: "其他",
                    }
                ]
            },

            // dateSelectorParams: {
            //     readonly: true,
            // },

            initSelectedCategory: {
                eng: "catering",
                ch: "餐饮",
            },
            activeCategory: {},
            result: [],

            showingFlow: {
                eng: 'out',
                ch: '支出'
            },
            thisMonth: new Date().Format("yyyy-MM"),
            showingMonth: new Date().Format("yyyy-MM"),
            noteText: "",
            pieChart: {},
            pieChartOption: {},
            barChart: {},
            barChartOption: {},


            // dialog
            centerDialogVisible: false
        }
    },
    computed: {
        // 统计打中的地鼠数量
        num: function () {
            return this.result.join('');
        },

        showingItems: function () {
            return this.items.filter(element => element.date.slice(0, 7) == this.selectedMonth)
        },

        selectedMonthlySum: function () {
            return this.sumPrice.monthlySum.find(element => element.month == this.selectedMonth)
        },

        // showingMonthlySum: function() {
        //     return this.sumPrice.monthlySum.find(element => element.month == this.showingMonth )
        // }
    },
    mounted() {
        this.init();

        this.calculateSum();

        this.addingPageInit();

        this.page2Init();
        this.setChart();

    },

    methods: {
        async init() {
            // db.items.bulkPut([{
            //         date: "2022-12-09",
            //         dataList: [{
            //                 iconsrc: "./static/icon-catering.png",
            //                 category: "餐饮",
            //                 time: "11:47",
            //                 source: "chillax秋蕾咖啡",
            //                 flow: "out",
            //                 price: -33,
            //             },
            //             {
            //                 iconsrc: "./static/icon-traffic.png",
            //                 category: "交通",
            //                 time: "11:38",
            //                 source: "深圳通",
            //                 flow: "out",
            //                 price: -2
            //             },
            //             {
            //                 iconsrc: "./static/icon-traffic.png",
            //                 category: "交通",
            //                 time: "11:00",
            //                 source: "深圳通",
            //                 flow: "out",
            //                 price: -2
            //             },
            //             {
            //                 iconsrc: "./static/icon-life.png",
            //                 category: "生活缴费",
            //                 time: "08:49",
            //                 source: "手机充值",
            //                 flow: "out",
            //                 price: -50
            //             },
            //         ]
            //     },
            //     {
            //         date: "2022-12-08",
            //         dataList: [{
            //                 iconsrc: "./static/icon-traffic.png",
            //                 category: "交通",
            //                 time: "19:08",
            //                 source: "深圳通",
            //                 flow: "out",
            //                 price: -3
            //             },
            //             {
            //                 iconsrc: "./static/icon-catering.png",
            //                 category: "餐饮",
            //                 time: "14:52",
            //                 source: "chillax秋蕾咖啡",
            //                 flow: "out",
            //                 price: -33,
            //             },
            //             {
            //                 iconsrc: "./static/icon-traffic.png",
            //                 category: "交通",
            //                 time: "14:44",
            //                 source: "深圳通",
            //                 flow: "out",
            //                 price: -3
            //             },
            //             {
            //                 iconsrc: "./static/icon-life.png",
            //                 category: "餐饮",
            //                 time: "11:55",
            //                 source: "野犬WoofWoof",
            //                 flow: "out",
            //                 price: -58
            //             },
            //             {
            //                 iconsrc: "./static/icon-life.png",
            //                 category: "餐饮",
            //                 time: "11:20",
            //                 source: "森螺",
            //                 flow: "out",
            //                 price: -29
            //             },
            //             {
            //                 iconsrc: "./static/icon-traffic.png",
            //                 category: "交通",
            //                 time: "11:09",
            //                 source: "深圳通",
            //                 flow: "out",
            //                 price: -3
            //             },
            //         ]
            //     }
            // ]);
            // db.items.put({
            //     date: "2022-12-08",
            //     dataList: "test dataList"
            // });
            // db.items.put({
            //     id: 789456,
            //     date: "2022-12-08",
            //     dataList: "test dataList"
            // });
            // db.transaction('rw', db.items, async ()=>{

            //     //
            //     // Transaction Scope
            //     //

            // await db.items.put({
            //     id: 10,
            //     date: "2022-12-08",
            //     dataList: "test dataList"
            // });

            // }).then(() => {
            //     console.log("Transaction committed");

            // }).catch(err => {
            //     console.error(err.stack);
            // });
            db.items.each(item => {
                this.items.push(item)
                // console.log("item", item);
            });
            // var testQuery = useObservable(liveQuery(() => db.items.toArray()))
            // console.log("testQuery", testQuery)
            // this.items = testQuery.value
        },
        storage() {
            console.log("this.items", this.items)
            db.items.bulkPut(JSON.parse(JSON.stringify(this.items)))
        },
        calculateSum() {
            let dailySum = [];
            let monthlySum = [];
            let yearlySum = [];

            for (let i = 0; i < this.items.length; i++) {
                let date = this.items[i].date;
                let dailyTotal = 0;
                const dataList = this.items[i].dataList;
                dailySum.push({
                    date: date,
                    in: 0,
                    out: 0,
                    // total: 0,
                })

                // console.log("月份", date.substring(0, date.indexOf("月")));


                for (let j = 0; j < this.items[i].dataList.length; j++) {
                    const item = this.items[i].dataList[j];


                    if (item.flow == "in") {
                        dailySum[i].in += Number(item.price);
                    } else {
                        dailySum[i].out += Number(item.price);
                    }
                    // dailySum[i].total += item.price;
                    // console.log("item", item)

                    // all
                    let thisMonth = date.slice(0, 7);
                    let monthIndex = monthlySum.findIndex((element) => (element.month == thisMonth));


                    if (monthIndex > -1) {
                        let thisCategory = item.category;
                        let categoryIndex = monthlySum[monthIndex].categoryList.findIndex((element) => (element.category == thisCategory));
                        if (categoryIndex > -1) {
                            monthlySum[monthIndex].categoryList[categoryIndex].value += Number(item.price);
                        } else {
                            monthlySum[monthIndex].categoryList.push({
                                category: item.category,
                                value: Number(item.price)
                            })
                        }
                        if (Number(item.price) > 0) {
                            monthlySum[monthIndex].in += Number(item.price)
                        } else {
                            monthlySum[monthIndex].out += Number(item.price)
                        }
                        // monthlySum[monthIndex].total += item.price
                    } else {
                        if (Number(item.price) > 0) {
                            monthlySum.push({
                                month: thisMonth,
                                categoryList: [{
                                    category: item.category,
                                    value: Number(item.price)
                                }],
                                in: Number(item.price),
                                out: 0
                            })
                        } else {
                            monthlySum.push({
                                month: thisMonth,
                                categoryList: [{
                                    category: item.category,
                                    value: Number(item.price)
                                }],
                                in: 0,
                                out: Number(item.price)
                            })
                        }
                    }


                }

            }

            console.log("dailySum", dailySum)
            console.log("monthlySum", monthlySum)

            this.sumPrice.dailySum = dailySum;
            this.sumPrice.monthlySum = monthlySum;

            this.dailySumTest = dailySum;
        },

        getDailyOut(index) {
            // console.log("total", this.sumPrice.dailySum[index])
            if (this.sumPrice.dailySum[index]) {
                return this.sumPrice.dailySum[index].out
            }
        },
        getDailyIn(index) {
            // console.log("total", this.sumPrice.dailySum[index])
            if (this.sumPrice.dailySum[index]) {
                return Number(this.sumPrice.dailySum[index].in)
            }
        },
        getMonthlyOut() {
            // if (this.sumPrice.monthlySum[0]) {
            //     return -this.sumPrice.monthlySum[0].out
            // }

            // let monthlySum = this.sumPrice.monthlySum.find(element => element.month == this.selectedMonth )
            if (this.selectedMonthlySum) {
                // console.log("monthlySum", this.selectedMonthlySum)
                return -this.selectedMonthlySum.out
            } else {
                return 0
            }
        },
        getMonthlyIn() {
            // if (this.sumPrice.monthlySum[0]) {
            //     return Number(this.sumPrice.monthlySum[0].in)
            // }
            let monthlySum = this.sumPrice.monthlySum.find(element => element.month == this.selectedMonth)
            if (this.selectedMonthlySum) {
                // console.log("monthlySum", this.selectedMonthlySum)
                return Number(this.selectedMonthlySum.in)
            } else {
                return 0
            }
        },
        showingMonthlySum() {
            let monthlySum = this.sumPrice.monthlySum.find(element => element.month == this.showingMonth);
            if (monthlySum) {
                var showingFlow = this.showingFlow.eng;
                if (showingFlow == "out") {
                    return -monthlySum.out;
                } else if (showingFlow == "in") {
                    return Number(monthlySum.in);
                }
            }

        },

        changeSelectedMonth(e) {
            // console.log("select month", e);
        },
        changeShowingMonth(e) {
            // console.log("show month", e);
            this.setChart();
            // this.showingItems = this.items.filter(element => element.date.slice(0, 7) == this.selectedMonth)
        },

        changePage(e, pageNum) {

            // console.log(e);
            // console.log(e.target.querySelector("path"));

            $(".nav-icon>svg>path").css("fill", "#B9B9B9")
            // $(".nav-item").children("path").css("fill", "#B9B9B9");


            if (e.target.nodeName == "path")
                // e.target.fill = "var(--bg-color)";
                e.target.style.fill = "var(--bg-color)";
            else
                // e.target.querySelector("path").setAttribute("fill", "var(--bg-color)");
                e.target.querySelector("path").style.fill = "var(--bg-color)";

            for (let i = 0; i < 3; i++) {
                this.pageshow[i] = false;
            }
            this.pageshow[pageNum] = true;

            if (pageNum == 1) {
                this.setChart();
                setTimeout(() => {
                    if (pieChart) {
                        pieChart.resize();
                        barChart.resize();
                    }
                }, 10);
            }

        },


        showAddingPage() {

            this.clearSwipe();
            gsap.to("#add-page", {
                y: "-90vh"
            })
            // $("#add-page .selector").find('.el-input')[0].readonly = false;
        },
        closeAddingPage() {
            gsap.to("#add-page", {
                y: "90vh"
            })
        },

        // selector init 
        addingPageInit() {

            $("#add-page .category-list").find("img").each(function (index, item) {
                let activeIndex = item.src.indexOf("-active");
                if (activeIndex > 0) {
                    item.src = item.src.replace("-active", "")
                }
            })

            this.activeCategory = this.initSelectedCategory;
            this.settingCategoryIcon("#add-page");

            $("#selectToOut").css("backgroundColor", "var(--flow-out-color)");
            $("#selectToOut").click(() => {
                $("#selectToIn").css("backgroundColor", "#dedede");
                $("#selectToOut").css("backgroundColor", "var(--flow-out-color)");
                // $(".category-list").css({"display": "flex", "opacity": "1"});
                this.flow = "out";
                this.activeCategory = {
                    eng: "catering",
                    ch: "餐饮",
                };
                this.settingCategoryIcon("#add-page");
            })
            $("#selectToIn").click(() => {
                $("#selectToIn").css("backgroundColor", "var(--flow-in-color)");
                $("#selectToOut").css("backgroundColor", "#dedede");
                // $(".category-list").css({"display": "none", "opacity": "0"});
                this.flow = "in";
                this.activeCategory = {
                    eng: "salary",
                    ch: "工资",
                };
                this.settingCategoryIcon("#add-page");
            })

        },
        settingCategoryIcon(page) {
            setTimeout(() => {
                // console.log("category-list", $(".category-list").find("img"))
                // $(".category-list").find("img").each((index, item) => {
                //     if (item.src.indexOf(this.activeCategory.eng) > 0) {
                //         item.src = item.src.replace(this.activeCategory.eng, this.activeCategory.eng + "-active")
                //     }
                // });
                $(page).find(".category-list img").each((index, item) => {
                    if (item.src.indexOf(this.activeCategory.eng) > 0 && item.src.indexOf("-active") < 0) {
                        item.src = item.src.replace(this.activeCategory.eng, this.activeCategory.eng + "-active")
                    }
                });
            }, 50);
        },


        swipeHandler(index, dailyIndex) { // you can remove the `mouseEvent` argument
            return (direction, mouseEvent) => {
                // console.log("direction", direction);
                console.log("mouseEvent", mouseEvent);
                // console.log(index, dailyIndex);


                let dayBoxDom = $(".day-box").children('li').prevObject[index];
                // gsap.to($(dayBoxDom).find(".day-list>li"), {
                //     x: "0",
                //     duration: 0.5
                // })
                this.clearSwipe();
                // let selectedItem = $(dayBoxDom).find(".day-list>li")[dailyIndex];

                // let selectedItem = mouseEvent.path.find(item => item.className == "item-box");
                let selectedItem;
                if( mouseEvent.target.className == "item-box" ) {
                    selectedItem = mouseEvent.target;
                }
                else {
                    selectedItem = mouseEvent.target.parentNode;
                }

                this.changingDom = selectedItem;


                // console.log("selectedItem", selectedItem);
                if (direction == "left") {
                    gsap.to(selectedItem, {
                        x: "-40vw",
                        duration: 0.5
                    })
                } else if (direction == "right") {
                    gsap.to(selectedItem, {
                        x: 0,
                        duration: 0.5
                    })
                }
            };
        },

        clearSwipe() {
            // console.log("li", $(".day-box .day-list li"))
            gsap.to($(".day-box .day-list li"), {
                x: "0",
                duration: 0.5
            })
        },
        selectDeleteItem(deletingItem) {
            this.centerDialogVisible = true;
            this.deletingItem = deletingItem;
        },
        hadleCancel() {
            this.centerDialogVisible = false;
            this.clearSwipe();
        },
        handleDelete() {
            this.centerDialogVisible = false;

            let dateIndex = this.items.findIndex(dateList => dateList.date == this.deletingItem.date);
            let itemIndex = this.items[dateIndex].dataList.findIndex(item => item == this.deletingItem.item);
            this.items[dateIndex].dataList.splice(itemIndex, 1);
            // console.log("this.items[dateIndex]", this.items[dateIndex])
            if (this.items[dateIndex].dataList.length == 0) {
                this.items.splice(dateIndex, 1);
                db.items.delete(JSON.parse(JSON.stringify(this.deletingItem.date)))
            }

            this.calculateSum();
            this.setChart();
            this.storage();

            this.clearSwipe();
        },

        showChangingPage(date, changingItem) {
            gsap.to("#change-page", {
                y: "-90vh"
            })

            this.changingItem = changingItem;
            this.selectedDay = date;
            this.NUM = Math.abs(changingItem.price);


            $("#change-page .category-list").find("img").each(function (index, item) {
                let activeIndex = item.src.indexOf("-active");
                if (activeIndex > 0) {
                    item.src = item.src.replace("-active", "")
                }
            })
            this.activeCategory = this.category[changingItem.flow].find(item => item.ch == changingItem.category)
            this.settingCategoryIcon("#change-page");

        },
        changeCategory(e) {

            // cancel active
            $(".category-list").find("img").each(function (index, item) {
                let activeIndex = item.src.indexOf("-active");
                if (activeIndex > 0) {
                    item.src = item.src.replace("-active", "")
                }
            })

            // console.log("e", e.target.src)
            const src = e.target.src;
            let startIndex = src.lastIndexOf("/");
            let substring = src.substring(startIndex + 1, src.length - 4);
            // console.log("substring", substring)
            this.activeCategory = this.category[this.changingItem.flow].find(item => item.eng == substring);
            if (src.indexOf("-active") < 0) {
                e.target.src = this.insertStr(src, src.length - 4, "-active")
            }

            // console.log("src urls", e.target.src)
        },
        closeChangingPage() {

            gsap.to("#change-page", {
                y: "90vh"
            })

            // console.log("changingIndex", this.changingIndex);
            // let dayBoxDom = $(".day-box").children('li').prevObject[this.changingIndex[0]];
            // let selectedItem = $(dayBoxDom).find(".day-list>li")[this.changingIndex[1]];
            // console.log("day-box", $(".day-box").children('li'));
            // console.log("selectedItem", selectedItem);

            // gsap.to(selectedItem, {
            //     x: "40vw",
            //     duration: 0.5
            // })
            gsap.to(this.changingDom, {
                x: "0",
                duration: 0.5
            })

        },

        confirmChange() {
            // console.log("activeCategory", this.activeCategory);
            // this.changingItem.iconsrc = "./static/categoryicon/" + this.activeCategory.eng + "-active.svg",
            this.changingItem.iconsrc =  imgAssets.getCategories(`${this.activeCategory.eng}-active.svg`),
            this.changingItem.category = this.activeCategory.ch;
            this.changingItem.source = this.noteText;
            this.changingItem.price = (this.changingItem.flow == "in") ? Number(this.NUM).toFixed(2) : "-" + Number(this.NUM).toFixed(2);


            this.calculateSum();
            this.setChart();
            this.storage();

            this.NUM = 0;
            this.result = [];
            this.$emit('comfirm', this.NUM);


            this.closeChangingPage();
        },

        // keyboard
        msDown(v) {
            this.active = v;
        },
        msUp(v) {
            this.active = '';
        },
        stopInput() {
            return false;
        },
        change(val, $event) {
            if (this.result.length === 0 && val === '.') {
                return false;
            } else {
                this.result.push(val);
                this.NUM = this.result.join('');
            }
        },
        del() {
            this.result.pop();
            this.NUM = this.result.join('');
            this.$emit('del', this.NUM);
        },

        selectCategory(e) {

            // cancel active
            $(".category-list").find("img").each(function (index, item) {
                let activeIndex = item.src.indexOf("-active");
                if (activeIndex > 0) {
                    item.src = item.src.replace("-active", "")
                }
            })

            // console.log("e", e.target.src)
            const src = e.target.src;
            let startIndex = src.lastIndexOf("/");
            let substring = src.substring(startIndex + 1, src.length - 4);
            // console.log("substring", substring)
            this.activeCategory = this.category[this.flow].find(item => item.eng == substring);
            if (src.indexOf("-active") < 0) {
                e.target.src = this.insertStr(src, src.length - 4, "-active")
            }

            // console.log("src urls", e.target.src)
        },
        insertStr(soure, start, newStr) {
            return soure.slice(0, start) + newStr + soure.slice(start)
        },

        confirm() {
            console.log("NUM", this.NUM);
            console.log("result", this.result);
            if (Number(this.NUM) !== 0) {
                this.show = false;

                var date = new Date();
                var time = date.toLocaleTimeString('chinese', {
                    hour12: false
                }).slice(0, 5);
                let itemDate = this.items.find(element => element.date == this.selectedDay);
                if (itemDate) {
                    // console.log("this.activeCategory", this.activeCategory)
                    itemDate.dataList.unshift({
                        // iconsrc: (this.flow == "in") ? "./src/categoryicon/in.png" : "./src/categoryicon/" + this.activeCategory.eng + "-active.png",
                        // category: (this.flow == "in") ? "收入" : this.activeCategory.ch,
                        // iconsrc: "./static/categoryicon/" + this.activeCategory.eng + "-active.svg",
                        iconsrc: imgAssets.getCategories(`${this.activeCategory.eng}-active.svg`),
                        category: this.activeCategory.ch,
                        time: time,
                        source: this.noteText,
                        flow: this.flow,
                        price: (this.flow == "in") ? Number(this.NUM).toFixed(2) : "-" + Number(this.NUM).toFixed(2),
                    })
                } else {
                    this.items.unshift({
                        date: this.selectedDay,
                        dataList: [{
                            // iconsrc: (this.flow == "in") ? "./src/categoryicon/in.png" : "./src/categoryicon/" + this.activeCategory.eng + "-active.png",
                            // category: (this.flow == "in") ? "收入" : this.activeCategory.ch,
                            // iconsrc: "./static/categoryicon/" + this.activeCategory.eng + "-active.svg",
                            iconsrc:  imgAssets.getCategories(`${this.activeCategory.eng}-active.svg`),
                            category: this.activeCategory.ch,
                            time: time,
                            source: this.noteText,
                            flow: this.flow,
                            price: (this.flow == "in") ? Number(this.NUM).toFixed(2) : "-" + Number(this.NUM).toFixed(2),
                        }]
                    })
                }
                this.items = this.items.sort(function (a, b) {
                    return Date.parse(b.date) - Date.parse(a.date);
                })
                // console.log("showingItems", this.showingItems)
                // console.log("items", this.items)
                this.calculateSum();
                this.setChart();
                this.storage();

                this.NUM = 0;
                this.result = [];
                this.$emit('comfirm', this.NUM);

                this.closeAddingPage();
            } else {
                ElMessage('输入数值啊傻')
            }

        },


        page2Init() {
            $("#showOut").css({
                "background": "rgba(1, 1, 1, 0.5)",
                "color": "#ffffff"
            });
            $("#showOut").click(() => {
                $("#showIn").css({
                    "background": "none",
                    "color": "#D3D3D3"
                });
                $("#showOut").css({
                    "background": "rgba(1, 1, 1, 0.5)",
                    "color": "#ffffff"
                });
                this.showingFlow = {
                    eng: 'out',
                    ch: '支出'
                };

                // console.log(this.showingFlow);
                this.setChart();
            })
            $("#showIn").click(() => {
                $("#showIn").css({
                    "background": "rgba(1, 1, 1, 0.5)",
                    "color": "#ffffff"
                });
                $("#showOut").css({
                    "background": "none",
                    "color": "#D3D3D3"
                });
                this.showingFlow = {
                    eng: 'in',
                    ch: '收入'
                };
                // console.log(this.showingFlow);
                this.setChart();
            })
        },

        setChart() {
            // console.log("this.sumPrice.monthlySum", this.sumPrice.monthlySum)
            // console.log("this.showingMonth", this.showingMonth)
            let showingMonthData = this.sumPrice.monthlySum.find(element => element.month == this.showingMonth)
            // console.log("showingMonthData", showingMonthData)
            if (showingMonthData) {

                $("#pie-chart").css("display", "block");
                $("#bar-chart").css("display", "block");




                const showingFlow = this.showingFlow.eng;

                let showingData = showingMonthData.categoryList.filter(item => {
                    // console.log("showingflow", showingFlow)
                    if (showingFlow == "out") {
                        return item.value < 0
                    } else if (showingFlow == "in") {
                        return item.value > 0
                    }
                }).sort(func);
                // console.log("showingData", showingData)

                let basicColor;
                if (showingFlow == "out") {
                    basicColor = Color('#B397A4');
                } else if (showingFlow == "in") {
                    basicColor = Color('#A29F80');
                }

                // console.log("basicColor", basicColor.getLightness())
                let grade = (1 - basicColor.getLightness()) / showingData.length
                // const colorList = ['hsl(240,30%,50%)', 'hsl(240,30%,60%)', 'hsl(240,30%,70%)', 'hsl(240,50%,80%)'];
                // const colorList = [, basicColor.setLightness(basicColor.getLightness() + ), basicColor.setLightness(0.8), basicColor.setLightness(0.9)];
                let colorList = [];
                for (let i = 0; i < showingData.length; i++) {
                    colorList.push(basicColor.setLightness(basicColor.getLightness() + grade * i))
                }
                // console.log("colorList", colorList)

                let pieChartColorList = colorList;
                let barChartColorList = [...colorList].reverse();

                function func(a, b) {
                    return a.value - b.value;
                }

                pieChart = echarts.init(document.getElementById('pie-chart'));
                $('#pie-chart').removeAttr('_echarts_instance_');
                this.pieChartOption = {
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        top: '5%',
                        left: 'center'
                    },
                    series: [{
                        name: 'Access From',
                        type: 'pie',
                        radius: ['25%', '45%'],
                        avoidLabelOverlap: false,

                        itemStyle: {
                            // color: (params) => {
                            //     var colorList = [
                            //         '#A07464', '#B99689', '#CBB8B1', '#E2DAD7'
                            //     ];

                            //     return colorList[sortArr.findIndex(item => item.value == params.value)]
                            // },
                            color: (params) => {
                                // var colorList = ['hsl(240,30%,50%)', 'hsl(240,30%,60%)', 'hsl(240,30%,70%)', 'hsl(240,50%,80%)'];
                                return pieChartColorList[params.dataIndex]

                                // return colorList[sortArr.findIndex(item => item.value == params.value)]

                            },

                            borderRadius: 5,
                            // borderColor: '#fff',
                            // borderWidth: 2
                        },
                        emphasis: {
                            // label: {
                            //     show: true,
                            //     fontSize: 40,
                            //     fontWeight: 'bold'
                            // }
                        },
                        label: {
                            show: true,
                            formatter: (params) => {
                                // console.log("pie params", params)
                                return params.data.category + "\n" + params.percent + '%'
                            },
                            lineHeight: 18,
                            position: 'outside',
                            color: '#616161',
                            fontSize: 14,
                            alignTo: 'labelLine'
                        },
                        labelLine: {
                            show: true
                        },
                        // data: showingMonthData.categoryList.filter(item => {
                        //     console.log("showingflow", showingFlow)
                        //     if (showingFlow == "out") {
                        //         return item.value < 0
                        //     } else if (showingFlow == "in") {
                        //         return item.value > 0
                        //     }
                        // }).sort(function (a, b) {
                        //     return a.value - b.value;
                        // })
                        data: showingData
                    }]
                }
                pieChart.setOption(this.pieChartOption);

                barChart = echarts.init(document.getElementById('bar-chart'));
                this.barChartOption = {
                    title: {
                        // text: 'World Population'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {},
                    grid: {
                        left: '5%',
                        //   right: '4%',
                        top: '5%',
                        width: '80%',
                        height: '50%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value',
                        boundaryGap: [0, 0.01],
                        axisLine: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        },
                        axisLabel: {
                            show: false
                        },
                        formatter: (value) => {
                            console.log("value", value)
                            return -value
                        }
                    },
                    yAxis: {
                        type: 'category',
                        data: showingData.map(item => item.category),
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        // splitLine: {
                        //     show: false
                        // },
                        axisLabel: {
                            show: true,
                            color: '#616161',
                            fontSize: 14
                        },
                    },
                    barWidth: '20',
                    barCategoryGap: '5',
                    label: {
                        show: true,
                        formatter: (params) => {
                            // console.log("bar params", params)
                            return "￥" + params.value.toFixed(2)
                            // return params.data.category +  params.percent + '%'
                        },
                        position: 'right',
                        color: '#616161',
                        fontSize: 14
                    },
                    series: [{
                        type: 'bar',
                        colorBy: 'data',
                        itemStyle: {
                            color: (params) => {
                                // var colorList = [
                                //     '#A07464', '#B99689', '#CBB8B1', '#E2DAD7'
                                // ];
                                // return colorList[sortArr.findIndex(item => item.value == -params.value)]
                                // var colorList = ['hsl(240,30%,50%)', 'hsl(240,30%,60%)', 'hsl(240,30%,70%)', 'hsl(240,50%,80%)'];
                                return barChartColorList[params.dataIndex]
                            },
                            borderRadius: 5
                            // borderColor: '#fff',
                            // borderWidth: 2
                        },
                        // data: sortArr.map(function (obj) {
                        //     return {
                        //         name: obj.category,
                        //         value: -obj.value
                        //     };
                        // }),
                        data: showingData.reverse().map((obj) => {
                            if (showingFlow == "out") {
                                return {
                                    name: obj.category,
                                    value: -obj.value
                                };
                            } else if (showingFlow == "in") {
                                return {
                                    name: obj.category,
                                    value: obj.value
                                };
                            }

                        }),

                    }]
                }
                barChart.setOption(this.barChartOption)
            } else {
                $("#pie-chart").css("display", "none");
                $("#bar-chart").css("display", "none");
            }

        },
    }
}