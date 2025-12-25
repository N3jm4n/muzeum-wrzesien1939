package muzeum_wrzesien1939_api.donation.service;

import lombok.RequiredArgsConstructor;
import muzeum_wrzesien1939_api.donation.entity.Donation;
import muzeum_wrzesien1939_api.donation.entity.DonationStatus;
import muzeum_wrzesien1939_api.donation.repository.DonationRepository;
import muzeum_wrzesien1939_api.user.entity.User;
import muzeum_wrzesien1939_api.user.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DonationService {

    private final DonationRepository repository;
    private final UserRepository userRepository;

    public DonationResponse createDonation(DonationRequest request) {
        String email = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User user = userRepository.findByEmail(email).orElseThrow();

        var donation = Donation.builder()
                .itemName(request.getItemName())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .status(DonationStatus.PENDING)
                .donor(user)
                .build();

        return mapToResponse(repository.save(donation));
    }

    public List<DonationResponse> getDonations(DonationStatus status) {
        List<Donation> donations;
        if (status != null) {
            donations = repository.findAllByStatus(status);
        } else {
            donations = repository.findAll();
        }
        return donations.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<DonationResponse> getMyDonations() {
        String email = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User user = userRepository.findByEmail(email).orElseThrow();

        return repository.findAllByDonor_Id(user.getId())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public DonationResponse updateStatus(Long id, DonationStatus newStatus) {
        var donation = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donation not found"));

        donation.setStatus(newStatus);
        return mapToResponse(repository.save(donation));
    }

    private DonationResponse mapToResponse(Donation donation) {
        return DonationResponse.builder()
                .id(donation.getId())
                .itemName(donation.getItemName())
                .description(donation.getDescription())
                .imageUrl(donation.getImageUrl())
                .status(donation.getStatus())
                .createdAt(donation.getCreatedAt())
                .donorEmail(donation.getDonor().getEmail())
                .build();
    }
}