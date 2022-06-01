(function() {
    let calendar = {
        curDate: new Date(),
        init() {
            this.renderSelect(this.curDate)
            this.getData(this.curDate)
            this.selectBindEvent()
            this.monthChange()
            this.backToday()
        },
        /**
         * @description 渲染下拉框
         * @param d 当前选择的时间
         */
        renderSelect (d) {
            let yearList = document.querySelector('.calendar-header .selector-box ul.year')
            let selectYear = document.querySelector('.calendar-header .selector-box .selector .year')
            let monthList = document.querySelector('.calendar-header .selector-box ul.month')
            let selectMonth = document.querySelector('.calendar-header .selector-box .selector .month')
            // 年份
            let yearLi = ''
            yearList.innerHTML = ''
            for(let i = 1990; i <= 2030; i++) {
                yearLi += `<li ${i === d.getFullYear() ? ' class="active" ' : ''}>${i}年</li>`
            }
            yearList.innerHTML = yearLi
            selectYear.innerHTML = `${d.getFullYear()}年`
            // 月份
            let monthLy = ''
            monthList.innerHTML = ''
            for(let i = 0; i <= 11; i++) {
                monthLy += `<li ${i === d.getMonth() ? ' class="active" ' : ''}>${i+1}月</li>`
            }
            monthList.innerHTML = monthLy
            selectMonth.innerHTML = `${d.getMonth() + 1}月`
        },
        /**
         * 给下拉框绑定点击事件
         */
        selectBindEvent() {
            let selects = document.querySelectorAll('.selector-box')
            selects.forEach((select, index) => {
                let curClass = select.classList
                let selector = select.querySelector('.selector span:nth-child(1)')
                select.onclick = (ev) =>{
                    if (curClass.contains('active')) {
                        curClass.remove('active')
                        if (ev.target.tagName === 'LI'){
                            let curLis = [...select.querySelectorAll('ul li')]
                            let activeLi = curLis.find(el => el.classList.contains('active'))
                            activeLi.classList.remove('active')
                            ev.target.classList.add('active')
                            const value = ev.target.textContent
                            selector.innerHTML = value
                            index === 0 ? this.curDate.setFullYear(parseInt(value)) : this.curDate.setMonth(parseInt(value) - 1 )
                            this.getData(this.curDate)
                        }
                    } else {
                        this.closeSelect()
                        curClass.add('active')
                    }
                }
            })
        },
        /**
         * 关闭下拉选择框
         */
        closeSelect() {
            let selects = document.querySelectorAll('.selector-box')
            selects && selects.forEach((select) => select.classList.remove('active'))
        },
        /**
         * 月份天数
         */
        getEndDay(year, month) {
            return new Date(year, month, 0).getDate()
        },
        /**
         * 当前月份从哪一格开始
         */
        getFirstWeek(year, month) {
            let days = new Date(year, month, 1).getDay()
            return days === 0 ? 6 : days -1
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
         * @description 渲染月份
         * @param d 当前选择的时间 
         */
        getData(d) {
            let lastMonthEndDay = this.getEndDay(d.getFullYear(), d.getMonth())
            let curMonthEndDay = this.getEndDay(d.getFullYear(), d.getMonth() + 1)
            let curMonthNum = this.getFirstWeek(d.getFullYear(), d.getMonth())
            // 上个月从哪天开始展示 = 上个月的天数 -  上个月最后一天从哪一格开始
            let lastMonthDay = lastMonthEndDay - curMonthNum + 1
            let nextMonthDay = 1
            let curMonthDay = 1

            let day = 0
            let tBody = document.querySelector('.calendar-content tbody')
            tBody.innerHTML = ''
            for(let i = 0; i < 6; i ++) {
                let tr = document.createElement('tr')
                let td = ''
                for(let j = 0; j < 7; j ++) {
                    if (day < curMonthNum) {
                        let last = lastMonthDay ++
                        let lNum = this.changeNum(last)
                        td += `<td>
                            <div class="last-month day">
                                <span>${last}</span>
                                <span>${lNum}</span>
                            </div>
                        </td>`
                        tr.innerHTML = td
                    } else if (day >= curMonthEndDay + curMonthNum) {
                        let next = nextMonthDay ++
                        let nNum = this.changeNum(next)
                        td += `<td>
                            <div class="day next-month">
                                <span>${next ++}</span>
                                <span>${nNum}</span>
                            </div>
                        </td>`
                        tr.innerHTML = td
                    }
                    else {
                        let current = new Date()
                        let cl = ''
                        // 当前选择的时间 === 实际时间（年月日都相等）
                        if (
                            current.getFullYear() === d.getFullYear() &&
                            current.getMonth() === d.getMonth() &&
                            curMonthDay == d.getDate()
                        ) {
                            cl += ' current'
                        }
                        let cur = curMonthDay ++
                        let CNum = this.changeNum(cur)
                        td += `<td>
                            <div class="day ${cl}">
                                <span>${cur}</span>
                                <span>${CNum}</span>
                            </div>
                        </td>`
                        tr.innerHTML = td
                    }
                    day ++
                }
                tBody.appendChild(tr)
            }
            this.bindTable()
        },
        /**
         * 上个月&下个月
         */
        monthChange() {
            let before = document.querySelector('.calendar-header .before')
            let after = document.querySelector('.calendar-header .after')
            before.onclick=()=>{
                this.curDate.setMonth(this.curDate.getMonth() - 1)
                this.renderSelect(this.curDate)
                this.getData(this.curDate)
                this.closeSelect()
            }
            after.onclick=()=>{
                this.curDate.setMonth(this.curDate.getMonth() + 1)
                this.renderSelect(this.curDate)
                this.getData(this.curDate)
                this.closeSelect()
            }
        },
        /**
         * 返回今天
         */
        backToday() {
            let back = document.querySelector('.calendar-header .back-today')
            back.onclick=()=>{
                this.curDate = new Date()
                this.renderSelect(this.curDate)
                this.getData(this.curDate)
                this.closeSelect()
            }
        },
        /**
         * 给日历单元格添加点击事件
         */
        bindTable () {
            // 拿到的是类数组 需转换为数组才能使用数组方法
            let tds = [...document.querySelectorAll('.calendar-content tbody .day')]
            let active = tds.find((td) => td.classList.contains('active'));
            tds.forEach((td) => {
                td.onclick=()=>{
                    active && active.classList.remove('active')
                    td.classList.add('active')
                    active = td
                }
            })
        }
    }
    calendar.init()
    
}())