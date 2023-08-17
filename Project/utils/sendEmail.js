const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'kuch57bhi@gmail.com',
                pass: 'Zainul10',
            },
        });
        console.log(email);
        await transporter.sendMail({
            from: 'kuch57bhi@gmail.com',
            to: email,
            subject: subject,
            text: text,
        });
        console.log("email sent successfully");
    } catch (error) {
        console.log("email not sent!");
        console.log(error);
        return error;

    }
};