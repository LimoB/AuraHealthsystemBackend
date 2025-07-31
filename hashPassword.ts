const bcrypt = require('bcrypt');

async function generateHashedPassword(){
    const plainTextPassword = "password123"; 
    const saltRounds = 10; 
    try{
        // Number of rounds to generate the salt
    const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
    console.log('Hashed Password:', hashedPassword);// Example plaintext password
}catch (error) {
    console.error('Error hashing password:', error);
}
}
generateHashedPassword();