const cardSection = document.querySelector('.card-section')
let dragEl = null
const data = []

export const handleListener = () => {
  cardSection.addEventListener('DOMSubtreeModified', cardListener)
}

export const createCard = () => {
  const startDate = document.querySelector('.start-date').innerHTML
  const endDate = document.querySelector('.end-date').innerHTML
  const days = dayjs(endDate).diff(startDate, 'days')
  renderInitCard(startDate, days)
  const openModalBtns = document.querySelectorAll('.toggleButton')
  openModalBtns.forEach((button) => button.addEventListener('click', openModal))
  const closeModalBtn = document.querySelector('#closeBtn')
  closeModalBtn.addEventListener('click', closeModal)
}

/* DOM */

function renderInitCard(startDate, days) {
  let temp = ''
  for (let i = 0; i <= days; i++) {
    const date = dayjs(startDate).add(i, 'day').format('YYYY/MM/DD')
    temp += `<div class="card">
        <div class="card-header">
          <span class="date">${date}</span>
          <h3 class="card-title"><strong>Day ${i + 1}</strong></h3>
          <button class="toggleButton" type="button"><i class="fa-solid fa-plus"></i></button>
        </div>
        <div class="card-body">
          <li class="card-item" draggable="true">
            <div class="category">景</div>
            <div class="detail">
              <span class="destination">高雄</span>
              <span class="budget">$100</span>
            </div>
            <button class="deleteBtn" type="button"><i class="fa-solid fa-xmark"></i></button>
          </li>
          <li class="card-item" draggable="true">
            <div class="category">食</div>
            <div class="detail">
              <span class="destination">壽司郎</span>
              <span class="budget">$300</span>
            </div>
            <button class="deleteBtn" type="button"><i class="fa-solid fa-xmark"></i></button>
          </li>
        </div>
      </div>`
    createData(date)
  }
  cardSection.innerHTML = temp
}

function cardListener() {
  const cards = cardSection.querySelectorAll('.card-body')
  const items = document.querySelectorAll('.card-item')
  cards.forEach((card) => {
    card.addEventListener('dragenter', handleDragEnter, false)
    card.addEventListener('dragleave', handleDragLeave, false)
    card.addEventListener('dragover', handleDragOver, false)
    card.addEventListener('drop', handleDropped, false)
  })
  items.forEach((item) => {
    const deleteBtn = item.querySelector('.deleteBtn')
    item.addEventListener('dragstart', handleDragStart, false)
    item.addEventListener('dragend', handleDragEnd, false)
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
        console.log(dragPosition)
      } else {
        this.insertBefore(dragEl, child)
      }
    })
  }
  return false
}

function openModal(e) {
  const modal = document.querySelector('#modal')
  const overlay = document.querySelector('#modalOverlay')
  modal.classList.remove('modal-hide')
  overlay.classList.remove('modal-hide')
}

function closeModal() {
  const modal = document.querySelector('#modal')
  const overlay = document.querySelector('#modalOverlay')
  modal.classList.add('modal-hide')
  overlay.classList.add('modal-hide')
}

function removeItem(e) {
  if (e.target.classList.contains('deleteBtn')) {
    const item = e.target.parentElement
    const cardbody = item.parentElement
    cardbody.removeChild(item)
  }
}

/* data */

function createData(date) {
  data.push({
    date: `${date}`,
    items: {}
  })
}

function createItem() {
  const toggleMe = document.querySelector('#toggleMe')
  const destination = document.querySelector('#destination').innerHTML
}
