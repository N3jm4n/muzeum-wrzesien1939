package muzeum_wrzesien1939_api.reservation.repository;

import muzeum_wrzesien1939_api.reservation.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    @Query("SELECT COALESCE(SUM(r.numberOfGuests), 0) FROM Reservation r WHERE r.visitDate = :date AND r.visitTime = :time")
    Integer sumGuestsByVisitDateAndVisitTime(@Param("date") LocalDate date, @Param("time") LocalTime time);

    List<Reservation> findAllByUserId(Long userId);

    List<Reservation> findAllByVisitDate(LocalDate date);
}