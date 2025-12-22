package muzeum_wrzesien1939_api.exhibit.service;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import muzeum_wrzesien1939_api.exhibit.entity.ExhibitCategory;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExhibitResponse {
    private Long id;
    private String name;
    private String description;
    private String productionYear;
    private String imageUrl;
    private ExhibitCategory category;
}