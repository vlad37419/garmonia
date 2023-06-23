(() => {
    function setWidthScrollBar() {
        let div = document.createElement('div');

        div.style.position = 'absolute';
        div.style.overflowY = 'scroll';
        div.style.width = '50px';
        div.style.height = '50px';

        document.body.append(div);
        let scrollWidth = div.offsetWidth - div.clientWidth;

        div.remove();

        return scrollWidth;
    }

    function bodyLock(bool) {
        if (bool) {
            document.body.classList.add('lock');
        } else {
            document.body.classList.remove('lock');
        }
    }

    function initModalWorker() {
        const modalList = document.querySelectorAll('.modal');
        const modalWindow = document.querySelector('#modal-window');
        const modalButtons = document.querySelectorAll('.modal-button');
        const modalClosers = document.querySelectorAll('.modal-close');

        modalClosers.forEach((closer) => {
            closer.addEventListener('click', () => {
                const responseBlockList = document.querySelectorAll('.response-block');
                bodyLock(false);
                document.querySelector('html').style.paddingRight = 0;
                modalList.forEach(function (modal) {
                    modal.classList.remove('active');
                });
                responseBlockList.forEach(function (responseBlock) {
                    responseBlock.remove();
                });
                modalWindow.querySelectorAll('.form').forEach((form) => {
                    form.reset();
                });
            });
        });

        modalButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const target = button.dataset?.target || 'application';
                const title = button.dataset?.title || 'Заказать звонок';
                const additional = button.dataset?.additional || '';

                bodyLock(true);
                document.querySelector('html').style.paddingRight = setWidthScrollBar() + 'px';
                modalWindow.classList.add('active');
                modalWindow.querySelectorAll('.form').forEach((form) => {
                    if (form.getAttribute('data-target') === target) {
                        form.style.display = '';
                        form.querySelector('.form__title').innerText = title;

                        const addition = form.querySelector('.additional__field');
                        if (addition) {
                            addition.value = additional;
                        }
                    } else {
                        form.style.display = 'none';
                    }
                });
            });
        })
    }

    function initPhoneMask() {
        const phoneFields = document.querySelectorAll('.field-phone');
        const maskOptions = {
            mask: '+{7} (000) 000 00-00'
        };

        phoneFields.forEach((phoneField) => {
            IMask(phoneField, maskOptions);
        });
    }

    function hide(element) {
        element.style.pointerEvents = 'none';
        element.style.opacity = '0.3';
    }

    function show(element) {
        element.style.pointerEvents = '';
        element.style.opacity = '';
    }

    function checkCorrectField(field) {
        switch (field.name) {
            case 'f_name':
                const regex = new RegExp("^[а-яА-Я-ёЁ ]+$");
                if (!(field.value.match(regex))) {
                    field.style.border = '1px solid red';
                    setTimeout(() => {
                        field.style.border = '';
                    }, 3000);
                    return false;
                }
                return true;
            case 'f_comment':
                if (field.value.length === 0) {
                    field.style.border = '1px solid red';
                    setTimeout(() => {
                        field.style.border = '';
                    }, 3000);
                    return false;
                }
                return true;
            case 'f_age':
                if (field.value.border === 0) {
                    field.style.border = '1px solid red';
                    setTimeout(() => {
                        field.style.border = '';
                    }, 3000);
                    return false;
                }
                return true;
            case 'f_phone':
                if (field.value.length !== 18) {
                    field.style.border = '1px solid red';
                    setTimeout(() => {
                        field.style.border = '';
                    }, 3000);
                    return false;
                }
                return true;
            default:
                return true;
        }
    }

    function sendRequestToCall(event) {
        event.preventDefault();

        hide(event.target);

        let valid = true;
        const formData = new FormData();
        const fetchBody = {};

        Object.keys(event.target).forEach((key) => {
            const field = event.target[key];

            if (!checkCorrectField(field)) {
                valid = false;
            }

            if (field.name && field.value !== undefined) {
                fetchBody[field.name] = field.value;
                let flag = false;
                if (field.type !== 'radio') {
                    formData.append(field.name, field.value);
                } else {
                    if (field.checked === true) {
                        formData.append(field.name, field.value);
                        flag = true;
                    } else {
                        if (flag !== true) {
                            formData.append(field.name, '0');
                        }
                    }
                }
            }
        });

        if (valid) {
            show(event.target);
            fetch('/netcat/add.php', {
                method: 'POST',
                body: formData,
            }).then(async (response) => {
                try {
                    show(event.target);
                    let responseResult = await response.json();

                    if (event.target.getAttribute('data-target') === 'application-page') {
                        event.target.style.pointerEvents = 'none';
                        const popupResponce = document.querySelector('#modal-response');
                        const responseBlock = document.createElement('p');
                        responseBlock.classList.add('form__title');
                        responseBlock.classList.add('response-block');
                        responseBlock.style.marginBottom = 0;
                        responseBlock.innerHTML = responseResult.response;
                        popupResponce.querySelector('.modal__body').innerHTML = '<button class="modal__close modal-close"></button>';
                        popupResponce.querySelector('.modal__body').append(responseBlock);
                        popupResponce.classList.add('active');
                        bodyLock(true);
                        document.querySelector('html').style.paddingRight = setWidthScrollBar() + 'px';
                        event.target.reset();
                        initModalWorker();
                        event.target.style.pointerEvents = 'all';
                    } else {
                        const responseBlock = document.createElement('p');
                        responseBlock.classList.add('form__title');
                        responseBlock.classList.add('response-block');
                        responseBlock.style.marginBottom = 0;

                        responseBlock.innerHTML = responseResult.response;
                        event.target.before(responseBlock);

                        event.target.reset();
                        event.target.style.display = 'none';

                        setTimeout(() => {
                            responseBlock.remove();
                            event.target.style.display = '';
                        }, 3000);
                    }
                } catch (e) {
                    show(event.target);
                    alert('Возникла ошибка. Повторите попытку позже')
                }
            });
        } else {
            show(event.target);
        }
    }

    function initFormSender() {
        document.querySelectorAll('.form').forEach((form) => {
            form.addEventListener('submit', (event) => {
                sendRequestToCall(event);
            });
        });
    }

    function canUseWebp() {
        let isitFirefox = window.navigator.userAgent.match(/Firefox\/([0-9]+)\./);
        let firefoxVer = isitFirefox ? parseInt(isitFirefox[1]) : 0;
        if (firefoxVer == 0) {
            let elem = document.createElement('canvas');
            if (!!(elem.getContext && elem.getContext('2d'))) {
                return elem.toDataURL('image/webp').indexOf('data:image/webp') == 0;
            }
        } else {
            if (firefoxVer >= 65)
                return true;
        }
        return false;
    }

    function addLazy(selector) {
        let arra;
        if (typeof selector !== "undefined") {
            arra = selector.querySelectorAll(".lazy");
        } else {
            arra = document.querySelectorAll(".lazy");
        }

        var lazyloadImages;
        if ("IntersectionObserver" in window) {
            lazyloadImages = arra;
            var imageObserver = new IntersectionObserver(function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        let image = entry.target;
                        if (typeof image.dataset.background !== "undefined") {
                            if (window.localStorage.getItem("workWebp") && (typeof image.dataset.backgroundWebp !== "undefined")) {
                                image.style.backgroundImage = image.dataset.backgroundWebp;
                            } else {
                                image.style.backgroundImage = image.dataset.background;
                            }
                        }

                        if (typeof image.dataset.src !== "undefined") {
                            if (typeof image.dataset.webp !== "undefined" && window.localStorage.getItem("workWebp")) {
                                image.src = image.dataset.webp;
                            } else {
                                image.src = image.dataset.src;
                            }
                        }

                        if (typeof image.dataset.srcVideo !== "undefined") {
                            image.src = image.dataset.srcVideo;
                        }

                        image.onload = function () {
                            if (this.width + this.height == 0) {
                                this.onerror();
                                return;
                            }
                            image.style.transform = "scale(1)"
                        }
                        image.onerror = function () {
                            console.log("Фотография не загружена. Ссылка:\n")
                            console.log(image)
                        }

                        image.classList.remove("lazy");
                        imageObserver.unobserve(image);

                    }
                });
            });

            lazyloadImages.forEach(function (image) {
                imageObserver.observe(image);
                if (typeof image.dataset.src !== "undefined") {
                    image.style.transform = "scale(0)";
                    image.style.transition = "transform .2s";
                }
            });
        } else {
            var lazyloadThrottleTimeout;
            lazyloadImages = arra;

            function lazyload() {
                if (lazyloadThrottleTimeout) {
                    clearTimeout(lazyloadThrottleTimeout);
                }

                lazyloadThrottleTimeout = setTimeout(function () {
                    var scrollTop = window.pageYOffset;
                    lazyloadImages.forEach(function (img) {
                        if (img.offsetTop < (window.innerHeight + scrollTop)) {
                            if (typeof image.dataset.background !== "undefined") {
                                if (window.localStorage.getItem("workWebp") && (typeof image.dataset.backgroundWebp !== "undefined")) {
                                    image.style.backgroundImage = image.dataset.backgroundWebp;
                                } else {
                                    image.style.backgroundImage = image.dataset.background;
                                }
                            }

                            if (typeof image.dataset.src !== "undefined") {
                                if (typeof image.dataset.webp !== "undefined" && window.localStorage.getItem("workWebp")) {
                                    image.src = image.dataset.webp;
                                } else {
                                    image.src = image.dataset.src;
                                }
                            }

                            if (typeof image.dataset.srcVideo !== "undefined") {
                                image.src = image.dataset.srcVideo;
                            }

                            image.onload = function () {
                                if (this.width + this.height == 0) {
                                    this.onerror();
                                    return;
                                }
                                image.style.transform = "scale(1)"
                            }
                            image.onerror = function () {
                                console.log("Фотография не загружена. Ссылка:\n")
                                console.log(image)
                            }

                            image.classList.remove("lazy");
                        }
                    });
                    if (lazyloadImages.length == 0) {
                        document.removeEventListener("scroll", lazyload);
                        window.removeEventListener("resize", lazyload);
                        window.removeEventListener("orientationChange", lazyload);
                    }
                }, 20);
            }

            document.addEventListener("scroll", lazyload);
            window.addEventListener("resize", lazyload);
            window.addEventListener("orientationChange", lazyload);
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        if (window.localStorage.getItem("workWebp") === null) {
            window.localStorage.setItem("workWebp", canUseWebp());
        }
        addLazy();

        const body = document.querySelector('.body');

        // dropdown menu
        const menuBtns = document.querySelectorAll('button.menu__link');
        const menuSubBtns = document.querySelectorAll('button.menu__sub-link');

        if (menuBtns.length > 0) {
            menuBtns.forEach(function (menuBtn) {
                menuBtn.addEventListener('click', function () {
                    menuSubBtns.forEach(el => {
                        el.closest('.menu__sub-item').classList.remove('active');
                    });
                    menuBtns.forEach(el => {
                        if (el != this) {
                            el.closest('.menu__item').classList.remove('active');
                        }
                    });
                    menuBtn.closest('.menu__item').classList.toggle('active');
                });

                window.addEventListener('click', function (e) {
                    const target = e.target;
                    if (!target.closest('.menu__item')) {
                        menuBtn.classList.remove('active');
                    }
                });
            });
        }

        if (menuSubBtns.length > 0) {
            menuSubBtns.forEach(function (menuBtn) {
                menuBtn.addEventListener('click', function () {
                    menuSubBtns.forEach(el => {
                        if (el != this) {
                            el.closest('.menu__sub-item').classList.remove('active');
                        }
                    });
                    menuBtn.closest('.menu__sub-item').classList.add('active');
                });
            });
        }

        window.addEventListener('click', function (e) {
            const target = e.target;

            if (!target.closest('.menu__sub-item')) {
                menuSubBtns.forEach(el => {
                    el.closest('.menu__sub-item').classList.remove('active');
                });
            }

            if (!target.closest('.menu__item')) {
                menuBtns.forEach(el => {
                    el.closest('.menu__item').classList.remove('active');
                });
            }
        });

        // documents slider
        const documentsSliderCheck = document.querySelectorAll('.documents__slider');

        if (documentsSliderCheck.length > 0) {
            const documentsSlider = new Swiper('.documents__slider', {
                spaceBetween: 30,
                slidesPerView: 4,
                touchRatio: 0,
                breakpoints: {
                    0: {
                        slidesPerView: 2,
                        spaceBetween: 10,
                        touchRatio: 1,
                    },
                    767: {
                        slidesPerView: 3,
                        spaceBetween: 10,
                        touchRatio: 1,
                    },
                    1025: {
                        slidesPerView: 4,
                        spaceBetween: 10,
                        touchRatio: 0,
                    },
                    1400: {
                        spaceBetween: 30,
                        slidesPerView: 4,
                        touchRatio: 0,
                    },
                },
                pagination: {
                    el: '.documents__slider-pagination',
                    type: 'bullets',
                    clickable: true,
                },
            });
        }

        // specialists slider
        const specialistsSliderCheck = document.querySelectorAll('.specialists__slider');

        if (specialistsSliderCheck.length > 0) {
            const specialistsSlider = new Swiper('.specialists__slider', {
                spaceBetween: 30,
                slidesPerView: 3,
                touchRatio: 0,
                breakpoints: {
                    0: {
                        slidesPerView: 1,
                        spaceBetween: 10,
                        touchRatio: 1,
                    },

                    575: {
                        slidesPerView: 2,
                        spaceBetween: 10,
                        touchRatio: 1,
                    },
                    767: {
                        slidesPerView: 3,
                        spaceBetween: 10,
                        touchRatio: 1,
                    },
                    1025: {
                        slidesPerView: 3,
                        spaceBetween: 10,
                        touchRatio: 0,
                    },
                    1400: {
                        spaceBetween: 30,
                        slidesPerView: 3,
                        touchRatio: 0,
                    },
                },
                pagination: {
                    el: '.specialists__slider-pagination',
                    type: 'bullets',
                    clickable: true,
                },
            });
        }

        // gallery slider
        const gallerySliderCheck = document.querySelectorAll('.gallery__slider');

        if (gallerySliderCheck.length > 0) {
            const gallerySlider = new Swiper('.gallery__slider', {
                spaceBetween: 30,
                slidesPerView: 3,
                touchRatio: 0,
                grid: {
                    rows: 2,
                },
                breakpoints: {
                    0: {
                        slidesPerView: 1,
                        spaceBetween: 10,
                        touchRatio: 1,
                        grid: {
                            rows: 1,
                        },
                    },

                    575: {
                        slidesPerView: 2,
                        spaceBetween: 10,
                        touchRatio: 1,
                        grid: {
                            rows: 1,
                        },
                    },
                    767: {
                        slidesPerView: 3,
                        spaceBetween: 10,
                        touchRatio: 1,
                        grid: {
                            rows: 1,
                        },
                    },
                    1025: {
                        slidesPerView: 3,
                        spaceBetween: 10,
                        touchRatio: 0,
                        grid: {
                            rows: 2,
                        },
                    },
                    1400: {
                        spaceBetween: 30,
                        slidesPerView: 3,
                        touchRatio: 0,
                        grid: {
                            rows: 2,
                        },
                    },
                },
                pagination: {
                    el: '.gallery__slider-pagination',
                    type: 'bullets',
                    clickable: true,
                },
            });
        }

        // reviews slider
        const reviewsSliderCheck = document.querySelectorAll('.reviews__slider');

        if (reviewsSliderCheck.length > 0) {
            const reviewsSlider = new Swiper('.reviews__slider', {
                spaceBetween: 90,
                slidesPerView: 3,
                touchRatio: 0,
                breakpoints: {
                    0: {
                        slidesPerView: 1,
                        spaceBetween: 10,
                        touchRatio: 1,
                        autoHeight: true,
                    },

                    575: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                        touchRatio: 1,
                    },
                    767: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                        touchRatio: 1,
                    },
                    1025: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                        touchRatio: 0,
                    },
                    1400: {
                        spaceBetween: 90,
                        slidesPerView: 3,
                        touchRatio: 0,
                    },
                },
                pagination: {
                    el: '.reviews__slider-pagination',
                    type: 'bullets',
                    clickable: true,
                },
            });
        }

        // accordion
        const ACCORDION_LIST = 'data-accordion-list'
        const ACCORDION_BUTTON = 'data-accordion-button'
        const ACCORDION_ARROW = 'data-accordion-arrow'
        const ACCORDION_CONTENT = 'data-accordion-content'
        const SECTION_OPENED = 'active'
        const ICON_ROTATED = 'rotated'

        class Accordion {
            static apply(accordionNode) {
                if (!accordionNode) {
                    return
                }

                const acc = new Accordion()
                acc.accordion = accordionNode
                accordionNode.onclick = acc.onClick.bind(acc)
            }

            handleClick(button) {
                const innerSection = button.nextElementSibling
                const isOpened = innerSection.classList.contains(SECTION_OPENED)

                if (isOpened) {
                    this.close(innerSection)
                    return
                }
                this.open(innerSection)
            }

            open(section) {
                const accordion = section.querySelector(`[${ACCORDION_CONTENT}`).closest('.accor');
                const accordionContent = section.querySelector(`[${ACCORDION_CONTENT}`)
                const accordionList = accordionContent.querySelector(`[${ACCORDION_LIST}`)
                const innerSectionHeight = accordionContent.clientHeight
                let countOfScrollHeight = 0;
                const allElementContentData = section.querySelectorAll(`[${ACCORDION_CONTENT}`)
                accordion.classList.add(SECTION_OPENED)
                section.classList.add(SECTION_OPENED)
                this.rotateIconFor(section.previousElementSibling)

                for (const item of allElementContentData) {
                    countOfScrollHeight = countOfScrollHeight + item.scrollHeight;
                }

                if (accordionContent.contains(accordionList)) {
                    section.style.maxHeight = `${innerSectionHeight + countOfScrollHeight}px`
                    return
                }
                section.style.maxHeight = `${innerSectionHeight}px`
            }

            close(section) {
                const accordion = section.querySelector(`[${ACCORDION_CONTENT}`).closest('.accor');
                section.style.maxHeight = 0
                accordion.classList.remove(SECTION_OPENED)
                section.classList.remove(SECTION_OPENED)
                this.rotateIconFor(section.previousElementSibling)
            }

            rotateIconFor(button) {
                const rotatedIconClass = ICON_ROTATED
                const arrowElement = button.dataset.hasOwnProperty('accordionArrow') ?
                    button :
                    button.querySelector(`[${ACCORDION_ARROW}]`)

                if (!arrowElement) {
                    return
                }

                const isOpened = arrowElement.classList.contains(rotatedIconClass)
                if (!isOpened) {
                    arrowElement.classList.add(rotatedIconClass)
                    return
                }
                arrowElement.classList.remove(rotatedIconClass)
            }

            onClick(event) {
                let button = event.target.closest(`[${ACCORDION_BUTTON}]`)
                if (button && button.dataset.accordionButton !== undefined) {
                    this.handleClick(button)
                }
            }
        }

        const accorWrapperList = document.querySelectorAll('.accor-wrapper');

        if (accorWrapperList.length > 0) {
            accorWrapperList.forEach(function (elem) {
                if (elem.querySelector('.accor-open')) {
                    Accordion.apply(elem);
                    elem.querySelector('.accor-open').click();
                }
            });
        }

        // articles slider
        const articlesSliderCheck = document.querySelectorAll('.articles__slider');

        if (articlesSliderCheck.length > 0) {
            const articlesSlider = new Swiper('.articles__slider', {
                spaceBetween: 60,
                slidesPerView: 3,
                touchRatio: 0,
                breakpoints: {
                    0: {
                        slidesPerView: 1,
                        spaceBetween: 10,
                        touchRatio: 1,
                        autoHeight: true,
                    },

                    575: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                        touchRatio: 1,
                    },
                    767: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                        touchRatio: 1,
                    },
                    1025: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                        touchRatio: 0,
                    },
                    1400: {
                        spaceBetween: 60,
                        slidesPerView: 3,
                        touchRatio: 0,
                    },
                },
                pagination: {
                    el: '.articles__slider-pagination',
                    type: 'bullets',
                    clickable: true,
                },
            });
        }

        // header menu mobile
        let headerMenuButton = document.querySelector('.menu-burger');
        let headerMenu = document.querySelector('.mobile-menu');

        headerMenuButton.addEventListener('click', function () {
            headerMenuButton.classList.toggle('active');
            headerMenu.classList.toggle('active');
            if (headerMenu.classList.contains('active')) {
                body.classList.add('lock');
            } else {
                body.classList.remove('lock');
            }
        });

        // more text
        let windowWidth = document.body.clientWidth;
        const moreBtnsList = document.querySelectorAll('.more-text-btn');
        const moreTextList = document.querySelectorAll('.more-text');

        if (windowWidth <= 575) {
            if (moreTextList.length > 0) {
                moreTextList.forEach(function (moreText) {
                    const textWrapper = moreText.querySelector('.more-text-wrapper');
                    const textContent = moreText.querySelector('.more-text-content');
                    const heightTextContent = getHeight(textContent);
                    const btnMore = moreText.querySelector('.more-text-btn');

                    if (heightTextContent <= 140) {
                        btnMore.style.display = 'none';
                        textWrapper.style.height = 'auto';
                    } else {
                        btnMore.style.display = 'flex';
                        textWrapper.style.height = 140 + 'px';
                        btnMore.textContent = 'Показать полностью';
                    }
                });
            }
        } else {
            if (moreTextList.length > 0) {
                moreTextList.forEach(function (moreText) {
                    const textWrapper = moreText.querySelector('.more-text-wrapper');
                    const btnMore = moreText.querySelector('.more-text-btn');

                    btnMore.style.display = 'none';
                    textWrapper.style.height = 'auto';
                });
            }
        }

        window.addEventListener('resize', () => {
            if (windowWidth != document.body.clientWidth) {
                setBlockMinHeight('.doctor-page__picture', '.doctor-page');
                setBlockMinHeight('.article-detail__author', '.article-detail__wrapper');
                if (document.body.clientWidth <= 575) {
                    if (moreTextList.length > 0) {
                        moreTextList.forEach(function (moreText) {
                            const textWrapper = moreText.querySelector('.more-text-wrapper');
                            const textContent = moreText.querySelector('.more-text-content');
                            const heightTextContent = getHeight(textContent);
                            const btnMore = moreText.querySelector('.more-text-btn');

                            if (heightTextContent <= 140) {
                                btnMore.style.display = 'none';
                                textWrapper.style.height = 'auto';
                            } else {
                                btnMore.style.display = 'flex';
                                textWrapper.style.height = 140 + 'px';
                                btnMore.textContent = 'Показать полностью';
                            }
                        });
                    }
                } else {
                    if (moreTextList.length > 0) {
                        moreTextList.forEach(function (moreText) {
                            const textWrapper = moreText.querySelector('.more-text-wrapper');
                            const btnMore = moreText.querySelector('.more-text-btn');

                            btnMore.style.display = 'none';
                            textWrapper.style.height = 'auto';
                        });
                    }
                }
                windowWidth = document.body.clientWidth;
            }
        });

        if (moreBtnsList.length > 0) {
            moreBtnsList.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    const textWrapper = btn.closest('.more-text').querySelector('.more-text-wrapper');
                    const textContent = btn.closest('.more-text').querySelector('.more-text-content');
                    const heightTextWrapper = getHeight(textWrapper);
                    const heightTextContent = getHeight(textContent);
                    if (heightTextContent > heightTextWrapper) {
                        textWrapper.style.height = heightTextContent + 'px';
                        btn.textContent = 'Скрыть';
                    } else {
                        textWrapper.style.height = 140 + 'px';
                        btn.textContent = 'Показать полностью';
                    }
                });
            })
        }

        Fancybox.bind('[data-fancybox="documents"]', {
            placeFocusBack: false,
        });

        const articleNavigation = document.querySelector('.article-navigation');

        if (articleNavigation) {
            const jsScrollBlockList = document.querySelectorAll('.article-navigation ~ section h2');

            if (jsScrollBlockList.length > 0) {
                for (let i = 0; i < jsScrollBlockList.length; i += 1) {
                    const jsScrollBlock = jsScrollBlockList[i];
                    const titleBlock = jsScrollBlock.textContent;
                    const articleNavigationList = document.querySelector('.article-navigation__list');
                    const articleNavigationItem = document.createElement('li');
                    const articleNavigationLink = document.createElement('a');
                    articleNavigationItem.classList.add('article-navigation__item');
                    articleNavigationLink.classList.add('article-navigation__link');
                    jsScrollBlock.setAttribute('id', `${i}`)
                    articleNavigationLink.setAttribute('href', `#${i}`);
                    articleNavigationLink.textContent = titleBlock;
                    articleNavigationItem.append(articleNavigationLink);
                    articleNavigationList.append(articleNavigationItem);
                }

                document.querySelectorAll('a[href^="#"').forEach(link => {

                    link.addEventListener('click', function (e) {
                        e.preventDefault();

                        let href = this.getAttribute('href').substring(1);

                        const scrollTarget = document.getElementById(href);

                        // const topOffset = document.querySelector('.scrollto').offsetHeight;
                        const topOffset = 80;
                        const elementPosition = scrollTarget.getBoundingClientRect().top;
                        const offsetPosition = elementPosition - topOffset;

                        window.scrollBy({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    });
                });
            }
        }


        // rating
        const ratings = document.querySelectorAll('.rating');
        let articleID = '';
        if (document.querySelector('[name="f_id_article"]')) {
            articleID = document.querySelector('[name="f_id_article"]').value;
        }

        if (ratings.length > 0) {
            initRatings();
        }

        function initRatings() {
            let ratingActive, ratingValue;

            for (let i = 0; i < ratings.length; i += 1) {
                const rating = ratings[i];
                initRating(rating);
            }
        }

        function initRating(rating) {
            initRatingVars(rating);

            setRatingActiveWidth();

            if (rating.classList.contains('rating__set')) {
                setRating(rating);
            }
        }

        function initRatingVars(rating) {
            ratingActive = rating.querySelector('.rating__active');
            ratingValue = rating.querySelector('.rating__value');
        }

        function setRatingActiveWidth(index = ratingValue.innerHTML) {
            const ratingActiveWidth = index / 0.05;
            ratingActive.style.width = `${ratingActiveWidth}%`;
        }

        function setRating(rating) {
            const ratingItems = rating.querySelectorAll('.rating__item');

            for (let i = 0; i < ratingItems.length; i += 1) {
                const ratingItem = ratingItems[i];

                ratingItem.addEventListener('mouseenter', (e) => {
                    initRatingVars(rating);

                    setRatingActiveWidth(ratingItem.value);
                });

                ratingItem.addEventListener('mouseleave', (e) => {
                    setRatingActiveWidth();
                });

                ratingItem.addEventListener('click', (e) => {
                    ratingItems.forEach((elem) => {
                        elem.style.pointerEvents = 'all';
                    });
                    ratingItem.style.pointerEvents = 'none';
                    initRatingVars(rating);

                    ratingValue.innerHTML = i + 1;
                    setRatingActiveWidth();

                    $.ajax({
                        url: '/ajax/',
                        type: "POST",
                        dataType: "html",
                        data: {
                            "ID_ARTICLE": articleID,
                            "RATING": ratingValue.innerHTML,
                        },
                        success: function (response) {
                        },
                        error: function (response) {
                            console.log(response);
                        }
                    });
                });
            }
        }

        const btnUp = {
            el: document.querySelector('.btn-to-top'),
            scrolling: false,
            show() {
                if (this.el.classList.contains('btn-to-top_hide') && !this.el.classList.contains('btn-to-top_hiding')) {
                    this.el.classList.remove('btn-to-top_hide');
                    this.el.classList.add('btn-to-top_hiding');
                    window.setTimeout(() => {
                        this.el.classList.remove('btn-to-top_hiding');
                    }, 300);
                }
            },
            hide() {
                if (!this.el.classList.contains('btn-to-top_hide') && !this.el.classList.contains('btn-to-top_hiding')) {
                    this.el.classList.add('btn-to-top_hiding');
                    window.setTimeout(() => {
                        this.el.classList.add('btn-to-top_hide');
                        this.el.classList.remove('btn-to-top_hiding');
                    }, 300);
                }
            },
            addEventListener() {
                window.addEventListener('scroll', () => {
                    const scrollY = window.scrollY || document.documentElement.scrollTop;
                    if (this.scrolling && scrollY > 0) {
                        return;
                    }
                    this.scrolling = false;
                    if (scrollY > 400) {
                        this.show();
                    } else {
                        this.hide();
                    }
                });
                document.querySelector('.btn-to-top').onclick = () => {
                    this.scrolling = true;
                    this.hide();
                    window.scrollTo({
                        top: 0,
                        left: 0,
                        behavior: 'smooth'
                    });
                }
            }
        }

        btnUp.addEventListener();
        initPhoneMask();
        initModalWorker();
        initFormSender();
    });
})();