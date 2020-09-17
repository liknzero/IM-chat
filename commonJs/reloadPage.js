const len = 5
$(function () {
    const { origin, pathname } = window.location
    const newUrl = `${origin}${pathname}`
    let oldUrl = window.localStorage.getItem('oldUrl') ? JSON.parse(window.localStorage.getItem('oldUrl')) : []
    if (newUrl !== oldUrl[0] && !newUrl.match(/\/auth\//g)) {
        oldUrl.unshift(newUrl)
        oldUrl = oldUrl.length >= len ? oldUrl.slice(0, len) : oldUrl
        console.log(oldUrl)
        window.localStorage.setItem('oldUrl', JSON.stringify(oldUrl))
    }
})
