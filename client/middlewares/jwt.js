import jwt from 'jsonwebtoken';

// Set your JWT secret directly here
const secretKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJc3N1ZXIgKGlzcykiOiJJc3N1ZXIiLCJJc3N1ZWQgQXQgKGlhdCkiOiIyMDIzLTEyLTI3VDA4OjM0OjI0Ljk0OVoiLCJFeHBpcmF0aW9uIFRpbWUgKGV4cCkiOiIyMDIzLTEyLTI3VDA5OjM0OjI0Ljk0OVoiLCJTdWJqZWN0IChzdWIpIjoiU3ViamVjdCIsIlVzZXJuYW1lIChhdWQpIjoiSmF2YUd1aWRlcyIsIlJvbGUiOiJBRE1JTiJ9.bjLsioLdGoDsc8ZW_8E0vYStiqzSIiW-8PEiwO2er8E';

const jwtAuthorizer = (req, res, next) => {
    try {
        // Check if the authorization header is present
        const token = req.headers.cookie;
console.log("Headers:", req.headers);
console.log("cookie", req.headers.cookie)
console.log("Received token:", token);

       
        // Extract the token from the header
        const tokenMatch = token.match(/authToken=([^;]+)/);
        if (!tokenMatch) {
            return res.status(401).send("Invalid authorization token");
        }

        const tokenValue = tokenMatch[1];
        // Verify the token
        const secretKey = process.env.JWT_SECRET || 'defaultSecretKey';

        const payload = jwt.verify(tokenValue, secretKey);

        // Attach the userID to the request for further use
        req.userID = payload.userID;

        // Log the payload for debugging purposes
        console.log(payload);

        // Send the token in the response for debugging purposes
        res.status(200).json({ userID: req.userID, token: tokenValue });

        // Move to the next middleware
        next();
    } catch (error) {
        // Handle JWT verification errors
        console.error("JWT verification error:", error.message);
        return res.status(401).send("Invalid authorization token");
    }
};

export default jwtAuthorizer;
