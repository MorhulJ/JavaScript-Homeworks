//Task 1
const sampleConfig = {
    apiKey: 'sec_live_94829104',
    environment: 'production',
    timeout: 5000,
}

//Task 1.1
function createSecureUser(initialData){
    return Object.defineProperties(initialData, {
        id: {
            value: initialData.id,
            writable: false,
            enumerable: true,
            configurable: false
        },
        passwordHash: {
            value: initialData.passwordHash,
            writable: true,
            enumerable: false,
            configurable: false
        },
        fullName: {
            get() {
                return `${initialData.firstName} ${initialData.lastName}`
            },
            set(fullname) {
                const parts = fullname.split(' ')
                
                if (parts.length !== 2){
                    throw new Error('Incorrect fullname format')
                }

                this.firstName = parts[0]
                this.lastName = parts[1]
            },
            enumerable: true
        }

    })
}

const user = createSecureUser({
    id: 1,
    firstName: 'Олександр',
    lastName: 'Коваль',
    email: 'koval@example.com',
    role: 'editor',
    passwordHash: 'e3b0c44298fc1c149afbf4c8996fb924',
})

console.log(user.fullName) // "Олександр Коваль"
user.fullName = 'Іван Франко'
console.log(user.firstName) // "Іван"

// id не змінюється (в strict mode викликає помилку, у non-strict ігнорується):
user.id = 999 
console.log(user.id) // 1

// passwordHash не потрапляє у перелік ключів:
console.log(Object.keys(user)) // ['firstName', 'lastName', 'email', 'role', 'fullName', 'id'] (без passwordHash)

//Task 1.2
function freezeConfig(config, options = {}){
    for (let key of Object.keys(config)){
        if (options.allowedToModify !== undefined){
            if (options.allowedToModify.includes(key)){
                continue
            } 
        }

        const descriptor = Object.getOwnPropertyDescriptor(config, key)
        Object.defineProperty(config, key, {
            ...descriptor,
            writable: false,
            configurable: false
        })
    }
    Object.preventExtensions(config)
    return config
}

const appConfig = {
    apiUrl: 'https://api.example.com/v1',
    port: 3000,
    debug: true,
}

freezeConfig(appConfig, { allowedToModify: ['debug'] })

appConfig.debug = false // Змінюється, бо дозволено в allowedToModify
console.log(appConfig.debug) // false

appConfig.port = 8080 // Не змінюється (writable: false)
appConfig.newProp = 'test' // Не додається (preventExtensions)
console.log(appConfig.port) // 3000
console.log(appConfig.newProp) // undefined

//Task 1.3
function createBankAccount(accountNumber, initialBalance){
    let account = {}
    Object.defineProperties(account, {
        _balance: {
            value: initialBalance,
            writable: true,
            enumerable: false,
            configurable: false
        },
        accountNumber: {
            value: accountNumber,
            writable: false,
            enumerable: true,
            configurable: false
        },
        balance: {
            get() {
                return `${this._balance} грн`
            },
            set(balance){
                if (balance < 0 || !Number.isFinite(balance)){
                    throw new Error("Balance can't be negative or not a number")
                }
                this._balance = balance
            }
        }
    })

    account.deposit = function(amount){
        if (amount > 0){
            this._balance += amount
        }
    }

    account.withdraw = function(amount){
        if (this._balance < amount){
            console.log("Not enough money")
        } else {
            this._balance -= amount
        }
    }

    return account
}

const account = createBankAccount('UA1234567890', 1000)

console.log(account.balance) // "1000 грн"
account.deposit(500)
console.log(account.balance) // "1500 грн"

account.withdraw(300)
console.log(account.balance) // "1200 грн"

//account.balance = -100 // Error: Баланс не може бути від’ємним



//Task 2
function Entity(id) {
    this.id = id
    this.createdAt = new Date()
}

//Task 2.1
let baseProduct = {
    currency: 'UAH',

    getPriceWithTax(taxRate = 0.2) {
        return this.price * (1 + taxRate)
    },
    getInfo() {
        return `[${this.sku}] ${this.title} — ${this.price} ${this.currency}`
    }
}

let electronics = {
    __proto__: baseProduct,
    warrantyMonths: 12,
    powerConsumptions: '65W',

    getWarrantyInfo() {
        return `${this.title}: warranty ${this.warrantyMonths} months`
    }
}

let laptop = {
    __proto__: electronics,
    sku: 'LAP-001',
    title: 'UltraBook Pro',
    price: 45000
}

console.log(laptop.getInfo()) // "[LAP-001] UltraBook Pro — 45000 UAH"
console.log(laptop.getPriceWithTax()) // 54000
console.log(laptop.getWarrantyInfo()) // "UltraBook Pro: Гарантія 12 міс."
console.log(baseProduct.isPrototypeOf(laptop)) // true

//Task 2.2
function User(name, email){
    this.name = name
    this.email = email
    this.isOnline = false
}

function Admin(name, email, permissions){
    User.call(this, name, email)
    this.permissions = permissions
}
 
User.prototype = {
    constructor: User,

    login() {
        this.isOnline = true
        return `${this.name} entered the system`
    },

    logout() {
        this.isOnline = false
        return `${this.name} left the system`
    },

    getProfile() {
        return `Username: ${this.name}, email: ${this.email}, isOnline: ${this.isOnline}`
    }
}

Admin.prototype = Object.create(User.prototype)
Admin.prototype.constructor = Admin

Admin.prototype.hasPermission = function(perm){
    return this.permissions.includes(perm)
}

Admin.prototype.banUser = function(targetUser){
    console.log(`Admin ${this.name} banned ${targetUser.name}`)
}


const admin = new Admin('Олена', 'admin@shop.ua', ['read', 'write', 'delete'])

console.log(admin.login()) // "Олена увійшов(ла) у систему"
console.log(admin.hasPermission('delete')) // true
console.log(admin.constructor === Admin) // true (не втрачено посилання на конструктор!)
console.log(admin instanceof User) // true

//Task 2.3
if (!String.prototype.hasOwnProperty('capitalizeWords')){
    Object.defineProperty(String.prototype, 'capitalizeWords', {
        value: function() {
            let words = this.split(' ')

            let capitalized = words.map(function(word) {
                let firstLetter = word[0].toUpperCase()
                let rest = word.slice(1).toLowerCase()
                return firstLetter + rest
            }) 
            return capitalized.join(' ')
        },
        enumerable: false
    })
}

if (!Array.prototype.hasOwnProperty('chunk')){
    Object.defineProperty(Array.prototype, 'chunk', {
        value: function(size){
            let chunked = []

            for (let i = 0; i < this.length; i += size){
                chunked.push(this.slice(i, i + size)) 
            }

            return chunked
        },
        enumerable: false
    })
}

if (!String.prototype.capitalizeWords) {
    Object.defineProperty(String.prototype, 'capitalizeWords', {
        value: function() {
            return this.split(' ')
                .map(word => word ? word[0].toUpperCase() + word.slice(1).toLowerCase() : '')
                .join(' ')
        },
        enumerable: false,
        writable: true,
        configurable: true,
    })
}

console.log('javaScript прототипне успадкування'.capitalizeWords())
// "Javascript Прототипне Успадкування"

const numbers = [1, 2, 3, 4, 5, 6, 7]
console.log(numbers.chunk(3)) // [[1, 2, 3], [4, 5, 6], [7]]
