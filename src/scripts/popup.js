document.querySelectorAll('span')[0].addEventListener('click', function () {
  chrome.tabs.create({url: 'https://soundcloud.com'})
})

document.querySelectorAll('footer')[0].addEventListener('click', function () {
  chrome.tabs.create({url: 'http://mattias.lol?sc-preview'})
})
