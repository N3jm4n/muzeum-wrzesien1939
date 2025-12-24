package muzeum_wrzesien1939_api.reservation.service;

import lombok.Builder;
import lombok.Data;
import java.time.LocalTime;

@Data
@Builder
public class TimeSlotResponse {
    private LocalTime time;
    private boolean isAvailable;
}