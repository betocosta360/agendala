import { getCustomRepository } from 'typeorm'
import { startOfHour } from "date-fns";
import Appointment from "../models/Appointment";
import AppointmentsRepository from "../repositories/AppointmentsRepository";

interface Request {
    date: Date;
    provider_id: string
}

class CreateAppointmentService {

    public async execute({date, provider_id}: Request): Promise<Appointment>{
        const appointmentsRepository = 
        getCustomRepository(AppointmentsRepository)

        const appointmentDate = startOfHour(date)

        const findAppointmentInSameDate = await appointmentsRepository
        .findByDate(appointmentDate)

        if(findAppointmentInSameDate){
            throw  Error("Estamos sem atendente para este horário"); 
        }
        const appointment = appointmentsRepository.create({
            provider_id,
            date: appointmentDate
        })
        await appointmentsRepository.save(appointment)
        return appointment
    }
}

export default CreateAppointmentService