import {connect} from '@/dbConfig/dbConfig'
import User from '@/models/userModel';

import {NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { sendEmail } from '@/helpers/mailer'

connect()

export async function POST(request: NextRequest){
    try{
        const reqBody = await request.json()
        const {username, email, password} = reqBody
        //validation left

        console.log(reqBody);
        const user = await User.findOne({email})

        if (user) {
            return NextResponse.json ({error: "user already exists"},{status: 400})
            
        }
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt)
        
       const newUser = new User ({
            username,
            email,
            password: hashedPassword

        })
        const savedUser =  await newUser.save()
        console.log(savedUser);
        
        // verification mail send process.. 

            await sendEmail({email,emailType: "VERIFY",userId: savedUser._id})
            return NextResponse.json({
                message: "user registered sussesfully",
                success: true,
                savedUser
            })



    } catch(error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({error: error.message}, {status: 500});
        }
        return NextResponse.json({error: "An unknown error occurred"}, {status: 500});

    }

}
