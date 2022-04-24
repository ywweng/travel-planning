const picker = () => {
  new Litepicker({
    element: document.querySelector('#litepicker'),
    singleMode: false,
    lang: 'zh-TW',
    startDate: new Date(),
    minDate: new Date() - 1,
    maxDate: dayjs(new Date()).add(1, 'year'),
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
        const startText = document.querySelector('.start-date')
        const endText = document.querySelector('.end-date')
        let startDate = dayjs(date1.dateInstance).format('YYYY/MM/DD')
        let endDate = dayjs(date2.dateInstance).format('YYYY/MM/DD')
        startText.innerHTML = startDate
        endText.innerHTML = endDate
      })
    }
  })
}
const litepicker = document.querySelector('#litepicker')
const cardSection = document.querySelector('.card-section')
const modal = document.querySelector('#modal')
const overlay = document.querySelector('#modalOverlay')
const closeModalBtn = document.querySelector('#closeBtn')
let dragEl = null
let targetCard = ''
let targetItem = ''
let data = []
const renderCard = () => {
  const startDate = document.querySelector('.start-date').innerHTML
  const endDate = document.querySelector('.end-date').innerHTML
  const days = dayjs(endDate).diff(startDate, 'days')
  renderInitCard(startDate, days)
}

function renderInitCard(startDate, days) {
  let temp = ''
  data = []
  for (let i = 0; i <= days; i++) {
    const date = dayjs(startDate).add(i, 'day').format('YYYY/MM/DD')
    temp += `<div class="card">
        <div class="card-header">
          <span class="date">${date}</span>
          <h3 class="card-title"><strong>Day ${i + 1}</strong></h3>
          <button class="modal-button" type="button"><i class="fa-solid fa-plus"></i></button>
        </div>
        <div class="card-body">
        </div>
      </div>`
    createData(date)
  }
  cardSection.innerHTML = temp
}

function cardListener() {
  const openModalBtns = cardSection.querySelectorAll('.modal-button')
  const cards = cardSection.querySelectorAll('.card-body')
  const items = cardSection.querySelectorAll('.card-item')
  openModalBtns.forEach((button) => button.addEventListener('click', openModal))
  cards.forEach((card) => {
    card.addEventListener('dragenter', handleDragEnter)
    card.addEventListener('dragleave', handleDragLeave)
    card.addEventListener('dragover', handleDragOver)
    card.addEventListener('drop', handleDropped)
  })
  items.forEach((item) => {
    const deleteBtn = item.querySelector('.deleteBtn')
    item.addEventListener('dragstart', handleDragStart)
    item.addEventListener('dragend', handleDragEnd)
    item.addEventListener('dblclick', openModal)
    deleteBtn.addEventListener('click', removeItem)
  })
}

function handleDragStart(e) {
  e.target.classList.add('hide')
  dragEl = this
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.setData('text/html', this.innerHTML)
}

function handleDragEnd(e) {
  const cards = document.querySelectorAll('.card-body')
  this.classList.remove('hide')
  cards.forEach((card) => card.classList.remove('dragging'))
}

function handleDragEnter(e) {
  this.classList.add('dragging')
}

function handleDragLeave(e) {
  this.classList.remove('dragging')
}

function handleDragOver(e) {
  e.preventDefault()
  e.dataTransfer.dropEffect = 'move'
  return false
}

function handleDropped(e) {
  e.preventDefault()
  e.stopPropagation()

  let children = [...this.children]
  let dragPosition = this.getBoundingClientRect(dragEl).y
  if (children.length === 0) {
    this.appendChild(dragEl)
  } else {
    children.forEach((child) => {
      if (dragPosition > this.getBoundingClientRect(child).y) {
        this.appendChild(dragEl)
      } else {
        this.insertBefore(dragEl, child)
      }
    })
  }
  return false
}

function openModal() {
  const addBtn = modal.querySelector('#addBtn')
  const arrivalHour = modal.querySelector('#arrival-hour')
  const arrivalMinute = modal.querySelector('#arrival-minute')
  let title = modal.querySelector('.modal-title')
  let hourOption = ''
  let minuteOption = ''
  for (let hour = 0; hour <= 24; hour++) {
    hourOption += `<option value="${hour}">${hour}</option>`
  }
  for (let minute = 0; minute <= 59; minute++) {
    minuteOption += `<option value="${minute}">${minute}</option>`
  }
  arrivalHour.innerHTML = hourOption
  arrivalMinute.innerHTML = minuteOption
  if (this.classList.contains('card-item')) {
    title.innerHTML = '編輯項目'
    addBtn.innerHTML = 'Save'
    targetItem = this
  } else if (this.classList.contains('modal-button')) {
    title.innerHTML = '新增項目'
    addBtn.innerHTML = 'Add'
    targetCard = this.parentElement.nextElementSibling
  }
  addBtn.addEventListener('click', handleItem)
  modal.classList.remove('modal-hide')
  overlay.classList.remove('modal-hide')
}

function closeModal() {
  modal.classList.add('modal-hide')
  overlay.classList.add('modal-hide')
}

function removeItem(e) {
  const item = this.parentElement
  const cardbody = this.parentElement.parentElement
  cardbody.removeChild(item)
}

function handleItem() {
  let modalItem = {
    arrivalHour: modal.querySelector('#arrival-hour').value,
    arrivalMinute: modal.querySelector('#arrival-minute').value,
    destination: modal.querySelector('#destination').value,
    category: modal.querySelector('#category').value,
    budget: modal.querySelector('#budget').value
  }
  if (Object.values(modalItem).some((value) => value === '')) {
    alert('請勿空白')
    return
  } else if (isInteger(modalItem.budget)) {
    let temp = `
    <div class="arrival-time">${modalItem.arrivalHour}：${modalItem.arrivalMinute}</div>
    <div class="category"><i class="fa-solid ${modalItem.category}"></i></div>
            <div class="detail">
              <span class="destination">${modalItem.destination}</span>
              <span class="budget">$${modalItem.budget}</span>
            </div>
            <button class="deleteBtn" type="button"><i class="fa-solid fa-xmark"></i></button>`
    let li = document.createElement('li')
    li.classList.add('card-item')
    li.setAttribute('draggable', 'true')
    li.innerHTML = temp
    if (targetCard !== '') {
      targetCard.appendChild(li)
      targetCard = ''
    } else if (targetItem !== '') {
      targetItem.innerHTML = temp
      targetItem = ''
    }
    closeModal()
  }
}

function handleDarkMode() {}

function isInteger(num) {
  if (typeof num !== 'number' && num % 1 !== 0) {
    alert('請輸入整數')
    return false
  } else {
    return true
  }
}

/* data */

function createData(date) {
  data.push({
    date: `${date}`,
    items: {}
  })
}

function addItem(date, item) {
  console.log(Object.keys(data) === date)
}

picker()
litepicker.addEventListener('DOMSubtreeModified', renderCard)
cardSection.addEventListener('DOMSubtreeModified', cardListener)
closeModalBtn.addEventListener('click', closeModal)
