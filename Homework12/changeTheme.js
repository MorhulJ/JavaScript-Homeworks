const btn = document.getElementById('theme-btn')

btn.addEventListener('click', function() {
    if (document.body.className === 'light-theme') {
        document.body.className = 'dark-theme'
    } else {
        document.body.className = 'light-theme'
    }
})
