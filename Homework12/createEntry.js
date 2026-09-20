const form = document.getElementById('entry-form')
const entries = document.getElementById('entries')
let entryCount = 0

const titleInput = document.getElementById('entry-input')
const textInput = document.getElementById('entry-text')

function createEntry(title, text) {
    entryCount++

    const entryDiv = document.createElement('div')
    const entryTitle = document.createElement('h6')
    const entryHeading = document.createElement('h2')
    const entryParagraph = document.createElement('p')
    const editBtn = document.createElement('button')
    const delBtn = document.createElement('button')

    entryDiv.classList.add('entry')
    entryTitle.textContent = `Запис номер ${entryCount}`
    entryHeading.textContent = title
    entryParagraph.textContent = text
    editBtn.textContent = 'Редагувати'
    editBtn.classList.add('edit-btn')
    delBtn.textContent = 'Видалити'
    delBtn.classList.add('delete-btn')

    entryDiv.append(entryTitle, entryHeading, entryParagraph, editBtn, delBtn)
    return entryDiv
}

form.addEventListener('submit', function(event) {
    event.preventDefault()

    const newEntry = createEntry(titleInput.value, textInput.value)
    entries.append(newEntry)

    titleInput.value = ''
    textInput.value = ''

    console.log(newEntry.parentNode)
    console.log(newEntry.firstElementChild)
    console.log(newEntry.lastElementChild)
    console.log(newEntry.nextElementSibling)
    console.log(newEntry.previousElementSibling)
})

entries.addEventListener('click', function(event) {

    if (event.target.matches('.delete-btn')) {
        const entryDiv = event.target.closest('.entry')
        entryDiv.remove()
        return
    }

    if (event.target.matches('.edit-btn')) {
        const entryDiv = event.target.closest('.entry')
        const heading = entryDiv.querySelector('h2')
        const paragraph = entryDiv.querySelector('p')
        const editBtn = event.target

        const editInput = document.createElement('input')
        const editTextarea = document.createElement('textarea')
        const saveBtn = document.createElement('button')

        editInput.value = heading.textContent
        editTextarea.value = paragraph.textContent
        saveBtn.textContent = 'Зберегти'
        saveBtn.classList.add('save-btn')

        heading.replaceWith(editInput)
        paragraph.replaceWith(editTextarea)
        editBtn.replaceWith(saveBtn)
        return
    }

    if (event.target.matches('.save-btn')) {
        const entryDiv = event.target.closest('.entry')
        const editInput = entryDiv.querySelector('input')
        const editTextarea = entryDiv.querySelector('textarea')
        const saveBtn = event.target

        const newHeading = document.createElement('h2')
        const newParagraph = document.createElement('p')
        const newEditBtn = document.createElement('button')

        newHeading.textContent = editInput.value
        newParagraph.textContent = editTextarea.value
        newEditBtn.textContent = 'Редагувати'
        newEditBtn.classList.add('edit-btn')

        editInput.replaceWith(newHeading)
        editTextarea.replaceWith(newParagraph)
        saveBtn.replaceWith(newEditBtn)
        return
    }
})