
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



    /**
     * *********************************************************    DATATABLES
     */

    /*_____________________  PRODUCTS  _____________________*/
    const productDataTable = $('#products_table').DataTable({
        scrollY:        '50vh',
        scrollCollapse: true,
        paging:         false,
        order: [[ 2, 'asc' ]],
        language: {
            info: 'Number of products: _MAX_',
            infoFiltered:   "(filtered _TOTAL_ products)",
            search: "_INPUT_",
            searchPlaceholder: "Search product"
        },
        columnDefs: [{
            searchable: false,
            orderable: false,
            targets: 0
        }, {
            searchable: false,
            orderable: false,
            targets: 1
        }, {
            searchable: false,
            orderable: false,
            targets: 9
        }],
        createdRow: function(row, data, index) {
            if(data[5].replace(/[$,]/g, '') * 1 > 1000) {
                $('td', row).eq(5).addClass('text-success');
            } else if(data[5].replace(/[$,]/g, '') * 1 < 1000) {
                $('td', row).eq(5).addClass('text-danger');
            }
        }
    });
    productDataTable.on( 'order.dt search.dt', function () {
        productDataTable.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
            cell["innerHTML"] = i+1;
        } );
    }).draw();

    /*_____________________  SELLERS  _____________________*/
    const sellerDataTable = $('#sellers_table').DataTable({
        scrollY:        '50vh',
        scrollCollapse: true,
        paging:         false,
        order: [[ 2, 'asc' ]],
        language: {
            info: 'Number of sellers: _MAX_',
            infoFiltered:   "(filtered _TOTAL_ sellers)",
            search: "_INPUT_",
            searchPlaceholder: "Search seller"
        },
        columnDefs: [{
            searchable: false,
            orderable: false,
            targets: 0
        }, {
            searchable: false,
            orderable: false,
            targets: 6
        }],
    });
    sellerDataTable.on( 'order.dt search.dt', function () {
        sellerDataTable.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
            cell["innerHTML"] = i+1;
        } );
    }).draw();

    /*_____________________  CUSTOMERS  _____________________*/
    const customerDataTable = $('#customers_table').DataTable({
        scrollY:        '50vh',
        scrollCollapse: true,
        paging:         false,
        order: [[ 2, 'asc' ]],
        language: {
            info: 'Number of customers: _MAX_',
            infoFiltered:   "(filtered _TOTAL_ customers)",
            search: "_INPUT_",
            searchPlaceholder: "Search customer"
        },
        columnDefs: [{
            searchable: false,
            orderable: false,
            targets: 0
        }, {
            searchable: false,
            orderable: false,
            targets: 6
        }],
    });
    customerDataTable.on( 'order.dt search.dt', function () {
        customerDataTable.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
            cell["innerHTML"] = i+1;
        } );
    }).draw();

    /*_____________________  CUSTOMERS  _____________________*/
    const orderDataTable = $('#orders_table').DataTable({
        scrollY:        '50vh',
        scrollCollapse: true,
        paging:         false,
        order: [[7, 'DESC']],
        language: {
            info: 'Number of orders: _MAX_',
            infoFiltered:   "(filtered _TOTAL_ orders)",
            search: "_INPUT_",
            searchPlaceholder: "Search order"
        },
        columnDefs: [{
            searchable: false,
            orderable: false,
            targets: 0
        }, {
            searchable: false,
            orderable: false,
            targets: 8
        }],
    });
    orderDataTable.on( 'order.dt search.dt', function () {
        orderDataTable.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
            cell["innerHTML"] = i+1;
        } );
    }).draw();

    /*_____________________  SUB_CATEGORIES  _____________________*/
    const subCatDataTable = $('#sub_cat_table').DataTable({
        scrollY:        '20vh',
        scrollCollapse: true,
        paging:         false,
        order: [[1, 'ASC']],
        language: {
            info: 'Total Sub-Categories: _MAX_',
            infoFiltered:   "(filtered _TOTAL_)",
            search: "_INPUT_",
            searchPlaceholder: "Search Sub-Category"
        },
        columnDefs: [{
            searchable: false,
            orderable: false,
            targets: 0
        }, {
            searchable: false,
            orderable: false,
            targets: 2
        }],
    });
    subCatDataTable.on( 'order.dt search.dt', function () {
        subCatDataTable.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
            cell["innerHTML"] = i+1;
        } );
    }).draw();

    /*_____________________  COUPONS  _____________________*/
    const couponDataTable = $('#coupons_table').DataTable({
        scrollY:        '50vh',
        scrollCollapse: true,
        paging:         false,
        order: [[2, 'ASC']],
        language: {
            info: 'Number of coupons: _MAX_',
            infoFiltered:   "(filtered _TOTAL_ coupons)",
            search: "_INPUT_",
            searchPlaceholder: "Search coupon"
        },
        columnDefs: [
            { searchable: false, orderable: false, targets: 0 },
            { searchable: false, orderable: false, targets: 7 }
        ],
    });
    couponDataTable.on( 'order.dt search.dt', function () {
        couponDataTable.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
            cell["innerHTML"] = i+1;
        } );
    }).draw();

    /*_____________________  PAYMENTS  _____________________*/
    const paymentDataTable = $('#payments_table').DataTable({
        scrollY:        '50vh',
        scrollCollapse: true,
        paging:         false,
        order: [[5, 'DESC']],
        language: {
            info: 'Number of payments: _MAX_',
            infoFiltered:   "(filtered _TOTAL_ payments)",
            search: "_INPUT_",
            searchPlaceholder: "Search payment"
        },
        columnDefs: [
            { searchable: false, orderable: false, targets: 0 },
            { searchable: false, orderable: false, targets: 6 }
        ]
    });
    paymentDataTable.on( 'order.dt search.dt', function () {
        paymentDataTable.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
            cell["innerHTML"] = i+1;
        });
    }).draw();



    /**
     * *********************************************************    SELECT2
     */

    /*_____________________  ADD VARIATION  _____________________*/
    $('#add_variation').on('click', () => {
        $('#variation_row .form-row').clone().appendTo($('#variation_row .col'));
    });

    $('.variation').select2({
        placeholder: 'Select your option',
        width: 'resolve',
        theme: 'classic',
        tags: true,
        tokenSeparators: [',', ' ']
    });
});