package muzeum_wrzesien1939_api.reservation.service;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
public class ReservationResponse {
    private Long id;
    private LocalDate visitDate;
    private LocalTime visitTime;
    private int numberOfGuests;
    private String firstName;
    private String lastName;
    private String userEmail;
}