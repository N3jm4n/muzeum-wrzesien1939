package muzeum_wrzesien1939_api.donation.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import muzeum_wrzesien1939_api.user.entity.User;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "donations")
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String itemName;

    @Column(length = 2000)
    private String description;

    //TODO get rid of lob, maybe use binary image data
    @Lob
    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DonationStatus status;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User donor;

    @CreationTimestamp
    private LocalDateTime createdAt;
}