package muzeum_wrzesien1939_api.exhibit.service;

import lombok.RequiredArgsConstructor;
import muzeum_wrzesien1939_api.exhibit.service.ExhibitRequest;
import muzeum_wrzesien1939_api.exhibit.service.ExhibitResponse;
import muzeum_wrzesien1939_api.exhibit.entity.Exhibit;
import muzeum_wrzesien1939_api.exhibit.repository.ExhibitRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExhibitService {

    private final ExhibitRepository repository;

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

    public List<ExhibitResponse> getAllExhibits() {
        return repository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ExhibitResponse getExhibitById(Long id) {
        var exhibit = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exhibit not found"));//TODO maybe nicer exception
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