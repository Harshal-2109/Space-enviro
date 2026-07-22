document.addEventListener('DOMContentLoaded', () => {

    const scrollTrack   = document.getElementById('scrollTrack');
    const scene3D        = document.getElementById('scene3D');
    const floorSelector   = document.getElementById('floorSelector');
    const cloudOverlay    = document.getElementById('cloudOverlay');

    const homeView        = document.getElementById('homeView');
    const detailView      = document.getElementById('detailView');
    const backBtn         = document.getElementById('backBtn');
    const contactBtn      = document.getElementById('contactBtn');
    const dynamicFloorTitle = document.getElementById('dynamicFloorTitle');

    const floorBtns = document.querySelectorAll('.floor-btn');

    /* ---------------------------------------------------
       1. SCROLL-DRIVEN 3D BUILDING REVEAL
       As the user scrolls through #scrollTrack, the building
       rotates from a tilted "flying in" state to flat/upright,
       then the floor selector fades in once it settles.
    --------------------------------------------------- */
    function updateScene() {
        if (!scrollTrack) return;

        const rect = scrollTrack.getBoundingClientRect();
        const trackHeight = scrollTrack.offsetHeight - window.innerHeight;

        // Progress: 0 when track just enters, 1 when fully scrolled past
        let progress = -rect.top / trackHeight;
        progress = Math.min(Math.max(progress, 0), 1);

        // Interpolate the transform values
        const rotateX = 45 - (45 * progress);      // 45deg -> 0deg
        const rotateZ = -10 + (10 * progress);      // -10deg -> 0deg
        const translateY = 200 - (200 * progress);  // 200px -> 0px
        const scale = 0.6 + (0.4 * progress);       // 0.6 -> 1

        scene3D.style.transform =
            `rotateX(${rotateX}deg) rotateZ(${rotateZ}deg) translateY(${translateY}px) scale(${scale})`;

        // Reveal the floor selector once the building has mostly settled
        if (progress > 0.85) {
            floorSelector.classList.add('active');
        } else {
            floorSelector.classList.remove('active');
        }
    }

    window.addEventListener('scroll', updateScene, { passive: true });
    window.addEventListener('resize', updateScene);
    updateScene();

    /* ---------------------------------------------------
       2. FLOOR SELECTION -> CLOUD TRANSITION -> DETAIL VIEW
    --------------------------------------------------- */
    const floorSpecs = {
        'Penthouse': {
            title: 'Penthouse Suite',
            tagline: 'Premium Panoramic Living Space',
            area: '3,250 Sq Ft',
            config: '4 BHK + Terrace',
            facing: 'East (Sunrise)'
        },
        'Floor 15-20': {
            title: 'Sky Residences',
            tagline: 'Elevated Living, Uninterrupted Views',
            area: '2,100 Sq Ft',
            config: '3 BHK',
            facing: 'North-East'
        },
        'Floor 10-14': {
            title: 'Mid-Rise Homes',
            tagline: 'Balanced Comfort & Connectivity',
            area: '1,850 Sq Ft',
            config: '3 BHK',
            facing: 'South-East'
        },
        'Floor 1-9': {
            title: 'Garden Level Residences',
            tagline: 'Close to Nature, Close to Everything',
            area: '1,600 Sq Ft',
            config: '2 BHK',
            facing: 'West'
        }
    };

    function populateDetailView(floorKey) {
        const spec = floorSpecs[floorKey] || floorSpecs['Penthouse'];

        if (dynamicFloorTitle) dynamicFloorTitle.textContent = spec.title;

        const taglineEl = detailView.querySelector('.detail-header p');
        if (taglineEl) taglineEl.textContent = spec.tagline;

        const specValues = detailView.querySelectorAll('.spec-value');
        if (specValues.length === 3) {
            specValues[0].textContent = spec.area;
            specValues[1].textContent = spec.config;
            specValues[2].textContent = spec.facing;
        }
    }

    function playCloudTransition(onMidpoint) {
        cloudOverlay.classList.add('engulf');

        // Swap views at roughly the peak of the "engulf" animation
        setTimeout(() => {
            onMidpoint();
        }, 600);

        // Clean up the overlay once the transition is done
        setTimeout(() => {
            cloudOverlay.classList.remove('engulf');
        }, 1300);
    }

    floorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const floorKey = btn.getAttribute('data-floor');

            playCloudTransition(() => {
                populateDetailView(floorKey);
                homeView.classList.remove('view-active');
                homeView.classList.add('view-hidden');
                detailView.classList.remove('view-hidden');
                detailView.classList.add('view-active');
                window.scrollTo(0, 0);
            });
        });
    });

    /* ---------------------------------------------------
       3. BACK BUTTON -> RETURN TO EXTERIOR VIEW
    --------------------------------------------------- */
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            playCloudTransition(() => {
                detailView.classList.remove('view-active');
                detailView.classList.add('view-hidden');
                homeView.classList.remove('view-hidden');
                homeView.classList.add('view-active');
                updateScene();
            });
        });
    }

    /* ---------------------------------------------------
       4. CONTACT BUTTON
    --------------------------------------------------- */
    if (contactBtn) {
        contactBtn.addEventListener('click', () => {
            alert('Thanks for your interest! Our team will reach out to you shortly.');
        });
    }
});
