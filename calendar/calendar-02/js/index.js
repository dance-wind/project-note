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
                        index === 0 ? this.scrollBar() : ''
                    }
                }
            })
        },
        closeSelect() {
            let selects = document.querySelectorAll('.selector-box')
            selects && selects.forEach((select) => select.classList.remove('active'))
        },
        scrollBar() {
            let selectorWrap = document.querySelectorAll('.selector-box')[0].querySelector('.selector-list')
            let selectorUl = document.querySelectorAll('.selector-box')[0].querySelector('.selector-list ul')
            let selectorScroll = document.querySelectorAll('.selector-box')[0].querySelector('.selector-list .scroll')
            let selectorSpan = document.querySelectorAll('.selector-box')[0].querySelector('.selector-list .scroll span')

            selectorSpan.style.transform = selectorUl.style.transform = 'translateY(0)'
            let multiple = (selectorUl.offsetHeight + 18) / selectorWrap.offsetHeight
            selectorSpan.style.height = selectorWrap.offsetHeight / multiple + 'px'

            let scrollTop = 0
            let maxHeight = selectorScroll.offsetHeight - selectorSpan.offsetHeight
            selectorSpan.onmousedown = function (ev) {
                let startY = ev.clientY
                let startT = parseInt(this.style.transform.split('(')[1])
                document.onmousemove = ev => {
                    scrollTop = ev.clientY - startY + startT
                    scrollTop > 0 ? scrollTop > maxHeight ? scrollTop = maxHeight : '' : scrollTop = 0
                    scroll()
                }
                document.onmouseup = () => document.onmousemove = null
                selectorScroll.onclick=(ev) => ev.stopPropagation()
            }
            function scroll() {
                let scaleY = scrollTop / maxHeight
                selectorSpan.style.transform = `translateY(${scrollTop}px)`
                selectorUl.style.transform = `translateY(${(selectorWrap.offsetHeight - selectorUl.offsetHeight - 18) * scaleY}px)`
            }
            selectorWrap.onwheel = (ev) => {
                ev.deltaY > 0 ? scrollTop += 10 : scrollTop -= 10
                scrollTop > 0 ? scrollTop > maxHeight ? scrollTop = maxHeight : '' : scrollTop = 0
                scroll()
                ev.preventDefault();
            }
        },
        getEndDay(year, month) {
            return new Date(year, month, 0).getDate()
        },
        getFirstWeek(year, month) {
            return new Date(year, month - 1, 1).getDay()
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
        getData(d) {
            let lastMonthEndDay = this.getEndDay(d.getFullYear(), d.getMonth())
            let curMonthEndDay = this.getEndDay(d.getFullYear(), d.getMonth() + 1)
            let curMonthFirstWeekDay = this.getFirstWeek(d.getFullYear(), d.getMonth() + 1)
            let lastMonthNum = curMonthFirstWeekDay - 1
            lastMonthNum = curMonthFirstWeekDay === 0 ? 6 : lastMonthNum
            let lastMonthDay = lastMonthEndDay - lastMonthNum + 1
            let nextMonthDay = 1
            let curMonthDay = 1

            let day = 0
            let tBody = document.querySelector('.calendar-content tbody')
            tBody.innerHTML = ''
            for(let i = 0; i < 6; i ++) {
                let tr = document.createElement('tr')
                let td = ''
                for(let j = 0; j < 7; j ++) {
                    if (day < lastMonthNum) {
                        let last = lastMonthDay ++
                        let lNum = this.changeNum(last)
                        td += `<td>
                            <div class="last-month day">
                                <span>${last}</span>
                                <span>${lNum}</span>
                            </div>
                        </td>`
                        tr.innerHTML = td
                    } else if (day >= curMonthEndDay + lastMonthNum) {
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
                        if (
                            current.getFullYear() === d.getFullYear() &&
                            current.getMonth() === d.getMonth() &&
                            current.getDate() === d.getDate() &&
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
        backToday() {
            let back = document.querySelector('.calendar-header .back-today')
            back.onclick=()=>{
                this.curDate = new Date()
                this.renderSelect(this.curDate)
                this.getData(this.curDate)
                this.closeSelect()
            }
        },
        bindTable () {
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