using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ChartCreator : MonoBehaviour
{
    void Start() //pass parameters to visualization creation
    {
        //disable component so that views are not created from it
        GetComponent<ChartGenerator>().enabled = false; 
        GetComponent<ChartGenerator>().autostart = false;
        
        //Passing parameters for visualization creation
        GetComponent<ChartGenerator>().charttype = ChartGenerator.ChartType.AreaChart;
        GetComponent<ChartGenerator>().title = "Chart title";
        GetComponent<ChartGenerator>().xlabel = "x label";
        GetComponent<ChartGenerator>().x = "orange, pineapple, apple, microsoft";
        GetComponent<ChartGenerator>().ylabel = "y label";
        GetComponent<ChartGenerator>().y = "2, 2.30, 16, 2.1";
        GetComponent<ChartGenerator>().zlabel = "z label";
        GetComponent<ChartGenerator>().z = "xiaomi, xbox, hp, aoc";
        
        Color[] colors = {Color.blue, Color.gray, Color.magenta, Color.white};
        GetComponent<ChartGenerator>().colors = colors;
        
        //getchart voilà
        GetComponent<ChartGenerator>().getchart();
    }
    

}
