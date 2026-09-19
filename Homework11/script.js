const additionalSections = [
    {
        sectionId: 'attributes',
        title: 'Атрибути та властивості вузлів',
        text: 'DOM-властивості та HTML-атрибути мають важливі відмінності.',
        quote: 'Використовуйте dataset для нестандартних атрибутів data-*',
        isImportant: true,
    },
    {
        sectionId: 'styling',
        title: 'Керування класами та стилями',
        text: 'Властивість classList надає зручні методи add, remove та toggle.',
        quote: null,
        isImportant: false,
    },
]

//Task 1.1
let articleTitle = document.getElementById('article-title')
let contentContainer = document.querySelector('.content')
let statsCounter = document.querySelector('#stats-counter')
let allSections = document.querySelectorAll('.content-section')

let articleInfo = document.getElementById('article-info')
articleInfo.textContent = "Категорія: JavaScript | Стан: Опубліковано"

function inspectSectionRelatives(sectionElement) {
    return {
        parentContainer: sectionElement.parentElement,
        previusSibling: sectionElement.previousElementSibling,
        nextSibling: sectionElement.nextElementSibling,
        firstChild: sectionElement.firstElementChild,
        lastChild: sectionElement.lastElementChild
    }
}

function updateArticleStats() {
    let allSections = contentContainer.children
    let sectionsCount = allSections.length
    let totalSimbols = 0

    for (let i = 0; i < allSections.length; i++) {
        totalSimbols += allSections[i].textContent.length
    }

    statsCounter.textContent = `Статистика: Секцій: ${sectionsCount} | Символів: ${totalSimbols}`
}

// Перевірка навігації та статистики:
const introSection = document.querySelector('[data-section="intro"]')
console.log(inspectSectionRelatives(introSection))
// { parent: main#article-content, prev: null, next: section[data-section="navigation"], ... }

updateArticleStats()
// Текст у #stats-counter: "Статистика: Секцій: 3 | Символів: 482"


//Task 1.2
function enhanceArticleLinks() {
    let allLinks = contentContainer.querySelectorAll('a')

    allLinks.forEach(link => {
        let href = link.getAttribute('href')

        if (href.startsWith('http://') || href.startsWith('https://')) {
            link.target = '_blank'
            link.rel = 'noopener noreferrer'
            link.classList.add('external-link')

            let externalSection = link.closest('.content-section')
            externalSection.dataset.hasExternalLinks = 'true'
        } else {
            link.classList.add('internal-link')
        }
    })
}

function styleImportantQuotes() {
    let allQuots = contentContainer.querySelectorAll('blockquote')

    allQuots.forEach((quote) => {
        if (quote.matches('[data-important="true"]')) {
            quote.classList.add('important')
            quote.style.borderLeft = '4px solid orange'
            quote.style.paddingLeft = '15px'
            quote.style.fontStyle = 'italic'
        }
    })
}

// Перевірка обробки посилань та цитат:
enhanceArticleLinks()
styleImportantQuotes()

const mdnLink = document.querySelector('a[href*="developer.mozilla.org"]')
console.log(mdnLink.getAttribute('target')) // "_blank"
console.log(mdnLink.classList.contains('external-link')) // true


//Task 1.3
function generateTableOfContents() {
    let tocList = document.querySelector('#toc-list')
    tocList.textContent = ''

    let sectionTitles = contentContainer.querySelectorAll('.section-title')
    sectionTitles.forEach(title => {
        let parentSection = title.closest('.content-section')

        let sectionId = parentSection.dataset.section
        parentSection.id = sectionId

        let listItem = document.createElement('li')
        let anchorLink = document.createElement('a')

        anchorLink.href = `#${sectionId}`
        anchorLink.textContent = title.textContent

        listItem.appendChild(anchorLink)
        tocList.appendChild(listItem)
    })
}

function createSectionElement(sectionData) {
    let newSection = document.createElement('section')

    newSection.classList.add('content-section')
    newSection.dataset.section = sectionData.sectionId

    let sectionTitle = document.createElement('h2')
    let sectionParagraph = document.createElement('p')

    sectionTitle.classList.add('section-title')

    sectionTitle.textContent = sectionData.title
    sectionParagraph.textContent = sectionData.text

    newSection.appendChild(sectionTitle)
    newSection.appendChild(sectionParagraph)

    if (sectionData.quote) {
        let sectionQuote = document.createElement('blockquote')
        sectionQuote.textContent = sectionData.quote
        if (sectionData.isImportant) {
            sectionQuote.dataset.important = 'true'
        }
        newSection.appendChild(sectionQuote)
    }

    newSection.insertAdjacentHTML('afterbegin', '<span class="section-badge">📄 Розділ</span>')

    return newSection
}

function appendSections(sectionsList) {
    sectionsList.forEach((section) => {
        let newSection = createSectionElement(section)
        contentContainer.append(newSection)
    })

    generateTableOfContents()
    enhanceArticleLinks()
    styleImportantQuotes()
    updateArticleStats()
}

function removeSectionByCode(sectionCode) {
    let sectionToRemove = contentContainer.querySelector(`[data-section="${sectionCode}"]`)
    sectionToRemove.remove()
    
    generateTableOfContents()
    updateArticleStats()
}

// Генерація змісту та динамічне наповнення статті:
generateTableOfContents()

// Додавання нових розділів із масиву:
appendSections(additionalSections)

// Видалення секції за ідентифікатором:
removeSectionByCode('styling')
