package muzeum_wrzesien1939_api.exhibition.service;

import lombok.Data;
import java.util.List;

@Data
public class ExhibitionRequest {
    private String name;
    private String description;
    private String backgroundImageUrl;
    private List<Long> exhibitIds;
}