package muzeum_wrzesien1939_api.donation.service;

import lombok.Builder;
import lombok.Data;
import muzeum_wrzesien1939_api.donation.entity.DonationStatus;

import java.time.LocalDateTime;

@Data
@Builder
public class DonationResponse {
    private Long id;
    private String itemName;
    private String description;
    private String imageUrl;
    private DonationStatus status;
    private LocalDateTime createdAt;
    private String donorEmail;
}