---
sidebar_position: 50
---
# DevOps

## Build Automation
Gradle is used as the build automation tool for the project. It allows for the automation of the build process, including compiling, testing, and packaging the application. The build process is defined in the `build.gradle` file, which specifies the project's dependencies, tasks, and configurations for each node. Additionally, tasks for code quality checks are defined in the build file. In this case, I tried to keep the codebase with only necessary dependencies, so the build process is not something complex.

## Version Control

### DVCS Workflow
The project uses Git as the version control system, and my workflow is based on updating the main branch with new features or fixes through dedicated branches. In this way, the main branch always contains the latest stable code. New changes or fixes are introduced through dedicated branches (`feature/name`, `fix/name`, `chore/description`, etc.), ensuring a structured approach to development and a clear history. Releases are directly managed from the main branch when merging a feature (or fix) branch.

Moreover, to ensure consistency and quality, every commit is associated with a meaningful message that describes the changes introduced following the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) standard.

### Semantic Versioning and Release
Both the provider node and the consumer node follow [Semantic Versioning](https://semver.org/), with version numbers automatically determined by the CI/CD pipeline. The Semantic Release plugin automates this process. By analyzing conventional commit messages, the plugin determines the next version based on the changes introduced. Additionally, it generates a changelog and creates a new release on GitHub.

This setup can be difficult to understand for a new developer, but it ensures consistency and quality in the release process, making it easier to track changes and manage versions. Potentially, to make the system more accessible, a more traditional release process could be adopted, but the current setup is more suitable for an open-source project. The only change to make would be triggering the release process only when a new Pull Request is merged into the main branch and after at least some code reviews.

## Quality Assurance
To maintain the quality of the system, some quality assurance practices have been adopted, exploiting these tools:
1. **Prettier**: A code formatter to ensure consistent code style.
2. **ESLint**: A static code analysis tool to identify problematic patterns in the code.

Certainly, the system can be improved with more tools and practices, but for a prototype and the fact that I'm the only developer, these are enough to ensure good code quality and maintainability.

## Continuous Integration and Delivery
The CI/CD pipeline is an essential part of the development process, ensuring that the code is continuously integrated, does not break the build, and that new features are delivered.
1. **Build**: Compiles the project, ensuring functionality across Linux and macOS platforms.
2. **Style Check**: Verifies code formatting and consistency using linters and formatters.
3. **Generate Documentation**: Builds the documentation website and stores it as an artifact for future releases.
4. **Version Calculation**: Determines the next version number for the project based on commit history.
5. **Release Management**: Analyzes commit messages to determine if a new release is required, and if CI/CD file determined conditions are met, tags the repository with the new version number.
6. **Deploy Documentation**: Retrieves the pre-built documentation and publishes it to GitHub Pages.
7. **Docker Image Deployment**: Builds Docker images for all nodes upon release trigger and pushes the new images to Docker Hub with the *latest* tag.

![CI/CD Pipeline](images/ci-cd-pipeline)
*Figure 1: CI/CD Pipeline*
