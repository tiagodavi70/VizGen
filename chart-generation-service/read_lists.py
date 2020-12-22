import os
import numpy as np


outs = os.listdir("outputs_evaluation/")
y = [int(o.split("_")[1].split(".")[0]) for o in outs]
outs = ["outputs_evaluation/" + x for _,x in sorted(zip(y,outs))]

for out in outs:
    sum = 0
    time_ = 0
    
    with open(out, "r") as file:
        lines = file.read().split("\n")
        for line in lines:
            if line.find("start") == 0:
                time_ = int(line.split(": ")[1])
            elif line.find("finish") == 0: 
                time_ = int(line.split(": ")[1]) - time_
                sum += time_
                time_ = 0
    print(int(sum/1000))