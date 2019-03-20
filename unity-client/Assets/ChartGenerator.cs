using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;

public class ChartGenerator : MonoBehaviour {


    public enum VisualizationType
    {
        BarChartVertical,
        LineChart,
        PieChart,
        AreaChart
    }

    public string value;
    public string key;
    public string category;

    public VisualizationType visualizationtype = VisualizationType.BarChartVertical;

    // Use this for initialization
    void Start() {
        getchart();
    }

    // start the process of chart requisition for the server
    public void getchart()
    {
        Debug.Log("http://localhost:3000/chartgen.html?value=" + value + "&key=" + key + "&chart=" + visualizationtype.ToString().ToLower());
        StartCoroutine(GetRequest("http://localhost:3000/chartgen.html?value=" + value + "&key=" + key + "&chart=" + visualizationtype.ToString().ToLower()));
    }

    // generate sprite based on base64 string that came from server
    void generateViz(string base64string)
    {
        byte[] Bytes = System.Convert.FromBase64String(base64string);
        Texture2D tex = new Texture2D(900, 465);
        tex.LoadImage(Bytes);
        Rect rect = new Rect(0, 0, tex.width, tex.height);
        Sprite sprite = Sprite.Create(tex, rect, new Vector2(0,0), 100f);
        SpriteRenderer renderer = this.gameObject.GetComponent<SpriteRenderer>(); 
        if (renderer == null)
        {
            renderer = this.gameObject.AddComponent<SpriteRenderer>(); // will crash if there's another renderer (like MeshRenderer) as component
        }
        renderer.sprite = sprite;
    }

    // network connection and image download
    IEnumerator GetRequest(string uri)
    {
        using (UnityWebRequest webRequest = UnityWebRequest.Get(uri))
        {
            // Request and wait for the desired page.
            yield return webRequest.SendWebRequest();

            string[] pages = uri.Split('/');
            int page = pages.Length - 1;

            if (webRequest.isNetworkError)
            {
                Debug.Log(pages[page] + ": Error: " + webRequest.error);
            }
            else
            {
                generateViz(webRequest.downloadHandler.text); // plain base64 string that (hopefully) came without any html tag
            }
        }
    }

    public int checkmaxdimensions() // charts have different dimensions so we need to know what options show to user
    {
        int dim = 0;
        switch (visualizationtype)
        {
            case VisualizationType.BarChartVertical:
                dim = 2;
                break;
            case VisualizationType.LineChart:
                dim = 3;
                break;
            case VisualizationType.PieChart:
                dim = 2;
                break;
            case VisualizationType.AreaChart:
                dim = 3;
                break;
        }
        return dim;
    }
}
