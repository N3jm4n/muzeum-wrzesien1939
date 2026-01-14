package muzeum_wrzesien1939_api.exhibit.service;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Exhibit search criteria (Query Object Pattern)")
public class ExhibitSearchCriteria {

    @Schema(description = "Filter by name (partial match)", example = "Mask")
    private String name;

    @Schema(description = "Filter by category", example = "Militaria")
    private String category;

    @Schema(description = "Filter by production year", example = "1939")
    private Integer productionYear;
}