const checkbox = document.querySelector('.checkbox'),
    container = document.querySelector('.container');
let isRobot = true,
    chanceToBeHuman = 0,
    generationDelay = 5000;

const captcha = () => {
    checkbox.classList.remove('loading');
    checkbox.classList.add('captcha-open');

    generateFlower();
};

const generateFlower = () => {
    container.classList.remove('robot', 'human');
    document.querySelector('.try-again').classList.remove('show');

    const petals = document.querySelector('.petals'),
        petalSvgPath = `<path d="M 61.789062 12.421875 C 53.875 21.972656 45.90625 33.28125 40.3125 42.871094 C 33.210938 55.039062 28.964844 65.773438 27.882812 74.328125 C 27.246094 79.394531 27.585938 83.171875 29.171875 88.28125 C 30.371094 92.179688 32.15625 95.917969 34.523438 99.460938 C 36.085938 101.804688 37.460938 103.484375 39.492188 105.527344 C 42.53125 108.5625 45.078125 110.449219 48.535156 112.195312 C 52.257812 114.09375 55.851562 115.136719 60.253906 115.632812 C 61.609375 115.789062 65.488281 115.789062 66.894531 115.632812 C 75.117188 114.734375 82.0625 111.296875 87.988281 105.203125 C 93.445312 99.601562 97.421875 92.039062 99.023438 84.238281 C 99.695312 80.96875 99.695312 76.914062 99.023438 72.765625 C 96.757812 58.820312 86.25 39.132812 69.6875 17.820312 C 67.34375 14.796875 63.691406 10.351562 63.5625 10.351562 C 63.535156 10.351562 62.726562 11.289062 61.789062 12.421875 Z M 61.789062 12.421875 "/>`;
    let petalAmount = Math.floor(Math.random() * 3 + 2) * 2;

    if(isRobot) {
        if(Math.random() * 100 < chanceToBeHuman) {
            petalAmount += 1;
        }
    } else {
        if(Math.random() * 100 > chanceToBeHuman) {
            petalAmount += 1;
        }
    }

    chanceToBeHuman += 20;

    petals.innerHTML = '';

    for(let i = 0; i < petalAmount; i++) {
        const newPetal = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        
        newPetal.classList.add('petal');
        newPetal.innerHTML = petalSvgPath;
        newPetal.style.transform = `rotate(${i * (360 / petalAmount)}deg)`;
        newPetal.addEventListener('click', () => {
            if(newPetal.classList.contains('picked')) return;

            newPetal.classList.add('picked');
            changeRobotState();
        });

        petals.append(newPetal);
    }
};

const changeRobotState = () => {
    const rotate = Math.round(Math.random() * 1440 - 720),
        translateX = Math.round(Math.random() * 220 - 110),
        translateY = Math.round(Math.random() * 60 - 30);

    isRobot = !isRobot;

    document.querySelector('.not').classList.toggle('human', !isRobot);
    document.querySelector('.flower').style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg)`;

    if(document.querySelector('.petal:not(.picked)') === null) {
        if(!isRobot) {
            checkbox.classList.remove('captcha-open');
        } else {
            document.querySelector('.try-again').classList.add('show');
            
            generationProgress();
        }

        container.classList.toggle('robot', isRobot);
        container.classList.toggle('human', !isRobot);
    }
};

const generationProgress = () => {
    document.querySelector('.flower-container').classList.add('generating');

    let start;

    const frame = timestamp => {
        if(start === undefined) start = timestamp;

        const elapsed = timestamp - start,
            timeLeft = generationDelay - elapsed;
        
        if(timeLeft > 0) {
            document.querySelector('.wait .ms').innerText = Math.round(timeLeft);

            requestAnimationFrame(frame);
        } else {
            generationDelay *= 2;

            document.querySelector('.flower-container').classList.remove('generating');
            generateFlower();
        }
    };
    
    requestAnimationFrame(frame);
};

checkbox.addEventListener('click', function() {
    this.classList.add('loading');

    setTimeout(captcha, 2600);
});