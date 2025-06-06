import { createUserService, userLoginService } from "../../../src/Authentication/authentication.service"
import db from "../../../src/Drizzle/db"
import { UserEntity } from "../../../src/Drizzle/schema"


jest.mock("../../../src/Drizzle/db", () => ({  // used to mock the database module
    insert: jest.fn(() => ({ // mock the insert method
        values: jest.fn().mockReturnThis()//mockReturnThis() is used to return the same object
    })),
    query: {
        UsersTable: {
            findFirst: jest.fn()
        }
    }
}))

describe("Auth Service", () => {
    afterEach(() => {
        jest.clearAllMocks();
    })

    describe("createUserService", () => {
        it('should insert a user and return success message', async () => {
            const user = {
                firstName: 'Test',
                lastName: 'User',
                email: 'test@mail.com',
                password: 'hashed',
                userID: 1,
                phoneNumber: null,
                address:  null,
                role: null,
                createdAt:  null, 
                isVerified: true,
                verificationCode: null
            };
            const result = await createUserService(user)
            expect(db.insert).toHaveBeenCalled()
            expect(result).toBe("User created successfully")
        })
    })


    describe('userLoginService', () => {
        it("should return user data if found", async () => {
            const mockUser = {
                id: 1,
                firstName: 'Test',
                lastName: 'User',
                email: 'test@mail.com',
                password: 'hashed'
            };
            (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValueOnce(mockUser)

            const result = await userLoginService({ email: 'test@mail.com' } as UserEntity)

            expect(db.query.UsersTable.findFirst).toHaveBeenCalled()
            expect(result).toEqual(mockUser)
        })

        it('should return null if user not found', async () => {
            (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValueOnce(null)

            const result = await userLoginService({ email: 'test@mail.com' } as UserEntity)
            expect(db.query.UsersTable.findFirst).toHaveBeenCalled()
            expect(result).toBeNull()
        })
    })

})