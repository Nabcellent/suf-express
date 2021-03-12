window.setTimeout(function() {
    $(".alert").fadeTo(500, 0).slideUp(500, function(){
        $(this).remove();
    });
}, 4000);



$(() => {
    const path = location.href;

    /**
     * *********************************************************    NAVIGATIONS
     */
    //==    Nav Elements
    const $headerContainer = $('.header_container');
    const $sideBar = $('#sidebar');
    const $navStateToggle = $('#nav_state_toggle');
    const $navLogoName = $('.nav_logo_name');
    const $navName = $('.nav_name');
    const $navSubtitle = $('.nav_subtitle');
    const $navDropdownIcon = $('.nav_dropdown_icon');

    let lsKey = 'fixedNav';
    let lsVal = '';

    /*_____________________  NAV STATE  _____________________*/
    const $hiddenElements = [$sideBar, $navLogoName, $navName, $navSubtitle, $navDropdownIcon, $headerContainer, $('body')];

    const fixedNavState = (state) => {
        if(state === 'toggle') {
            $($hiddenElements).each(function() {
                $(this).toggleClass('fixed');
            });
        } else if(state === 'remove') {
            $($hiddenElements).each(function() {
                $(this).removeClass('fixed');
            });
        } else if(state === 'add') {
            $($hiddenElements).each(function() {
                $(this).addClass('fixed');
            });
        }
    }

    if(localStorage.getItem(lsKey) === 'true') {
        fixedNavState('toggle');
        $navStateToggle.prop('checked', true);
    }
    if($(window).width() < 768) {
        fixedNavState('remove');
    }

    $(window).on('resize', () => {
        if($(this).width() < 768) {
            fixedNavState('remove');
        }
    })

    $navStateToggle.on('change', function() {
        if($(this).prop('checked')) {
            fixedNavState('toggle');

            if($sideBar.hasClass('fixed')) {
                lsVal = 'true';
            }

            localStorage.setItem(lsKey, lsVal);
        } else {
            fixedNavState('toggle');
            localStorage.setItem(lsKey, 'false');
        }
    });


    /*_____________________  SHOW NAVBAR  _____________________*/
    const showMenu = (headerToggle, navbarId) => {
        const toggleBtn = document.getElementById(headerToggle),
            nav = document.getElementById(navbarId)

        // Validate that variables exist
        if(headerToggle && navbarId && $(window).width() < 768){
            toggleBtn.addEventListener('click', ()=>{
                // We add the show-menu class to the div tag with the nav__menu class
                nav.classList.toggle('show_menu')

                //Change Icon
                toggleBtn.classList.toggle('bx-x');
            });
        }
    }
    showMenu('header_toggle','sidebar');


    /*_____________________  DROPDOWN  _____________________*/
    const navDropdown = document.querySelectorAll('.nav_dropdown');

    function collapseDropdown() {
        navDropdown.forEach(l => l.classList.remove('active'))
        this.classList.add('active');
    }

    navDropdown.forEach(l => l.addEventListener('click', collapseDropdown));

    $sideBar.on('mouseleave', () => {
        collapseDropdown();
    })


    /*_____________________  ACTIVE LINK  _____________________*/
    const linkColor = document.querySelectorAll('.nav_link')

    function colorLink() {
        linkColor.forEach(l => l.classList.remove('active'))
        this.classList.add('active')
    }
    
    linkColor.forEach(l => l.addEventListener('click', colorLink));



    /**
     * *********************************************************    ANIME INPUT
     */

    console.log('Page ready');

    let $animeInput = $('.anime_input');

    if($animeInput.val()) {
        console.log('inputing');
        $animeInput.addClass('dirty_input');
    } else {
        $animeInput.removeClass('dirty_input');
    }

    $animeInput.each(function() {
        $(this).on('blur', function() {
            if($(this).val()) {
                $(this).addClass('dirty_input');
            } else {
                $(this).removeClass('dirty_input');
            }
        });
    });
});