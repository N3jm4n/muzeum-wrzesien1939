package muzeum_wrzesien1939_api.exhibition;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import muzeum_wrzesien1939_api.exhibition.service.ExhibitionRequest;
import muzeum_wrzesien1939_api.exhibition.service.ExhibitionResponse;
import muzeum_wrzesien1939_api.exhibition.service.ExhibitionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/exhibitions")
@RequiredArgsConstructor
@Tag(name = "Exhibitions", description = "Curated collections of exhibits")
public class ExhibitionController {

    private final ExhibitionService service;

    @Operation(summary = "Get all exhibitions", description = "Returns list of curated collections.")
    @GetMapping
    @Transactional
    public ResponseEntity<List<ExhibitionResponse>> getAll() {
        return ResponseEntity.ok(service.getAllExhibitions());
    }

    @Operation(summary = "Get exhibition details", description = "Returns exhibition info and all items inside it.")
    @GetMapping("/{id}")
    @Transactional
    public ResponseEntity<ExhibitionResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getExhibitionById(id));
    }

    @Operation(summary = "Create exhibition", description = "Admin creates a collection and assigns item IDs.")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ExhibitionResponse> create(@RequestBody ExhibitionRequest request) {
        return ResponseEntity.ok(service.createExhibition(request));
    }
}