import Appointment from "../models/Appointment.js";
import asyncHandler from "../middleware/asyncHandler.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { addDays } from "date-fns"; // Import addDays for date range
import { IST_TIMEZONE, nowInIST } from "../utils/dateUtils.js"; // Import IST constant

// Helper function to get the current time in IST

// @desc Create a new appointment
// @route  POST /api/appointments
// @access Private (Patient/Doctor/Admin)
export const createAppointment = asyncHandler(async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.body.doctor });
    const patient = await Patient.findOne({ userId: req.body.patient });

    if (!doctor) return errorResponse(res, "Doctor not found", 404);
    if (!patient) return errorResponse(res, "Patient not found", 404);

    // ✅ Set doctorProfile explicitly
    const appointment = new Appointment({
      ...req.body,
      doctorProfile: doctor._id,
    });

    await appointment.save();

    // Add to doctor's appointments
    await Doctor.findOneAndUpdate(
      { userId: appointment.doctor },
      { $push: { appointments: appointment._id } }
    );

    // Add to patient's appointments
    await Patient.findOneAndUpdate(
      { userId: appointment.patient },
      { $push: { appointments: appointment._id } }
    );

    return successResponse(
      res,
      appointment,
      "Appointment created successfully",
      201
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
});

// @desc Get all appointments
// @route  GET /api/appointments
// @access Private (Admin/Doctor)
export const getAppointments = asyncHandler(async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "name email")
      .populate("doctor", "name  email")
      .populate("doctorProfile", " specialization ");

    return successResponse(
      res,
      appointments,
      "Appointments retrieved successfully",
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

// @desc Get single appointment
// @route  GET /api/appointments/:id
// @access Private
export const getAppointmentById = asyncHandler(async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patient", "name email")
      .populate("doctor", "name specialization email");

    if (!appointment) {
      return errorResponse(res, "Appointment not found", 404);
    }

    return successResponse(
      res,
      appointment,
      "Appointment retrieved successfully",
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

// @desc Update appointment
// @route  PUT /api/appointments/:id
// @access Private
export const updateAppointment = asyncHandler(async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!appointment) {
      return errorResponse(res, "Appointment not found", 404);
    }

    return successResponse(
      res,
      appointment,
      "Appointment updated successfully",
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
});

// @desc Delete appointment
// @route  DELETE /api/appointments/:id
// @access Private (Admin/Doctor)
export const deleteAppointment = asyncHandler(async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return errorResponse(res, "Appointment not found", 404);
    }

    // Remove appointment from doctor's appointments array
    await Doctor.findOneAndUpdate(
      { userId: appointment.doctor },
      { $pull: { appointments: appointment._id } }
    );

    // Remove appointment from patient's appointments array
    await Patient.findOneAndUpdate(
      { userId: appointment.patient },
      { $pull: { appointments: appointment._id } }
    );

    // Delete the appointment
    await Appointment.findByIdAndDelete(req.params.id);

    return successResponse(res, null, "Appointment deleted successfully", 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

// @desc Get upcoming appointments (Patient/Doctor)
// @route  GET /api/appointments/upcoming
// @access Private
export const getUpcomingAppointments = asyncHandler(async (req, res) => {
  const { role, id } = req.user;

  try {
    // Use IST-aware "now" for comparison
    const query = { appointmentDate: { $gte: nowInIST() } };

    if (role === "patient") {
      query.patient = id;
    } else if (role === "doctor") {
      query.doctor = id;
    } else {
      return errorResponse(
        res,
        "Only patients or doctors can view upcoming appointments",
        403
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
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

// @desc Get past appointments (Patient/Doctor)
// @route  GET /api/appointments/past
// @access Private
export const getPastAppointments = asyncHandler(async (req, res) => {
  const { role, id } = req.user;

  try {
    // Use IST-aware "now" for comparison
    const query = { appointmentDate: { $lt: nowInIST() } };

    if (role === "patient") {
      query.patient = id;
    } else if (role === "doctor") {
      query.doctor = id;
    } else {
      return errorResponse(
        res,
        "Only patients or doctors can view past appointments",
        403
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
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

// @desc Cancel appointment
// @route  PATCH /api/appointments/:id/cancel
// @access Private

// A constant for your business rule (e.g., 24-hour cancellation window)
const CANCELLATION_WINDOW_HOURS = 24;

export const cancelAppointment = asyncHandler(async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    const { role } = req.user; // Assuming role is on the req.user object
    const { reason } = req.body; // Get optional reason from request body

    if (!appointment) {
      return errorResponse(res, "Appointment not found", 404);
    }

    // A more robust check to see if the appointment is already cancelled
    if (
      appointment.status.startsWith("cancelled-by") ||
      appointment.status === "completed"
    ) {
      return errorResponse(
        res,
        `Cannot cancel appointment with status: ${appointment.status}`,
        400
      );
    }

    // --- Business Logic: Check for Late Cancellation ---
    const now = nowInIST(); // Use IST-aware "now"
    const appointmentDate = new Date(appointment.appointmentDate);
    // Calculate the difference in milliseconds
    const timeDiffMs = appointmentDate.getTime() - now.getTime();
    const isLateCancellation =
      timeDiffMs < CANCELLATION_WINDOW_HOURS * 60 * 60 * 1000;

    // --- Update Appointment Document ---

    // 1. Set the new, more descriptive status
    appointment.status = `cancelled-by-${role}`;

    // 2. Populate the detailed cancellation object for a clear audit trail
    appointment.cancellationDetails = {
      cancelledBy: role,
      cancellationTimestamp: now, // Use IST-aware "now"
      cancellationReason: reason || "No reason provided.", // Use reason from body or a default
      isLateCancellation: isLateCancellation,
    };

    // 3. Keep track of the last user to modify the record
    appointment.lastUpdatedBy = role;

    await appointment.save();

    return successResponse(
      res,
      appointment,
      "Appointment cancelled successfully",
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

// @desc Confirm appointment
// @route  PATCH /api/appointments/:id/confirm
// @access Private (Doctor/Admin)
export const confirmAppointment = asyncHandler(async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return errorResponse(res, "Appointment not found", 404);
    }

    // Check if appointment can be confirmed
    if (appointment.status !== "scheduled") {
      return errorResponse(
        res,
        `Cannot confirm appointment with status: ${appointment.status}`,
        400
      );
    }

    // Update appointment status to confirmed
    appointment.status = "confirmed";
    appointment.lastUpdatedBy = req.user.role;
    await appointment.save();

    return successResponse(
      res,
      appointment,
      "Appointment confirmed successfully",
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

// @desc Complete appointment
// @route  PATCH /api/appointments/:id/complete
// @access Private (Doctor/Admin)
export const completeAppointment = asyncHandler(async (req, res) => {
  try {
    const { notes } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return errorResponse(res, "Appointment not found", 404);
    }

    // Check if appointment can be completed
    if (
      appointment.status === "completed" ||
      appointment.status === "cancelled"
    ) {
      return errorResponse(
        res,
        `Cannot complete appointment with status: ${appointment.status}`,
        400
      );
    }

    // Update appointment status to completed
    appointment.status = "completed";
    appointment.lastUpdatedBy = req.user.role;

    // Add notes if provided
    if (notes) {
      appointment.notes = notes;
    }

    await appointment.save();

    return successResponse(
      res,
      appointment,
      "Appointment completed successfully",
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

// @desc Get appointments by date range
// @route  GET /api/appointments/date-range
// @access Private
export const getAppointmentsByDateRange = asyncHandler(async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const { role, id } = req.user;

    if (!startDate || !endDate) {
      return errorResponse(res, "Start date and end date are required", 400);
    }

    // Interpret the input dates as IST
    // e.g., "2025-10-31" becomes 2025-10-31 00:00:00 IST
    const startIST = zonedTimeToUtc(new Date(startDate), IST_TIMEZONE);

    // To include the entire end day, we get the start of the *next* day
    // e.g., "2025-10-31" becomes 2025-11-01 00:00:00 IST
    const endIST = addDays(zonedTimeToUtc(new Date(endDate), IST_TIMEZONE), 1);

    const query = {
      appointmentDate: {
        $gte: startIST,
        $lt: endIST, // Use $lt to capture everything *before* the next day starts
      },
    };

    // Filter by user role
    if (role === "patient") {
      query.patient = id;
    } else if (role === "doctor") {
      query.doctor = id;
    }
    // Admin can see all appointments (no additional filter)

    const appointments = await Appointment.find(query)
      .populate("patient", "name email role")
      .populate("doctor", "name email role")
      .populate("doctorProfile", "specialization")
      .sort({ appointmentDate: 1 });

    return successResponse(
      res,
      appointments,
      "Appointments retrieved successfully",
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

// @desc Get appointment statistics
// @route  GET /api/appointments/stats
// @access Private (Admin/Doctor)
export const getAppointmentStats = asyncHandler(async (req, res) => {
  try {
    const { role, id } = req.user;

    let matchQuery = {};
    if (role === "doctor") {
      matchQuery.doctor = id;
    }

    const stats = await Appointment.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalAppointments = await Appointment.countDocuments(matchQuery);

    const statsFormatted = {
      total: totalAppointments,
      byStatus: stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
    };

    return successResponse(
      res,
      statsFormatted,
      "Appointment statistics retrieved successfully",
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});
