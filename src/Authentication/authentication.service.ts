import { sql } from "drizzle-orm";
import db from "../Drizzle/db";
import { UserEntity, UsersTable } from "../Drizzle/schema";

export const createUserService = async (user: UserEntity) => {
    await db.insert(UsersTable).values(user)
    return "User created successfully";
}

export const getUserByEmailService = async (email: string) => {
    return await db.query.UsersTable.findFirst({
        where: sql`${UsersTable.email} = ${email}`
    });
};

export const verifyUserService = async (email: string) => {
    await db.update(UsersTable)
        .set({ isVerified: true, verificationCode: null })
        .where(sql`${UsersTable.email} = ${email}`);
}


//login a user
export const userLoginService = async (user: UserEntity) => {
    // email and password
    const { email } = user;

    return await db.query.UsersTable.findFirst({
        columns: {
            userID: true,           
            email: true,
            password: true,
            role: true
        }, where: sql`${UsersTable.email} = ${email} `
    })
}