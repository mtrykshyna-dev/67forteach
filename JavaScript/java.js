const slider = document.querySelector('.slider');

function nextSlide(container, selector, step) {
    const slides = container.querySelectorAll(selector);
    if (slides.length === 0) {
        return;
    }

    const activeIndex = Array.from(slides).findIndex(function (slide) {
        return slide.classList.contains('active');
    });
    const nextIndex = (activeIndex + (step || 1) + slides.length) % slides.length;

    if (activeIndex !== -1) {
        slides[activeIndex].classList.remove('active');
    }
    slides[nextIndex].classList.add('active');
    updateDots(container, nextIndex);
}

function addDots(container, selector) {
    const slides = container.querySelectorAll(selector);
    const dots = document.createElement('div');
    dots.className = 'slider-dots';
    slides.forEach(function (slide, i) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', 'Слайд ' + (i + 1));
        if (slide.classList.contains('active')) dot.classList.add('active');
        dot.addEventListener('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            slides.forEach(function (s) { s.classList.remove('active'); });
            slides[i].classList.add('active');
            updateDots(container, i);
        });
        dots.appendChild(dot);
    });
    container.after(dots);
    container._dots = dots;
}

function updateDots(container, index) {
    if (!container._dots) return;
    container._dots.querySelectorAll('button').forEach(function (d, i) {
        d.classList.toggle('active', i === index);
    });
}

if (slider) {
    addDots(slider, '.slide');

    slider.addEventListener('click', function (event) {
        event.preventDefault();
        nextSlide(slider, '.slide', 1);
    });

    let paused = false;
    slider.addEventListener('mouseenter', function () { paused = true; });
    slider.addEventListener('mouseleave', function () { paused = false; });
    setInterval(function () {
        if (!paused) nextSlide(slider, '.slide', 1);
    }, 5000);
}

const hero = document.querySelector('.section_1');

if (hero && hero.querySelectorAll('.hero-slide').length > 1) {
    setInterval(function () {
        nextSlide(hero, '.hero-slide', 1);
    }, 6000);
}
