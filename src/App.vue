<template>
    <div id="page1" v-show='pageshow[0] == true'>
        <div id="page1-top">
            <div id="title" class="center">记账demo</div>
            <!-- <DBItems :prefix="prefix" msg="Hello Vue 3 in CodeSandbox!" /> -->

            <!-- <div id="selector-type">全部类型</div> -->
            <!-- <div id="selector-time">2022年12月</div> -->
            <div id="selector-time">
                <el-date-picker v-model="selectedMonth" value-format="YYYY-MM" type="month" placeholder="选择月份"
                    format="YYYY-MM" @change="changeSelectedMonth">
                </el-date-picker>
                <!-- <img src="./src/calenderIcon.png" alt=""> -->
            </div>
            <div id="statistic-all">总支出￥{{ getMonthlyOut() }} 总入账￥{{ getMonthlyIn() }}</div>
        </div>


        <div id="detail-box">
            <div class="day-box" v-for="(dailyItems, index) in showingItems" :key="index">
                <div class="date">{{dailyItems.date}}</div>
                <div class="statistic-day">
                    <div class="out">出：{{ getDailyOut(index) }}</div>
                    <!-- <div class="out">出：{{ sumPrice.dailySum[index].total }}</div> -->
                    <!-- <div class="out">出：{{index}} <div> -->
                    <div class="in">入：{{ getDailyIn(index) }}</div>
                </div>
                <div class="day-list">
                    <li v-for="(item, dailyIndex) in dailyItems.dataList" class="item-box" :key="item.time"  v-touch:swipe="swipeHandler(index, dailyIndex)">
                        <!-- <div class="item-box-inner" > -->
                            <img :src="item.iconsrc" alt="">
                            <div class="item-category">{{ item.category }}</div>
                            <div class="item-time">{{ item.time }}</div>
                            <div class="item-source">{{ item.source }}</div>
                            <div class="item-price">{{ item.price }}</div>
                            <div class="item-change-icon center" @click="showChangingPage ( dailyItems.date, item )">修改
                            </div>
                            <div class="item-delete-icon center"
                                @click="selectDeleteItem( {'date': dailyItems.date, 'item': item} )">删除</div>
                        <!-- </div> -->
                    </li>
                </div>
            </div>
        </div>

        <div id="add-icon" class="center">
            <svg t="1671085596445" class="icon" viewBox="0 0 1024 1024" version="1.1" @click="showAddingPage"
                xmlns="http://www.w3.org/2000/svg" p-id="2692" width="200" height="200">
                <path
                    d="M512 936.915619c-234.672764 0-424.915619-190.243879-424.915619-424.915619S277.327236 87.083357 512 87.083357c234.676857 0 424.916643 190.243879 424.916643 424.915619S746.676857 936.915619 512 936.915619zM724.45781 469.50414 554.491767 469.50414 554.491767 299.546284l-84.983533 0 0 169.957857L299.54219 469.50414l0 84.99172 169.966043 0 0 169.966043 84.983533 0L554.491767 554.49586l169.966043 0L724.45781 469.50414z"
                    p-id="2693" fill="var(--bg-color)"></path>
            </svg>
        </div>

        <div id="change-page">
            <!-- <img class="close-button" :src="require('/static/close.png')" alt="" @click="closeChangingPage"> -->
            <img class="close-button" :src= "imgAssets.getIcons('close.png')"  alt="" @click="closeChangingPage">
            <div class="selector">
                <!-- <button id="selectToOut">支出</button>
                <button id="selectToIn">入账</button> -->
                <!-- <input type="radio" id="expenditure" name="flow" value="out" />
                    <input type="radio" id="income" name="flow" value="in" /> -->
                <el-date-picker v-model="selectedDay" value-format="YYYY-MM-DD" type="date" :placeholder="today"
                    format="YYYY-MM-DD" readonly>
                </el-date-picker>
                <!-- <select name="" id=""></select> -->
            </div>
            <div class="input-box">￥<input type="text" v-model="NUM" @focus="show = true" onfocus="this.blur()">
            </div>
            <div class="category-list">
                <div class="category-item" v-for="(item, index) in category[changingItem.flow]" :key="index">
                    <!-- <img @click="changeCategory" :src="'../static/categoryicon/' + item.eng + '.svg'" alt=""> -->
                    <img @click="changeCategory" :src="imgAssets.getCategories(`${item.eng}.svg`)" alt="">
                    <h5>{{ item.ch }}</h5>
                </div>


                <!-- <img src="./src/categories.png" style="width: 100%;" alt=""> -->
            </div>
            <div class="notes">
                <h6>备注</h6>
                <textarea v-model="noteText" name="" id="" cols="30" rows="10"></textarea>
            </div>
            <div class="keyboard-wrapper">
                <!-- <input type="text" v-model="NUM" @focus="show = true" onfocus="this.blur()" /> -->
                <!-- <div class="keyboard" v-if="show"> -->
                <div class="keyboard">
                    <div class="num">
                        <table>
                            <tr>
                                <td @click="change(1)" :class="[active === 1 ? 'active' : '']" @touchstart="msDown(1)"
                                    @touchend="msUp(1)">1</td>
                                <td @click="change(2)" :class="[active === 2 ? 'active' : '']" @touchstart="msDown(2)"
                                    @touchend="msUp(2)">2</td>
                                <td @click="change(3)" :class="[active === 3 ? 'active' : '']" @touchstart="msDown(3)"
                                    @touchend="msUp(3)">3</td>
                                <td rowspan="2" class="del" @click="del"><img style="width: 30%;"
                                        :src="imgAssets.getCategories('backspace.png')" alt=""></td>
                            </tr>
                            <tr>
                                <td @click="change(4)" :class="[active === 4 ? 'active' : '']" @touchstart="msDown(4)"
                                    @touchend="msUp(4)">4</td>
                                <td @click="change(5)" :class="[active === 5 ? 'active' : '']" @touchstart="msDown(5)"
                                    @touchend="msUp(5)">5</td>
                                <td @click="change(6)" :class="[active === 6 ? 'active' : '']" @touchstart="msDown(6)"
                                    @touchend="msUp(6)">6</td>
                            </tr>
                            <tr>
                                <td @click="change(7)" :class="[active === 7 ? 'active' : '']" @touchstart="msDown(7)"
                                    @touchend="msUp(7)">7</td>
                                <td @click="change(8)" :class="[active === 8 ? 'active' : '']" @touchstart="msDown(8)"
                                    @touchend="msUp(8)">8</td>
                                <td @click="change(9)" :class="[active === 9 ? 'active' : '']" @touchstart="msDown(9)"
                                    @touchend="msUp(9)">9</td>
                                <td rowspan="2" class="confirm" @click="confirmChange">确定</td>
                            </tr>
                            <tr>
                                <td colspan="2" @click="change(0)" :class="[active === 0 ? 'active' : '']"
                                    @touchstart="msDown(0)" @touchend="msUp(0)">0</td>
                                <td colspan="1" @click="change('.')" :class="[active === '.' ? 'active' : '']"
                                    @touchstart="msDown('.')" @touchend="msUp('.')">.</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <div id="add-page">
            <!-- <img class="close-button" src="../static/close.png" alt="" @click="closeAddingPage"> -->
            <img class="close-button" :src="imgAssets.getIcons('close.png')" alt="" @click="closeAddingPage">
            <div class="selector">
                <button id="selectToOut">支出</button>
                <button id="selectToIn">入账</button>
                <!-- <input type="radio" id="expenditure" name="flow" value="out" />
                    <input type="radio" id="income" name="flow" value="in" /> -->
                <el-date-picker v-model="selectedDay" value-format="YYYY-MM-DD" type="date" :placeholder="today"
                    format="YYYY-MM-DD" ref="dateSelector">
                </el-date-picker>
                <!-- <select name="" id=""></select> -->
            </div>
            <div class="input-box">￥<input type="text" v-model="NUM" @focus="show = true" onfocus="this.blur()">
            </div>
            <div class="category-list">
                <!-- <div class="category-item"><img @click="selectCategory" src="./src/categoryicon/catering-active.png" alt=""></div>
                    <div class="category-item"><img @click="selectCategory" src="./src/categoryicon/clothing.png" alt=""></div>
                    <div class="category-item"><img @click="selectCategory" src="./src/categoryicon/daily.png" alt=""></div>
                    <div class="category-item"><img @click="selectCategory" src="./src/categoryicon/drug.png" alt=""></div>
                    <div class="category-item"><img @click="selectCategory" src="./src/categoryicon/home.png" alt=""></div>
                    <div class="category-item"><img @click="selectCategory" src="./src/categoryicon/love.png" alt=""></div>
                    <div class="category-item"><img @click="selectCategory" src="./src/categoryicon/traffic.png" alt=""></div>
                    <div class="category-item"><img @click="selectCategory" src="./src/categoryicon/other.png" alt=""></div> -->

                <div class="category-item" v-for="(item, index) in category[flow]" :key="index">
                    <!-- <img @click="selectCategory" :src="'./src/categoryicon/' + item.eng + '.png'" alt=""> -->
                    <!-- <img @click="selectCategory" :src="'../static/categoryicon/' + item.eng + '.svg'" alt=""> -->
                    <img @click="selectCategory" :src="imgAssets.getCategories(`${item.eng}.svg`)" alt="">
                    <h5>{{ item.ch }}</h5>
                </div>


                <!-- <img src="./src/categories.png" style="width: 100%;" alt=""> -->
            </div>
            <div class="notes">
                <h6>备注</h6>
                <textarea v-model="noteText" name="" id="" cols="30" rows="10"></textarea>
            </div>
            <div class="keyboard-wrapper">
                <!-- <input type="text" v-model="NUM" @focus="show = true" onfocus="this.blur()" /> -->
                <!-- <div class="keyboard" v-if="show"> -->
                <div class="keyboard">
                    <div class="num">
                        <table>
                            <tr>
                                <td @click="change(1)" :class="[active === 1 ? 'active' : '']" @touchstart="msDown(1)"
                                    @touchend="msUp(1)">1</td>
                                <td @click="change(2)" :class="[active === 2 ? 'active' : '']" @touchstart="msDown(2)"
                                    @touchend="msUp(2)">2</td>
                                <td @click="change(3)" :class="[active === 3 ? 'active' : '']" @touchstart="msDown(3)"
                                    @touchend="msUp(3)">3</td>
                                <td rowspan="2" class="del" @click="del"><img style="width: 30%;"
                                    :src="imgAssets.getIcons('backspace.png')" alt=""></td>
                            </tr>
                            <tr>
                                <td @click="change(4)" :class="[active === 4 ? 'active' : '']" @touchstart="msDown(4)"
                                    @touchend="msUp(4)">4</td>
                                <td @click="change(5)" :class="[active === 5 ? 'active' : '']" @touchstart="msDown(5)"
                                    @touchend="msUp(5)">5</td>
                                <td @click="change(6)" :class="[active === 6 ? 'active' : '']" @touchstart="msDown(6)"
                                    @touchend="msUp(6)">6</td>
                            </tr>
                            <tr>
                                <td @click="change(7)" :class="[active === 7 ? 'active' : '']" @touchstart="msDown(7)"
                                    @touchend="msUp(7)">7</td>
                                <td @click="change(8)" :class="[active === 8 ? 'active' : '']" @touchstart="msDown(8)"
                                    @touchend="msUp(8)">8</td>
                                <td @click="change(9)" :class="[active === 9 ? 'active' : '']" @touchstart="msDown(9)"
                                    @touchend="msUp(9)">9</td>
                                <td rowspan="2" class="confirm" @click="confirm">确定</td>
                            </tr>
                            <tr>
                                <td colspan="2" @click="change(0)" :class="[active === 0 ? 'active' : '']"
                                    @touchstart="msDown(0)" @touchend="msUp(0)">0</td>
                                <td colspan="1" @click="change('.')" :class="[active === '.' ? 'active' : '']"
                                    @touchstart="msDown('.')" @touchend="msUp('.')">.</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- 通知框 -->
        <el-dialog v-model="centerDialogVisible" title="Warning" width="80%" center>
            <span>
                确定删除？
            </span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="hadleCancel">取消</el-button>
                    <el-button type="primary" @click="handleDelete">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>

    <div id="page2" v-show='pageshow[1] == true'>
        <div id="page2-top">
            <!-- <div id="calendar">2022年12月</div> -->
            <div id="calendar">
                <el-date-picker v-model="showingMonth" value-format="YYYY-MM" format="YYYY-MM" type="month"
                    :placeholder="thisMonth" @change="changeShowingMonth">
                </el-date-picker>
            </div>
            <div id="selector-in-out">
                <div class="center" id="showOut">支出</div>
                <div class="center" id="showIn">入账</div>
            </div>
            <div id="total-num">
                <div class="sum-title">共{{ this.showingFlow.ch }}</div>
                <div class="sum-price">￥{{ showingMonthlySum() }}</div>
            </div>
        </div>


        <div id="graphic">
            <div id="chart1-title">支出构成</div>
            <div id="pie-chart"></div>
            <div id="bar-chart"></div>
        </div>
    </div>

    <div id="page3" v-show='pageshow[2] == true'>
        <h1>加钱解锁更多定制服务 </h1>
    </div>
    <div id="nav-bar">
        <div class="nav-item">
            <div class="nav-icon center" @click="changePage($event, 0)">
                <!-- <img style="height: 100%;" src="./src/navIcon-detail.svg" alt=""> -->
                <svg id="navicon-detail" style="height: 100%;" width="153" height="159" viewBox="0 0 153 159"
                    fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M140.266 0H12.7343C5.78264 0 0.146132 4.72137 0 10.6142H0.87679C0.584527 10.6142 0.31314 10.6319 0 10.6497V148.155C0 154.137 5.72002 159 12.7552 159H140.266C147.28 159 153 154.137 153 148.155V10.6319C152.854 4.72137 147.196 0 140.266 0ZM80.2681 117.484C80.2681 120.608 77.262 123.164 73.5878 123.164H43.1089C39.4347 123.164 36.4286 120.608 36.4286 117.484C36.4286 114.36 39.4347 111.804 43.1089 111.804H73.5878C77.262 111.804 80.2681 114.36 80.2681 117.484ZM99.0565 79.5C99.0565 82.6239 96.0503 85.1798 92.3762 85.1798H43.1089C39.4347 85.1798 36.4286 82.6239 36.4286 79.5C36.4286 76.3761 39.4347 73.8202 43.1089 73.8202H92.3762C96.0503 73.8202 99.0565 76.3761 99.0565 79.5ZM116.592 41.5161C116.592 44.64 113.586 47.1959 109.912 47.1959H43.1089C39.4347 47.1959 36.4286 44.64 36.4286 41.5161C36.4286 38.3922 39.4347 35.8362 43.1089 35.8362H109.912C113.586 35.8362 116.592 38.3922 116.592 41.5161Z"
                        fill="var(--bg-color)" />
                </svg>
            </div>
            <h3>明细</h3>
        </div>
        <div class="nav-item">
            <div class="nav-icon center" @click="changePage($event, 1)">
                <!-- <img style="height: 100%;" src="./src/navIcon-statistic.svg" alt=""> -->
                <svg id="navicon-statistic" style="height: 100%;" width="153" height="149" viewBox="0 0 153 149"
                    fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M24.0886 49.2661C27.9779 49.2661 30.8321 50.5345 32.6513 53.0712C34.4705 55.608 35.3801 58.4117 35.3801 61.4825V149H0V62.2836C0 58.1447 1.22325 54.9404 3.66974 52.6707C6.11624 50.401 8.78229 49.2661 11.6679 49.2661H24.0886ZM82.8044 0C86.1919 0 88.8893 1.10148 90.8967 3.30443C92.9041 5.50739 93.9077 8.14427 93.9077 11.2151V149H58.7159V11.6156C58.7159 9.6129 59.0922 7.87724 59.845 6.4086C60.5978 4.93997 61.5387 3.73835 62.6679 2.80376C63.797 1.86918 65.0517 1.16823 66.4317 0.700941C67.8118 0.233647 69.0664 0 70.1956 0H82.8044V0ZM141.332 86.7164C142.461 86.7164 143.685 87.0502 145.002 87.7177C146.319 88.3853 147.574 89.3199 148.766 90.5215C149.958 91.7231 150.961 93.0916 151.777 94.627C152.592 96.1624 153 97.7979 153 99.5336V149H117.808V99.9341C117.808 98.4655 118.09 96.9301 118.655 95.328C119.22 93.7258 120.004 92.2905 121.007 91.0222C122.011 89.7538 123.203 88.7191 124.583 87.918C125.963 87.1169 127.469 86.7164 129.1 86.7164H141.332Z"
                        fill="#B9B9B9" />
                </svg>

            </div>
            <h3>统计</h3>
        </div>
        <div class="nav-item">
            <div class="nav-icon center" @click="changePage($event, 2)">
                <!-- <img style="height: 100%;" src="./src/navIcon-setting.svg" alt=""> -->
                <svg id="navicon-setting" style="height: 100%;" width="176" height="175" viewBox="0 0 176 175"
                    fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M171.135 103.906L156.292 92.6563C156.448 91.0938 156.604 89.375 156.604 87.5C156.604 85.625 156.448 83.9063 156.292 82.3438L171.135 71.0938C175.198 67.9688 176.292 62.5 173.635 57.8125L157.073 29.8438C155.198 26.5625 151.604 24.5313 147.854 24.5313C146.604 24.5313 145.51 24.6875 144.26 25.1563L126.604 32.0312C123.635 30 120.51 28.2813 117.385 26.875L114.729 8.90625C113.948 3.75 109.573 0 104.26 0H70.8229C65.5104 0 61.1354 3.75 60.3542 8.75L57.8542 26.875C54.7292 28.2813 51.7604 30 48.6354 32.0312L30.9792 25.1563C29.7292 24.6875 28.4792 24.5313 27.2292 24.5313C23.4792 24.5313 19.8854 26.4063 18.1667 29.6875L1.44792 57.8125C-1.20833 62.1875 -0.114584 67.9688 3.94792 71.0938L18.7917 82.3438C18.6354 84.2188 18.4792 85.9375 18.4792 87.5C18.4792 89.0625 18.4792 90.7813 18.7917 92.6563L3.94792 103.906C-0.114584 107.031 -1.20833 112.5 1.44792 117.188L18.0104 145.156C19.8854 148.438 23.4792 150.469 27.2292 150.469C28.4792 150.469 29.5729 150.313 30.8229 149.844L48.4792 142.969C51.4479 145 54.5729 146.719 57.6979 148.125L60.3542 166.094C60.9792 171.094 65.5104 175 70.8229 175H104.26C109.573 175 113.948 171.25 114.729 166.25L117.385 148.125C120.51 146.719 123.479 145 126.604 142.969L144.26 149.844C145.51 150.313 146.76 150.469 148.01 150.469C151.76 150.469 155.354 148.594 157.073 145.312L173.792 117.031C176.292 112.5 175.198 107.031 171.135 103.906V103.906ZM125.042 87.5C125.042 108.125 108.167 125 87.5417 125C66.9167 125 50.0417 108.125 50.0417 87.5C50.0417 66.875 66.9167 50 87.5417 50C108.167 50 125.042 66.875 125.042 87.5Z"
                        fill="#B9B9B9" />
                </svg>

            </div>
            <h3>设置</h3>
        </div>
    </div>

</template>



<style scoped>
    header {
        line-height: 1.5;
    }

    .logo {
        display: block;
        margin: 0 auto 2rem;
    }

    @media (min-width: 1024px) {
        header {
            display: flex;
            place-items: center;
            padding-right: calc(var(--section-gap) / 2);
        }

        .logo {
            margin: 0 2rem 0 0;
        }

        header .wrapper {
            display: flex;
            place-items: flex-start;
            flex-wrap: wrap;
        }
    }
</style>

<script type="module" src="./app.js"></script>