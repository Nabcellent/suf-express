
$(() => {
    /*_______  Set Product To Delete  _______*/
    $('.delete_product').on('click', function() {
        $('#delete_product_modal #product_id').val($(this).attr('data-id'));
        $('#delete_product_modal #image_name').val($(this).attr('data-image'));
    })

    /*_______  Set Sub-Category To Update  _______*/
    $('#add_sub_category').on('click', () => {
        $('#cat_group').show();
    })
    $('#sub_cat_table .update_sub_category').on('click', function() {
        $('#sub_category_modal button[type="submit"]').html("Update");
        $('#sub_category_modal .modal-title').html("Update Sub-Category");
        $('#cat_group').hide();
        $('#sub_category_modal #category_id').val($(this).attr('data-id'));
        $('#sub_category_modal #title').val($(this).attr('data-title'));
        $('#sub_category_modal form').attr('action', '/products/categories?_method=PUT')
    })

    /*_______  Set Sub-Category To Delete  _______*/
    $('#sub_cat_table .delete_sub_category').on('click', function() {
        $('#delete_sub_category #sub_category_id').val($(this).attr('data-id'));
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
        $('#brand #btn_update_brand').html("Update");
        $('#brand .modal-title').html("Update Brand");

        $('#brand form').attr('action', '/products/addons/brand?_method=PUT');

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