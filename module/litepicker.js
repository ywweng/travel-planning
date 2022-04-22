export const picker = () => {
  new Litepicker({
    element: document.querySelector('#litepicker'),
    singleMode: false,
    lang: 'zh-TW',
    startDate: new Date(),
    endDate: new Date().setDate(new Date().getDate() + 1),
    minDate: new Date() - 1,
    maxDays: 18,
    tooltipText: {
      one: '天',
      other: '天'
    },
    tooltipNumber: (totalDays) => {
      return totalDays
    },
    setup: (picker) => {
      picker.on('selected', (date1, date2) => {
        const litepicker = document.querySelector('#litepicker')
        const start = document.querySelector('.start-date')
        const end = document.querySelector('.end-date')
        let startDate = date1.dateInstance
        let endDate = date2.dateInstance
        startDate = `${startDate.getFullYear()}/${
          startDate.getMonth() + 1
        }/${startDate.getDate()}`
        endDate = `${endDate.getFullYear()}/${
          endDate.getMonth() + 1
        }/${endDate.getDate()}`
        start.innerHTML = startDate
        end.innerHTML = endDate
      })
    }
  })
}
