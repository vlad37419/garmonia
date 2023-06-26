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
            headerBottom.style.paddingBottom = contraindications.scrollHeight + headerTop.scrollHeight + 'px';
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
                headerBottom.style.paddingBottom = contraindications.scrollHeight + headerTop.scrollHeight + 'px';
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
                console.log(section);
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
        console.log(accorWrapperList);

        if (accorWrapperList.length > 0) {
            accorWrapperList.forEach(function (elem) {
                Accordion.apply(elem);
            });
        }

        initPhoneMask();
    });
})();