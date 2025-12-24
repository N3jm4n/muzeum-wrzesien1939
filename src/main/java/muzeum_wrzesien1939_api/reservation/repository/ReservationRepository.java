package muzeum_wrzesien1939_api.reservation.repository;

import muzeum_wrzesien1939_api.reservation.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    boolean existsByVisitDateAndVisitTime(LocalDate date, LocalTime time);

    List<Reservation> findAllByUserId(Long userId);

    List<Reservation> findAllByVisitDate(LocalDate date);
}