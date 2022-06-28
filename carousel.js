"use strict";
let curSlide = 0;
let maxSlide = document.querySelectorAll(".slide").length - 1;
const slider = document.querySelectorAll(".slider")[0];
const nextSlide = document.querySelector(".btn-next");
const prevSlide = document.querySelector(".btn-prev");
const indicatorContainer = document.querySelector('.carousel-indicators');
const indicatorButtons = [];

const slideMove = Object.freeze({
  LEFT: "left",
  RIGHT: "right",
});

function updateCurrentSlide(move, allowRewind=false) {
  if (move == slideMove.LEFT) {
    if (curSlide === 0) {
      if (allowRewind) {
        curSlide = maxSlide;
      } else {
        return;
      }
    } else {
      curSlide--;
    }
  } else if (move == slideMove.RIGHT) {
    if (curSlide === maxSlide) {
      if (allowRewind) {
        curSlide = 0;
      } else {
        return;
      }
    } else {
      curSlide++;
    }
  }
}

function repositionSlides(curSlide) {
  // loop through slides and set each slides translateX
  // (to basically set which one is visible)
  document.querySelectorAll(".slide").forEach((slide, indx) => {
    slide.style.transform = `translateX(${100 * (indx - curSlide)}%)`;
  });
}

// DESKTOP LOGIC FOR SLIDES
nextSlide.addEventListener("click", function () {
  updateCurrentSlide(slideMove.RIGHT, true);
  repositionSlides(curSlide);
  updateIndicators();
});
prevSlide.addEventListener("click", function () {
  updateCurrentSlide(slideMove.LEFT, true);
  repositionSlides(curSlide);
  updateIndicators();
});

// keyboard arrows sliding
document.addEventListener("keydown", function (e) {
  if (!e.repeat) {
    if (e.key == "ArrowLeft") {
      updateCurrentSlide(slideMove.LEFT);
    } else if (e.key == "ArrowRight") {
      updateCurrentSlide(slideMove.RIGHT);
    }
  }
  repositionSlides(curSlide);
  updateIndicators();
});

// MOBILE LOGIC FOR SLIDES
slider.addEventListener('touchstart', handleTouchStart, false);
slider.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;
var yDown = null;

function getTouches(evt) {
  return evt.touches ||             // browser API
    evt.originalEvent.touches; // jQuery
}

function handleTouchStart(evt) {
  const firstTouch = getTouches(evt)[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
};

function handleTouchMove(evt) {
  if (!xDown || !yDown) {
    return;
  }

  var xUp = evt.touches[0].clientX;
  var yUp = evt.touches[0].clientY;

  var xDiff = xDown - xUp;
  var yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff > 0) {
      /* right swipe */
      updateCurrentSlide(slideMove.RIGHT);
    } else {
      /* left swipe */
      updateCurrentSlide(slideMove.LEFT);
    }
    repositionSlides(curSlide);
    updateIndicators();
  }
  /* reset values */
  xDown = null;
  yDown = null;
};

// carousel indicators logic
function setIndicators() {
  if (indicatorContainer !== null) {
    for (let i = 0; i <= maxSlide; i++) {
      const button = document.createElement('button');
      button.setAttribute('type', 'button');
      button.setAttribute('btindex', i);
      indicatorContainer.appendChild(button);
      indicatorButtons.push(button);
    }

    indicatorButtons[0].classList.add('current-indicator');

    horizontallyPositionCarouselIndicators();
  }
}

function horizontallyPositionCarouselIndicators() {
  // horizontal center positioning
  const sliderWidth = document.getElementsByClassName('slider')[0].offsetWidth;
  const halfIndicatorWidthPlusMargin = 8;
  const leftPosition = (sliderWidth / 2) - ((maxSlide + 1) * halfIndicatorWidthPlusMargin);
  indicatorContainer.style.left = `${leftPosition}px`;
}

function updateIndicators() {
  indicatorButtons.forEach(function (element, index) {

    if (index === curSlide) {
      element.classList.add('current-indicator');
      element.setAttribute('aria-current', true);
    } else {
      element.classList.remove('current-indicator');
      element.removeAttribute('aria-current');
    }

  });
}

// added to account screen rotation on mobile
window.addEventListener('resize', function (event) {
  horizontallyPositionCarouselIndicators();
});


window.onload = function (event) {
  repositionSlides(curSlide);
  setIndicators();
};
