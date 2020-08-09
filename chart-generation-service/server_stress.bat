REM @echo off
REM set a=0
REM echo %a%

set obj[0].dataset = cars 
set obj[0].x1 = 1 
set obj[0].x2 = 1 
set obj[0].y1 = price
set obj[0].y2 = 1 

set n = "barchartvertical"
set i = 0
echo %%obj[%i%].dataset%%
set url ="http://localhost:3000/generate/" and %%obj[%i%].dataset%% and "/chartgen.html?chart=" and %n% and "&y=" and %obj[0].y1%

REM curl "http://localhost:3000/generate/%obj[0].dataset%/chartgen.html?chart=%n%&y=%obj[0].y1%"

REM http://localhost:3000/generate/iris/chartgen.html?chart=parallel_coordinates&fold=petal_width;petal_length&z=iris
REM http://localhost:3000/generate/cars/chartgen.html?chart=barchartvertical&y=price
REM http://localhost:3000/generate/cars/chartgen.html?chart=heatmap&x=make&y=body-style
REM http://localhost:3000/generate/cars/chartgen.html?chart=linechart&x=num-of-cylinders&y=compression-ratio&z=drive-wheels&title=automobile
REM http://localhost:3000/generate/iris/chartgen.html?chart=scatterplot&title=automobile_test&x=sepal_length&y=sepal_width&z=iris
REM http://localhost:3000/generate/cars/chartgen.html?chart=areachart&x=num-of-cylinders&y=compression-ratio&z=drive-wheels&title=automobile
REM http://localhost:3000/generate/cars/chartgen.html?x=make&chart=piechart

for %%n in (iris,cars) do ( 
    echo %%n
)

echo %url%