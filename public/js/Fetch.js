$(() => {
    console.log()
    fetch('/products/create/info')
        .then(response => response.json())
        .then((data) => {
            let categoryOptions = '';
            data.categories.forEach(category => {
                categoryOptions += `<optgroup label="${category.title}">`;

                data.subCategories.forEach(subCategory => {
                    if(subCategory.category_id === category.id) {
                        categoryOptions += `<option value="${subCategory.category_id}">${subCategory.title}</option>`
                    }
                });

                categoryOptions += '</optgroup>';
            });

            let sellerOptions = '';
            data.sellers.forEach(seller => {
                sellerOptions += `<option value="${seller.user_id}">${seller.last_name} ${seller.first_name}</option>`;
            })

            let brandOptions = '';
            data.brands.forEach(brand => {
                brandOptions += `<option value="${brand.id}">${brand.name}</option>`;
            })

            $('#select_brand').append(brandOptions);
            $('#categories_s2').append(categoryOptions);
            $('#sellers_s2').append(sellerOptions);
        })
        .catch((error) => {
            alert('Problem contacting server');
            console.log(error)
        })


    $('#variation_attribute_s2').on('change', function() {
        fetch(`/products/details/attributeValues/${$(this).val()}`)
            .then(response => response.json())
            .then((data) => {
                let values = JSON.parse(data);
                let attributeValOptions = '<option></option>';

                if(Array.isArray(values)) {
                    values.forEach(value => {
                        attributeValOptions += `<option value="${value}">${value}</option>`
                    })
                } else {
                    attributeValOptions += `<option value="${values}">${values}</option>`
                }
                $('#values_s2').html(attributeValOptions);
            })
            .catch((error) => {
                alert('Problem contacting server');
                console.log(error)
            });
    });
});