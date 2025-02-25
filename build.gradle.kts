import java.io.BufferedInputStream
import java.io.ByteArrayInputStream
import java.io.FileOutputStream
import java.net.URI
import java.util.*
import java.util.zip.ZipInputStream

group = "it-anonymous-shard"
version = "0.1.0"

repositories {
    mavenCentral()
}

val Project.isNodeProject get() = file("package.json").exists()

val nodes = listOf(
    "provider-node",
    "consumer-node",
)

nodes.forEach { submodule ->

    val formattedSubmoduleName = submodule.replaceFirstChar {
        if (it.isLowerCase()) it.titlecase(Locale.getDefault()) else it.toString()
    }.split("-")[0]

    // Register the `npmInstall` task for each submodule
    tasks.register<Exec>("npmInstall$formattedSubmoduleName") {
        workingDir = file(submodule)
        commandLine("npm", "install")
    }

    // Register the `npmBuild` task for each submodule
    tasks.register<Exec>("npmBuild$formattedSubmoduleName") {
        workingDir = file(submodule)
        commandLine("npm", "run", "build")
    }

    // Register the `npmTest` task for each submodule
    tasks.register<Exec>("npmTest$formattedSubmoduleName") {
        workingDir = file(submodule)
        commandLine("npm", "run", "test")
    }

    // Register the `npmLint` task for each submodule
    tasks.register<Exec>("npmLint$formattedSubmoduleName") {
        dependsOn("npmInstall$formattedSubmoduleName")
        workingDir = file(submodule)
        commandLine("npm", "run", "lint")
    }

    // Register the `npmFormat` task for each submodule
    tasks.register<Exec>("npmFormat$formattedSubmoduleName") {
        dependsOn("npmInstall$formattedSubmoduleName")
        workingDir = file(submodule)
        commandLine("npm", "run", "format")
    }
}


tasks.register("npmBuildAll") {
    dependsOn(nodes.map { submodule ->
        val name = submodule.replaceFirstChar {
            if (it.isLowerCase()) it.titlecase(Locale.getDefault()) else it.toString()
        }.split("-")[0]
        tasks.named("npmBuild$name")
    })
}

tasks.register("npmInstallAll") {
    dependsOn(nodes.map { submodule ->
        val name = submodule.replaceFirstChar {
            if (it.isLowerCase()) it.titlecase(Locale.getDefault()) else it.toString()
        }.split("-")[0]
        tasks.named("npmInstall$name")
    })
}


val swaggerUI = "swagger-ui"
val openAPI = "openapi"

tasks.register<DefaultTask>("download-swagger-ui") {
    val releaseUrl = "https://github.com/swagger-api/swagger-ui/archive/refs/tags/v5.17.14.zip"
    doLast {
        ByteArrayInputStream(URI(releaseUrl).toURL().readBytes()).use { inputStream ->
            BufferedInputStream(inputStream).use { bufferedInputStream ->
                ZipInputStream(bufferedInputStream).use { zip ->
                    var currentEntry = zip.nextEntry
                    while(currentEntry != null) {
                        if (currentEntry.name.matches(Regex("swagger-ui-[0-9\\.]+/dist/.+"))) {
                            println("Extracting ${currentEntry.name}")
                            project.layout.buildDirectory.asFile.get().also {
                                val destination = it.resolve(swaggerUI)
                                currentEntry?.name?.split("/")?.last()?.let { fileName ->
                                    val outFile = File(destination, fileName)
                                    outFile.parentFile.mkdirs()
                                    FileOutputStream(outFile).use { fileOutputStream ->
                                        zip.copyTo(fileOutputStream)
                                    }
                                }
                            }
                        }
                        currentEntry = zip.nextEntry
                    }
                }
            }
        }
    }
    outputs.dir(project.layout.buildDirectory.dir(swaggerUI))
}

val openApiPath = rootProject.layout.buildDirectory.dir("openapi")

tasks.register<Copy>("generate-openapi-index-page") {
    from(project.layout.projectDirectory.dir("src").dir("resources"))
    into(openApiPath.get())
    expand("nodes" to nodes.joinToString(separator = "\n") {
        "<li><a href=\"$it\">${it.capitalize()}</a></li>"//
    })
}

fun osIs(os: String) = System.getProperty("os.name").startsWith(os)

allprojects {
    tasks.register<Delete>("clean") {
        delete("dist", "node_modules/", "tsconfig.tsbuildinfo", "build")
    }
}

subprojects {
    if (project.name in nodes) {
        tasks.register<Copy>("generate-openapi-website") {
            dependsOn(":download-swagger-ui")
            from(
                rootProject.layout.projectDirectory
                    .dir("doc")
                    .dir("api")
                    .dir(openAPI)
                    .dir(project.name)
                    .files("schemas.yml", "specification.yml"),
                rootProject.layout.buildDirectory.dir(swaggerUI).get()
            )
            into(openApiPath.get().dir(project.name))
            doLast {
                rootProject.layout.buildDirectory
                    .dir(openAPI)
                    .get()
                    .dir(project.name)
                    .file("swagger-initializer.js").asFile.also {
                        it.writeText(
                            it.readText()
                                .replace(
                                    "https://petstore.swagger.io/v2/swagger.json",
                                    "specification.yml"
                                )
                        )
                }
            }
        }
    }
}
