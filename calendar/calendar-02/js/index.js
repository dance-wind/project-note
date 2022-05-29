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
        lastMonthEndDay() {
            return new Date(this.curYear, this.curMonth, 0).getDate()
        },
        curMonthEndDay() {
            return new Date(this.curYear, this.curMonth + 1, 0).getDate()
        },
        curMonthFirstWeekDay () {
            return new Date(this.curYear, this.curMonth, 1).getDay()
        },
        lastMonthNum () {
            let lastMonthNum = this.curMonthFirstWeekDay - 1
            return this.curMonthFirstWeekDay === 0 ? 6 : lastMonthNum
        },
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
        handleShowselect (type) {
            if (type === 'year') {
                this.showYearList = !this.showYearList
                this.showMonthList = false
            } else {
                this.showMonthList = !this.showMonthList
                this.showYearList = false
            }
        },
        handleSelectYear (year) {
            this.curDate = new Date(year,this.curMonth,this.curDay)
            this.getData()
        },
        handleSelectMonth (month) {
            this.curDate = new Date(this.curYear,month,this.curDay)
            this.getData()
        },
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
        getData() {
            let nextMonthDay = 1
            let curMonthDay = 1

            let num = 0
            let lastMonthDay = this.lastMonthEndDay - this.lastMonthNum + 1
            let table = []
            for(let i = 0; i < 6; i ++) {
                let tr = []
                for(let j = 0; j < 7; j ++) {
                    let td = {}
                    if (num < this.lastMonthNum) {
                        let last = lastMonthDay ++
                        let lNum = this.changeNum(last)
                        td = {
                            status: 'last-month',
                            day: last,
                            nDay: lNum,
                            num
                        }
                        tr.push(td)
                    } else if (num >= this.curMonthEndDay + this.lastMonthNum) {
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
        handleClickBefore() {
            this.curDate = new Date(this.curYear,this.curMonth - 1,this.curDay)
            this.getData(this.curDate)
        },
        handleClickAfter() {
            this.curDate = new Date(this.curYear,this.curMonth + 1,this.curDay)
            this.getData(this.curDate)
        },
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