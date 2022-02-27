// ---------------
// Global Variables
let nextLaunchData = {}
let rocketName = ''
let launchPadName = ''
let allCrewData = []
let crewMembers = []
let upcomingLaunchData = []
let pastLaunchData = []

// ---------------
// URLs
const nextDataURL = 'https://api.spacexdata.com/v5/launches/next'
const upcomingDataURL = 'https://api.spacexdata.com/v5/launches/upcoming'
const pastDataURL = 'https://api.spacexdata.com/v5/launches/past'

// ----------------------
// URL Requests & Loading Spinner
const loadingSpinner = document.querySelector('.loading-spinner')

// Gets Data & Calls Functions
async function getNextData() {
  const res = await fetch(nextDataURL)
  const nextData = await res.json()
  nextLaunchData = nextData

  createNextLaunchCountdown(nextLaunchData)
  getRocketData(nextLaunchData)
  getLaunchData(nextLaunchData)
  getCrewData(nextLaunchData)

  setTimeout(() => {
    loadingSpinner.style.display = 'none'
    createNextLaunchCard(nextLaunchData)
  }, 1000)
}

// Gets Rocket Data
async function getRocketData(nextLaunchData) {
  const res = await fetch(
    `https://api.spacexdata.com/v4/rockets/${nextLaunchData.rocket}`
  )
  const rocketData = await res.json()
  rocketName = rocketData.name
}

// Gets Launchpad Data
async function getLaunchData(nextLaunchData) {
  const res = await fetch(
    `https://api.spacexdata.com/v4/launchpads/${nextLaunchData.launchpad}`
  )
  const launchPadData = await res.json()
  launchPadName = launchPadData.name
}

// Gets Crew Data
async function getCrewData(nextLaunchData) {
  const res = await fetch(`https://api.spacexdata.com/v4/crew`)
  const crewData = await res.json()
  allCrewData = crewData

  if (nextLaunchData.crew.length > 0) {
    nextLaunchData.crew.forEach((nextLaunchCrew) => {
      allCrewData.forEach((allCrew) => {
        if (nextLaunchCrew.crew === allCrew.id) {
          const crewMember = {
            crewRole: nextLaunchCrew.role,
            crewName: allCrew.name,
            crewImage: allCrew.image,
          }
          crewMembers.push(crewMember)
        }
      })
    })
  }
}

getNextData()

// Get Upcoming Launch Data
async function getUpcomingData() {
  const res = await fetch(upcomingDataURL)
  const upcomingData = await res.json()

  upcomingData.shift()
  upcomingLaunchData = upcomingData
  createUpcomingLaunchCards(upcomingLaunchData)
}
getUpcomingData()

// Gets Past Launch Data
async function getPastData() {
  const res = await fetch(pastDataURL)
  const pastData = await res.json()

  pastLaunchData = pastData.slice(-50).reverse()
  createPastLaunchCards(pastLaunchData)
}
getPastData()

// ----------------------------------------------------------------
// Gets Current Date/Time, pass in date/time and returns each value
function getTimeRemaining(time) {
  const total = Date.parse(time) - Date.parse(new Date())
  const seconds = Math.floor((total / 1000) % 60)
  const minutes = Math.floor((total / 1000 / 60) % 60)
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24)
  const days = Math.floor(total / (1000 * 60 * 60 * 24))

  return {
    total,
    days,
    hours,
    minutes,
    seconds,
  }
}

// Updates Next Launch Countdown, updates each second
function createNextLaunchCountdown(nextLaunchData) {
  let nextLaunch = nextLaunchData.date_local
  const days = document.querySelector('.days')
  const hours = document.querySelector('.hours')
  const mins = document.querySelector('.mins')
  const secs = document.querySelector('.secs')

  const timeinterval = setInterval(() => {
    const t = getTimeRemaining(nextLaunch)
    days.innerHTML = `<span>${
      t.days < 10 ? '0' + t.days : t.days
    }</span><small>Days</small>`
    hours.innerHTML = `<span>${
      t.hours < 10 ? '0' + t.hours : t.hours
    }</span><small>Hours</small>`
    mins.innerHTML = `<span>${
      t.minutes < 10 ? '0' + t.minutes : t.minutes
    }</span><small>Mins</small>`
    secs.innerHTML = `<span>${
      t.seconds < 10 ? '0' + t.seconds : t.seconds
    }</span><small>Secs</small>`
    if (t.total <= 0) {
      clearInterval(timeinterval)
    }
  }, 1000)
}

// ------------------------
// Creates Next Launch Cards
function createNextLaunchCard(nextLaunchData) {
  const nextLaunchEl = document.querySelector('.next-launch-wrapper')
  const nextLaunchCard = document.createElement('div')
  nextLaunchCard.classList.add('row-inner')
  nextLaunchCard.innerHTML = `
    <div class="col">
    <div class="mission-details-wrapper">
      <div class="mission-details">
        <div class="mission-details-headings">
          <div class="mission-date">
            <small>Date:</small> 
            <h3>${
              nextLaunchData.date_local === null
                ? 'N/A'
                : nextLaunchData.date_local
                    .slice(0, 10)
                    .split('-')
                    .reverse()
                    .join('/')
            }</h3>
          </div>
          <div class="mission-name">
            <small>Name:</small>
            <h3>${
              nextLaunchData.name === null ? 'N/A' : nextLaunchData.name
            }</h3>
          </div>
          <div class="flight-number">
            <small>Flight No:</small>
            <h4>${
              nextLaunchData.flight_number === null
                ? 'N/A'
                : nextLaunchData.flight_number
            }</h4>
          </div>
          <div class="rocket">
            <small>Rocket:</small>
            <h4>${rocketName === null ? 'N/A' : rocketName}</h4>
          </div>
        </div>
      </div>
      <div class="mission-details">
        <div class="mission-details-headings">
          <div class="launchpad">
            <small>Launchpad:</small>
            <h4>${launchPadName === null ? 'N/A' : launchPadName}</h4>
          </div>
          <div class="presskit">
            <small>Press Kit:</small>
            ${presskitLink(nextLaunchData.links.presskit)}
          </div>
          <div class="youtube">
            <small>YouTube:</small>
            ${youtubeLink(nextLaunchData.links.youtube_id)}
          </div>
          <div class="wiki">
            <small>Wikipedia:</small>
            ${wikiLink(nextLaunchData.links.wikipedia)}
          </div>
        </div>
        <div class="mission-patch">
          <img
            src="${
              nextLaunchData.links.patch.small === null
                ? './icons/rocket-white.svg'
                : nextLaunchData.links.patch.small
            }"
            alt="mission-patch"
          />
        </div>
      </div>
    </div>
  </div>
    `
  nextLaunchEl.append(nextLaunchCard)

  const nextLaunchDetailsEl = document.createElement('div')
  nextLaunchDetailsEl.classList.add('row-inner')
  nextLaunchDetailsEl.innerHTML = `
    <div class="col">
      <div class="mission-details-wrapper">
        <div class="mission-details flex-half">
          <div class="mission-description">
            <small>Details:</small>
            <p>${
              nextLaunchData.details === null
                ? 'No details for this launch'
                : nextLaunchData.details
            }
            </p>
          </div>
        </div>
        <div class="mission-details">
          <div class="mission-crew">
            <small>Crew:</small>
            <div class="mission-crew-profiles">
            </div>
          </div>
        </div>
      </div>
    </div>
    `
  nextLaunchEl.append(nextLaunchDetailsEl)

  // Creates Mission Crew Details & Patch
  const missionCrewProfilesEl = document.querySelector('.mission-crew-profiles')
  const nextMissionPatch = document.querySelector('.next-launch-wrapper img')
  createCrewEls(missionCrewProfilesEl)
  nextMissionImgPatchModal(nextMissionPatch)
}

// ----------------------------------------------------
// Presskit, YT & Wiki Function Check & Insert into DOM
function presskitLink(link) {
  if (link === null) {
    return `<p>No link<p/>`
  } else {
    return `<a href="${link}" target="_blank" aria-label="presskit-icon"><i class="fa-solid fa-note-sticky"></i></a>`
  }
}

function youtubeLink(link) {
  if (link === null) {
    return `<p>No link<p/>`
  } else {
    return `<a href="https://www.youtube.com/watch?v=${link}" target="_blank" aria-label="youtube-icon"><i class="fa-brands fa-youtube"></i></a>`
  }
}

function wikiLink(link) {
  if (link === null) {
    return `<p>No link<p/>`
  } else {
    return `<a href="${link}" target="_blank" aria-label="wiki-icon"><i class="fa-brands fa-wikipedia-w"></i></a>`
  }
}

// --------------------
// Creates Crew Element
function createCrewEls(missionCrewProfilesEl) {
  if (crewMembers.length === 0) {
    const missionNoCrewEl = document.createElement('p')
    missionNoCrewEl.textContent = 'No crew on this mission'
    missionCrewProfilesEl.style.justifyContent = 'flex-start'
    missionCrewProfilesEl.append(missionNoCrewEl)
  } else {
    crewMembers.forEach((crew) => {
      const missionCrewImgEl = document.createElement('div')
      missionCrewImgEl.classList.add('mission-crew-img')
      missionCrewImgEl.innerHTML = `
    <img
      src="${crew.crewImage}"
      alt="${crew.crewName}"
      referrerpolicy="no-referrer"
    />
    <div class="tooltip">
      <span class="tooltip-text-title">
        ${crew.crewName}
        <small class="tooltip-text-role">${crew.crewRole}</small>
      </span>
    </div>
      
      `
      missionCrewProfilesEl.append(missionCrewImgEl)
    })
  }
}

// -------------------------
// Creates Next Mission Patch
function nextMissionImgPatchModal(nextMissionPatch) {
  const modal = document.querySelector('.modal')
  const modalImg = document.querySelector('.modal img')
  let currentClickedImg = nextMissionPatch.src

  nextMissionPatch.addEventListener('click', () => {
    modalImg.src = currentClickedImg
    modal.classList.add('active')

    gsap.fromTo('.modal-img', { y: 1000, opacity: 0 }, { y: 0, opacity: 1 })
  })

  const closeBtn = document.querySelector('.close-btn')
  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active')
  })
}

// -----------------------------
// Creates Upcoming Launch Cards
function createUpcomingLaunchCards(upcomingLaunchData) {
  const upcomingLaunchWrapper = document.querySelector(
    '.upcoming-launch-wrapper'
  )

  upcomingLaunchData.forEach((upcomingLaunch) => {
    const upcomingLaunchCard = document.createElement('div')
    upcomingLaunchCard.classList.add('col')
    upcomingLaunchCard.innerHTML = `
    <div class="card upcoming-card">
    <div class="mission-details upcoming">
      <div class="mission-patch">
        <img
          src="${
            upcomingLaunch.links.patch.small === null
              ? './icons/rocket-white.svg'
              : upcomingLaunch.links.patch.small
          }"
          alt="mission-patch"
        />
      </div>
      <div class="mission-details-headings">
        <div class="mission-date">
          <small>Date:</small>
          <h3>${
            upcomingLaunch.date_local === null
              ? 'N/A'
              : upcomingLaunch.date_local
                  .slice(0, 10)
                  .split('-')
                  .reverse()
                  .join('/')
          }</h3>
        </div>
        <div class="mission-name">
          <small>Name:</small>
          <h3>${upcomingLaunch.name === null ? 'N/A' : upcomingLaunch.name}</h3>
        </div>
        <div class="flight-number">
          <small>Flight No:</small>
          <h4>${
            upcomingLaunch.flight_number === null
              ? 'N/A'
              : upcomingLaunch.flight_number
          }</h4>
        </div>
      </div>
    </div>
    <div class="card-expand-arrow upcoming">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
      >
        <path
          d="M443.5 98.5l-211 211.1c-4.7 4.7-12.3 4.7-17 0L4.5 98.5c-4.7-4.7-4.7-12.3 0-17l7.1-7.1c4.7-4.7 12.3-4.7 17 0L224 269.9 419.5 74.5c4.7-4.7 12.3-4.7 17 0l7.1 7.1c4.6 4.6 4.6 12.2-.1 16.9zm0 111l-7.1-7.1c-4.7-4.7-12.3-4.7-17 0L224 397.9 28.5 202.5c-4.7-4.7-12.3-4.7-17 0l-7.1 7.1c-4.7 4.7-4.7 12.3 0 17l211 211.1c4.7 4.7 12.3 4.7 17 0l211-211.1c4.8-4.8 4.8-12.4.1-17.1z"
        />
      </svg>
    </div>
    <div class="mission-details upcoming expand">
      <div class="mission-description">
        <small>Details:</small>
        <p>
          ${
            upcomingLaunch.details === null
              ? 'No details for this launch.'
              : upcomingLaunch.details
          }
        </p>
      </div>
    </div>
  </div>
    `
    upcomingLaunchWrapper.firstElementChild.append(upcomingLaunchCard)
  })

  // Adds drop down feature for cards
  const upcomingCards = document.querySelectorAll('.upcoming-card')
  const upcomingLaunchFirstCardArrow =
    document.querySelector('.card-expand-arrow')
  const upcomingLaunchFirstCardText = document.querySelector(
    '.mission-details.upcoming.expand'
  )
  upcomingLaunchFirstCardArrow.classList.add('active')
  upcomingLaunchFirstCardText.classList.add('active')

  expandUpcomingCards()

  // GSAP Animation
  upcomingCards.forEach((card) => {
    tl.fromTo(card, { y: 2000 }, { y: 0 }, '+1')
  })
}

// -------------------------
// Creates Past Launch Cards
function createPastLaunchCards(pastLaunchData) {
  const pastLaunchWrapper = document.querySelector('.past-launch-wrapper')

  pastLaunchData.forEach((pastLaunch) => {
    const pastLaunchCard = document.createElement('div')
    pastLaunchCard.classList.add('col')
    pastLaunchCard.innerHTML = `
    <div class="card past-card">
    <div class="mission-details past">
      <div class="mission-patch">
        <img
          src="${
            pastLaunch.links.patch.small === null
              ? './icons/rocket-white.svg'
              : pastLaunch.links.patch.small
          }"
          alt="mission-patch"
        />
      </div>
      <div class="mission-details-headings">
        <div class="mission-date">
          <small>Date:</small>
          <h3>${
            pastLaunch.date_local === null
              ? 'N/A'
              : pastLaunch.date_local
                  .slice(0, 10)
                  .split('-')
                  .reverse()
                  .join('/')
          }</h3>
        </div>
        <div class="mission-name">
          <small>Name:</small>
          <h3>${pastLaunch.name === null ? 'N/A' : pastLaunch.name}</h3>
        </div>
        <div class="flight-number">
          <small>Flight No:</small>
          <h4>${
            pastLaunch.flight_number === null ? 'N/A' : pastLaunch.flight_number
          }</h4>
        </div>
        <div class="mission-outcome">
        <small>Mission Success:</small>
        ${missionSuccess(pastLaunch.success)}
      </div>
      </div>
    </div>
    <div class="card-expand-arrow past">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
      >
        <path
          d="M443.5 98.5l-211 211.1c-4.7 4.7-12.3 4.7-17 0L4.5 98.5c-4.7-4.7-4.7-12.3 0-17l7.1-7.1c4.7-4.7 12.3-4.7 17 0L224 269.9 419.5 74.5c4.7-4.7 12.3-4.7 17 0l7.1 7.1c4.6 4.6 4.6 12.2-.1 16.9zm0 111l-7.1-7.1c-4.7-4.7-12.3-4.7-17 0L224 397.9 28.5 202.5c-4.7-4.7-12.3-4.7-17 0l-7.1 7.1c-4.7 4.7-4.7 12.3 0 17l211 211.1c4.7 4.7 12.3 4.7 17 0l211-211.1c4.8-4.8 4.8-12.4.1-17.1z"
        />
      </svg>
    </div>
    <div class="mission-details past expand">
      <div class="mission-description">
        <small>Details:</small>
        <p>
          ${
            pastLaunch.details === null
              ? 'No details for this launch.'
              : pastLaunch.details
          }
        </p>
      </div>
    </div>
  </div>
    `
    pastLaunchWrapper.firstElementChild.append(pastLaunchCard)
  })

  expandPastCards()

  // GSAP Animation
  const pastCards = document.querySelectorAll('.past-card')
  pastCards.forEach((card) => {
    tl.fromTo(card, { x: 1000 }, { x: 0 }, '+1')
  })
}

// -------------------------
// Check Mission Sucess FUNC
function missionSuccess(launchSuccess) {
  if (launchSuccess === false) {
    return '<h4 style="color: rgba(255, 0, 0, 0.7);">No<h4/>'
  } else {
    return '<h4 style="color: rgba(0, 255, 0, 0.7);">Yes<h4/>'
  }
}

// ---------------------------
// Expand Upcoming Card Detail
function expandUpcomingCards() {
  const upcomingCardExpandArrows = document.querySelectorAll(
    '.card-expand-arrow.upcoming'
  )
  upcomingCardExpandArrows.forEach((arrow) => {
    arrow.addEventListener('click', () => {
      removeActiveExpandUpcomingCardArrows(upcomingCardExpandArrows)
      arrow.classList.toggle('active')
      arrow.nextElementSibling.classList.toggle('active')
    })
  })
}

// Removes Card Details 'Active' Class
function removeActiveExpandUpcomingCardArrows(upcomingCardExpandArrows) {
  upcomingCardExpandArrows.forEach((arrow) => {
    arrow.classList.remove('active')
    arrow.nextElementSibling.classList.remove('active')
  })
}

// -----------------------
// Expand Past Card Detail
function expandPastCards() {
  const pastCardExpandArrows = document.querySelectorAll(
    '.card-expand-arrow.past'
  )
  pastCardExpandArrows.forEach((arrow) => {
    arrow.addEventListener('click', () => {
      removeActiveExpandPastCardArrows(pastCardExpandArrows)
      arrow.classList.toggle('active')
      arrow.nextElementSibling.classList.toggle('active')
    })
  })
}
// Removes Card Details 'Active' Class
function removeActiveExpandPastCardArrows(pastCardExpandArrows) {
  pastCardExpandArrows.forEach((arrow) => {
    arrow.classList.remove('active')
    arrow.nextElementSibling.classList.remove('active')
  })
}

// ---------------------------------------------------------
// Horizontal Scroll & Grab for Past/Future Card Wrapper Div
let mouseDown = false
let startX
let scrollLeft

const scrollColDivs = document.querySelectorAll('.col-lg.scroll')

let startDragging = (e) => {
  mouseDown = true
  scrollColDivs.forEach((scrollDiv) => {
    startX = e.pageX - scrollDiv.offsetLeft
    scrollLeft = Math.round(scrollDiv.scrollLeft)
    scrollDiv.style.cursor = 'grabbing'
  })
}

let stopDragging = () => {
  mouseDown = false
  scrollColDivs.forEach((scrollDiv) => {
    scrollDiv.style.cursor = 'grab'
  })
}

scrollColDivs.forEach((scrollDiv) => {
  scrollDiv.addEventListener('mousemove', (e) => {
    e.preventDefault()
    if (!mouseDown) {
      return null
    }

    const x = e.pageX - scrollDiv.offsetLeft
    const scroll = x - startX

    scrollDiv.scrollLeft = scrollLeft - scroll
  })
})

scrollColDivs.forEach((scrollDiv) => {
  scrollDiv.addEventListener('mousedown', startDragging, false)
})

scrollColDivs.forEach((scrollDiv) => {
  scrollDiv.addEventListener('mouseup', stopDragging, false)
})

scrollColDivs.forEach((scrollDiv) => {
  scrollDiv.addEventListener('mouseleave', stopDragging, false)
})

// ----- Animations
// GSAP Animations
const tl = gsap.timeline({
  defaults: {
    duration: 1.5,
    ease: 'power3.out',
  },
})

tl.to('body', { overflow: 'hidden' })

tl.fromTo(
  '.launch-countdown-wrapper',
  { x: -1500, opacity: 0 },
  { x: 0, opacity: 1, delay: 1 },
  '<'
)

tl.fromTo(
  '.next-launch-wrapper',
  { x: 1500, opacity: 0 },
  { x: 0, opacity: 1 },
  '<'
)

tl.fromTo(
  '.upcoming-launches-wrapper',
  { y: 1500, opacity: 0 },
  { y: 0, opacity: 1 },
  '<'
)

tl.fromTo(
  '.past-launches-wrapper',
  { y: 1500, opacity: 0 },
  { y: 0, opacity: 1 },
  '<'
)

tl.to('body', { overflow: 'auto' })
