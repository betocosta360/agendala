import { getRepository } from 'typeorm'
import { hash } from 'bcryptjs'

import User from '../models/User'
import AppError from '../errors/AppErrors'

interface Request {
    name: string;
    email: string;
    password: string
}
class CreateUserService {
    public async execute({ name, email, password }: Request):
        Promise<User> {
        const usersRepository = getRepository(User)

        const checkUserExist = await usersRepository
            .findOne({
                where: { email }
            })

        if (checkUserExist) {
            throw new AppError('E-mail já cadastrado no sistema!!!', 401)
        }
        const hashedPassword = await hash(password, 8)

        const user = usersRepository.create({
            name, email, password: hashedPassword
        })
        await usersRepository.save(user)
        return user
    }
}

export default CreateUserService