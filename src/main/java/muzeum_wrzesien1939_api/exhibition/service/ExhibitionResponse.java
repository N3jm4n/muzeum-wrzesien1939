package muzeum_wrzesien1939_api.exhibition.service;

import lombok.Builder;
import lombok.Data;
import muzeum_wrzesien1939_api.exhibit.service.ExhibitResponse;

import java.util.List;

@Data
@Builder
public class ExhibitionResponse {
    private Long id;
    private String name;
    private String description;
    private String backgroundImageUrl;
    private List<ExhibitResponse> exhibits;
}