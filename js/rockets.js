// URL
const rocketsDataURL = 'https://api.spacexdata.com/v4/rockets'

// Get Rocket Data and calls createRocketDataObj
function getRocketsData() {
  fetch(rocketsDataURL)
    .then((res) => {
      if (res.ok) {
        return res.json()
      } else {
        return Promise.reject(res)
      }
    })
    .then((data) => {
      createRocketDataObj(data)
    })
    .catch((err) => {
      console.log(err)
    })
}

getRocketsData()

// ---------------------
// Creates Rocket Object
let rockets = []

function createRocketDataObj(rocketData) {
  for ({
    flickr_images,
    name,
    first_flight,
    height,
    mass,
    diameter,
    engines,
    description,
    first_stage,
    second_stage,
    active,
    cost_per_launch,
    success_rate_pct,
    wikipedia,
  } of rocketData) {
    rockets = {
      rocketImgs: flickr_images,
      rocketName: name,
      rocketFirstFlight: first_flight,
      rocketHeight: height,
      rocketMass: mass,
      rocketDiameter: diameter,
      rocketEngines: engines,
      rocketDescription: description,
      rocketFirstStage: first_stage,
      rocketSecondStage: second_stage,
      isRocketActive: active,
      costPerLaunch: cost_per_launch,
      rocketSuccessRate: success_rate_pct,
      rocketWikiPage: wikipedia,
    }
    createRocketEls(rockets)
  }
}

// ---------------------
// Creates Rocket Element
function createRocketEls(rockets) {
  const rocketCarouselWrapperEl = document.querySelector(
    '.rockets-carousel-wrapper'
  )

  const card = document.createElement('div')
  card.classList.add('card', 'carousel-card')
  card.innerHTML = `

          <div class="col">
            <div class="rocket-image">
              <img src="${rockets.rocketImgs[1]}" alt="rocket-image" />
            </div>
          </div>
          <div class="col">
            <div class="rocket-details-wrapper">
              <div class="rocket-details">
                <div class="rocket-name">
                  <small>Name:</small>
                  <h3>${rockets.rocketName}</h3>
                </div>
                <div class="first-flight">
                  <small>First Flight:</small>
                  <h3>${rockets.rocketFirstFlight
                    .split('-')
                    .reverse()
                    .join('/')}</h3>
                </div>
                <div class="rocket-height">
                  <small>Height:</small>
                  <h3><span>${rockets.rocketHeight.meters}</span>m / <span>${
    rockets.rocketHeight.feet
  }</span>ft</h3>
                </div>
                <div class="rocket-diameter">
                  <small>Diameter:</small>
                  <h3><span>${rockets.rocketDiameter.meters}</span>m / <span>${
    rockets.rocketDiameter.feet
  }</span>ft</h3>
                </div>
                <div class="rocket-mass">
                  <small>Mass:</small>
                  <h3><span>${rockets.rocketMass.kg.toLocaleString(
                    'en-US'
                  )}</span>kg / <span>${rockets.rocketMass.lb.toLocaleString(
    'en-US'
  )}</span>lb</h3>
                </div>
                <div class="engine-type">
                  <small>Engine Type:</small>
                  <h3>${rockets.rocketEngines.type}</h3>
                </div>
                <div class="num-of-engines">
                  <small>No. of Engines:</small>
                  <h3>${rockets.rocketEngines.number}</h3>
                </div>
                <div class="rocket-description">
                  <small>Details:</small>
                  <p>
                  ${rockets.rocketDescription}
                  </p>
                </div>
                <div class="rocket-first-stage">
                  <small>First Stage:</small>
                  <ul>
                    <li>
                      <small>Engines:</small>
                      <h4>${rockets.rocketFirstStage.engines}</h4>
                    </li>
                    <li>
                      <small>Fuel Amount:</small>
                      <h4><span>${
                        rockets.rocketFirstStage.fuel_amount_tons
                      }</span> tons</h4>
                    </li>
                    <li>
                      <small>Reusable:</small>
                      <h4>${
                        rockets.rocketFirstStage.reusable === true
                          ? 'Yes'
                          : 'No'
                      }</h4>
                    </li>
                  </ul>
                </div>
                <div class="rocket-second-stage">
                  <small>Second Stage:</small>
                  <ul>
                    <li>
                      <small>Engines:</small>
                      <h4>${rockets.rocketSecondStage.engines}</h4>
                    </li>
                    <li>
                      <small>Fuel Amount:</small>
                      <h4><span>${
                        rockets.rocketSecondStage.fuel_amount_tons
                      }</span> tons</h4>
                    </li>
                    <li>
                      <small>Reusable:</small>
                      <h4>${
                        rockets.rocketSecondStage.reusable === true
                          ? 'Yes'
                          : 'No'
                      }</h4>
                    </li>
                  </ul>
                </div>
                <div class="currently-active">
                  <small>Currently Active:</small>
                  <h3>${rockets.isRocketActive === true ? 'Yes' : 'No'}</h3>
                </div>
                <div class="cost-per-launch">
                  <small>Cost per launch:</small>
                  <h3>$<span>${rockets.costPerLaunch.toLocaleString(
                    'en-US'
                  )}</span></h3>
                </div>
                <div class="success-rate">
                  <small>Launch Success Rate:</small>
                  <h3><span>${rockets.rocketSuccessRate}</span>%</h3>
                </div>
                <div class="wiki">
                  <small>Wikipedia Page:</small>
                  <a href="${
                    rockets.rocketWikiPage
                  }" target="_blank" aria-label="wiki-icon">
                    <i class="fa-brands fa-wikipedia-w"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

    `
  rocketCarouselWrapperEl.append(card)
}

// --------------
// Rocket Carousel
let carouselIdx = 0

function rocketCarousel(carouselIdx) {
  const prevBtn = document.querySelector('.prev-btn')
  const nextBtn = document.querySelector('.next-btn')
  const carouselCards = document.querySelectorAll('.carousel-card')

  prevBtn.addEventListener('click', () => {
    carouselIdx--

    if (carouselIdx < 0) {
      carouselIdx = carouselCards.length - 1
    }
    rocketCarouselCheck(carouselCards, carouselIdx)

    tl2.fromTo('.carousel-card', { opacity: 1, x: -2000 }, { opacity: 1, x: 0 })
  })

  nextBtn.addEventListener('click', () => {
    carouselIdx++

    if (carouselIdx >= carouselCards.length) {
      carouselIdx = 0
    }
    rocketCarouselCheck(carouselCards, carouselIdx)

    tl2.fromTo('.carousel-card', { opacity: 0, x: 2000 }, { opacity: 1, x: 0 })
  })
}

function rocketCarouselCheck(carouselCards, carouselIdx) {
  for (i = 0; i < carouselCards.length; i++) {
    carouselCards[i].style.display = 'none'
  }
  carouselCards[carouselIdx].style.display = 'flex'
}

setTimeout(() => {
  rocketCarousel(carouselIdx)
}, 250)

// ---------------
// GSAP Animations
const tl2 = gsap.timeline({
  defaults: {
    duration: 1,
    ease: 'power3.out',
  },
})
