(function() {
    /**
     * 月份列表
     */
    const yearListDom = document.querySelector('#year-list')
    /**
     * 年份选择器
     */
    const yearPickerDom = document.querySelector('#year-select')
    /**
     * 月份列表
     */
    const monthListDom = document.querySelector('#month-list')
    /**
     * 月份选择器
     */
    const monthPickerDom = document.querySelector('#month-select')
    /**
     * 日历表
     */
    const calendarTableDom = document.querySelector('#calendar-table')
    /**
     * 上个月
     */
    const beforeDom = document.querySelector('#before')
    /**
     * 下个月
     */
    const afterDom = document.querySelector('#after')
    /**
     * 回到今天
     */
    const backDom = document.querySelector('#back-today')

    const yearList = []
    const monthList = []
    for(let i = 1990; i <= 2030; i++) {yearList.push(i)}
    for(let i = 0; i <= 11; i++) {monthList.push(i)}

    let calendar = {
        curDate: new Date(),
        render() {
            this.renderYearAndMonthPicker()
            this.renderTable()
            this.renderYearListAndMonthList()
        },
        bindClick() {
            this.monthChange()
            this.backToday()
            this.addMonthButtonOrYearButtonClick()
        },
        /**
         * 月份天数
         * @param year 年份
         * @param month 月份
         */
        getMonthDay(year, month) {
            // (year, month, 0)表示是(year, month, 1)的前一天 => 上个月的最后一天
            // getDate 返回是月份中的哪一日 
            return new Date(year, month, 0).getDate()
        },
        /**
         * 当月在日历表哪一格开始
         * @param year 年份
         * @param month 月份
         */
        getFirstMonthCell(year, month) {
            // getDay 返回是一周中的第几天，返回 0 表示星期天
            let days = new Date(year, month - 1, 1).getDay()
            // 周一 => 周天  0 => 6
            return days === 0 ? 6 : days - 1
        },
        /**
         * @param curDay 日期
         * @returns 
         */
        isToday (curDay) {
            let today = new Date()
            const curDate = this.curDate
            return (
                today.getFullYear() === curDate.getFullYear() &&
                today.getMonth() === curDate.getMonth() &&
                curDay == curDate.getDate()
            )
        },
        /**
         * @description 渲染月份
         */
        renderTable() {
            const curDate = this.curDate
            // 上个月的天数
            let lastMonthEndDay = this.getMonthDay(curDate.getFullYear(), curDate.getMonth())
            // 当月天数
            let curMonthEndDay = this.getMonthDay(curDate.getFullYear(), curDate.getMonth() + 1)
            // 当月在日历表哪一格开始
            let curMonthNum = this.getFirstMonthCell(curDate.getFullYear(), curDate.getMonth() + 1)
            // 上个月日历 = 上个月的天数 -  上个月在第几格结束
            let lastMonthDay = lastMonthEndDay - (curMonthNum - 1)
            // 下个月日历
            let nextMonthDay = 1
            // 当月日历
            let curMonthDay = 1
            // 日历格子
            let cell = 0
            
            calendarTableDom.innerHTML = ''
            for(let i = 0; i < 6; i ++) {
                let tr = document.createElement('tr')
                let td = ''
                for(let j = 0; j < 7; j ++) {
                    /**
                     * 渲染上个月的格子
                     */
                    const renderLast = () => {
                        td += `<td>
                            <div class="last-month day">${lastMonthDay}</div>
                        </td>`
                        lastMonthDay ++ 
                        tr.innerHTML = td
                    }
                    /**
                     * 渲染下个月的格子
                     */
                    const renderNext = () => {
                        td += `<td>
                            <div class="day next-month">${nextMonthDay}</div>
                        </td>`
                        nextMonthDay ++
                        tr.innerHTML = td
                    }
                    /**
                     * 渲染当月的格子
                     */
                    const renderCur = () => {
                        let cl = this.isToday(curMonthDay) ? 'current' : ''
                        td += `<td>
                            <div class="day ${cl}">${curMonthDay}</div>
                        </td>`
                        curMonthDay ++
                        tr.innerHTML = td
                    }

                    if (cell < curMonthNum) {
                        renderLast()
                    } else if (cell >= curMonthEndDay + curMonthNum) {
                        renderNext()
                    } else {
                        renderCur()
                    }
                    cell ++
                }
                calendarTableDom.appendChild(tr)
            }
        },
        /**
         * 上个月&下个月
         */
        monthChange() {
            const render = () => {
                this.renderYearAndMonthPicker()
                this.renderTable()
            }
            beforeDom.onclick=()=>{
                this.closeList()
                this.curDate.setMonth(this.curDate.getMonth() - 1)
                render()
            }
            afterDom.onclick=()=>{
                this.closeList()
                this.curDate.setMonth(this.curDate.getMonth() + 1)
                render()
            }
        },
        /**
         * 点击月份按钮显示月份列表
         * 点击年份按钮显示年份列表
         */
        addMonthButtonOrYearButtonClick () {
            yearPickerDom.onclick = () => {
                this.closeList()
                yearListDom.classList.add('show')
            }
            monthPickerDom.onclick = () => {
                this.closeList()
                monthListDom.classList.add('show')
            }
        },
        closeList () {
            this.closeYearList()
            this.closeMonthList()
        },
        closeYearList () {
            yearListDom.classList.remove('show')
        },
        closeMonthList () {
            monthListDom.classList.remove('show')
        },
        /**
         * 渲染年份列表&月份列表
         */
        renderYearListAndMonthList () {
            monthList.forEach((monthItem) => {
                let month = document.createElement('div')
                month.classList.add('month')
                month.innerHTML = `<div>${monthItem + 1}月</div>`
                month.onclick = () => {
                    console.log(monthItem);
                    this.closeList()
                    this.curDate.setMonth(monthItem)
                    this.renderYearAndMonthPicker()
                    this.renderTable()
                }
                monthListDom.appendChild(month)
            })
            yearList.forEach((yearItem) => {
                let year = document.createElement('div')
                year.classList.add('year')
                year.innerHTML = `<div>${yearItem}年</div>`
                year.onclick = () => {
                    this.closeList()
                    this.curDate.setFullYear(yearItem)
                    this.renderYearAndMonthPicker()
                    this.renderTable()
                }
                yearListDom.appendChild(year)
            })
        },
        getCurMonth () {
            return this.curDate.getMonth()
        },
        getCurYear () {
            return this.curDate.getFullYear()
        },
        /**
         * @description 渲染当前年月
         */
        renderYearAndMonthPicker () {
            const curDate = this.curDate
            let selectYear = yearPickerDom.querySelector('.year')
            let selectMonth = monthPickerDom.querySelector('.month')
            selectYear.innerHTML = `${this.getCurYear()}年`
            selectMonth.innerHTML = `${this.getCurMonth() + 1}月`
        },
        /**
         * 返回今天
         */
        backToday() {
            backDom.onclick=()=>{
                this.curDate = new Date()
                this.closeList()
                this.renderYearAndMonthPicker()
                this.renderTable()
            }
        },
    }
    calendar.render()
    calendar.bindClick()
    
}())