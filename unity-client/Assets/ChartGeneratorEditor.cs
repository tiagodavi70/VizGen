using System.Collections;
using System.Collections.Generic;
using UnityEditor;
using UnityEngine;

[CustomEditor(typeof(ChartGenerator))]
public class ChartGeneratorEditor : Editor
{
    public override void OnInspectorGUI()
    {
        ChartGenerator script = (ChartGenerator)target;

        script.visualizationtype = (ChartGenerator.VisualizationType)EditorGUILayout.EnumPopup("Visualization", script.visualizationtype);
        script.value = EditorGUILayout.TextField("Value", "1,2,3,4");
        EditorGUILayout.LabelField("Usage example", "1,2,3,4");
        script.key = EditorGUILayout.TextField("Key", "pear,orange,pineapple,blueberry");
        EditorGUILayout.LabelField("Usage example", "pear,orange,pineapple,blueberry");

        if (script.checkmaxdimensions() > 2)
        {
            script.category = EditorGUILayout.TextField("Category", "a,a,b,b");
            EditorGUILayout.LabelField("Usage example", "a,a,b,b");
        }
    }

    

}
