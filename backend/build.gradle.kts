import org.jetbrains.kotlin.gradle.dsl.Coroutines
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import com.github.jengelman.gradle.plugins.shadow.tasks.ShadowJar

val logback_version: String by project
val ktor_version: String by project
val kotlin_version: String by project

buildscript {
    repositories {
        maven { url = uri("https://plugins.gradle.org/m2/") }
    }
    dependencies {
        classpath("com.github.jengelman.gradle.plugins:shadow:5.2.0")
    }
}

apply(plugin = "com.github.johnrengelman.shadow")
plugins {
    application
    kotlin("jvm") version "1.3.61"
}

group = "com.mehtasankets.mmflow"
version = "0.0.1-SNAPSHOT"

application {
    mainClassName = "io.ktor.server.netty.EngineMain"
}

tasks {
    named<ShadowJar>("shadowJar") {
        archiveBaseName.set("mmflow")
        mergeServiceFiles()
        manifest {
            attributes(mapOf("Main-Class" to "io.ktor.server.netty.EngineMain"))
        }
    }
}

repositories {
    mavenLocal()
    mavenCentral()
    jcenter()
    maven { url = uri("https://maven.pkg.jetbrains.space/kotlin/p/kotlin/kotlin-js-wrappers/") }
}

dependencies {
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8:$kotlin_version")
    implementation("io.ktor:ktor-server-netty:$ktor_version")
    implementation("ch.qos.logback:logback-classic:$logback_version")
    implementation("io.ktor:ktor-server-core:$ktor_version")
    implementation("io.ktor:ktor-html-builder:1.6.8")
    implementation("org.jetbrains:kotlin-css-jvm:1.0.0-pre.31-kotlin-1.2.41")
    implementation("org.xerial:sqlite-jdbc:3.30.1")
    implementation("com.fasterxml.jackson.core:jackson-core:2.10.3")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin:2.10.3")
    implementation( "com.fasterxml.jackson.datatype:jackson-datatype-jsr310:2.10.3")
    implementation("com.google.api-client:google-api-client:1.30.9")
    testImplementation("io.ktor:ktor-server-tests:$ktor_version")
}

kotlin.sourceSets["main"].kotlin.srcDirs("src")
kotlin.sourceSets["test"].kotlin.srcDirs("test")

sourceSets["main"].resources.srcDirs("resources")
sourceSets["test"].resources.srcDirs("testresources")
