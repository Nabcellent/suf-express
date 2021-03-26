
const readProfile = async(req, res) => {
    res.render('users/profile', {
        Title: 'Customers',
        layout: './layouts/nav',
        admin: req.user[0],
    });
}

module.exports = {
    readProfile
}