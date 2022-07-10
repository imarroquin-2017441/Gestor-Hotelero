export class UserModel {
    constructor(
        public id: String,
        public name: String,
        public surname: String,
        public username: String,
        public email: String,
        public password: String,
        public phone: String,
        public role: String
    ){

    }
}