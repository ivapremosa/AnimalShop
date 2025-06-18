FROM eclipse-temurin:17-jdk AS build

WORKDIR /app

# Install Maven
RUN apt-get update && apt-get install -y maven

# Copy only the POM file first to leverage Docker cache
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests -Dspring-boot.repackage.skip=true

FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 50053

ENTRYPOINT ["java", "-jar", "app.jar"] 