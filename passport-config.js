 import passport from "passport";
 import { Strategy as GoogleStrategy } from "passport-google-oauth20";
//  import { Strategy as FacebookStrategy } from "passport-facebook";
import { userModel } from "./src/models/user.model";

// Google login

 passport.use(new GoogleStrategy({
     clientID: GOOGLE_CLIENT_ID,
     clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL,
    
  },
  async (accessToekn, refreshToken, profile,done)=>{

// Exsiting user check block if not it will create new user as per google account

    try{
      let user = await userModel.findOne({'googleID': profile.id});
      if(!user){
        user = await userModel({
          name: profile.displayName,
          email: profile.emails? profile.email[0].value:null,
          googleID: profile.id
        })
        await user.save();
      }
    }catch(error){
      return done(error);
    }
  }))


  passport.serializeUser(async(id,done)=>{
 try{
  const user = await userModel.findById(id)
  done(null,user)
 }catch(error){
  done(error)
 }
})



// // facebook login 

//   passport.use(new FacebookStrategy({
//     clientID: FACEBOOK_CLIENT_ID,
//     clientSecret: FACEBOOK_CLIENT_SECRET,
//     callbackURL: FACEBOOK_CALLBACK_URL,
//     profileFields: ['id', 'displayName', 'emails']
//   },
//   async (accessToken, refreshToken, profile,done)=>{
    
//     // Check for existing user profile
    
//     try{
//       let user = await userModel.findOne({'facebookID': profile.id});
//       if(!user){
//         user = await userModel({
//           name: profile.displayName,
//           email: profile.emails? profile.emails[0].value:null,
//           facebookID: profile.id 
//         })
//         await user.save();
//       }
//       return done(null,user)
//     }catch(error){
//       return done(error);
//     }
//   }))

//   export default passport;

