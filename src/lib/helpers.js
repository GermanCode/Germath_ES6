import bcrypt from 'bcryptjs';

const helpers = {};

helpers.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

helpers.mathPassword = async (password, savedPassword) =>{
    try{
        return await bcrypt.compare(password, savedPassword);
    }catch(e){
        console.log(e);
    }
};

//await bcrypt.compare(password, savedPassword);

module.exports = helpers;