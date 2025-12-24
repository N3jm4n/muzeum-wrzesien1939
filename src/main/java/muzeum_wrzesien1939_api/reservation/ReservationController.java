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

    @Operation(summary = "Get my reservations", description = "Returns reservation history for the logged-in user.")
    @GetMapping("/my")
    public ResponseEntity<List<ReservationResponse>> getMyReservations() {
        return ResponseEntity.ok(service.getMyReservations());
    }
}