package muzeum_wrzesien1939_api.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import muzeum_wrzesien1939_api.auth.service.JwtService;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // 1. Sprawdzamy, czy nagłówek istnieje i czy zaczyna się od "Bearer "
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2. Wyciągamy sam token (ucinamy "Bearer ")
        jwt = authHeader.substring(7);

        // 3. Wyciągamy email z tokena
        userEmail = jwtService.extractUsername(jwt);

        // 4. Jeśli mamy email, a użytkownik nie jest jeszcze zalogowany w kontekście Springa:
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // Pobieramy dane użytkownika z bazy
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            // 5. Sprawdzamy czy token jest ważny
            if (jwtService.isTokenValid(jwt, userDetails)) {

                // Tworzymy obiekt autoryzacji
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );

                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                // 6. Ustawiamy użytkownika jako "Zalogowany" w kontekście Security
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // Przekazujemy żądanie dalej (do kontrolerów)
        filterChain.doFilter(request, response);
    }
}