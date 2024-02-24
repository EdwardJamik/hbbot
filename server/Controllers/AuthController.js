const User = require("../Models/manager.model");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");

module.exports.Signup = async (req, res, next) => {
    try {
        const { password, username,entree } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.json({ message: "Пользователь уже существует" });
        }
        const user = await User.create({ password, username, entree });
        res.json({ message: "Пользователя зарегистрировано", success: true });
    } catch (error) {
        console.error(error);
    }
};

module.exports.DeleteUser = async (req, res, next) => {
    try {
        const { id } = req.body;
        const user = await User.deleteOne({_id:id });
        res.json({ message: "Пользователь удалено", success: true });
    } catch (error) {
        console.error(error);
    }
};

module.exports.Login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if(!username || !password ){
            return res.json({message:'Заполните все поля'})
        }
        const user = await User.findOne({ username });
        if(!user){
            return res.json({message:'Неверное имя пользователя или пароль' })
        }
        const auth = await bcrypt.compare(password,user.password)
        if (!auth) {
            return res.json({message:'Неверный username или пароль' })
        }
        const token = createSecretToken(user._id);

        res.cookie("token", token, {
            httpOnly: false
        }).status(201).json({ message: "Пользователь успешно авторизован", success: true });


    } catch (error) {
        console.error(error);
    }
}

module.exports.Logout = async (req, res, next) => {
    try {
        res.clearCookie('token')
        res.status(201).json({ message: "User logged in successfully", success: true });

    } catch (error) {
        console.error(error);
    }
}
