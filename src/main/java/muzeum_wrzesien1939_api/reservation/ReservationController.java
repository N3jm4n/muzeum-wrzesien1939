package muzeum_wrzesien1939_api.reservation;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import muzeum_wrzesien1939_api.reservation.service.ReservationRequest;
import muzeum_wrzesien1939_api.reservation.service.ReservationResponse;
import muzeum_wrzesien1939_api.reservation.service.ReservationService;
import muzeum_wrzesien1939_api.reservation.service.TimeSlotResponse;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/reservations")
@RequiredArgsConstructor
@Tag(name = "Reservations", description = "Booking museum visits")
public class ReservationController {

    private final ReservationService service;

    @Operation(summary = "Check available slots", description = "Returns available hours for a given date.")
    @GetMapping("/available-slots")
    public ResponseEntity<List<TimeSlotResponse>> getSlots(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return ResponseEntity.ok(service.getAvailableSlots(date));
    }

    @Operation(summary = "Make a reservation", description = "Books a visit for the logged-in user.")
    @PostMapping
    public ResponseEntity<String> makeReservation(@RequestBody ReservationRequest request) {
        service.makeReservation(request);
        return ResponseEntity.ok("Reservation confirmed!");
    }

    @Operation(summary = "Get reservations by date", description = "Returns a list of reservations for a specific day (ADMIN only).")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/by-date")
    public ResponseEntity<List<ReservationResponse>> getReservationsByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return ResponseEntity.ok(service.getReservationsForDate(date));
    }

    @Operation(summary = "Get reservations by month", description = "Returns a list of reservations for a specific month (ADMIN only).")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/by-month")
    public ResponseEntity<List<ReservationResponse>> getReservationsByMonth(
            @RequestParam int year,
            @RequestParam int month
    ) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
        return ResponseEntity.ok(service.getReservationsForDateRange(startDate, endDate));
    }

    @Operation(summary = "Get reservations by date range", description = "Returns a list of reservations for a specific date range (ADMIN only).")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/by-range")
    public ResponseEntity<List<ReservationResponse>> getReservationsByRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
    ) {
        return ResponseEntity.ok(service.getReservationsForDateRange(start, end));
    }

    @Operation(summary = "Get my reservations", description = "Returns reservation history for the logged-in user.")
    @GetMapping("/my")
    public ResponseEntity<List<ReservationResponse>> getMyReservations() {
        return ResponseEntity.ok(service.getMyReservations());
    }
}