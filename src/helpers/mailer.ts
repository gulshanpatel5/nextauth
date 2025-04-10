import User from '@/models/userModel';
import nodemailer from 'nodemailer'
import bcrypt from 'bcryptjs'

export const sendEmail = async({email, emailType, userId}:any) =>
{
    try{
       
      const hashedToken = await bcrypt.hash(userId.toString(),10)

        if(emailType === "VERIFY"){
          await User.findByIdAndUpdate(userId,{verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000} )
        }else if( emailType === "RESET"){

          await User.findByIdAndUpdate(userId,{forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000} )

        }



        // Looking to send emails in production? Check out our Email API/SMTP product!
          const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "3059e80d702538",
              pass: "7960d7507ac525"
            }
          });
        const mailOptions =
            {
                from: 'gulshanpatel044@gmail.com', 
                to: email,
                subject: emailType === 'VERIFIED' ? "Verify Your email" : "Reset your password", 
                
                html: `<p> Click <a href="">here</a> to $ {emailType === "VERIFY" ? "verify your email" : "reset your password"} or copy and paste the link below in your browser.<br>
                </p> `,
              }
        
              const mailResponse =  await transport.sendMail(mailOptions)
              return mailResponse

        

    } catch (error: any) {
        throw new Error(error.message)

    }
}