//Task 1
const sampleOrderData = {
    orderId: 'ORD-9821',
    customer: 'Олена Петренко',
    initialItems: [
        { id: 1, title: 'Механічна клавіатура', price: 3200, category: 'electronics' },
        { id: 2, title: 'Бездротова миша', price: 1100, category: 'electronics' },
    ],
}

//Task 1.1
class Product {
    static #nextId = 1
    static taxRate = 0.05
    #id
    #price

    constructor(title, price, category) {
        this.#id = Product.#nextId++
        this.title = title
        this.price = price
        this.category = category
    }

    get id() {
        return this.#id
    }

    get price() {
        return this.#price
    }

    set price(price) {
        if (price > 0) {
            this.#price = price
        } else {
            throw new Error('Ціна повинна бути додатним числом')
        }
    }

    static formatPrice(amount, currency = 'грн') {
        return `${amount.toFixed(2)} ${currency}`
    }

    calculateTotalWithTax() {
        return this.price * (1 + Product.taxRate)
    }

    getInfo() {
        return `[ID: prod_${this.#id}] ${this.title} (${this.category}) - ${this.price} грн`
    }
}

const keyboard = new Product('Механічна клавіатура', 3200, 'electronics')

console.log(keyboard.id) // Наприклад, "prod_1"
console.log(keyboard.price) // 3200
console.log(keyboard.getInfo()) // "[ID: prod_1] Механічна клавіатура (electronics) — 3200 грн"
console.log(Product.formatPrice(keyboard.calculateTotalWithTax())) // "3360.00 грн"

// keyboard.price = -100 // Error: Ціна повинна бути додатним числом
// keyboard.#price = 500 // SyntaxError: Private field '#price' must be declared in an enclosing class

//Task 1.2
class ElectronicsProduct extends Product {
    _warrantyMonths
    powerConsumption

    constructor(title, price, warrantyMonths, powerConsumption) {
        super(title, price, 'electronics')
        this._warrantyMonths = warrantyMonths
        this.powerConsumption = powerConsumption
    }

    getInfo() {
        return super.getInfo() + ` | Гарантія: ${this._warrantyMonths} міс., Потужність: ${this.powerConsumption} Вт`
    }
}

class PerishableProduct extends Product {
    #expirationDate

    constructor(title, price, category, expirationDate) {
        super(title, price, category)
        this.#expirationDate = expirationDate
    }

    isExpired() {
        return this.#expirationDate < new Date()
    }

    getInfo() {
        return super.getInfo() + ` | Придатний до: ${this.#expirationDate.toLocaleDateString('sv-SE')}`
    }
}

const tv = new ElectronicsProduct('Smart TV 55"', 18000, 24, 120)
console.log(tv.getInfo())
// "[ID: prod_2] Smart TV 55" (electronics) — 18000 грн | Гарантія: 24 міс., Потужність: 120 Вт"

const milk = new PerishableProduct('Органічне молоко', 45, 'dairy', new Date('2026-10-01'))
console.log(milk.isExpired()) // false
console.log(milk.getInfo())
// "[ID: prod_3] Органічне молоко (dairy) — 45 грн | Придатний до: 2026-10-01"

//Task 1.3
class User {
    #passwordHash

    constructor(name, email, role = 'customer') {
        this.name = name
        this.email = email
        this.role = role
    }

    setPassword(newPassword) {
        if (newPassword.length >= 6){
            this.#passwordHash = `hash${newPassword}`
        } else {
            throw new Error('Password must have at least 6 symbols')
        }
    }

    checkPassword(password) {
        return `hash${password}` === this.#passwordHash
    }

    getRole() {
        return this.role
    }
}

class AdminUser extends User {
    static #secretMasterKey = 'master_admin_2026'

    constructor(name, email, adminKey) {
        if (adminKey === AdminUser.#secretMasterKey) {
            super(name, email, 'admin')
            this.permissions = ['all']
        } else {
            throw new Error('Відмовлено у доступі: невірний ключ адміністратора')
        }
    }

    static createSuperAdmin(name, email) {
        return new AdminUser(name, email, AdminUser.#secretMasterKey)
    }
}

const admin = AdminUser.createSuperAdmin('Тарас', 'taras@store.ua')
console.log(admin.getRole()) // "admin"
console.log(admin.permissions) // ['all']

// Спроба створити з невірним ключем:
// const fakeAdmin = new AdminUser('Хакер', 'hacker@mail.com', '12345') 
// Error: Відмовлено у доступі: невірний ключ адміністратора




//Task 2
// Базова сутність документа або допису для контент-системи
class Document {
    constructor(title, author) {
        this.title = title
        this.author = author
        this.content = ''
        this.createdAt = new Date()
    }
}

//Task 2.1
const eventEmitterMixin = {
    _eventHandlers: {},

    on(eventName, handler) {
        if (this._eventHandlers[eventName]){
            this._eventHandlers[eventName].push(handler)
        } else {
            this._eventHandlers[eventName] = []
            this._eventHandlers[eventName].push(handler)
        }
    },

    off(eventName, handler) {
        if (this._eventHandlers[eventName].includes(handler)) {
            const index = this._eventHandlers[eventName].indexOf(handler)
            this._eventHandlers[eventName].splice(index, 1)
        }
    },

    emit(eventName, ...args) {
    if (this._eventHandlers[eventName]) {
        for (const handler of this._eventHandlers[eventName]) {
            handler(...args)
        }
    }
}
}

class Article extends Document {}
Object.assign(Article.prototype, eventEmitterMixin)

const article = new Article('Новинки JS 2026', 'Олексій')
article.on('publish', (data) => console.log(`Статтю опубліковано: ${data.url}`))
article.emit('publish', { url: 'https://example.com/js-2026' })
// Виведе: Статтю опубліковано: https://example.com/js-2026

//Task 2.2
const serializableMixin = {
    serialize() {
        return JSON.stringify(this)
    },

    deserialize(jsonString) {
        return Object.assign(this, JSON.parse(jsonString))
    }
}

const loggingMixin = {
    log(message) {
        console.log(`[${this.constructor.name}] ${message} | Стан: ${this.serialize()}`)
    },

    logAction(actionName, details) {
        const timestamp = new Date().toISOString()

        const logEntry = {
            action: actionName,
            details: details,
            timestamp: timestamp
        }

        if (!this._actionLog) this._actionLog = []
        this._actionLog.push(logEntry)
    }
}

Object.setPrototypeOf(loggingMixin, serializableMixin)

class Task {
    constructor(title) {
        this.title = title
        this.status = 'pending'
    }
}

Object.assign(Task.prototype, loggingMixin, serializableMixin)

const task = new Task('Підготувати реліз')
task.status = 'in-progress'
task.log('Зміна статусу')
// [Task] Зміна статусу | Стан: {"title":"Підготувати реліз","status":"in-progress"}

//Task 2.3
function Timestampable(Base) {
    return class extends Base {
        #updatedAt
        
        constructor(...args) {
            super(...args)
            this.#updatedAt = new Date()
        }

        touch() {
            this.#updatedAt = new Date()
        }

        get updatedAt() {
            return this.#updatedAt
        }

        get ageInSeconds() {
            const now = new Date()
            return Math.floor((now - this.#updatedAt) / 1000)
        }
    }
}

class BlogPost extends Timestampable(Document) {
    publish() {
        this.touch()
        console.log(`Пост "${this.title}" оновлено: ${this.updatedAt.toISOString()}`)
    }
}

const post = new BlogPost('Класи та міксини в JS', 'Марія')
console.log(post.updatedAt) // Поточна дата
// post.touch();
// console.log(post.ageInSeconds);
