// import JsonWebToken from 'jsonwebtoken';
// import dotenv from 'dotenv';

// dotenv.config({
//     path: '../.env'
// });

// const isAuthenticated = async (req, res, next) => {
//     try {
//         const jsonToken = req.cookies.jsonToken;
//         console.log(req.cookies);

//         if (!jsonToken) {
//             return res.status(401).json({
//                 message: 'User not Authenticated.',
//                 status: false
//             });
//         }

//         // Verify the token
//         JsonWebToken.verify(jsonToken, process.env.TOKEN_SECRET, (err, decode) => {
//             if (err) {
//                 if (err.name === 'TokenExpiredError') {
//                     // Token has expired
//                     try {
//                         const decoded = JsonWebToken.decode(jsonToken);
//                         const newToken = JsonWebToken.sign({ userId: decoded.userId }, process.env.TOKEN_SECRET, { expiresIn: '2d' }); // Adjust the expiration as needed
//                         res.cookie('jsonToken', newToken, { httpOnly: true });

//                         req.user = decoded.userId;
//                         next();
//                     } catch (decodeError) {
//                         return res.status(401).json({
//                             message: 'Token expired and refresh failed.',
//                             status: false
//                         });
//                     }
//                 } else {
//                     return res.status(401).json({
//                         message: 'Invalid token.',
//                         status: false
//                     });
//                 }
//             } else {
//                 req.user = decode.userId;
//                 next();
//             }
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             message: 'Internal Server Error.',
//             status: false
//         });
//     }
// };

// export default isAuthenticated;



import JsonWebToken from 'jsonwebtoken';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Load environment variables
dotenv.config({
    path: '../.env'
});

const isAuthenticated = async (req, res, next) => {
    try {
        const {jsonToken} = req.cookies.jsonToken;  // line 73
        console.log("Cookies: ", req.cookies); // Log cookies for debugging
       // // console.log("Cookies: ", req.cookies); // Log cookies for debugging

        if (!jsonToken) {
            // console.log("No token found in cookies."); // Debug log
            return res.status(401).json({
                message: 'User not Authenticated.',
                status: false
            });
        }



        // Verify the token
        JsonWebToken.verify(jsonToken, process.env.TOKEN_SECRET, (err, decode) => {
            if (err) {
                console.log("Token verification error: ", err); // Debug log
                if (err.name === 'TokenExpiredError') {
                    // Token has expired, attempt to refresh
                    try {
                        const decoded = JsonWebToken.decode(jsonToken);
                        const newToken = JsonWebToken.sign(
                            { userId: decoded.userId }, 
                            process.env.TOKEN_SECRET, 
                            { expiresIn: '2d' } // Adjust the expiration as needed
                        );
                        res.cookie('jsonToken', newToken, { httpOnly: true });

                        req.user = decoded.userId;
                        next();
                    } catch (decodeError) {
                        console.log("Token decode error: ", decodeError); // Debug log
                        return res.status(401).json({
                            message: 'Token expired and refresh failed.',
                            status: false
                        });
                    }
                } else {
                    return res.status(401).json({
                        message: 'Invalid token.',
                        status: false
                    });
                }
            } else {
                req.user = decode.userId;
                next();
            }
        });
    } catch (error) {
        console.log("Internal server error: ", error); // Debug log
        res.status(500).json({
            message: 'Internal Server Error.',
            status: false
        });
    }
};

export default isAuthenticated;
