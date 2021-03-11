
$(() => {
    /**
     * *********************************************************    VALIDATION CONFIGS
     */
    jQuery.validator.setDefaults({
        errorPlacement: function (error, element) {
            error.addClass('error');
            if(element.prop('type') === 'radio') {
                error.insertAfter(element.closest('.form-group'));
            } else if(element.prop('type') === 'file') {
                error.insertAfter(element.closest('div'));
            } else if(element.is('textarea')) {
                error.insertAfter(element.next());
            } else if(element.closest('.input-group').length > 0) {
                error.insertAfter(element.parent('.input-group'));
            } else if(element.hasClass('anime_input')) {
                error.insertAfter(element.closest('label'));
            }
        }
    });

    /**
     * *********************************************************    SIGN UP
     */

    $('#reg_form').validate({
        rules: {
            first_name: {
                required: true,
                minlength: 3
            },
            last_name: {
                required: true,
                minlength: 3
            },
            email: 'required',
            phone: {
                required: true,
                maxlength: 10,
                minlength: 9
            },
            id_number: 'required',
            gender: 'required',
            password: 'required',
            confirm_password: {
                equalTo: '#password'
            }
        },
        submitHandler: function(form) {
            let data = $(form).serialize();

            $.ajax({
                data: data,
                method: 'POST',
                url: '/register',
                success: (response) => {
                    if(response.errors) {
                        $('#reg_form .err_message').html(response.errors[0].msg);
                    } else if(response.success) {
                        $('#reg_form .err_message').html('');
                        location.href = '/sign-in';
                    }
                }
            });
        }
    })

});