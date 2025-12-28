package muzeum_wrzesien1939_api.exhibition.repository;

import muzeum_wrzesien1939_api.exhibition.entity.Exhibition;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExhibitionRepository extends JpaRepository<Exhibition, Long> {
}
