import numpy as np
import os

data = [{
            "dataset":"cars", 
            "x1": "make",
            "x2": "fuel-type",
            "y1": "price",
            "y2": "city-mpg"
        },
        {
            "dataset":"iris", 
            "x1": "iris",
            "x2": "sepal_width",
            "y1": "petal_length",
            "y2": "petal_width"
        },
        # {
        #     "dataset":"generated", 
        #     "x1": "Dimension_3",
        #     "x2": "Dimension_4",
        #     "y1": "Dimension_1",
        #     "y2": "Dimension_2"
        # }
        ]

count_total = 0
for i in [100, 500, 1000, 2000, 3000, 4000, 5000]:
    links = ""
    for d in data:
        url_base = "http://localhost:3000/generate/"
        url_base += d["dataset"] + "/chartgen.html?chart="
        
        count = 0
        for j in range(0,i):
            links += url_base + "parallel_coordinates&fold="+ d["y1"] + ";" + d["y2"] + "\n"
            links += url_base + "barchartvertical&y="       + d["y1"] + "\n"
            links += url_base + "heatmap&x="                + d["x1"] + "&y=" + d["x2"] + "\n"
            links += url_base + "linechart&x="              + d["x1"] + "&y=" + d["y1"] + "\n"
            links += url_base + "areachart&x="              + d["x1"] + "&y=" + d["y1"] + "\n"
            links += url_base + "scatterplot&x="            + d["y1"] + "&y=" + d["y2"] + "\n"
            links += url_base + "piechart&x="               + d["x1"] + "\n"
            count += 7
        print(d["dataset"], i, count)
        count_total += count
    with open("lists/links_" + str(i) + ".txt", "w+") as f:
        f.write(links)

print("total", count_total/7, count_total)

# summary - two datasets
# cars 100 700
# iris 100 700
# generated 100 700
# cars 500 3500
# iris 500 3500
# generated 500 3500
# cars 1000 7000
# iris 1000 7000
# generated 1000 7000
# cars 5000 35000
# iris 5000 35000
# generated 5000 35000
# total 19800 138600

# cars 100 700
# iris 100 700
# cars 500 3500
# iris 500 3500
# cars 1000 7000
# iris 1000 7000
# cars 2000 14000
# iris 2000 14000
# cars 3000 21000
# iris 3000 21000
# cars 4000 28000
# iris 4000 28000
# cars 5000 35000
# iris 5000 35000
# total 31200 218400