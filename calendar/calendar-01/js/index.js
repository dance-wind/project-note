;(function () {
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
   * 上个月/上一年
   */
  const beforeDom = document.querySelector('#before')
  /**
   * 下个月/下一年
   */
  const afterDom = document.querySelector('#after')
  /**
   * 回到今天
   */
  const backDom = document.querySelector('#back-today')

  const calendar = {
    curDate: new Date(),
    /**
     * 是否展示年份列表
     */
    showYearList: false,
    /**
     * 可以从哪一年开始选
     */
    startYear: new Date().getFullYear(),
    render() {
      this.renderYearAndMonthPicker()
      this.renderTable()
    },
    bindClick() {
      this.monthChange()
      this.backToday()
      this.addMonthButtonOrYearButtonClick()
    },
    /**
     * 获取上月份天数
     * @param {number} year 年份
     * @param {number} month 月份
     * @returns {number}
     */
    getLastMonthDays(year, month) {
      // (year, month, 0)表示是(year, month, 1)的前一天 => 上个月的最后一天
      // getDate 返回是月份中的哪一日
      return new Date(year, month, 0).getDate()
    },
    /**
     * 当月在日历表哪一格开始
     * @param {number} year 年份
     * @param {number} month 月份
     * @returns {number}
     */
    getMonthFirstCell(year, month) {
      // getDay 返回是一周中的第几天，返回 0 表示星期天
      const days = new Date(year, month - 1, 1).getDay()
      // 周一 => 周天  0 => 6
      return days === 0 ? 6 : days - 1
    },
    /**
     * 判断当前日历的某个日期是不是今天
     * @param {number} curDay 日期
     * @returns {boolean}
     */
    isToday(curDay) {
      const today = new Date()
      const curDate = this.curDate

      return (
        today.getFullYear() === curDate.getFullYear() &&
        today.getMonth() === curDate.getMonth() &&
        curDay == curDate.getDate()
      )
    },
    /**
     * @description 渲染月份表格
     */
    renderTable() {
      const curDate = this.curDate

      // 上个月的天数
      const lastMonthEndDays = this.getLastMonthDays(
        curDate.getFullYear(),
        curDate.getMonth()
      )

      // 当月天数
      const curMonthEndDays = this.getLastMonthDays(
        curDate.getFullYear(),
        curDate.getMonth() + 1
      )

      // 当月在日历表哪一格开始
      const curMonthNum = this.getMonthFirstCell(
        curDate.getFullYear(),
        curDate.getMonth() + 1
      )

      // 上个月日历 = 上个月的天数 -  上个月在第几格结束
      let lastMonthDay = lastMonthEndDays - (curMonthNum - 1)

      // 下个月日历
      let nextMonthDay = 1

      // 当月日历
      let curMonthDay = 1

      // 日历格子
      let cell = 0

      let row = ''
      for (let i = 0; i < 6; i++) {
        let column = ''
        for (let j = 0; j < 7; j++) {
          /**
           * 渲染上个月的格子
           */
          const renderLast = () => {
            column += `<div class="last-month day">${lastMonthDay}</div>`
            lastMonthDay++
          }

          /**
           * 渲染下个月的格子
           */
          const renderNext = () => {
            column += `<div class="next-month day">${nextMonthDay}</div>`
            nextMonthDay++
          }

          /**
           * 渲染当月的格子
           */
          const renderCur = () => {
            const cl = this.isToday(curMonthDay) ? 'current' : ''
            column += `<div class="${cl} day">${curMonthDay}</div>`
            curMonthDay++
          }

          if (cell < curMonthNum) {
            renderLast()
          } else if (cell >= curMonthEndDays + curMonthNum) {
            renderNext()
          } else {
            renderCur()
          }
          cell++
        }
        row += `<div class="row">${column}</div>`
      }
      calendarTableDom.innerHTML = row
    },
    /**
     * 上个月&下个月
     */
    monthChange() {
      const render = () => {
        this.renderYearAndMonthPicker()
        this.renderTable()
      }

      beforeDom.addEventListener('click', () => {
        if (this.showYearList) {
          this.startYear -= 16
          this.renderYearList()
        } else {
          this.curDate.setMonth(this.curDate.getMonth() - 1)
          render()
        }
      })

      afterDom.addEventListener('click', () => {
        if (this.showYearList) {
          this.startYear += 16
          this.renderYearList()
        } else {
          this.curDate.setMonth(this.curDate.getMonth() + 1)
          render()
        }
      })
    },
    /**
     * 点击月份按钮显示月份列表
     * 点击年份按钮显示年份列表
     */
    addMonthButtonOrYearButtonClick() {
      yearPickerDom.addEventListener('click', () => {
        this.renderYearList()
        this.closeList()
        yearListDom.classList.add('show')
        this.showBeforeArrowAndNextArrow()
        this.showYearList = true
      })

      monthPickerDom.addEventListener('click', () => {
        this.renderMonthList()
        this.closeList()
        monthListDom.classList.add('show')
        this.hideBeforeArrowAndNextArrow()
        this.showYearList = false
      })
    },
    /**
     * 隐藏箭头
     */
    hideBeforeArrowAndNextArrow() {
      beforeDom.classList.add('hide')
      afterDom.classList.add('hide')
    },
    /**
     * 展示箭头
     */
    showBeforeArrowAndNextArrow() {
      beforeDom.classList.remove('hide')
      afterDom.classList.remove('hide')
    },
    /**
     * 关闭年份&月份列表
     */
    closeList() {
      this.closeYearList()
      this.closeMonthList()
    },
    closeYearList() {
      yearListDom.classList.remove('show')
    },
    closeMonthList() {
      monthListDom.classList.remove('show')
    },
    /**
     * 渲染年份列表
     */
    renderYearList() {
      const endYear = this.startYear + 16
      const yearList = []
      for (let i = this.startYear; i < endYear; i++) {
        yearList.push(i)
      }

      yearListDom.innerHTML = ''
      yearList.forEach(yearItem => {
        const year = document.createElement('div')
        year.classList.add('year')
        year.innerHTML = `<div>${yearItem}年</div>`

        year.addEventListener('click', () => {
          this.showYearList = false
          this.closeList()
          this.curDate.setFullYear(yearItem)
          this.renderYearAndMonthPicker()
          this.renderTable()
        })

        yearListDom.appendChild(year)
      })
    },
    /**
     * 渲染月份列表
     */
    renderMonthList() {
      const monthList = []
      for (let i = 0; i <= 11; i++) {
        monthList.push(i)
      }

      monthList.forEach(monthItem => {
        const month = document.createElement('div')
        month.classList.add('month')
        month.innerHTML = `<div>${monthItem + 1}月</div>`

        month.addEventListener('click', () => {
          this.showBeforeArrowAndNextArrow()
          this.closeList()
          this.curDate.setMonth(monthItem)
          this.renderYearAndMonthPicker()
          this.renderTable()
        })

        monthListDom.appendChild(month)
      })
    },
    /**
     * @description 渲染当前年月
     */
    renderYearAndMonthPicker() {
      const curDate = this.curDate
      const selectYear = yearPickerDom.querySelector('.year')
      const selectMonth = monthPickerDom.querySelector('.month')
      selectYear.innerHTML = `${curDate.getFullYear()}年`
      selectMonth.innerHTML = `${curDate.getMonth() + 1}月`
    },
    /**
     * 返回今天
     */
    backToday() {
      backDom.addEventListener('click', () => {
        this.curDate = new Date()
        this.showYearList = false
        this.closeList()
        this.renderYearAndMonthPicker()
        this.renderTable()
        this.showBeforeArrowAndNextArrow()
      })
    },
  }
  calendar.render()
  calendar.bindClick()
})()
