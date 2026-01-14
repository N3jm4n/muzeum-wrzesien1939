package muzeum_wrzesien1939_api.exhibit;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import muzeum_wrzesien1939_api.exhibit.service.ExhibitRequest;
import muzeum_wrzesien1939_api.exhibit.service.ExhibitResponse;
import muzeum_wrzesien1939_api.exhibit.service.ExhibitSearchCriteria;
import muzeum_wrzesien1939_api.exhibit.service.ExhibitService;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/exhibits")
@RequiredArgsConstructor
@Tag(name = "Exhibits", description = "Management of museum exhibits")
public class ExhibitController {

    private final ExhibitService service;

    @Operation(summary = "Get all exhibits", description = "Returns a list of all exhibits with optional filtering (Query Object Pattern).")
    @GetMapping
    public ResponseEntity<List<ExhibitResponse>> getAllExhibits(
            @ParameterObject @ModelAttribute ExhibitSearchCriteria criteria
    ) {
        return ResponseEntity.ok(service.getAllExhibits(criteria));
    }

    @Operation(summary = "Create a new exhibit", description = "Adds a new exhibit to the database (ADMIN only).")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ExhibitResponse> createExhibit(@RequestBody ExhibitRequest request) {
        return ResponseEntity.ok(service.createExhibit(request));
    }

    @Operation(summary = "Get exhibit details", description = "Returns details of a single exhibit by ID.")
    @GetMapping("/{id}")
    public ResponseEntity<ExhibitResponse> getExhibitById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getExhibitById(id));
    }

    @Operation(summary = "Update exhibit", description = "Updates an existing exhibit (ADMIN only).")
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ExhibitResponse> updateExhibit(
            @PathVariable Long id,
            @RequestBody ExhibitRequest request
    ) {
        return ResponseEntity.ok(service.updateExhibit(id, request));
    }

    @Operation(summary = "Delete exhibit", description = "Removes an exhibit from the database (ADMIN only).")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExhibit(@PathVariable Long id) {
        service.deleteExhibit(id);
        return ResponseEntity.noContent().build();
    }
}