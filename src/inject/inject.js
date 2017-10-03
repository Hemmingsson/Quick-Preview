/* ==========================================================================
Setup
========================================================================== */
var clientID = 'client_id=27e7671d4d1784ed5d35d34922e136d8'

// All Selectors
var selectors = {
  item: '.sound__body, .soundBadge, .chartTrack, .audibleTile, .trackItem, .fullListenHero',
  titleLink: 'a.soundTitle__title, a.audibleTile__heading, .chartTrack__title a',
  playButton: 'sc-button-play',
  pauseButton: 'sc-button-pause',
  wave: '.sound__waveform, .fullHero__waveform'
}

// Progress Svg
var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="40 50 120 100"><path class="move" d="M100,50c27.6,0,50,22.4,50,50s-22.4,50-50,50s-50-22.4-50-50\nS72.4,50,100,50"/></svg>'
// Progress Animation
var progressAnimationFrame

// Preview Object
var currentPreview

/* ==========================================================================
Watch for Items and Prepare
========================================================================== */

sentinel.on(selectors.item, function (elm) {
  setHoverListener(elm)
})
var setHoverListener = function (item) {
  // Does item have a play button?
  var playElm = item.getElementsByClassName(selectors.playButton)[0]
  if (!playElm) return
  // Set mouse hover listner
  playElm.addEventListener('mouseover', function () { onPlayHover(item, playElm) })
}

/* ==========================================================================
On Hover
========================================================================== */

var onPlayHover = function (item, playElm) {
  // Dont do shit if hovered button is already playing
  if (playElm.classList.contains('sc-button-pause')) return

  // Create Preview Object
  currentPreview = {
    wrapperElm: item,
    playElm: playElm,
    titleElm: item.querySelectorAll(selectors.titleLink)[0],
    waveElm: item.querySelectorAll(selectors.wave)[0],
    durationIndicator: null,
    circleIndicator: null,
    url: findStreamUrl(item),
    StreamUrl: item.getAttribute('data-streamurl'),
    wasScPlaying: false
  }

  // Remove Title "tooltip"
  playElm.title = ''

  // Inititae Preview Player
  var validItem = currentPreview.playElm && currentPreview.url
  if (validItem) { initPreviewPlayer() }

  // Listen for Cancel events
  playElm.addEventListener('mouseout', cancelPreview)
  playElm.addEventListener('click', cancelPreview)
}

/* ==========================================================================
Preview Player
========================================================================== */

var previewPlayer = new Audio()
// Sample Settings
var sampleStartPoints = []
var sampleLenght = 6 // Seconds
var sampleSize = 5
var currentSample = 0

/*
   Inititate, Cancel & Fail Preview Functions
   ========================================================================== */

var initPreviewPlayer = function () {
  // Save player state
  currentPreview.wasScPlaying = isSoundCloudPlaying()
  // Create Duration Wave indicator
  if (currentPreview.waveElm) createDurationWave()
  // Create Duration Circle indicator
  if (currentPreview.playElm) createDurationCircle()
  // Check whether we have the stream Url or it needs to be request it from api
  if (currentPreview.StreamUrl) {
    setPreviewPlayerSrc(currentPreview.StreamUrl)
  } else {
    getAndSetPreviewPlayerSrc()
  }
}

var cancelPreview = function () {
  if (!currentPreview) return
  // Cancel Duration update and destroy elements
  cancelAnimationFrame(progressAnimationFrame)
  destroyDurationIndicators()

  // Play soundcloud player if was playing before init
  if (currentPreview.wasScPlaying) { playSoundCloudPlayer(true) }

  // Reset Values
  setPreviewPlayerSrc('')
  currentSample = 0
  currentPreview = null
}

var failedPreview = function () {
  // Message to be displayed
  var errorMessage = '😵 No Preview Avalible'
  // Title Element
  var titleElm = currentPreview.titleElm
  // Check if title elm is pressent & errorMessage is not already applyed
  if (titleElm && titleElm.innerText !== errorMessage) {
    // Save track title
    var trackTitle = titleElm.innerText
    // Set error message
    titleElm.innerText = errorMessage
    setTimeout(function () {
      // Reset Error message to track title again
      titleElm.innerText = trackTitle
    }, 2000)
  }
  cancelPreview()
}

/*
   Sample Generation & Handeling
   ========================================================================== */

var createSamplePoints = function () {
  var points = []
  for (var i = 1; i < sampleSize; i++) {
    var lol = previewPlayer.duration / sampleSize
    points.push(lol * i)
  }
  return points
}

var playNextSample = function () {
  previewPlayer.currentTime = sampleStartPoints[currentSample]
}

var sampleHandeling = function () {
  if (currentPreview && !previewPlayer.paused) {
    if (previewPlayer.currentTime > sampleStartPoints[currentSample] + sampleLenght) {
      currentSample++
      // Play next sample if avalible
      if (currentSample !== sampleSize - 1) {
        playNextSample()
      } else {
        // Last Sample - Kill Preview
        cancelPreview()
      }
    }
  }
}

/*
   Get and Set Stream Url
   ========================================================================== */

var getAndSetPreviewPlayerSrc = function () {
  // Get stream url
  resolveSoundCloudUrl(currentPreview.url).then(function (trackData) {
    if (!trackData) failedPreview()
    if (!currentPreview) return
    var streamUrl = getStreamUrl(trackData)
    // set Stream Url
    setPreviewPlayerSrc(streamUrl)
    // Save stream url on elm to reduce requsts
    currentPreview.wrapperElm.setAttribute('data-streamurl', streamUrl)
  })
}

var setPreviewPlayerSrc = function (src) {
  previewPlayer.src = src
}

/*
   Player Events
   ========================================================================== */

previewPlayer.addEventListener('loadedmetadata', function () {
  if (!currentPreview) return
  sampleStartPoints = createSamplePoints()
  playNextSample()
})

previewPlayer.addEventListener('playing', function () {
   // Remove Loading animation
  currentPreview.circleIndicator.classList.remove('pulse')
})

previewPlayer.addEventListener('canplay', function () {
  if (!currentPreview) return
  // Pause Soundcloud Player
  playSoundCloudPlayer(false)
  // Play Preview Player
  previewPlayer.play()
  // Update Duration Indicators
  progressAnimationFrame = requestAnimationFrame(updateProgressBars)
})

previewPlayer.addEventListener('timeupdate', sampleHandeling)

/* ==========================================================================
Preview Duration
========================================================================== */

/*
   Create & Destroy Elements
   ========================================================================== */

var createDurationWave = function () {
  // Create wave Parent
  currentPreview.durationIndicator = document.createElement('div')
  currentPreview.durationIndicator.classList.add('durationWave')
  currentPreview.waveElm.append(currentPreview.durationIndicator)
  // Get wave image
  var durationImage = currentPreview.wrapperElm.getElementsByTagName('canvas')[0].toDataURL()
  // Create Duration Progress elm
  var durationProgress = document.createElement('div')
  durationProgress.classList.add('durationWaveProgress')
  durationProgress.style.width = currentPreview.waveElm.offsetWidth + 'px'
  durationProgress.style.height = currentPreview.waveElm.offsetHeight + 'px'
  durationProgress.style['-webkit-mask-image'] = 'url(' + durationImage + ')'
  // Append Duration wave
  currentPreview.durationIndicator.append(durationProgress)
}

var createDurationCircle = function () {
  // Create Wave Circle Parent
  currentPreview.circleIndicator = document.createElement('div')
  currentPreview.circleIndicator.classList.add('durationCircle')
  currentPreview.circleIndicator.classList.add('pulse')
  // Insert Svg
  currentPreview.circleIndicator.innerHTML = svg
  // Append Duration Circle
  currentPreview.playElm.append(currentPreview.circleIndicator)
}

var destroyDurationIndicators = function () {
  if (currentPreview.durationIndicator) {
    currentPreview.durationIndicator.remove()
  }
  if (currentPreview.circleIndicator) {
    currentPreview.circleIndicator.remove()
  }
}

/*
   Update Progress elements
   ========================================================================== */

function updateProgressBars () {
  updateDurationCircle()
  updateDurationWave()
  progressAnimationFrame = requestAnimationFrame(updateProgressBars)
}

var updateDurationWave = function () {
  if (!currentPreview) return
  if (!currentPreview.durationIndicator) return
  var durationWidth = convertRange(previewPlayer.currentTime, [0, previewPlayer.duration], [0, 100])
  currentPreview.durationIndicator.style.width = durationWidth + '%'
}

var updateDurationCircle = function () {
  if (!currentPreview) return
  var currentTime = previewPlayer.currentTime
  var circumference = 314

  // calculate current total time of samples
  var sampleTime = sampleLenght * currentSample
  var relativeTime = currentTime - sampleStartPoints[currentSample]
  var time = relativeTime + sampleTime

  // Convert total time of samples to stroke offsset value
  var value = convertRange(time, [0, (sampleSize - 1) * sampleLenght], [0, 100])
  value = value < 0 ? 0 : value
  var strokeDash = circumference - (value * circumference / 100)
  // Set offset stroke
  var progressElm = currentPreview.circleIndicator.getElementsByClassName('move')[0]
  progressElm.style['stroke-dashoffset'] = strokeDash
}

var convertRange = function (value, r1, r2) {
  return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0]
}

/* ==========================================================================
Soundcloud Interface
========================================================================== */

var isSoundCloudPlaying = function () {
  return document.body.getElementsByClassName('playControl')[0].classList.contains('playing')
}

var playSoundCloudPlayer = function (play) {
  var playBtn = document.body.getElementsByClassName('playControl')[0]
  if (play && !isSoundCloudPlaying()) { playBtn.click() } // Play
  if (!play && isSoundCloudPlaying()) { playBtn.click() } // Pause
}

var findStreamUrl = function (previewItem) {
  // Get Normal Track Link Url
  var linkElm = previewItem.querySelectorAll(selectors.titleLink)[0]
  if (linkElm) return linkElm.href
  // Get Track Page Url
  var isItemPage = previewItem.classList.contains('fullListenHero')
  if (isItemPage) return window.location.href
  // No url was found
  return null
}

/* ==========================================================================
Soundcloud Api
========================================================================== */

var resolveSoundCloudUrl = function (url) {
  var resolveURL = 'https://api.soundcloud.com/resolve?url=' + url + '&' + clientID
  return new Promise(function (resolve, reject) {
    var request = new XMLHttpRequest()
    request.open('GET', resolveURL, true)
    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        resolve(JSON.parse(request.responseText))
      } else {
        resolve(null)
      }
    }
    request.send()
  })
}

var getStreamUrl = function (trackData) {
  var streamUrl
  if (trackData.kind === 'track') {
    streamUrl = trackData.stream_url
  }
  if (trackData.kind === 'playlist') {
    streamUrl = trackData.tracks[0].stream_url
  }
  if (streamUrl) return streamUrl + '?' + clientID
}
