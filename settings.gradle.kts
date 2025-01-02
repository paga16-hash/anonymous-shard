plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version "0.8.0"
    id("org.danilopianini.gradle-pre-commit-git-hooks") version "2.0.12"
}

rootProject.name = "anonymous-shard"
val subprojects = listOf(
    "provider-node",
    "consumer-node",
    "consumer-node-frontend",
)
subprojects.forEach { include(":$it") }

if (File(System.getProperty("user.dir") + "/.git").exists()) {
    gitHooks {
        commitMsg {
            conventionalCommits {
                defaultTypes()
                types("wip", "other", "deps")
            }
        }
        preCommit {
            from {
                ""//./gradlew format-fix
            }
            appendScript {
                ""// && git add .
            }
        }
        createHooks(overwriteExisting = true)
    }
}
