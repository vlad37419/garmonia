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

        // dropdown menu
        const menuBtns = document.querySelectorAll('button.menu__link');

        if (menuBtns.length > 0) {
            menuBtns.forEach(function (menuBtn) {
                menuBtn.addEventListener('click', function () {
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


        window.addEventListener('click', function (e) {
            const target = e.target;

            if (!target.closest('.menu__item')) {
                menuBtns.forEach(el => {
                    el.closest('.menu__item').classList.remove('active');
                });
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

                // menuClose(mobileMenu);

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

        // header menu mobile
        // let headerMenuButton = document.querySelector('.menu-burger');
        // let headerMenu = document.querySelector('.mobile-menu');

        // headerMenuButton.addEventListener('click', function () {
        //     headerMenuButton.classList.toggle('active');
        //     headerMenu.classList.toggle('active');
        //     if (headerMenu.classList.contains('active')) {
        //         body.classList.add('lock');
        //     } else {
        //         body.classList.remove('lock');
        //     }
        // });

        initPhoneMask();
    });
})();