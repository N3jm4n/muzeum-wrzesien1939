package muzeum_wrzesien1939_api.exhibition.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import muzeum_wrzesien1939_api.exhibit.entity.Exhibit;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "exhibitions")
public class Exhibition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 2000)
    private String description;

    //TODO get rid of lob, maybe use binary image data
    @Lob
    @Column(columnDefinition = "TEXT")
    private String backgroundImageUrl;

    @ManyToMany
    @JoinTable(
            name = "exhibition_exhibits",
            joinColumns = @JoinColumn(name = "exhibition_id"),
            inverseJoinColumns = @JoinColumn(name = "exhibit_id")
    )
    private List<Exhibit> exhibits;
}