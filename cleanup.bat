@echo off
del /f index.html package.json package-lock.json vite.config.js GOOGLE_SHEET_SETUP.md
rd /s /q src
rd /s /q node_modules
del "%~f0"
