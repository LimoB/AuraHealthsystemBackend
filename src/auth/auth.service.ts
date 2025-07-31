

//register a new user
import { eq } from "drizzle-orm";
import db  from "../drizzle/db";
import { userTable,} from "../drizzle/schema";
import { TUserInsert, TUserSelect } from "../drizzle/types"

// Create a new user
export const createUserServices = async (user: TUserInsert): Promise<TUserSelect> => {
  const [createdUser] = await db
    .insert(userTable)
    .values(user)
    .returning(); // returns an array of inserted rows

  return createdUser;
};


//get user by email
export const getUserByEmailServices = async(email:string):Promise<TUserSelect | undefined>=>{
    return await db.query.userTable.findFirst({
        where:(eq(userTable.email, email))
    })
}