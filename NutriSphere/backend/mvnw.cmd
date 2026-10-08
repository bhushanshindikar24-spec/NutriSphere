@echo off
setlocal EnableExtensions EnableDelayedExpansion

set "BASE_DIR=%~dp0"
set "WRAPPER_DIR=%BASE_DIR%.mvn\wrapper"
set "PROPS=%WRAPPER_DIR%\maven-wrapper.properties"
set "MAVEN_VERSION=3.9.16"

if exist "%PROPS%" (
  for /f "tokens=1,* delims==" %%A in ('findstr /b "mavenVersion=" "%PROPS%"') do set "MAVEN_VERSION=%%B"
)

set "DIST_DIR=%WRAPPER_DIR%\apache-maven-%MAVEN_VERSION%"
set "MAVEN_HOME=%DIST_DIR%"

if not exist "%DIST_DIR%\bin\mvn.cmd" (
  set "ZIP=%WRAPPER_DIR%\apache-maven-%MAVEN_VERSION%-bin.zip"
  if not exist "%ZIP%" (
    echo Downloading Apache Maven %MAVEN_VERSION%...
    powershell -NoProfile -ExecutionPolicy Bypass -Command "$ProgressPreference='SilentlyContinue'; Invoke-WebRequest -Uri 'https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/%MAVEN_VERSION%/apache-maven-%MAVEN_VERSION%-bin.zip' -OutFile '%ZIP%'"
    if errorlevel 1 (
      echo Failed to download Maven %MAVEN_VERSION%.
      exit /b 1
    )
  )
  powershell -NoProfile -ExecutionPolicy Bypass -Command "Expand-Archive -LiteralPath '%ZIP%' -DestinationPath '%WRAPPER_DIR%' -Force"
  if errorlevel 1 (
    echo Failed to extract Maven.
    exit /b 1
  )
)

call "%DIST_DIR%\bin\mvn.cmd" %*
exit /b %ERRORLEVEL%
