import Appointment from "../models/Appointment.js";
import asyncHandler from "../middleware/asyncHandler.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { fromZonedTime } from "date-fns-tz";
import { IST_TIMEZONE, nowInIST } from "../utils/dateUtils.js";

// Pagination default for getAppointments — prevents fetching entire collection
const DEFAULT_PAGE_LIMIT = 50;

// @desc Create a new appointment
// @route  POST /api/appointments
// @access Private (Patient/Doctor/Admin)
export const createAppointment = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ userId: req.body.doctor });
  const patient = await Patient.findOne({ userId: req.body.patient });

  if (!doctor) return errorResponse(res, "Doctor not found", 404);
  if (!patient) return errorResponse(res, "Patient not found", 404);

  const appointment = new Appointment({
    ...req.body,
    doctorProfile: doctor._id,
  });

  await appointment.save();

  await Doctor.findOneAndUpdate(
    { userId: appointment.doctor },
    { $push: { appointments: appointment._id } },
  );

  await Patient.findOneAndUpdate(
    { userId: appointment.patient },
    { $push: { appointments: appointment._id } },
  );

  return successResponse(
    res,
    appointment,
    "Appointment created successfully",
    201,
  );
});

// @desc Get all appointments
// @route  GET /api/appointments
// @access Private (Admin/Doctor)
export const getAppointments = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, parseInt(req.query.limit) || DEFAULT_PAGE_LIMIT);
  const skip = (page - 1) * limit;

  const [appointments, total] = await Promise.all([
    Appointment.find()
      .populate("patient", "name email")
      .populate("doctor", "name email")
      .populate("doctorProfile", "specialization")
      .sort({ appointmentDate: -1 })
      .skip(skip)
      .limit(limit),
    Appointment.countDocuments(),
  ]);

  return successResponse(
    res,
    {
      appointments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    },
    "Appointments retrieved successfully",
    200,
  );
});

// @desc Get single appointment
// @route  GET /api/appointments/:id
// @access Private
export const getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate("patient", "name email")
    .populate("doctor", "name specialization email");

  if (!appointment) return errorResponse(res, "Appointment not found", 404);

  return successResponse(
    res,
    appointment,
    "Appointment retrieved successfully",
    200,
  );
});

// @desc Update appointment
// @route  PUT /api/appointments/:id
// @access Private
export const updateAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true },
  );

  if (!appointment) return errorResponse(res, "Appointment not found", 404);

  return successResponse(
    res,
    appointment,
    "Appointment updated successfully",
    200,
  );
});

// @desc Delete appointment
// @route  DELETE /api/appointments/:id
// @access Private (Admin/Doctor)
export const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) return errorResponse(res, "Appointment not found", 404);

  await Doctor.findOneAndUpdate(
    { userId: appointment.doctor },
    { $pull: { appointments: appointment._id } },
  );

  await Patient.findOneAndUpdate(
    { userId: appointment.patient },
    { $pull: { appointments: appointment._id } },
  );

  await Appointment.findByIdAndDelete(req.params.id);

  return successResponse(res, null, "Appointment deleted successfully", 200);
});

// @desc Get upcoming appointments (Patient/Doctor)
// @route  GET /api/appointments/upcoming
// @access Private
export const getUpcomingAppointments = asyncHandler(async (req, res) => {
  const { role, id } = req.user;

  const now = nowInIST();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  const query = {
    appointmentDate: { $gte: startOfToday },
    status: {
      $nin: ["cancelled-by-patient", "cancelled-by-doctor", "no-show"],
    },
  };

  if (role === "patient") {
    query.patient = id;
  } else if (role === "doctor") {
    query.doctor = id;
  } else {
    return errorResponse(
      res,
      "Only patients or doctors can view upcoming appointments",
      403,
    );
  }

  const appointments = await Appointment.find(query)
    .populate("patient", "name email role")
    .populate("doctor", "name email role")
    .populate("doctorProfile", "specialization experience")
    .sort({ appointmentDate: 1 });

  return successResponse(
    res,
    appointments,
    "Upcoming appointments retrieved successfully",
    200,
  );
});

// @desc Get past appointments (Patient/Doctor)
// @route  GET /api/appointments/past
// @access Private
export const getPastAppointments = asyncHandler(async (req, res) => {
  const { role, id } = req.user;

  const query = { appointmentDate: { $lt: nowInIST() } };

  if (role === "patient") {
    query.patient = id;
  } else if (role === "doctor") {
    query.doctor = id;
  } else {
    return errorResponse(
      res,
      "Only patients or doctors can view past appointments",
      403,
    );
  }

  const appointments = await Appointment.find(query)
    .populate("patient", "userId name email")
    .populate("doctor", "userId name specialization email")
    .sort({ appointmentDate: -1 });

  return successResponse(
    res,
    appointments,
    "Past appointments retrieved successfully",
    200,
  );
});

// @desc Cancel appointment
// @route  PATCH /api/appointments/:id/cancel
// @access Private
const CANCELLATION_WINDOW_HOURS = 24;

export const cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  const { role } = req.user;
  const { reason } = req.body;

  if (!appointment) return errorResponse(res, "Appointment not found", 404);

  if (
    appointment.status.startsWith("cancelled-by") ||
    appointment.status === "completed"
  ) {
    return errorResponse(
      res,
      `Cannot cancel appointment with status: ${appointment.status}`,
      400,
    );
  }

  const now = nowInIST();
  const timeDiffMs =
    new Date(appointment.appointmentDate).getTime() - now.getTime();
  const isLateCancellation =
    timeDiffMs < CANCELLATION_WINDOW_HOURS * 60 * 60 * 1000;

  appointment.status = `cancelled-by-${role}`;
  appointment.cancellationDetails = {
    cancelledBy: role,
    cancellationTimestamp: now,
    cancellationReason: reason || "No reason provided.",
    isLateCancellation,
  };
  appointment.lastUpdatedBy = role;

  await appointment.save();

  return successResponse(
    res,
    appointment,
    "Appointment cancelled successfully",
    200,
  );
});

// @desc Confirm appointment
// @route  PATCH /api/appointments/:id/confirm
// @access Private (Doctor/Admin)
export const confirmAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) return errorResponse(res, "Appointment not found", 404);

  if (appointment.status !== "scheduled") {
    return errorResponse(
      res,
      `Cannot confirm appointment with status: ${appointment.status}`,
      400,
    );
  }

  appointment.status = "confirmed";
  appointment.lastUpdatedBy = req.user.role;
  await appointment.save();

  return successResponse(
    res,
    appointment,
    "Appointment confirmed successfully",
    200,
  );
});

// @desc Complete appointment
// @route  PATCH /api/appointments/:id/complete
// @access Private (Doctor/Admin)
export const completeAppointment = asyncHandler(async (req, res) => {
  const { notes } = req.body;
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) return errorResponse(res, "Appointment not found", 404);

  if (
    appointment.status === "completed" ||
    appointment.status === "cancelled"
  ) {
    return errorResponse(
      res,
      `Cannot complete appointment with status: ${appointment.status}`,
      400,
    );
  }

  appointment.status = "completed";
  appointment.lastUpdatedBy = req.user.role;
  if (notes) appointment.notes = notes;

  await appointment.save();

  return successResponse(
    res,
    appointment,
    "Appointment completed successfully",
    200,
  );
});

// @desc Get appointments by date range
// @route  GET /api/appointments/date-range
// @access Private
export const getAppointmentsByDateRange = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const { role, id } = req.user;

  if (!startDate || !endDate) {
    return errorResponse(res, "Start date and end date are required", 400);
  }

  const startUTC = fromZonedTime(`${startDate}T00:00:00`, IST_TIMEZONE);
  const endUTC = fromZonedTime(`${endDate}T00:00:00`, IST_TIMEZONE);
  endUTC.setDate(endUTC.getDate() + 1);

  const query = {
    appointmentDate: { $gte: startUTC, $lt: endUTC },
  };

  if (role === "patient") query.patient = id;
  else if (role === "doctor") query.doctor = id;

  const appointments = await Appointment.find(query)
    .populate("patient", "name email role")
    .populate("doctor", "name email role")
    .populate("doctorProfile", "specialization")
    .sort({ appointmentDate: 1 });

  return successResponse(
    res,
    appointments,
    "Appointments retrieved successfully",
    200,
  );
});

// @desc Get appointment statistics
// @route  GET /api/appointments/stats
// @access Private (Admin/Doctor)
export const getAppointmentStats = asyncHandler(async (req, res) => {
  const { role, id } = req.user;

  let matchQuery = {};
  if (role === "doctor") matchQuery.doctor = id;

  const stats = await Appointment.aggregate([
    { $match: matchQuery },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const totalAppointments = await Appointment.countDocuments(matchQuery);

  return successResponse(
    res,
    {
      total: totalAppointments,
      byStatus: stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
    },
    "Appointment statistics retrieved successfully",
    200,
  );
});
