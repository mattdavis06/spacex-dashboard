const bgImages = [
  '/img/img-1.jpg',
  '/img/img-2.jpg',
  '/img/img-3.jpg',
  '/img/img-4.jpg',
  '/img/img-5.jpg',
  '/img/img-6.jpg',
]

// Loads random bg from array or images
function randomBackground() {
  const body = document.body
  let randomBg = bgImages[Math.floor(Math.random() * bgImages.length)]
  body.style.backgroundImage = `-webkit-linear-gradient(linear, left bottom, left top, from(var(--bg-color-1)), to(var(--bg-color-2))), url(${randomBg})`
  body.style.backgroundImage = `-o-linear-gradient(bottom, linear-gradient(0deg, var(--bg-color-1)), var(--bg-color-2)), url(${randomBg})`
  body.style.backgroundImage = `linear-gradient(0deg, var(--bg-color-1), var(--bg-color-2)), url(${randomBg})`
}

window.addEventListener('load', randomBackground)

// Mobile menu functionality
const navMobileIcon = document.querySelector('.nav-mobile-icon')
const navMobileLinksEl = document.querySelector('.nav-mobile-links')
navMobileIcon.addEventListener('click', () => {
  navMobileIcon.classList.toggle('active')
  navMobileLinksEl.classList.toggle('active')
})

// Close mobile menu when link clicked
const navMobileLinks = document.querySelectorAll('.nav-mobile-links ul li a')
navMobileLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navMobileIcon.classList.toggle('active')
    navMobileLinksEl.classList.remove('active')
  })
})

// ---------------
// GSAP Animations
const navLinks = gsap.utils.toArray('.nav-link a')

// Animation for onClick NavLinks
function navLinkAnimation(navigationLinks) {
  navigationLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault()

      setTimeout(() => {
        const section = document.querySelector(link.getAttribute('href'))
        gsap.to(document.body, { scrollTo: section })
      }, 200)
    })
  })
}

// Calls both for desktop and mobile
navLinkAnimation(navLinks)
navLinkAnimation(navMobileLinks)

// Back to top btn, adds .active class on scroll trigger to show element
const backToTopBtn = document.querySelector('.back-to-top')
const scrollTo = gsap.timeline({
  scrollTrigger: {
    trigger: backToTopBtn,
    end: 'center -500px',
    toggleClass: 'active',
  },
})

// Back to top btn, onClick scroll back up to #header
backToTopBtn.addEventListener('click', () => {
  scrollTo.to(document.body, {
    duration: 1,
    ease: 'back.out',
    scrollTo: { y: '#header' },
  })
})

// ===== TO DO
// last 25 past launches, load more on slide **
// - convert to all GSAP animations
//  mobile testing
// check lighthouse report
// Mark up all comments!!
