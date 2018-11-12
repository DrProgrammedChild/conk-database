@echo off

echo Please enter a module name
set /p "module=>"
npm install %module%
echo Successfully installed!