const yearList = []
const monthList = []
for(let i = 1990; i <= 2030; i++) {yearList.push(i)}
for(let i = 0; i <= 11; i++) {monthList.push(i)}
const Counter = {
    data() {
        return {
            curDate: new Date(),
            yearList,
            showYearList: false,
            monthList,
            showMonthList: false,
            tableList: [],
        }
    },
    computed: {
        curYear () {
            return this.curDate.getFullYear()
        },
        curMonth () {
            return this.curDate.getMonth()
        },
        curDay () {
            return this.curDate.getDate()
        },
        /**
         * 上个月最后一天
         */
        lastMonthEndDay() {
            return new Date(this.curYear, this.curMonth, 0).getDate()
        },
        /**
         * 当月最后一天
         */
        curMonthEndDay() {
            return new Date(this.curYear, this.curMonth + 1, 0).getDate()
        },
        /**
         * 当前月份从哪一格开始
         */
        curMonthNum () {
            let days = new Date(this.curYear, this.curMonth, 1).getDay()
            return days === 0 ? 6 : days - 1
        },
        /**
         * 是否是今天
         */
        isCurrent() {
            let current = new Date()
            return (
                current.getFullYear() === this.curYear &&
                current.getMonth() === this.curMonth &&
                current.getDate() === this.curDay
            )
        }
    },
    methods: {
        init() {
            this.monthChange()
            this.backToday()
        },
        /**
         * 下拉框显隐
         */
        handleShowselect (type) {
            if (type === 'year') {
                this.showYearList = !this.showYearList
                this.showMonthList = false
            } else {
                this.showMonthList = !this.showMonthList
                this.showYearList = false
            }
        },
        /**
         * 点击年份重新渲染
         */
        handleSelectYear (year) {
            this.curDate = new Date(year,this.curMonth,this.curDay)
            this.getData()
        },
        /**
         * 点击月份重新渲染
         */
        handleSelectMonth (month) {
            this.curDate = new Date(this.curYear,month,this.curDay)
            this.getData()
        },
        /**
         * @description 转中文数字
         * @param num 数字
         * @returns {string} 
         */
        changeNum(num) {
            const Bit = {
                '1': '一',
                '2': '二',
                '3': '三',
                '4': '四',
                '5': '五',
                '6': '六',
                '7': '七',
                '8': '八',
                '9': '九',
                '0': '',
            };
            const Ten = {
                '1': '十',
                '2': '二十',
                '3': '三十',
            }
            const splitNum = num.toString().split('')
            return splitNum.length === 2 ? `${Ten[splitNum[0]]}${Bit[splitNum[1]]}` : `初${Bit[splitNum[0]]}`
        },
        /**
         * 渲染月份
         */
        getData() {
            let nextMonthDay = 1
            let curMonthDay = 1

            let num = 0
            // 上个月从哪天开始展示 = 上个月的天数 -  上个月最后一天从哪一格开始
            let lastMonthDay = this.lastMonthEndDay - this.curMonthNum + 1
            let table = []
            for(let i = 0; i < 6; i ++) {
                let tr = []
                for(let j = 0; j < 7; j ++) {
                    let td = {}
                    if (num < this.curMonthNum) {
                        let last = lastMonthDay ++
                        let lNum = this.changeNum(last)
                        td = {
                            status: 'last-month',
                            day: last,
                            nDay: lNum,
                            num
                        }
                        tr.push(td)
                    } else if (num >= this.curMonthEndDay + this.curMonthNum) {
                        let next = nextMonthDay ++
                        let nNum = this.changeNum(next)
                        td = {
                            status: 'next-month',
                            day: next,
                            nDay: nNum,
                            num
                        }
                        tr.push(td)
                    } else {
                        let cur = curMonthDay
                        let CNum = this.changeNum(cur)
                        td = {
                            status: curMonthDay == this.curDay && this.isCurrent ? 'current' : '',
                            day: cur,
                            nDay: CNum,
                            num
                        }
                        curMonthDay ++
                        tr.push(td)
                    }
                    num ++
                }
                table.push(tr)
            }
            this.tableList = table
        },
        /**
         * 上个月
         */
        handleClickBefore() {
            this.curDate = new Date(this.curYear,this.curMonth - 1,this.curDay)
            this.getData(this.curDate)
        },
        /**
         * 下个月
         */
        handleClickAfter() {
            this.curDate = new Date(this.curYear,this.curMonth + 1,this.curDay)
            this.getData(this.curDate)
        },
        /**
         * 返回今天
         */
        handleBack() {
            this.curDate = new Date()
            this.getData(this.curDate)
        }
    },
    mounted () {
        this.getData()
    }
}

Vue.createApp(Counter).mount('#calendar')