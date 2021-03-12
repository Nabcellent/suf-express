$(() => {
    const swiper = new Swiper('#details-swiper', {
        slidesPerView: 3,
        loop: true,
        spaceBetween: 30,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
})