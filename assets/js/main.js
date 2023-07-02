(() => {
    function getHeight(el) {
        if (el) {
            return el.offsetHeight;
        }
    }

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

    function menuOpen(menuSelector) {
        menuSelector.classList.toggle('active');
        document.body.classList.toggle('lock');
    }

    function menuClose(menuSelector) {
        menuSelector.classList.remove('active');
        document.body.classList.remove('lock');
    }

    function initPhoneMask() {
        const phoneFields = document.querySelectorAll('input[type="tel"]');
        const maskOptions = {
            mask: '+{7} (000) 000 00-00'
        };

        phoneFields.forEach((phoneField) => {
            IMask(phoneField, maskOptions);
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        const body = document.querySelector('.body');
        const header = document.querySelector('.header');

        // dropdown menu
        const menuBtns = document.querySelectorAll('button.menu__link');

        if (menuBtns.length > 0) {
            menuBtns.forEach(function (menuBtn) {
                menuBtn.addEventListener('click', function () {
                    if (window.innerWidth > 1024) {
                        menuBtns.forEach(el => {
                            if (el != this) {
                                el.closest('.menu__item').classList.remove('active');
                            }
                        });
                        menuBtn.closest('.menu__item').classList.toggle('active');
                    }
                });
                window.addEventListener('click', function (e) {
                    if (window.innerWidth > 1024) {
                        const target = e.target;
                        if (!target.closest('.menu__item')) {
                            menuBtn.classList.remove('active');
                        }
                    }
                });
            });
        }


        window.addEventListener('click', function (e) {
            const target = e.target;

            if (!target.closest('.menu__item')) {
                menuBtns.forEach(el => {
                    el.closest('.menu__item').classList.remove('active');
                });
            }
        });

        // Popups
        function popupClose(popupActive) {
            const formPopup = popupActive.querySelector('.form');
            if (formPopup) {
                formPopup.dataset.additional = "Неизвестная форма";
            }
            popupActive.classList.remove('open');
            document.body.classList.remove('lock');
            document.querySelector('html').style.paddingRight = 0;
            document.querySelectorAll('.padding-lock').forEach(function (elem) {
                elem.style.paddingRight = 0;
            });
        }

        const popupOpenBtns = document.querySelectorAll('.popup-btn');
        const popups = document.querySelectorAll('.popup');
        const closePopupBtns = document.querySelectorAll('.close-popup');

        closePopupBtns.forEach(function (el) {
            el.addEventListener('click', function (e) {
                popupClose(e.target.closest('.popup'));
            });
        });

        popupOpenBtns.forEach(function (el) {
            el.addEventListener('click', function (e) {
                const path = e.currentTarget.dataset.path;
                const currentPopup = document.querySelector(`[data-target="${path}"]`);
                const currentForm = currentPopup.querySelector('.form');

                popups.forEach(function (popup) {
                    popupClose(popup);
                    popup.addEventListener('click', function (e) {
                        if (!e.target.closest('.popup__content')) {
                            popupClose(e.target.closest('.popup'));
                        }
                    });
                });

                menuClose(header);

                if (currentForm) {
                    currentForm.dataset.additional = el.dataset.additional;
                }
                currentPopup.classList.add('open');
                document.body.classList.add('lock');
                document.querySelector('html').style.paddingRight = setWidthScrollBar() + 'px';
                document.querySelectorAll('.padding-lock').forEach(function (elem) {
                    elem.style.paddingRight = setWidthScrollBar() + 'px';
                });
            });
        });

        // mobile-menu
        const contraindications = document.querySelector('.contraindications');
        const headerTop = document.querySelector('.header__top');
        const headerBottom = document.querySelector('.header__bottom');
        const openMenuBtns = document.querySelectorAll('.open-menu');
        const closeMenuBtns = document.querySelectorAll('.close-menu');
        const menuList = document.querySelector('.menu__list');
        const menuSubList = document.querySelectorAll('.menu__sub-list');
        const menuItems = document.querySelectorAll('.menu__item-burger');
        const menuSubItemsAccor = document.querySelectorAll('.menu__sub-item_accor');
        const menuSubListWrapper = document.querySelectorAll('.menu__sub-list-wrapper');

        openMenuBtns.forEach(function (openMenuBtn) {
            openMenuBtn.addEventListener('click', function () {
                menuOpen(header);
            })
        });

        closeMenuBtns.forEach(function (closeMenuBtn) {
            closeMenuBtn.addEventListener('click', function () {
                menuClose(header);
            })
        });

        if (window.innerWidth <= 1024) {
            headerBottom.style.height = window.screen.height + contraindications.scrollHeight - headerTop.scrollHeight + 'px';
            headerBottom.style.paddingBottom = contraindications.scrollHeight + headerTop.scrollHeight + 150 + 'px';
            menuList.classList.add('accor-wrapper');
            menuList.setAttribute('data-accordion-list', '');
            for (let i = 0; i < menuSubList.length; i += 1) {
                menuSubList[i].setAttribute('data-accordion-list', '');
            }
            for (let i = 0; i < menuSubListWrapper.length; i += 1) {
                menuSubListWrapper[i].classList.add('accor-full');
                menuSubListWrapper[i].querySelector('.menu__sub-list').setAttribute('data-accordion-content', '');
                menuSubListWrapper[i].querySelector('.menu__sub-list').classList.add('accor-full-content');
            }
            for (let i = 0; i < menuItems.length; i += 1) {
                const menuItem = menuItems[i];
                menuItem.classList.add('accor');
            }
            for (let i = 0; i < menuSubItemsAccor.length; i += 1) {
                const menuSubItemAccor = menuSubItemsAccor[i];
                menuSubItemAccor.classList.add('accor');
            }
        } else {
            headerBottom.style.height = 'initial';
            headerBottom.style.paddingBottom = 'initial';
            menuList.classList.remove('accor-wrapper');
            menuList.removeAttribute('data-accordion-list', '');
            for (let i = 0; i < menuSubList.length; i += 1) {
                menuSubList[i].removeAttribute('data-accordion-list', '');
            }
            for (let i = 0; i < menuSubListWrapper.length; i += 1) {
                menuSubListWrapper[i].classList.remove('accor-full');
                menuSubListWrapper[i].querySelector('.menu__sub-list').removeAttribute('data-accordion-content', '');
                menuSubListWrapper[i].querySelector('.menu__sub-list').classList.remove('accor-full-content');
            }
            for (let i = 0; i < menuItems.length; i += 1) {
                const menuItem = menuItems[i];
                menuItem.classList.remove('accor');
            }
            for (let i = 0; i < menuSubItemsAccor.length; i += 1) {
                const menuSubItemAccor = menuSubItemsAccor[i];
                menuSubItemAccor.classList.remove('accor');
            }
        }

        window.addEventListener('resize', () => {
            if (window.innerWidth <= 1024) {
                headerBottom.style.height = window.screen.height + contraindications.scrollHeight - headerTop.scrollHeight + 'px';
                headerBottom.style.paddingBottom = contraindications.scrollHeight + headerTop.scrollHeight + 150 + 'px';
                menuList.classList.add('accor-wrapper');
                menuList.setAttribute('data-accordion-list', '');
                for (let i = 0; i < menuSubList.length; i += 1) {
                    menuSubList[i].setAttribute('data-accordion-list', '');
                }
                for (let i = 0; i < menuSubListWrapper.length; i += 1) {
                    menuSubListWrapper[i].classList.add('accor-full');
                    menuSubListWrapper[i].querySelector('.menu__sub-list').setAttribute('data-accordion-content', '');
                    menuSubListWrapper[i].querySelector('.menu__sub-list').classList.add('accor-full-content');
                }
                for (let i = 0; i < menuItems.length; i += 1) {
                    const menuItem = menuItems[i];
                    menuItem.classList.add('accor');
                }
                for (let i = 0; i < menuSubItemsAccor.length; i += 1) {
                    const menuSubItemAccor = menuSubItemsAccor[i];
                    menuSubItemAccor.classList.add('accor');
                }
            } else {
                headerBottom.style.height = 'initial';
                headerBottom.style.paddingBottom = 'initial';
                menuList.classList.remove('accor-wrapper');
                menuList.removeAttribute('data-accordion-list', '');
                for (let i = 0; i < menuSubList.length; i += 1) {
                    menuSubList[i].removeAttribute('data-accordion-list', '');
                }
                for (let i = 0; i < menuSubListWrapper.length; i += 1) {
                    menuSubListWrapper[i].classList.remove('accor-full');
                    menuSubListWrapper[i].querySelector('.menu__sub-list').removeAttribute('data-accordion-content', '');
                    menuSubListWrapper[i].querySelector('.menu__sub-list').classList.remove('accor-full-content');
                }
                for (let i = 0; i < menuItems.length; i += 1) {
                    const menuItem = menuItems[i];
                    menuItem.classList.remove('accor');
                }
                for (let i = 0; i < menuSubItemsAccor.length; i += 1) {
                    const menuSubItemAccor = menuSubItemsAccor[i];
                    menuSubItemAccor.classList.remove('accor');
                }
            }
        });

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
                const innerSection = button.closest('.accor').querySelector('.accor-full');
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
                Accordion.apply(elem);
            });
        }

        // promo slider
        const promoSliderCheck = document.querySelectorAll('.promo__slider');

        if (promoSliderCheck.length > 0) {
            const promoSlider = new Swiper('.promo__slider', {
                loop: true,
                autoHeight: true,
                effect: 'fade',
                fadeEffect: {
                    crossFade: true
                },
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false
                },
                pagination: {
                    el: '.promo__slider-pagination',
                    bulletClass: 'swiper-pagination-bullet-custom',
                    bulletActiveClass: 'swiper-pagination-bullet-custom--active',
                    renderBullet: function (index, className) {
                        return `<div class="${className}" data-index="${index}">
                        <svg viewbox="0 0 20 20">
                            <circle r="9" cx="10" cy="10" fill="none" stroke-width="2" stroke="#ABD43E"/>
                        </svg>
                      </div>`
                    },
                    clickable: true
                },
                navigation: {
                    nextEl: '.promo__slider-btn_next',
                    prevEl: '.promo__slider-btn_prev',
                },
                on: {
                    init: function () {
                        const _self = this;

                        _self.el.style.setProperty('--delay', _self.params.autoplay.delay);

                        _self.el.addEventListener('mouseenter', function () {
                            _self.el.classList.add('swiper--pause');
                            _self.autoplay.pause();
                        });

                        _self.el.addEventListener('mouseleave', function () {
                            _self.el.classList.remove('swiper--pause');
                            _self.autoplay.resume();
                        });
                    }
                }
            });
        }

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

                    if (heightTextContent <= 485) {
                        btnMore.style.display = 'none';
                        textWrapper.style.height = 'auto';
                    } else {
                        btnMore.style.display = 'flex';
                        textWrapper.style.height = 485 + 'px';
                        btnMore.textContent = 'Читать полностью';
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
                if (document.body.clientWidth <= 575) {
                    if (moreTextList.length > 0) {
                        moreTextList.forEach(function (moreText) {
                            const textWrapper = moreText.querySelector('.more-text-wrapper');
                            const textContent = moreText.querySelector('.more-text-content');
                            const heightTextContent = getHeight(textContent);
                            const btnMore = moreText.querySelector('.more-text-btn');

                            if (heightTextContent <= 485) {
                                btnMore.style.display = 'none';
                                textWrapper.style.height = 'auto';
                            } else {
                                btnMore.style.display = 'flex';
                                textWrapper.style.height = 485 + 'px';
                                btnMore.textContent = 'Читать полностью';
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
                        textWrapper.style.height = 485 + 'px';
                        btn.textContent = 'Читать полностью';
                    }
                });
            })
        }

        // programs slider
        const programsSliderCheck = document.querySelectorAll('.programs__slider');

        if (programsSliderCheck.length > 0) {
            const programsSlider = new Swiper('.programs__slider', {
                navigation: {
                    nextEl: '.programs__slider-btn_next',
                    prevEl: '.programs__slider-btn_prev',
                },
                breakpoints: {
                    0: {
                        slidesPerView: 1,
                        spaceBetween: 15,
                    },
                    575: {
                        slidesPerView: 2,
                        spaceBetween: 15,
                    },
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 15,
                    },
                    1200: {
                        slidesPerView: 4,
                        spaceBetween: 15,
                    }
                },
            });
        }

        // promotions slider
        const promotionsSliderCheck = document.querySelectorAll('.promotions__slider');

        if (promotionsSliderCheck.length > 0) {
            const promotionsSlider = new Swiper('.promotions__slider', {
                navigation: {
                    nextEl: '.promotions__slider-btn_next',
                    prevEl: '.promotions__slider-btn_prev',
                },
                breakpoints: {
                    0: {
                        slidesPerView: 1,
                        spaceBetween: 15,
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 15,
                    },
                    1200: {
                        slidesPerView: 3,
                        spaceBetween: 15,
                    }
                },
            });
        }

        // documents slider
        const documentsSliderCheck = document.querySelectorAll('.documents__slider');

        if (documentsSliderCheck.length > 0) {
            const documentsSlider = new Swiper('.documents__slider', {
                navigation: {
                    nextEl: '.documents__slider-btn_next',
                    prevEl: '.documents__slider-btn_prev',
                },
                pagination: {
                    el: ".documents__pagination",
                    type: "fraction",
                },
                breakpoints: {
                    0: {
                        slidesPerView: 1.35,
                        spaceBetween: 15,
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 15,
                    },
                    1200: {
                        slidesPerView: 3,
                        spaceBetween: 15,
                    }
                },
            });
        }

        // documents fancybox
        Fancybox.bind('[data-fancybox="documents"]', {
            placeFocusBack: false,
        });

        // specialists slider
        const specialistsSliderCheck = document.querySelectorAll('.specialists__slider');

        if (specialistsSliderCheck.length > 0) {
            const specialistsSlider = new Swiper('.specialists__slider', {
                navigation: {
                    nextEl: '.specialists__slider-btn_next',
                    prevEl: '.specialists__slider-btn_prev',
                },
                breakpoints: {
                    0: {
                        slidesPerView: 1.25,
                        spaceBetween: 15,
                    },
                    575: {
                        slidesPerView: 2,
                        spaceBetween: 15,
                    },
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 15,
                    },
                    1200: {
                        slidesPerView: 4,
                        spaceBetween: 15,
                    },
                    1440: {
                        slidesPerView: 5,
                        spaceBetween: 15,
                    }
                },
            });
        }

        // rating
        const ratings = document.querySelectorAll('.rating');

        if (ratings.length > 0) {
            initRatings();
        }

        function initRatings() {
            let ratingActive, ratingValue, ratingText;

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
            ratingText = rating.querySelector('.rating__text');
        }

        function setRatingActiveWidth(index = ratingValue.innerHTML.replace(',', '.')) {
            const ratingActiveWidth = index / 0.05;
            ratingActive.style.width = `${ratingActiveWidth}%`;
            ratingText.innerHTML = `Рекомендуют ${Math.round(ratingActiveWidth)}%`
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
                });
            }
        }

        // reviews slider
        const reviewsSliderCheck = document.querySelectorAll('.reviews__slider');

        if (reviewsSliderCheck.length > 0) {
            const reviewsSlider = new Swiper('.reviews__slider', {
                navigation: {
                    nextEl: '.reviews__slider-btn_next',
                    prevEl: '.reviews__slider-btn_prev',
                },
                breakpoints: {
                    0: {
                        slidesPerView: 1,
                        spaceBetween: 15,
                        autoHeight: true,
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 15,
                    },
                },
            });
        }

        // news slider
        const newsSliderCheck = document.querySelectorAll('.reviews__slider');

        if (newsSliderCheck.length > 0) {
            const newsSlider = new Swiper('.news__slider', {
                navigation: {
                    nextEl: '.news__slider-btn_next',
                    prevEl: '.news__slider-btn_prev',
                },
                breakpoints: {
                    0: {
                        slidesPerView: 1.15,
                        spaceBetween: 10,
                    },
                    575: {
                        slidesPerView: 2,
                        spaceBetween: 15,
                    },
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 15,
                    },
                    1440: {
                        slidesPerView: 4,
                        spaceBetween: 15,
                    },
                },
            });
        }

        // articles slider
        const articlesSliderCheck = document.querySelectorAll('.articles__slider');

        if (articlesSliderCheck.length > 0) {
            const articlesSlider = new Swiper('.articles__slider', {
                navigation: {
                    nextEl: '.articles__slider-btn_next',
                    prevEl: '.articles__slider-btn_prev',
                },
                breakpoints: {
                    0: {
                        slidesPerView: 1,
                        spaceBetween: 15,
                        autoHeight: true,
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 15,
                    },
                    1200: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                    }
                },
            });
        }

        // Tabs
        class Tabs {
            container;
            tab_button_class;
            tab_content_class;
            tab_attribute_key;
            tab_attribute_target;
            tab_navigation_next;
            tab_navigation_prev;
            tab_active_name;

            constructor({ container = '.tabs-container', tabs_wrapper_class = '.tabs__wrapper', button_class = '.tab', content_class = '.tab-content', attribute_key = 'path', attribute_target = 'target', nav_next = '.tabs__arrow_next', nav_prev = '.tabs__arrow_prev', name_active = '.tabs__active' } = {}) {
                this.container = container;
                this.tabs_wrapper_class = tabs_wrapper_class;
                this.tab_button_class = button_class;
                this.tab_content_class = content_class;
                this.tab_attribute_key = attribute_key;
                this.tab_attribute_target = attribute_target;
                this.tab_navigation_next = nav_next;
                this.tab_navigation_prev = nav_prev;
                this.tab_active_name = name_active;
            }

            initTabs() {
                document.querySelectorAll(this.container).forEach((wrapper) => {
                    this.initTabsWrapper(wrapper);
                });
            }

            initTabsWrapper(wrapper) {
                const tabsWrapper = wrapper.querySelector(this.tabs_wrapper_class);
                const tabsButtonList = wrapper.querySelectorAll(this.tab_button_class);
                const tabsContentList = wrapper.querySelectorAll(this.tab_content_class);
                const tabsNavigationNext = wrapper.querySelector(this.tab_navigation_next);
                const tabsNavigationPrev = wrapper.querySelector(this.tab_navigation_prev);
                const tabActiveName = wrapper.querySelector(this.tab_active_name);
                const tabsClose = document.querySelectorAll('.tabs__close');
                let currentTab = 0;
                if (tabActiveName) {
                    tabActiveName.querySelector('.tabs__active-text').textContent = tabsButtonList[currentTab].textContent;
                }

                for (let index = 0; index < tabsButtonList.length; index++) {
                    if (tabsButtonList[index].dataset.start === true) {
                        currentTab = index;
                    }

                    tabsButtonList[index].addEventListener('click', () => {
                        if (tabsContentList[index]) {
                            currentTab = index;
                            this.showTabsContent({
                                list_tabs: tabsContentList,
                                list_buttons: tabsButtonList,
                                index: currentTab,
                            });
                            if (tabActiveName) {
                                tabActiveName.querySelector('.tabs__active-text').textContent = tabsButtonList[index].textContent;
                                tabActiveName.closest('.tabs').classList.remove('active');
                                document.body.classList.remove('lock');
                            }
                        }
                    });
                }

                this.showTabsContent({
                    list_tabs: tabsContentList,
                    list_buttons: tabsButtonList,
                    index: currentTab,
                });

                if (tabsNavigationNext) {
                    tabsNavigationNext.addEventListener('click', () => {
                        if (currentTab + 1 < tabsButtonList.length) {
                            currentTab += 1;
                        } else {
                            currentTab = 0;
                        }

                        const tabsWrapperPositionX = tabsWrapper.getBoundingClientRect().left;
                        const currentTabPositionX = tabsButtonList[currentTab].getBoundingClientRect().left;
                        const currentTabPositionXRegardingParent = currentTabPositionX - tabsWrapperPositionX;

                        tabsWrapper.scrollBy({
                            left: currentTabPositionXRegardingParent,
                            behavior: 'smooth'
                        });

                        this.showTabsContent({
                            list_tabs: tabsContentList,
                            list_buttons: tabsButtonList,
                            index: currentTab,
                        });
                    });
                }

                if (tabsNavigationPrev) {
                    tabsNavigationPrev.addEventListener('click', () => {
                        if (currentTab - 1 >= 0) {
                            currentTab -= 1;
                        } else {
                            currentTab = tabsButtonList.length - 1;
                        }

                        const tabsWrapperPositionX = tabsWrapper.getBoundingClientRect().left;
                        const currentTabPositionX = tabsButtonList[currentTab].getBoundingClientRect().left;
                        const currentTabPositionXRegardingParent = currentTabPositionX - tabsWrapperPositionX;

                        tabsWrapper.scrollBy({
                            left: currentTabPositionXRegardingParent,
                            behavior: 'smooth'
                        });

                        this.showTabsContent({
                            list_tabs: tabsContentList,
                            list_buttons: tabsButtonList,
                            index: currentTab,
                        });
                    });
                }

                if (tabActiveName) {
                    tabActiveName.addEventListener('click', function () {
                        tabActiveName.closest('.tabs').classList.add('active');
                        document.body.classList.add('lock');
                    });
                }

                if (tabsClose.length > 0) {
                    for (let i = 0; i < tabsClose.length; i += 1) {
                        const tabClose = tabsClose[i]
                        tabClose.addEventListener('click', function () {
                            tabClose.closest('.tabs').classList.remove('active');
                            document.body.classList.remove('lock');
                        });
                    }
                }


                tabsWrapper.closest('.tabs__container').addEventListener('click', function (e) {
                    if (!e.target.closest('.tabs__wrapper')) {
                        console.log(tabsWrapper);
                        tabsWrapper.closest('.tabs').classList.remove('active');
                        document.body.classList.remove('lock');
                    }
                });
            }

            hideTabsContent({ list_tabs, list_buttons }) {
                list_buttons.forEach((el) => {
                    el.classList.remove('active');
                });
                list_tabs.forEach((el) => {
                    el.classList.remove('active');
                });
            }

            showTabsContent({ list_tabs, list_buttons, index }) {
                this.hideTabsContent({
                    list_tabs,
                    list_buttons
                });

                if (list_tabs[index]) {
                    list_tabs[index].classList.add('active');
                }

                if (list_buttons[index]) {
                    list_buttons[index].classList.add('active');
                }
            }
        }

        // side-promotions slider
        const sidePromotionsSliderCheck = document.querySelectorAll('.side-promotions');

        if (sidePromotionsSliderCheck.length > 0) {
            const sidePromotionsSlider = new Swiper('.side-promotions', {
                pagination: {
                    el: ".side-promotions__pagination",
                    type: "fraction",
                },
                navigation: {
                    nextEl: '.side-promotions__btn_next',
                    prevEl: '.side-promotions__btn_prev',
                },
                slidesPerView: 1,
                spaceBetween: 15,
            });
        }

        new Tabs().initTabs();
        initPhoneMask();
        AOS.init();
    });
})();