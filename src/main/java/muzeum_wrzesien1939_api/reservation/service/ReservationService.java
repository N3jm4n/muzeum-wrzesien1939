package muzeum_wrzesien1939_api.reservation.service;

import lombok.RequiredArgsConstructor;
import muzeum_wrzesien1939_api.reservation.entity.Reservation;
import muzeum_wrzesien1939_api.reservation.repository.ReservationRepository;
import muzeum_wrzesien1939_api.user.entity.User;
import muzeum_wrzesien1939_api.user.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;

    //TODO possibly make them adjustable for admin
    private final LocalTime OPENING_TIME = LocalTime.of(10, 0);
    private final LocalTime CLOSING_TIME = LocalTime.of(15, 0);

    public List<TimeSlotResponse> getAvailableSlots(LocalDate date) {
        List<TimeSlotResponse> slots = new ArrayList<>();
        LocalTime currentTime = OPENING_TIME;

        while (!currentTime.isAfter(CLOSING_TIME)) {
            boolean isTaken = reservationRepository.existsByVisitDateAndVisitTime(date, currentTime);

            slots.add(TimeSlotResponse.builder()
                    .time(currentTime)
                    .isAvailable(!isTaken)
                    .build());

            currentTime = currentTime.plusHours(1);
        }
        return slots;
    }

    public void makeReservation(ReservationRequest request) {
        if (reservationRepository.existsByVisitDateAndVisitTime(request.getDate(), request.getTime())) {
            throw new RuntimeException("This time slot is already booked!");
        }

        String email = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Reservation reservation = Reservation.builder()
                .visitDate(request.getDate())
                .visitTime(request.getTime())
                .numberOfGuests(request.getNumberOfGuests())
                .user(user)
                .build();

        reservationRepository.save(reservation);
    }

    public List<ReservationResponse> getReservationsForDate(LocalDate date) {
        return reservationRepository.findAllByVisitDate(date)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<ReservationResponse> getMyReservations() {
        String email = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User user = userRepository.findByEmail(email).orElseThrow();

        return reservationRepository.findAllByUserId(user.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private ReservationResponse mapToResponse(Reservation reservation) {
        return ReservationResponse.builder()
                .id(reservation.getId())
                .visitDate(reservation.getVisitDate())
                .visitTime(reservation.getVisitTime())
                .numberOfGuests(reservation.getNumberOfGuests())
                .firstName(reservation.getUser().getFirstName())
                .lastName(reservation.getUser().getLastName())
                .userEmail(reservation.getUser().getEmail())
                .build();
    }
}