package muzeum_wrzesien1939_api.donation.service;

import lombok.Data;

@Data
public class DonationRequest {
    private String itemName;
    private String description;
    private String imageUrl;
}