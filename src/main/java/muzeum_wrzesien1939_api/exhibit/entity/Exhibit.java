package muzeum_wrzesien1939_api.exhibit.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "exhibits")
public class Exhibit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 2000)
    private String description;

    //TODO think whether String or int would be better
    //String so we can use more of description when exact year unknown (e.g. XIX century)
    private String productionYear;

    //TODO get rid of lob, maybe use binary image data
    @Lob
    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExhibitCategory category;
}