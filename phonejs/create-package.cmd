@echo off
rem download zip.exe from http://gnuwin32.sourceforge.net/packages/zip.htm

rem del package.zip
"C:\Program Files (x86)\GnuWin32\bin\zip" -r package.zip * -x@package-exclude.txt 