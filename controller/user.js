require('dotenv').config()
const user = require("../models/user")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer");

const getInfo = async (req, res) => {
    var tokenJwt = req.headers.authorization.substring(7, req.headers.authorization.length)
    const jwtSecretKey =  process.env.SECRET_JWT
    var decoded =  jwt.decode(tokenJwt, {complete:true})
    console.log(decoded.payload)
    const email = decoded.payload.email
    try{
        const userInfo = await user.find({email:email})
        if(userInfo.length === 0){
            res.status(401)
            res.json({success:false, errorCode:5, errorMessage:"User not found"})
            return
        }
        var userInformation = userInfo[0]
    }
    catch(e){
        console.log(e)
        res.status(500)
        res.json({success:false, errorCode:4, errorMessage:"An error occured"})
        return
    }
    res.status(200)
    res.json({
        success:true, 
        firstName:userInformation.firstName, 
        secondName:userInformation.secondName, 
        email:userInformation.email, 
        isEmailVerified:userInformation.isEmailVerified, 
        apiToken:userInformation.isEmailVerified == 1?userInformation.apiToken:"Please verify your email to get API token",
        emailValidTill:(userInformation.emailValidTill-Date.now()<0?0:Math.floor((userInformation.emailValidTill-Date.now())/1000))

    })
}

const sendVerificationEmail = async (req, res) => {
    var tokenJwt = req.headers.authorization.substring(7, req.headers.authorization.length)
    const jwtSecretKey =  process.env.SECRET_JWT
    var decoded =  jwt.decode(tokenJwt, {complete:true})
    var userInfo = decoded.payload
    const email = userInfo.email
    // check if the user is alredy verified
    try{
    var userInfoDb = await user.find({email:userInfo.email})
    }
    catch(e){
        console.log(e)
        res.status(500)
        res.json({success:false, errorCode:4, errorMessage:"An error occured"})
        return
    }
    if(userInfoDb.length === 0){
        res.status(401)
        res.json({success:false, errorCode:5, errorMessage:"User not found"})
        return
    }
    if(userInfoDb[0].isEmailVerified){
        res.status(200)
        res.json({success:false, errorCode:0, errorMessage:"User already verified"})
        return
    }

    // check if the mail has been send within the last 1 minute
    if(userInfoDb[0].emailValidTill >= Date.now()){
        res.status(200)
        res.json({success:false, errorCode:0, timeLeft:userInfoDb[0].emailValidTill-Date.now(), errorMessage:"Verification mail already sent, please wait for 1 minute"})
        return
    }
    let transporter = nodemailer.createTransport({
            host: "smtp.zoho.in",
            secure: true,
            port: 465,
            auth: {
                user: "no-reply@cloudpiler.tech",
                pass: "0JE25zmdpHsY",
            },
        });
    const firstName = userInfo.firstName
    jwtVerificationToken = jwt.sign({email:userInfo.email}, jwtSecretKey, {expiresIn: '1h'})
    const verification_token = "https://www.cloudpiler.tech/user/verifyEmail?authentication_token=" + jwtVerificationToken
    const mailString = "<!DOCTYPE HTML PUBLIC \"-\/\/W3C\/\/DTD XHTML 1.0 Transitional \/\/EN\" \"http:\/\/www.w3.org\/TR\/xhtml1\/DTD\/xhtml1-transitional.dtd\"><html xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\" xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:o=\"urn:schemas-microsoft-com:office:office\"><head><!--[if gte mso 9]><xml> <o:OfficeDocumentSettings> <o:AllowPNG\/> <o:PixelsPerInch>96<\/o:PixelsPerInch> <\/o:OfficeDocumentSettings><\/xml><![endif]--> <meta http-equiv=\"Content-Type\" content=\"text\/html; charset=UTF-8\"> <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"> <meta name=\"x-apple-disable-message-reformatting\"> <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"> <title><\/title> <style type=\"text\/css\"> @media only screen and (min-width: 620px){.u-row{width: 600px !important;}.u-row .u-col{vertical-align: top;}.u-row .u-col-50{width: 300px !important;}.u-row .u-col-100{width: 600px !important;}}@media (max-width: 620px){.u-row-container{max-width: 100% !important; padding-left: 0px !important; padding-right: 0px !important;}.u-row .u-col{min-width: 320px !important; max-width: 100% !important; display: block !important;}.u-row{width: 100% !important;}.u-col{width: 100% !important;}.u-col > div{margin: 0 auto;}}body{margin: 0; padding: 0;}table,tr,td{vertical-align: top; border-collapse: collapse;}p{margin: 0;}.ie-container table,.mso-container table{table-layout: fixed;}*{line-height: inherit;}a[x-apple-data-detectors='true']{color: inherit !important; text-decoration: none !important;}table, td{color: #000000;}#u_body a{color: #0000ee; text-decoration: underline;}#u_content_text_4 a{color: #f0c20c;}@media (max-width: 480px){#u_content_image_1 .v-src-width{width: auto !important;}#u_content_image_1 .v-src-max-width{max-width: 25% !important;}#u_content_text_3 .v-container-padding-padding{padding: 10px 20px 20px !important;}#u_content_button_1 .v-size-width{width: 65% !important;}#u_content_text_2 .v-container-padding-padding{padding: 20px 20px 60px !important;}#u_content_text_4 .v-container-padding-padding{padding: 60px 20px !important;}#u_content_heading_2 .v-container-padding-padding{padding: 30px 10px 0px !important;}#u_content_heading_2 .v-text-align{text-align: center !important;}#u_content_text_5 .v-container-padding-padding{padding: 10px 20px 30px !important;}#u_content_text_5 .v-text-align{text-align: center !important;}}<\/style> <link href=\"https:\/\/fonts.googleapis.com\/css?family=Open+Sans:400,700&display=swap\" rel=\"stylesheet\" type=\"text\/css\"><link href=\"https:\/\/fonts.googleapis.com\/css?family=Rubik:400,700&display=swap\" rel=\"stylesheet\" type=\"text\/css\"><\/head><body class=\"clean-body u_body\" style=\"margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #000000;color: #000000\"> <table id=\"u_body\" style=\"border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #000000;width:100%\" cellpadding=\"0\" cellspacing=\"0\"> <tbody> <tr style=\"vertical-align: top\"> <td style=\"word-break: break-word;border-collapse: collapse !important;vertical-align: top\"> <div class=\"u-row-container\" style=\"padding: 0px;background-color: transparent\"> <div class=\"u-row\" style=\"Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;\"> <div style=\"border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;\"> <div class=\"u-col u-col-100\" style=\"max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;\"> <div style=\"height: 100%;width: 100% !important;\"> <div style=\"height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\"> <table id=\"u_content_image_1\" style=\"font-family:'Open Sans',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\"> <tbody> <tr> <td class=\"v-container-padding-padding\" style=\"overflow-wrap:break-word;word-break:break-word;padding:120px 10px 100px;font-family:'Open Sans',sans-serif;\" align=\"left\"> <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"> <tr> <td class=\"v-text-align\" style=\"padding-right: 0px;padding-left: 0px;\" align=\"center\"> <img align=\"center\" border=\"0\" src=\"..\/img\/image-4.png\" alt=\"Logo\" title=\"Logo\" style=\"outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 47%;max-width: 272.6px;\" width=\"272.6\" class=\"v-src-width v-src-max-width\"\/> <\/td><\/tr><\/table> <\/td><\/tr><\/tbody><\/table> <\/div><\/div><\/div><\/div><\/div><\/div><div class=\"u-row-container\" style=\"padding: 0px;background-color: transparent\"> <div class=\"u-row\" style=\"Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;\"> <div style=\"border-collapse: collapse;display: table;width: 100%;height: 100%;background-image: url('..\/img\/image-2.png');background-repeat: no-repeat;background-position: center top;background-color: transparent;\"> <div class=\"u-col u-col-100\" style=\"max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;\"> <div style=\"background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;\"> <div style=\"height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;\"> <table style=\"font-family:'Open Sans',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\"> <tbody> <tr> <td class=\"v-container-padding-padding\" style=\"overflow-wrap:break-word;word-break:break-word;padding:60px 10px 10px;font-family:'Open Sans',sans-serif;\" align=\"left\"> <div class=\"v-text-align\" style=\"line-height: 170%; text-align: center; word-wrap: break-word;\"> <p style=\"font-size: 14px; line-height: 170%;\"><span style=\"font-size: 20px; line-height: 34px;\"><strong><span style=\"line-height: 34px; font-size: 20px;\">Hi "+firstName+",<\/span><\/strong><\/span><\/p><\/div><\/td><\/tr><\/tbody><\/table><table id=\"u_content_text_3\" style=\"font-family:'Open Sans',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\"> <tbody> <tr> <td class=\"v-container-padding-padding\" style=\"overflow-wrap:break-word;word-break:break-word;padding:10px 100px 20px;font-family:'Open Sans',sans-serif;\" align=\"left\"> <div class=\"v-text-align\" style=\"line-height: 170%; text-align: center; word-wrap: break-word;\"> <p style=\"line-height: 170%; font-size: 14px;\"><span style=\"font-size: 16px; line-height: 27.2px;\">We just need you to do this one last bit before we provide you with your API token. Please verify you email address by clicking the button below<\/span><\/p><\/div><\/td><\/tr><\/tbody><\/table><table id=\"u_content_button_1\" style=\"font-family:'Open Sans',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\"> <tbody> <tr> <td class=\"v-container-padding-padding\" style=\"overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Open Sans',sans-serif;\" align=\"left\"> <div class=\"v-text-align\" align=\"center\"> <a href=\""+verification_token+"\" target=\"_blank\" class=\"v-button v-size-width\" style=\"box-sizing: border-box;display: inline-block;font-family:'Open Sans',sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #000000; border-radius: 4px;-webkit-border-radius: 4px; -moz-border-radius: 4px; width:50%; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;\"> <span style=\"display:block;padding:10px 20px;line-height:120%;\"><span style=\"font-size: 16px; line-height: 19.2px;\"><strong><span style=\"line-height: 19.2px; font-size: 16px;\">Verify Email<\/span><\/strong><\/span><\/span> <\/a> <\/div><\/td><\/tr><\/tbody><\/table><table id=\"u_content_text_2\" style=\"font-family:'Open Sans',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\"> <tbody> <tr> <td class=\"v-container-padding-padding\" style=\"overflow-wrap:break-word;word-break:break-word;padding:20px 100px 60px;font-family:'Open Sans',sans-serif;\" align=\"left\"> <div class=\"v-text-align\" style=\"line-height: 170%; text-align: center; word-wrap: break-word;\"> <p style=\"font-size: 14px; line-height: 170%;\">If you never signed up for this. You can simply ignore this and we'll see you somewhere in the future &lt;3.\u00A0<\/p><\/div><\/td><\/tr><\/tbody><\/table> <\/div><\/div><\/div><\/div><\/div><\/div><div class=\"u-row-container\" style=\"padding: 0px;background-color: transparent\"> <div class=\"u-row\" style=\"Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;\"> <div style=\"border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;\"> <div class=\"u-col u-col-100\" style=\"max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;\"> <div style=\"background-color: #000000;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;\"> <div style=\"height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;\"> <table id=\"u_content_text_4\" style=\"font-family:'Open Sans',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\"> <tbody> <tr> <td class=\"v-container-padding-padding\" style=\"overflow-wrap:break-word;word-break:break-word;padding:60px 80px;font-family:'Open Sans',sans-serif;\" align=\"left\"> <div class=\"v-text-align\" style=\"color: #ffffff; line-height: 170%; text-align: center; word-wrap: break-word;\"> <p style=\"font-size: 14px; line-height: 170%;\">Need help? <a rel=\"noopener\" href=\"mailto:support@cloudpiler.tech?\" target=\"_blank\">Contact our support team<\/a>.<\/p><p style=\"font-size: 14px; line-height: 170%;\">Want to get started with custom plans of our products?<\/p><p style=\"font-size: 14px; line-height: 170%;\">Lets have a chat,<a rel=\"noopener\" href=\"https:\/\/koalendar.com\/e\/product-discussion-koaF19M4\" target=\"_blank\"> book a call<\/a>.<\/p><\/div><\/td><\/tr><\/tbody><\/table> <\/div><\/div><\/div><\/div><\/div><\/div><div class=\"u-row-container\" style=\"padding: 0px;background-color: transparent\"> <div class=\"u-row\" style=\"Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;\"> <div style=\"border-collapse: collapse;display: table;width: 100%;height: 100%;background-image: url('..\/img\/image-3.png');background-repeat: no-repeat;background-position: center top;background-color: transparent;\"> <div class=\"u-col u-col-50\" style=\"max-width: 320px;min-width: 300px;display: table-cell;vertical-align: top;\"> <div style=\"background-color: #f1c40f;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;\"> <div style=\"height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;\"> <table id=\"u_content_heading_2\" style=\"font-family:'Open Sans',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\"> <tbody> <tr> <td class=\"v-container-padding-padding\" style=\"overflow-wrap:break-word;word-break:break-word;padding:30px 10px 0px 50px;font-family:'Open Sans',sans-serif;\" align=\"left\"> <h1 class=\"v-text-align\" style=\"margin: 0px; line-height: 140%; text-align: left; word-wrap: break-word; font-weight: normal; font-family: 'Rubik',sans-serif; font-size: 22px;\"><div><div><strong>CloudPiler<\/strong><\/div><\/div><\/h1> <\/td><\/tr><\/tbody><\/table> <\/div><\/div><\/div><div class=\"u-col u-col-50\" style=\"max-width: 320px;min-width: 300px;display: table-cell;vertical-align: top;\"> <div style=\"background-color: #f1c40f;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;\"> <div style=\"height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;\"> <table id=\"u_content_text_5\" style=\"font-family:'Open Sans',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\"> <tbody> <tr> <td class=\"v-container-padding-padding\" style=\"overflow-wrap:break-word;word-break:break-word;padding:31px 50px 30px 10px;font-family:'Open Sans',sans-serif;\" align=\"left\"> <div class=\"v-text-align\" style=\"line-height: 170%; text-align: right; word-wrap: break-word;\"> <p style=\"font-size: 14px; line-height: 170%;\">You one stop solution to remote<\/p><p style=\"font-size: 14px; line-height: 170%;\">code execution.<\/p><\/div><\/td><\/tr><\/tbody><\/table> <\/div><\/div><\/div><\/div><\/div><\/div><div class=\"u-row-container\" style=\"padding: 0px;background-color: transparent\"> <div class=\"u-row\" style=\"Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;\"> <div style=\"border-collapse: collapse;display: table;width: 100%;height: 100%;background-image: url('..\/img\/image-1.png');background-repeat: no-repeat;background-position: center top;background-color: transparent;\"> <div class=\"u-col u-col-100\" style=\"max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;\"> <div style=\"background-color: #000000;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;\"> <div style=\"height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;\"> <table style=\"font-family:'Open Sans',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\"> <tbody> <tr> <td class=\"v-container-padding-padding\" style=\"overflow-wrap:break-word;word-break:break-word;padding:20px;font-family:'Open Sans',sans-serif;\" align=\"left\"> <div class=\"v-text-align\" style=\"color: #f1c40f; line-height: 140%; text-align: center; word-wrap: break-word;\"> <p style=\"font-size: 14px; line-height: 140%;\">You can visit us at cloudpiler.tech<\/p><\/div><\/td><\/tr><\/tbody><\/table> <\/div><\/div><\/div><\/div><\/div><\/div><\/td><\/tr><\/tbody> <\/table> <\/body><\/html>"
    const mailOptions = {
        from: "CloudPiler <no-reply@cloudpiler.tech>", // sender address
        to: email,
        subject: "Verify Email: One last step before we get started", // Subject line
        html: mailString, // plain text body
    };
    transporter.sendMail(mailOptions, async function(err, info) {
    if (err) {
        console.log(err)
        res.status(500)
        res.json({success:false, errorCode:"-1", errorMessage:"An error occured while sending email"})
        return
    }
        try{
        const updatedUser = await user.updateOne({email:email
        }, {
            $set: {
                emailValidTill:Date.now() + 1000*60,
            }
        })
        }
        catch(error){
            console.log(error)
            res.status(500)
            res.json({success:false, errorCode:"-1", errorMessage:"An error occured while sending email"})
            return
        }
        console.log(info);
        res.status(200)
        res.json({success:true, errorCode:"0", errorMessage:""})

    })


}

const verifyEmail = async(req, res) => {
    jwtSecretKey = process.env.SECRET_JWT
    if(req.query.hasOwnProperty("authentication_token") === false){
        res.status(500)
        res.json({success:false, errorCode:"-1", errorMessage:"No verification token provided"})
        return
    }
    var token = req.query.authentication_token
    try{
        var verified = jwt.verify(token, jwtSecretKey)
    }
    catch(error){
        res.status(500)
        res.json({success:false, errorCode:"-1", errorMessage:"Invalid verification token provided"})
        return
    }
    if(verified){
        const email = verified.email
        try{
            const updatedUser = await user.updateOne({email:email
            }, {
                $set: {
                    isEmailVerified:true,
                }
            })
            res.status(200)
            res.redirect("/account")
        }
        catch(error){
            res.status(500)
            res.json({success:false, errorCode:"-1", errorMessage:"An error occured while verifying email"})
            return
        }
    }
    else{
        res.status(500)
        res.json({success:false, errorCode:"-1", errorMessage:"An error occured while verifying email, the token might be expored, try again."})
        return
    }

}

module.exports = {getInfo, verifyEmail, sendVerificationEmail}