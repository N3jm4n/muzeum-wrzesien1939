package muzeum_wrzesien1939_api.donation.repository;

import muzeum_wrzesien1939_api.donation.entity.Donation;
import muzeum_wrzesien1939_api.donation.entity.DonationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, Long> {

    List<Donation> findAllByStatus(DonationStatus status);

    List<Donation> findAllByDonor_Id(Long userId);
}