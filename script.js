// use data.json to set localStorage on first load for demo
const form = document.getElementById('form')
const nameInput = document.getElementById('name-input')
const emailInput = document.getElementById('email-input')
const adminCheckbox = document.getElementById('admin-checkbox')
const clearAllBtn = document.getElementById('clear')
const closeModal = document.getElementById('close-modal')
const clearAllItems = document.getElementById('clear-btn')
const filterContainer = document.getElementById('filter-container')
const filter = document.getElementById('filter')
const cancelEditBtn = document.getElementById('cancel-edit')
const onSubmitBtn = document.getElementById('onSubmitBtn')
const listLength = document.getElementById('list-length')
const resetFilterBtn = document.getElementById('reset-filter')
const modalContainer = document.getElementById('modal')
const filterUp = document.getElementById('filter-up')
const filterDown = document.getElementById('filter-down')
const ul = document.getElementById('ul')
const confirmDeleteInput = document.getElementById('confirm-delete-input')
const alert = document.getElementById('alert')
const heading = document.querySelectorAll('.nav-heading')

const navListItems = document.querySelectorAll('.nav-ul .nav-li')
const dropDownMenu = document.querySelectorAll('.super-nav')

const loader = document.querySelector('.loader')
navListItems.forEach((link) => {
  link.addEventListener('click', (e) => {
    const dropDownButton = e.target.matches('.nav-link')

    if (dropDownButton) e.preventDefault()
    if (e.target.closest('.super-nav')) return

    let currentDropdown

    if (dropDownButton) {
      currentDropdown = e.target.nextElementSibling
      currentDropdown.classList.toggle('active')
      console.log(currentDropdown)
    }

    dropDownMenu.forEach((item) => {
      if (item === currentDropdown) return
      item.classList.remove('active')
    })
  })
})

document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav-ul')) {
    dropDownMenu.forEach((item) => item.classList.remove('active'))
  }
})

let isEditMode = false
let objToEdit = null
let objToEditDetails = null

function displayInDom() {
  // check if local storage is empty and remove array for fresh dummy data
  function checkItemsArray() {
    const data = JSON.parse(localStorage.getItem('app2Items')) // Parse the stored data

    if (!data || data.length === 0) {
      // Check if data is null or an empty array
      localStorage.removeItem('app2Items') // Remove only app2Items from localStorage
      console.log('app2Items was empty and has been removed from localStorage')
    } else {
      console.log('app2Items exists and has data:', data)
    }
  }

  checkItemsArray()

  clearAllItems.disabled = true
  clearAllItems.style.cursor = 'default'
  const randomNumber = Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000
  console.log(randomNumber)
  const itemsFromStorage = getItemsFromStorage()
  // console.log(itemsFromStorage)
  // const sorted = itemsFromStorage.sort((a, b) => a.name.localeCompare(b.name));
  showSpinner()
  setTimeout(() => {
    sortByName(itemsFromStorage)
    addToDom(itemsFromStorage)
    resetState()
    hideSpinner()
  }, randomNumber)
}

function showSpinner() {
  cancelEditBtn.style.display = 'none'
  resetFilterBtn.style.display = 'none'
  loader.classList.add('showSpinner')
}
function hideSpinner() {
  loader.classList.remove('showSpinner')
}

function sortByName(users) {
  users.sort((a, b) => {
    if (a.itemNumber < b.itemNumber) {
      return -1
    } else if (a.itemNumber > b.itemNumber) {
      return 1
    } else {
      return 0
    }
  })
}

function sortByNameTest(users, comparison) {
  users.sort((a, b) => {
    const aItemNumber = parseInt(a.itemNumber)
    const bItemNumber = parseInt(b.itemNumber)

    if (comparison === '>') {
      if (aItemNumber > bItemNumber) {
        return -1
      } else if (aItemNumber < bItemNumber) {
        return 1
      } else {
        return 0
      }
    } else if (comparison === '<') {
      if (aItemNumber < bItemNumber) {
        return -1
      } else if (aItemNumber > bItemNumber) {
        return 1
      } else {
        return 0
      }
    } else {
      throw new Error('Invalid comparison operator ' + comparison)
    }
  })
}

function resetForm() {
  nameInput.value = ''
  emailInput.value = ''
  adminCheckbox.checked = false
  console.log('Reset...')
}

form.addEventListener('submit', (e) => {
  e.preventDefault()

  const name = nameInput.value
  const email = emailInput.value
  const admin = adminCheckbox.checked

  const lastItem = getItemsFromStorage()
  const lastItemNum = lastItem[lastItem.length - 1]
  const itemNum = testing(lastItemNum)

  function testing(test) {
    switch (typeof test) {
      case 'undefined':
        return 'undefined'
        break
      case 'object':
        return 'object'
        break
      default:
        return 1
    }
  }

  if (name === '' || email === '') {
    showAlert('Both Email and Name must be filled in', 'info2')
    return
  }

  const id = objToEdit ? objToEdit.id : crypto.randomUUID()
  const itemNumber = itemNum === 'undefined' ? 1 : lastItemNum.itemNumber + 1
  const formInfo = {
    id,
    name,
    email,
    admin,
    date: new Date().toLocaleString('en-gb'),
    itemNumber,
  }

  function capitalizeName(name) {
    return name
      ?.split(' ')
      .map((word) => word[0]?.toUpperCase() + word.slice(1))
      .join(' ')
  }

  formInfo.name = capitalizeName(formInfo.name)

  if (isEditMode) {
    replacePersonInStorage(formInfo)
    displayInDom()
  } else {
    const emailCheck = checkIfEmailExists(formInfo)
    if (emailCheck) {
      showAlert(`Email ${emailCheck.email} already exists`, 'info2')
      resetForm()
      return
    }
    addItemsToStorage(formInfo)
    const itemsFromStorage = getItemsFromStorage()
    sortByName(itemsFromStorage)
    addToDom(itemsFromStorage)
  }
  resetForm()
  resetState()
  showAlert(`Success ${formInfo.name} has been added`, 'success')
})

// prettier-ignore
function checkIfEmailExists(formData) {
  const itemsFromStorage = getItemsFromStorage();
  const foundEmail = itemsFromStorage.find((item) => item.email.toLowerCase() === formData.email.toLowerCase());
  return foundEmail;
}

function getItemsFromStorage() {
  let itemsFromStorage
  if (localStorage.getItem('app2Items') === null) {
    itemsFromStorage = []
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('app2Items'))
  }
  return itemsFromStorage
}

// prettier-ignore
function addToDom(data) {
  ul.innerHTML = ''
  const li = createAdminLi(data)
  li.forEach((item) => ul.appendChild(item))
}

// prettier-ignore
function createAdminLi(data) {
 const listElements =  data.map((item) =>{

  const li = document.createElement('li');
  li.id = item.id;
  const nameEl = document.createElement('div');
  const emailEl = document.createElement('div');
  const adminEl = document.createElement('div');
  const adminSpan = document.createElement('span');
  const timeEl = document.createElement('div');
  const numberEl = document.createElement('div');
  // li.setAttribute('id', item.id);

  
  // prettier-ignore
  adminEl.appendChild(adminSpan)
  nameEl.appendChild(document.createTextNode(item.name));
  emailEl.appendChild(document.createTextNode(item.email));
  adminSpan.appendChild(document.createTextNode(item.admin === true ? 'Admin' : 'Not Admin'));
  timeEl.appendChild(document.createTextNode(item.date === undefined ? '' : item.date));
  numberEl.appendChild(document.createTextNode(item.itemNumber));
  
  li.classList.add('list-item');
  nameEl.classList.add('box');
  emailEl.classList.add('box');
  adminEl.className = 'box admin-box';
  adminSpan.className = 'admin-span';
  numberEl.className = 'number-element number-box';
  timeEl.classList.add('date-box');

  const button = createButton('remove-item, delete-btn'); // space here so use trim() method

  li.appendChild(nameEl);
  li.appendChild(emailEl);
  li.appendChild(adminEl);
  li.appendChild(timeEl);
  li.appendChild(timeEl);
  li.appendChild(numberEl);
  li.appendChild(button);

return li;
})
return listElements;
}

function createButton(classes) {
  const button = document.createElement('button')
  const icon = createDeleteIcon('./svgs/delete.svg')

  const classList = classes.split(',')

  for (const className of classList) {
    button.classList.add(className.trim())
  }

  button.appendChild(icon)
  return button
}

function createDeleteIcon(svgSrc) {
  const icon = document.createElement('img')
  icon.setAttribute('src', svgSrc)
  icon.classList.add('delete-icon')
  return icon
}

const addItemsToStorage = (appData) => {
  let itemsFromStorage
  if (localStorage.getItem('app2Items') === null) {
    itemsFromStorage = []
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('app2Items'))
  }
  itemsFromStorage.push(appData)
  localStorage.setItem('app2Items', JSON.stringify(itemsFromStorage))
}

// onClickItem
ul.addEventListener('click', (e) => {
  if (
    e.target.classList.contains('remove-item') ||
    e.target.classList.contains('delete-icon')
  ) {
    removeItem(e.target.closest('li'))
  } else if (
    e.target.classList.contains('box') ||
    e.target.classList.contains('list-item')
  ) {
    setItemToEdit(e.target.closest('li'))
  }
  // console.log(e.target);
})

function setItemToEdit(item) {
  console.log(item)
  const itemsFromStorage = getItemsFromStorage()
  const filtered = itemsFromStorage.filter((i) => i.id === item.id)
  objToEditDetails = filtered

  nameInput.value = filtered[0].name
  emailInput.value = filtered[0].email
  adminCheckbox.checked = filtered[0].admin

  ul.querySelectorAll('.list-item').forEach((i) => i.classList.remove('edit-mode'))
  item.classList.add('edit-mode')
  isEditMode = true

  onSubmitBtn.innerText = 'Update'
  nameInput.focus()
  console.log(isEditMode)
  cancelEditBtn.style.display = 'inline'
  objToEdit = item
  showAlert('edit mode is active', 'info2')
}

function replacePersonInStorage(formData) {
  console.log(objToEditDetails)
  console.log(formData.id)
  const itemsFromStorage = getItemsFromStorage()

  const indexToReplace = itemsFromStorage.findIndex((item) => item.id === objToEdit.id)
  // replacing by the index and call displayInDom() right up the top when the form is submited
  if (indexToReplace !== -1) {
    const updatedFormData = {
      ...formData,
      itemNumber: objToEditDetails[0].itemNumber,
    }
    itemsFromStorage[indexToReplace] = updatedFormData
    localStorage.setItem('app2Items', JSON.stringify(itemsFromStorage))
  } else {
    console.log('blah')
  }
}

cancelEditBtn.addEventListener('click', (e) => {
  ul.querySelectorAll('.list-item').forEach((i) => i.classList.remove('edit-mode'))
  isEditMode = false
  objToEdit = null
  objToEditDetails = null
  resetState()
  resetForm()
  showAlert('Edit Mode Cancled', 'info2')
  console.log(isEditMode)
})

function removeItem(item) {
  console.log(item)
  item.remove()
  removeItemFromStorage(item.id)
  resetState()
  showAlert(`Item successfully removed`, 'info2')
  //  remove array from local storage for fresh dummy data
  checkItemsArray()
}

function removeItemFromStorage(itemId) {
  console.log(itemId)
  let itemsFromStorage = getItemsFromStorage()
  itemsFromStorage = itemsFromStorage.filter((item) => item.id !== itemId)
  localStorage.setItem('app2Items', JSON.stringify(itemsFromStorage))
}

clearAllBtn.addEventListener('click', (e) => {
  modalContainer.classList.remove('hide-modal')
  modalContainer.classList.add('show-modal')
  console.log('object')
  console.log(modalContainer.classList)
})

closeModal.addEventListener('click', (e) => {
  modalContainer.classList.add('hide-modal')
  modalContainer.classList.remove('show-modal')

  confirmDeleteInput.value = ''
  clearAllItems.disabled = true
  clearAllItems.style.background = '#d9b945'
  clearAllItems.style.color = '#000'
  clearAllItems.style.cursor = 'default'
})

confirmDeleteInput.addEventListener('input', (e) => {
  if (e.target.value === 'Delete') {
    clearAllItems.disabled = false
    clearAllItems.style.cursor = 'pointer'
    clearAllItems.style.background = '#211508'
    clearAllItems.style.color = '#fff'
  } else {
    clearAllItems.disabled = true
    clearAllItems.style.cursor = 'default'
    clearAllItems.style.background = '#d9b945'
    clearAllItems.style.color = '#000'
  }
})

clearAllItems.addEventListener('click', () => {
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild)
  }
  localStorage.removeItem('app2Items')
  modalContainer.classList.remove('show-modal')
  resetState()
})

filter.addEventListener('input', (e) => {
  if (e.target.value.length) {
    // if if it has length
    resetFilterBtn.style.display = 'block'
  } else {
    resetFilterBtn.style.display = 'none'
  }

  const inputText = e.target.value.toLowerCase().trim()
  const items = ul.querySelectorAll('.list-item')
  const filteredItems = []
  items.forEach((item) => {
    const email = item.firstChild.nextElementSibling.textContent.toLowerCase().trim()
    if (email.indexOf(inputText) !== -1) {
      item.style.display = 'flex'
      filteredItems.push(item)
    } else {
      console.log(false)
      item.style.display = 'none'
    }
  })
  listLength.innerHTML = filteredItems.length
})

resetFilterBtn.addEventListener('click', (e) => {
  console.log('clicked')
  ul.innerHTML = ''
  const itemsFromStorage = getItemsFromStorage()
  console.log(itemsFromStorage)
  sortByName(itemsFromStorage)
  addToDom(itemsFromStorage)
  resetState()
})

filterUp.addEventListener('click', (e) => {
  const itemsFromStorage = getItemsFromStorage()
  console.log(itemsFromStorage)
  // const sorted = itemsFromStorage.sort((a, b) => a.name.localeCompare(b.name));
  sortByNameTest(itemsFromStorage, '>')
  addToDom(itemsFromStorage)
  resetState()
})

filterDown.addEventListener('click', (e) => {
  const itemsFromStorage = getItemsFromStorage()
  console.log(itemsFromStorage)
  // const sorted = itemsFromStorage.sort((a, b) => a.name.localeCompare(b.name));
  sortByNameTest(itemsFromStorage, '<')
  addToDom(itemsFromStorage)
  resetState()
})

function resetState() {
  const items = ul.querySelectorAll('li')
  if (items.length === 0) {
    clear.style.display = 'none'
    filterContainer.style.display = 'none'
  } else {
    clear.style.display = 'inline'
    filterContainer.style.display = 'block'
  }
  onSubmitBtn.innerText = 'Add'
  cancelEditBtn.style.display = 'none'

  const itemsFromStorage = getItemsFromStorage()
  listLength.innerHTML = itemsFromStorage.length
  isEditMode = false
  objToEdit = null
  objToEditDetails = null
  filter.value = ''
  resetFilterBtn.style.display = 'none'
  if (itemsFromStorage.length >= 5) {
    listLength.style.background = 'green'
  } else {
    listLength.style.background = 'rgb(20, 65, 120)'
  }
  const adminbox = document.querySelectorAll('.admin-span')
  adminbox.forEach((item) => {
    if (item.firstChild.textContent === 'Admin') {
      item.classList.add('admin-active')
    }
  })

  confirmDeleteInput.value = ''
}

function showAlert(message, className) {
  const alertEl = document.createElement('div')
  alertEl.classList.add('alert', className)
  alertEl.setAttribute('tabIndex', -1)
  alertEl.textContent = message
  document.querySelector('#alert').appendChild(alertEl)
  console.log(alertEl)

  // setTimeout(() => alertEl.focus(), 0);
  // Trigger a DOM render to ensure animation styles are applied
  alertEl.offsetWidth // Get the width of the element to force a render
  setTimeout(() => alertEl.focus(), 0)
  alertEl.classList.add('show', className)
  setTimeout(() => alertEl.remove(), 3000)
}

function showModal(message, classes) {}

async function init() {
  // called in another file ****
  await ensureDataInLocalStorage() // Ensure dummy data is loaded
  document.addEventListener('DOMContentLoaded', displayInDom)
}

// clear local storage items if array is empty
function checkItemsArray() {
  const data = JSON.parse(localStorage.getItem('app2Items')) // Parse the stored data

  if (!data || data.length === 0) {
    // Check if data is null or an empty array
    localStorage.removeItem('app2Items') // Remove only app2Items from localStorage
    console.log('app2Items was empty and has been removed from localStorage')
  } else {
    console.log('app2Items exists and has data:', data)
  }
}

init()
