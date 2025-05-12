// export const generateToken=(user,message,statusCode,res)=>{
//     const token=user.generateJWT();
//     const cookieName=`${(user.role).toLowerCase()}Token`
//     res.status(statusCode).cookie(cookieName, token, {
//         expireIn: new Date(Date.now()+process.env.COOKIE_EXPIRES*24*60*60*1000)
//     }).json({
//         success: true,
//         message,
//         user,
//         token
//     })
// }

export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJWT();
  
  // Determine the cookie name based on the user's role
  let cookieName;
  switch (user.role) {
    case "Admin":
      cookieName = "adminToken";
      break;
    case "Doctor":
      cookieName = "doctorToken";
      break;
    case "Patient":
      cookieName = "patientToken";
      break;
    default:
      cookieName = "userToken";
  }

  // Set cookie options
  const options = {
    expires: new Date(
      Date.now() + (process.env.COOKIE_EXPIRES || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/"
  };

  // Set the cookie and send response
  res
    .status(statusCode)
    .cookie(cookieName, token, options)
    .json({
      success: true,
      message,
      user,
      token
    });
};