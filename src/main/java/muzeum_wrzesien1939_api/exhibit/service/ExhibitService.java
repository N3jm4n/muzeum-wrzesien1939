package muzeum_wrzesien1939_api.exhibit.service;

import lombok.RequiredArgsConstructor;
import muzeum_wrzesien1939_api.exhibit.entity.Exhibit;
import muzeum_wrzesien1939_api.exhibit.repository.ExhibitRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExhibitService {

    private final ExhibitRepository repository;

    public List<ExhibitResponse> getAllExhibits(ExhibitSearchCriteria criteria) {
        return repository.findAll()
                .stream()
                .filter(exhibit -> matches(exhibit, criteria))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private boolean matches(Exhibit exhibit, ExhibitSearchCriteria criteria) {
        if (criteria == null) return true;

        boolean nameMatches = criteria.getName() == null ||
                exhibit.getName().toLowerCase().contains(criteria.getName().toLowerCase());

        boolean categoryMatches = criteria.getCategory() == null ||
                (exhibit.getCategory() != null &&
                        exhibit.getCategory().name().equalsIgnoreCase(criteria.getCategory()));

        boolean yearMatches = criteria.getProductionYear() == null ||
                String.valueOf(criteria.getProductionYear()).equals(exhibit.getProductionYear());

        return nameMatches && categoryMatches && yearMatches;
    }

    public ExhibitResponse createExhibit(ExhibitRequest request) {
        var exhibit = Exhibit.builder()
                .name(request.getName())
                .description(request.getDescription())
                .productionYear(request.getProductionYear())
                .imageUrl(request.getImageUrl())
                .category(request.getCategory())
                .build();

        var savedExhibit = repository.save(exhibit);

        return mapToResponse(savedExhibit);
    }

    public ExhibitResponse getExhibitById(Long id) {
        var exhibit = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exhibit not found"));
        return mapToResponse(exhibit);
    }

    public ExhibitResponse updateExhibit(Long id, ExhibitRequest request) {
        var exhibit = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exhibit not found"));

        exhibit.setName(request.getName());
        exhibit.setDescription(request.getDescription());
        exhibit.setProductionYear(request.getProductionYear());
        exhibit.setImageUrl(request.getImageUrl());
        exhibit.setCategory(request.getCategory());

        var updatedExhibit = repository.save(exhibit);
        return mapToResponse(updatedExhibit);
    }

    public void deleteExhibit(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Exhibit not found");
        }
        repository.deleteById(id);
    }

    private ExhibitResponse mapToResponse(Exhibit exhibit) {
        return ExhibitResponse.builder()
                .id(exhibit.getId())
                .name(exhibit.getName())
                .description(exhibit.getDescription())
                .productionYear(exhibit.getProductionYear())
                .imageUrl(exhibit.getImageUrl())
                .category(exhibit.getCategory())
                .build();
    }
}