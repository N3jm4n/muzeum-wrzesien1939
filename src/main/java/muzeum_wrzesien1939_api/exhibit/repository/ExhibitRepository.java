package muzeum_wrzesien1939_api.exhibit.repository;

import muzeum_wrzesien1939_api.exhibit.entity.Exhibit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExhibitRepository extends JpaRepository<Exhibit, Long> {
}