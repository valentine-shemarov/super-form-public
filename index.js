const add = document.querySelector('.add')
const clear = document.querySelector('.clear')

const storage = JSON.parse(localStorage.getItem('users')) || {}

/**
 * Функция добавления слушателей на кнопки удаления и изменения
 * в карточке пользователя
 * @param {HTMLDivElement} userCard - карточка пользователя
 */
function setListeners(userCard) {
    const deleteBtn = userCard.querySelector('.delete')
    const changeBtn = userCard.querySelector('.change')

    const userEmail = deleteBtn.dataset.deleteUserEmail

    deleteBtn.addEventListener('click', (event) => {
        const emailToDelete = deleteBtn.dataset.deleteUserEmail
        const parentNodeToDelete = deleteBtn.closest('.user')
        
        const data = JSON.parse(localStorage.getItem('users'))
        delete data[emailToDelete]
        localStorage.setItem('users', JSON.stringify(data))

        delete storage[emailToDelete]

        parentNodeToDelete.remove()

        console.log(
            `%c Удаление пользователя ${userEmail} `,
            'background: red; color: white',
        )
    })

    changeBtn.addEventListener('click', () => {
        const emailToChange = changeBtn.dataset.changeUserEmail

        const allData = JSON.parse(localStorage.getItem('users'))
        const dataToChange = allData[emailToChange]

        const nameInput = document.querySelector('#name')
        const secondNameInput = document.querySelector('#secondName')
        const emailInput = document.querySelector('#email')

        nameInput.value = dataToChange.name
        secondNameInput.value = dataToChange.secondName
        emailInput.value = dataToChange.email

        console.log(
            `%c Изменение пользователя ${userEmail} `,
            'background: green; color: white',
        )
    })
}

/**
 * Функция создания карточки пользователя
 * @param {Object} data - объект с данными пользователя
 * @param {string} data.name - имя пользователя
 * @param {string} data.secondName - фамилия пользователя
 * @param {string} data.email - email пользователя
 * @returns {string} - возвращает строку с разметкой карточки пользователя
 */
function createCard({ name, secondName, email }) {
    return `
        <div data-user=${email} class="user-outer">
            <div class="user-info">
                <p>${name}</p>
                <p>${secondName}</p>
                <p class="email">${email}</p>
            </div>
            <div class="menu">
                <button data-delete-user-email=${email} class="delete">Удалить</button>
                <button data-change-user-email=${email} class="change">Изменить</button>
            </div>
        </div>
    `
}

/**
 * Функция перерисовки карточек пользователей при загрузке страницы
 * @param {Object} storage - объект с данными пользователей
 */
function rerenderCards(storage) {
    const users = document.querySelector('.users')

    if (!storage) {
        console.log('localStorage пустой')
        return
    }

    users.innerHTML = ''

    Object.keys(storage).forEach((email) => {
        const userData = storage[email]
        const userCard = document.createElement('div')
        userCard.className = 'user'
        userCard.dataset.email = email
        userCard.innerHTML = createCard(userData)
        users.append(userCard)
        setListeners(userCard)
    })
}

/**
 * Функция добавления карточки пользователя в список пользователей и в localStorage
 * @param {Event} e - событие клика по кнопке добавления
 */
function addCard(e) {
    e.preventDefault()
    const newName = document.querySelector('#name')
    const newSecondName = document.querySelector('#secondName')
    const newEmail = document.querySelector('#email')

    const users = document.querySelector('.users')

    if (!newEmail.value
        || !newName.value
        || !newSecondName.value
    ) {
        resetInputs(newName, newSecondName, newEmail)
        return
    }

    const data = {
        name: newName.value,
        secondName: newSecondName.value,
        email: newEmail.value,
    }

    if (storage[newEmail.value]) {
        // edit localStorage
        storage[newEmail.value] = data
        localStorage.setItem('users', JSON.stringify(storage))
        
        // edit DOM
        const userCard = document.querySelector(`[data-email="${newEmail.value}"]`)
        userCard.innerHTML = createCard(data)
    } else {
        // add
        storage[newEmail.value] = data

        const userCard = document.createElement('div')
        
        userCard.className = 'user'
        userCard.dataset.email = newEmail.value
        
        // fix
        userCard.innerHTML = createCard(data)

        users.append(userCard)
        setListeners(userCard)

        // Добавление данных в localStorage
        localStorage.setItem('users', JSON.stringify(storage))
    }
    
    resetInputs(newName, newSecondName, newEmail)

    console.log(storage)
}

/**
 * Функция очистки полей ввода
 * @param {HTMLInputElement} inputs
 */
function resetInputs(...inputs) {
    inputs.forEach((input) => {
        input.value = ''
    })
}

// Функция очистки localStorage
function clearLocalStorage() {
    localStorage.removeItem('users')
    window.location.reload()
}

// Добавление слушателей на кнопки добавления и очистки
add.addEventListener('click', addCard)
clear.addEventListener('click', clearLocalStorage)

// При загрузке страницы перерисовываются карточки пользователей
window.addEventListener('load', () => {
    rerenderCards(JSON.parse(localStorage.getItem('users')))
})
