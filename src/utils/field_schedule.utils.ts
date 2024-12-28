import { CreateFieldScheduleDto } from "src/dtos/field_scheudle/createFieldSchedule.dto";
import { SportCenter_Schedule } from "src/entities/sportcenter_schedules.entity";

export function validateFieldSchedule(
    fieldSchedule: CreateFieldScheduleDto,
    sportCenterSchedule: SportCenter_Schedule,
  ): boolean {
    const fieldOpeningTime = parseTime(fieldSchedule.opening_time);
    const fieldClosingTime = parseTime(fieldSchedule.closing_time);
    const sportCenterOpeningTime = parseTime(sportCenterSchedule.opening_time);
    const sportCenterClosingTime = parseTime(sportCenterSchedule.closing_time);
  
    // Validar que el horario de apertura/cierre de la cancha esté dentro del rango del centro deportivo
    const isWithinSportCenterHours =
      fieldOpeningTime >= sportCenterOpeningTime &&
      fieldClosingTime <= sportCenterClosingTime;
  
    // Validar que el horario de apertura sea antes del horario de cierre
    const isValidTimeRange = fieldOpeningTime < fieldClosingTime;
  
    return isWithinSportCenterHours && isValidTimeRange;
  }
  
  function parseTime(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes; // Conversión a minutos
  }


