const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const UserModel = require("../model/User");
const AdminModel = require("../model/Admin");
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const AssistantModel = require("../model/Assistant");
const admin = {
  email: "admin@test.com",
  password: "mypass1111",
};
passport.serializeUser(function (user, done) {
  done(null, user.email);
});

passport.deserializeUser(function (email, done) {
  if (email === admin.email) {
    done(null, admin);
  }
});

passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        let user = await UserModel.findOne({ email });
        if (user) {
          return done(null, false, { message: "Email already present" });
        }
        user = await UserModel.create({ email, password });
        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  "loginadmin",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = {
          email,
          password,
        };
        const validate = email === admin.email && password === admin.password;
        if (!validate) {
          return done(null, false, { message: "Wrong Password" });
        }

        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);
passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await UserModel.findOne({ email });
        if (!user) {
          const ass = await AssistantModel.findOne({ email });
          if (ass) {
            const validate = await ass.isValidPassword(password);
            console.log(validate);
            if (!validate) {
              return done(null, false, { message: "Wrong Password" });
            }
            ass.type = "ass";
            return done(null, ass, { message: "Logged in Successfully" });
          } else {
            return done(null, false, { message: "User not found" });
          }
        }
        const validate = await user.isValidPassword(password);
        console.log(validate);
        if (!validate) {
          return done(null, false, { message: "Wrong Password" });
        }

        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);
passport.use(
  new JWTstrategy(
    {
      secretOrKey: "my_secret_key_app01",
      jwtFromRequest: ExtractJWT.fromUrlQueryParameter("secret_token"),
    },
    async (token, done) => {
      try {
        const { _id, email } = token.user;
        const res = token.user;
        const ass = await AssistantModel.findById(_id);
        if (ass) {
          const user = await UserModel.findById(ass.created_by);
          res._id = user._id;
          res.email = user.email;
          res.type = "ass";
          res.ass_id = _id;
        }
        return done(null, res);
      } catch (error) {
        done(error);
      }
    }
  )
);
