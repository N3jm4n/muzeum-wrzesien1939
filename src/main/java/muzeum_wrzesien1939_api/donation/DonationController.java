package muzeum_wrzesien1939_api.donation;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import muzeum_wrzesien1939_api.donation.entity.DonationStatus;
import muzeum_wrzesien1939_api.donation.service.DonationRequest;
import muzeum_wrzesien1939_api.donation.service.DonationResponse;
import muzeum_wrzesien1939_api.donation.service.DonationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/donations")
@RequiredArgsConstructor
@Tag(name = "Donations", description = "Managing item donations from users")
public class DonationController {

    private final DonationService service;

    @Operation(summary = "Submit a donation", description = "User submits an item for review.")
    @PostMapping
    public ResponseEntity<DonationResponse> createDonation(@RequestBody DonationRequest request) {
        return ResponseEntity.ok(service.createDonation(request));
    }

    @Operation(summary = "Get my donations", description = "Returns history of user's submissions.")
    @GetMapping("/my")
    @Transactional
    public ResponseEntity<List<DonationResponse>> getMyDonations() {
        return ResponseEntity.ok(service.getMyDonations());
    }

    @Operation(summary = "Get all donations", description = "Admin sees all donations (can filter by status).")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<DonationResponse>> getAllDonations(
            @RequestParam(required = false) DonationStatus status
    ) {
        return ResponseEntity.ok(service.getDonations(status));
    }

    @Operation(summary = "Update donation status", description = "Admin accepts or rejects the donation.")
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/status")
    public ResponseEntity<DonationResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam DonationStatus status
    ) {
        return ResponseEntity.ok(service.updateStatus(id, status));
    }
}