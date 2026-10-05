@REM ----------------------------------------------------------------------------
@REM NutriSphere Maven Wrapper script for Windows
@REM ----------------------------------------------------------------------------

@IF "%DEBUG%" == "" @ECHO OFF
@SETLOCAL

@IF EXIST "C:\Program Files\Java\jdk-17" (
  SET "JAVA_HOME=C:\Program Files\Java\jdk-17"
  SET "PATH=C:\Program Files\Java\jdk-17\bin;%PATH%"
)

IF NOT "%JAVA_HOME%" == "" (
  SET "JAVACMD=%JAVA_HOME%\bin\java.exe"
) ELSE (
  SET "JAVACMD=java.exe"
)

SET "MAVEN_WRAPPER_BIN=C:\Users\Bhushan\.m2\wrapper\dists\apache-maven-3.9.16\0daed3be3ebd1c706f0e69e8b07c6b73f5cc4ea3dfce72a8d0ec2e849ca2ddb0\bin\mvn.cmd"
IF EXIST "%MAVEN_WRAPPER_BIN%" (
  "%MAVEN_WRAPPER_BIN%" %*
) ELSE (
  mvn %*
)
