using System.Collections;
using System.Collections.Generic;
using UnityEditor;
using UnityEngine;

[CustomEditor(typeof(ChartGenerator))]
[System.Serializable]
public class ChartGeneratorEditor : Editor
{
    [SerializeField]
    ChartGenerator script;
    [SerializeField]
    ChartGenerator.DataType datatype;

    void OnEnable()
    {
        script = (ChartGenerator) target;
    }

    public override void OnInspectorGUI()
    {
        
        script.autostart = EditorGUILayout.Toggle("Auto start", script.autostart);
        script.autoupdate = EditorGUILayout.Toggle("Auto update", script.autoupdate);
        script.charttype = (ChartGenerator.ChartType)EditorGUILayout.EnumPopup("Visualization", script.charttype);
        script.title = EditorGUILayout.TextField("Title", script.title);
        EditorGUILayout.Space();

        // script.charttype = (ChartGenerator.DataType)EditorGUILayout.EnumPopup("Visualization", script.datatype);

        script.xlabel = EditorGUILayout.TextField("Label X", script.xlabel);
        script.x = EditorGUILayout.TextField("x", script.x);
        EditorGUILayout.LabelField("Usage example", "pear,orange,pineapple,blueberry");
        EditorGUILayout.Space();

        script.ylabel = EditorGUILayout.TextField("Label Y", script.ylabel);
        script.y = EditorGUILayout.TextField("y", script.y);
        EditorGUILayout.LabelField("Usage example", "1,2,3,4");
        EditorGUILayout.Space();

        if (script.maxdimensions() > 2)
        {
            script.zlabel = EditorGUILayout.TextField("Label Z", script.zlabel);
            script.z = EditorGUILayout.TextField("z", script.z);
            EditorGUILayout.LabelField("Usage example", "america,america,europe,europe");
            EditorGUILayout.Space();
        }

        if (script.maxdimensions() > 3)
        {
            script.wlabel = EditorGUILayout.TextField("Label w", script.wlabel);
            script.w = EditorGUILayout.TextField("w", script.w);
            EditorGUILayout.LabelField("Usage example", "1,3,5,7");
            EditorGUILayout.Space();
        }
        var newc = script.numcolors();
        switch (script.charttype)
        {
            case ChartGenerator.ChartType.BarChartVertical:
                //Debug.Log(script.colors[0]);
                script.colors[0] = EditorGUILayout.ColorField("Bars color", script.colors[0]);
                break;
            case ChartGenerator.ChartType.LineChart:
            case ChartGenerator.ChartType.PieChart:
            case ChartGenerator.ChartType.AreaChart:
            case ChartGenerator.ChartType.Scatterplot:
                for (int i = 0; i < newc; i++)
                {
                    //Debug.Log(script.numcolors());
                    script.colors[i] = EditorGUILayout.ColorField("Color " + i, script.colors[i]);
                }
                break;
        }
        if (EditorApplication.isPlaying)
            Repaint();
        if (GUI.changed)
        {
            EditorUtility.SetDirty(script);
            serializedObject.ApplyModifiedProperties();
        }
    }
}
