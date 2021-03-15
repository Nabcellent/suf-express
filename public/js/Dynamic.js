
$(() => {
    /*_______  Set Product  To Delete  _______*/
    $('.delete_product').on('click', function() {
        $('#delete_product_modal #product_id').val($(this).attr('data-id'));
        $('#delete_product_modal #image_name').val($(this).attr('data-image'));
    })

    /*_______  Set Image To Delete  _______*/
    $('.delete_image').on('click', function() {
        $('#delete_image_modal #image_id').val($(this).attr('data-id'));
        $('#delete_image_modal #image_name').val($(this).attr('data-image'));
    })

    /*_______  Set Variation Id For Price  _______*/
    $('.extra_price').on('click', function() {
        let variationId = $(this).attr('data-id');
        $('#set_price #variation_id').val(variationId);
    })


    /*_______  Set Brand Id To Update  _______*/
    $('.update_brand').on('click', function() {
        let brandId = $(this).attr('data-id');
        let brandName = $(this).attr('data-name');
        let brandStatus = $(this).attr('data-status');

        $('#brand form').attr('action', '/products/addons/brand?_method=PUT')

        $('#brand #brand_id').val(brandId);
        $('#brand #name').val(brandName);

        if(brandStatus === '0') {
            $('#brand #inactive').prop('checked', true);
        } else {
            $('#brand #active').prop('checked', true);
        }
    })

    /*_______  Set Brand Id To Delete  _______*/
    $('.delete_brand').on('click', function() {
        let brandId = $(this).attr('data-id');
        $('#delete_brand_modal #brand_id').val(brandId);
    })
})