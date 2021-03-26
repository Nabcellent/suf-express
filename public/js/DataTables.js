
/*_____________________  PRODUCTS  _____________________*/

const productDataTable = $('#products_table').DataTable({
    scrollY:        '50vh',
    scrollCollapse: true,
    paging:         false,
    order: [[ 4, 'desc' ]],
    language: {
        info: 'Number of products: _MAX_',
        infoFiltered:   "(filtered _TOTAL_ products)",
        search: "_INPUT_",
        searchPlaceholder: "Search details.ejs"
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
    scrollY:        '30vh',
    scrollCollapse: true,
    paging:         false,
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
        targets: 3
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


/*_____________________  COUPONS  _____________________*/

const brandDataTable = $('#brands_table').DataTable({
    scrollY:        '50vh',
    scrollCollapse: true,
    paging:         false,
    order: [[0, 'ASC']],
    language: {
        info: 'Number of brands: _MAX_',
        infoFiltered:   "(filtered _TOTAL_ brands)",
        search: "_INPUT_",
        searchPlaceholder: "Search brand"
    },
    columnDefs: [
        { searchable: false, orderable: false, targets: 0 },
        { searchable: false, orderable: false, targets: 2 }
    ],
});
brandDataTable.on( 'order.dt search.dt', function () {
    brandDataTable.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
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