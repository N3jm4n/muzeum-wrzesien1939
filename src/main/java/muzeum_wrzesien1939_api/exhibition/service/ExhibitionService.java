package muzeum_wrzesien1939_api.exhibition.service;

import lombok.RequiredArgsConstructor;
import muzeum_wrzesien1939_api.exhibit.entity.Exhibit;
import muzeum_wrzesien1939_api.exhibit.repository.ExhibitRepository;
import muzeum_wrzesien1939_api.exhibit.service.ExhibitResponse;
import muzeum_wrzesien1939_api.exhibition.entity.Exhibition;
import muzeum_wrzesien1939_api.exhibition.repository.ExhibitionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExhibitionService {

    private final ExhibitionRepository exhibitionRepository;
    private final ExhibitRepository exhibitRepository;

    public List<ExhibitionResponse> getAllExhibitions() {
        return exhibitionRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ExhibitionResponse getExhibitionById(Long id) {
        Exhibition exhibition = exhibitionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exhibition not found"));
        return mapToResponse(exhibition);
    }

    public ExhibitionResponse createExhibition(ExhibitionRequest request) {
        List<Exhibit> selectedExhibits = exhibitRepository.findAllById(request.getExhibitIds());

        Exhibition exhibition = Exhibition.builder()
                .name(request.getName())
                .description(request.getDescription())
                .backgroundImageUrl(request.getBackgroundImageUrl())
                .exhibits(selectedExhibits)
                .build();

        return mapToResponse(exhibitionRepository.save(exhibition));
    }

    @Transactional
    public ExhibitionResponse updateExhibition(Long id, ExhibitionRequest request) {
        Exhibition exhibition = exhibitionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exhibition not found"));

        exhibition.setName(request.getName());
        exhibition.setDescription(request.getDescription());

        if (request.getBackgroundImageUrl() != null && !request.getBackgroundImageUrl().isEmpty()) {
            exhibition.setBackgroundImageUrl(request.getBackgroundImageUrl());
        }

        if (request.getExhibitIds() != null) {
            List<Exhibit> newExhibits = exhibitRepository.findAllById(request.getExhibitIds());
            exhibition.setExhibits(newExhibits);
        }

        return mapToResponse(exhibitionRepository.save(exhibition));
    }

    @Transactional
    public void deleteExhibition(Long id) {
        if (!exhibitionRepository.existsById(id)) {
            throw new RuntimeException("Exhibition not found");
        }

        exhibitionRepository.deleteById(id);
    }

    private ExhibitionResponse mapToResponse(Exhibition exhibition) {
        List<ExhibitResponse> exhibitResponses = exhibition.getExhibits().stream()
                .map(e -> ExhibitResponse.builder()
                        .id(e.getId())
                        .name(e.getName())
                        .imageUrl(e.getImageUrl())
                        .category(e.getCategory())
                        .description(e.getDescription())
                        .productionYear(e.getProductionYear())
                        .build())
                .collect(Collectors.toList());

        return ExhibitionResponse.builder()
                .id(exhibition.getId())
                .name(exhibition.getName())
                .description(exhibition.getDescription())
                .backgroundImageUrl(exhibition.getBackgroundImageUrl())
                .exhibits(exhibitResponses)
                .build();
    }
}