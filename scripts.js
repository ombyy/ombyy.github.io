document.addEventListener('DOMContentLoaded', () => {
    function createNavbar() {
        const navbar = document.createElement('nav');
        navbar.classList.add('navbar');

        const ul = document.createElement('ul');

        const links = [
            { name: 'Home', href: '/index.html' },
            { name: 'About', href: '/about.html' },
            { name: 'Contact', href: '/contact.html' },
            { name: 'Projects', href: '/projects.html' }
        ];

        links.forEach(link => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.textContent = link.name;
            a.href = link.href;
            li.appendChild(a);
            ul.appendChild(li);
        });

        navbar.appendChild(ul);
        document.body.appendChild(navbar);

        setActiveLink();
    }

    function setActiveLink() {
        const currentPath = window.location.pathname;
        const links = document.querySelectorAll('.navbar a');

        links.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });
    }

    function addVideoBackground() {
        const videoBackground = document.createElement('div');
        videoBackground.classList.add('video-background');

        const video = document.createElement('video');
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.id = 'bg-video';

        const source = document.createElement('source');
        source.src = 'img/img_website/background1.mp4';
        source.type = 'video/mp4';

        video.appendChild(source);
        videoBackground.appendChild(video);
        document.body.appendChild(videoBackground);
    }

    addVideoBackground();
    createNavbar();
    
    function scrambleText(selector, phrases) {
        const el = document.querySelector(selector);
        if (!el) return;

        const chars = '!<>-_\\/[]{}—=+*^?#________';
        let frame = 0;
        let queue = [];
        let resolve;
        let frameRequest;

        function setText(newText) {
            const oldText = el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise(res => resolve = res);
            queue = [];
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                queue.push({ from, to, start, end });
            }
            cancelAnimationFrame(frameRequest);
            frame = 0;
            update();
            return promise;
        }

        function update() {
            let output = '';
            let complete = 0;
            for (let i = 0, n = queue.length; i < n; i++) {
                let { from, to, start, end, char } = queue[i];
                if (frame >= end) {
                    complete++;
                    output += to;
                } else if (frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = randomChar();
                        queue[i].char = char;
                    }
                    output += `<span class="dud">${char}</span>`;
                } else {
                    output += from;
                }
            }
            el.innerHTML = output;
            if (complete === queue.length) {
                resolve();
            } else {
                frameRequest = requestAnimationFrame(update);
                frame++;
            }
        }

        function randomChar() {
            return chars[Math.floor(Math.random() * chars.length)];
        }

        let counter = 0;
        const next = () => {
            setText(phrases[counter]).then(() => {
                setTimeout(next, 4000);
            });
            counter = (counter + 1) % phrases.length;
        };

        next();
    }

    const phrases = [
        'Hey!, my name is George Sorrell', 'Welcome to my portfolio', 
        'I am a full stack web developer', 'Below are languages and frameworks I have experience with', 
    ];
    scrambleText('.intro', phrases);
});

