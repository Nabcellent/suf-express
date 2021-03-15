
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
})