import { Router } from "express";
import { parseISO } from 'date-fns'
import AppointmentsRepository from "../repositories/AppointmentsRepository";
import CreateAppointmentService from "../services/CreateAppointmentService";
import { getCustomRepository } from "typeorm";
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get('/', async (request, response) => {
    console.log(request.user)
    const appointmentsRepository = getCustomRepository(AppointmentsRepository)
    const appointments = await appointmentsRepository.find()
    return response.json(appointments)
})

appointmentsRouter.post('/', async (request, response) => {

    const { provider_id, date } = request.body
    const parseDate = parseISO(date)
    const createAppointment = new CreateAppointmentService()
    const appointment = await createAppointment.execute({
        date: parseDate,
        provider_id
    })
    return response.json(appointment)


})

export default appointmentsRouter