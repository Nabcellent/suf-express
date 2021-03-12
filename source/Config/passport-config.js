const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const {dbCheck} = db = require('../Database/query');

function initialize(passport) {
    const authenticateUser = async (email, password, done) => {
        const user = await dbCheck.getCheckInstance().checkEmail('users', 'email', email);

        if (!user) {
            return done(null, false);
        }

        try {
            if (await bcrypt.compare(password, user[0].password)) {
                return done(null, user[0]);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error);
        }
    }

    passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser));
    passport.serializeUser((user, done) => done(null, user.email));
    passport.deserializeUser(async (email, done) => {
        done(null, await dbCheck.getCheckInstance().checkEmail('users', 'email', email));
    })
}

module.exports = initialize;