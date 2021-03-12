$(() => {
    fetch('/products/create/info')
        .then(response => response.json())
        .then((data) => {
            let categoryOptions = '<option selected hidden value="">Select a category *</option>';
            data.categories.forEach(category => {
                categoryOptions += `<optgroup label="${category.title}">`;

                data.subCategories.forEach(subCategory => {
                    if(subCategory.category_id === category.id) {
                        categoryOptions += `<option value="${subCategory.category_id}">${subCategory.title}</option>`
                    }
                });

                categoryOptions += '</optgroup>';
            })

            let sellerOptions = '<option selected hidden value="">Select a seller*</option>';
            data.sellers.forEach(seller => {
                sellerOptions += `<option value="${seller.user_id}">${seller.first_name} ${seller.last_name}</option>`;
            })

            $('#categories_s2').html(categoryOptions);
            $('#sellers_s2').html(sellerOptions);
        })
        .catch((error) => {
            alert('Problem contacting server');
            console.log(error)
        })
});