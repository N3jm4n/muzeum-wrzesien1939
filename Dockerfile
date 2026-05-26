# ============================================
# Stage 1: Build the application
# ============================================
FROM gradle:8-jdk21-alpine AS build
WORKDIR /app

# Copy Gradle config first for dependency caching
COPY build.gradle settings.gradle ./
COPY gradle ./gradle
COPY gradlew gradlew.bat ./

RUN chmod +x gradlew

# Download dependencies (cached unless build.gradle changes)
RUN ./gradlew dependencies --no-daemon || true

# Copy source code and build
COPY src ./src
RUN ./gradlew clean bootJar -x test --no-daemon

# ============================================
# Stage 2: Runtime
# ============================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create non-root user
RUN addgroup -S museum && adduser -S museum -G museum

# Copy the built JAR
COPY --from=build /app/build/libs/*.jar app.jar

# Change ownership
RUN chown museum:museum app.jar

USER museum

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]