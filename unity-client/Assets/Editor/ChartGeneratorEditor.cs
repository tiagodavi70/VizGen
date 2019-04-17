using System.Collections;
using System.Collections.Generic;
using UnityEditor;
using UnityEngine;

[CustomEditor(typeof(ChartGenerator))]
public class ChartGeneratorEditor : Editor
{
    public override void OnInspectorGUI()
    {
        ChartGenerator script = (ChartGenerator) target;

        script.autostart = EditorGUILayout.Toggle("Auto start", true);
        script.autostart = EditorGUILayout.Toggle("Auto update", false);
        script.charttype = (ChartGenerator.ChartType)EditorGUILayout.EnumPopup("Visualization", script.charttype);
        EditorGUILayout.Space();

        script.xlabel = EditorGUILayout.TextField("Label X", "fruits");
        script.x = EditorGUILayout.TextField("x", "pear,orange,pineapple,blueberry");
        EditorGUILayout.LabelField("Usage example", "pear,orange,pineapple,blueberry");
        EditorGUILayout.Space();

        script.ylabel = EditorGUILayout.TextField("Label Y", "qt. sold");
        script.y = EditorGUILayout.TextField("y", "1,2,3,4");
        EditorGUILayout.LabelField("Usage example", "1,2,3,4");
        EditorGUILayout.Space();

        if (script.checkmaxdimensions() > 2)
        {
            script.zlabel = EditorGUILayout.TextField("Label Z", "continent");
            script.z = EditorGUILayout.TextField("z", "america,america,europe,europe");
            EditorGUILayout.LabelField("Usage example", "america,america,europe,europe");
            EditorGUILayout.Space();
        }

        if (script.checkmaxdimensions() > 3)
        {
            script.wlabel = EditorGUILayout.TextField("Label w", "toxins");
            script.w = EditorGUILayout.TextField("w", "1,3,5,7");
            EditorGUILayout.LabelField("Usage example", "1,3,5,7");
            EditorGUILayout.Space();
        }

        switch (script.charttype)
        {
            case ChartGenerator.ChartType.BarChartVertical:
                script.colors = new Color[1];
                script.colors[0] = EditorGUILayout.ColorField("Bar color", new Color(70, 130, 180));
                break;
            case ChartGenerator.ChartType.LineChart:   
                break;
            case ChartGenerator.ChartType.PieChart:
                break;
            case ChartGenerator.ChartType.AreaChart:
                break;
            case ChartGenerator.ChartType.Scatterplot:
                break;
        }
    }
}
