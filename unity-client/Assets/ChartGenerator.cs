using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;

public class ChartGenerator : MonoBehaviour {


    public bool autostart = true;
    public bool autoupdate = false;

    public enum ChartType
    {
        BarChartVertical,
        LineChart,
        PieChart,
        AreaChart
    }

    private ChartType Charttype = ChartType.BarChartVertical;
    private string X = "pear,orange,pineapple,blueberry";
    public string Y = "1,2,3,4";
    public string Z = "america,america,europe,europe";
    public string W = "";

    public Color Colors = new Color(70,130,180);
    public bool ShowLabels;
    public bool Legends;
    public bool Sort;

    public float Inner;
    public float Padding;

    public ChartType charttype
    {
        get
        {return Charttype;}
        set
        {Charttype = value;if (autoupdate) getchart();}
    }
    public string x
    {
        get
        {return X;}
        set
        {X = value; if (autoupdate)getchart();}
    }
    public string y
    {
        get
        { return Y;}
        set
        { Y = value; if (autoupdate) getchart(); }
    }
    public string z
    {
        get
        { return Z;}
        set
        { Z = value; if (autoupdate) getchart(); }
    }

    public Color colors
    {
        get
        { return Colors;}
        set
        { Colors = value; if (autoupdate) getchart(); }
    }

    // Use this for initialization
    void Start() {
        if (autostart) getchart(); 
    }

    // start the process of chart requisition for the server
    public void getchart()
    {
        if (verifyparameters()) {
            string url = "http://localhost:3000/chartgen.html?x=" + x + "&y=" + y + "&chart=" + Charttype.ToString().ToLower();
            url += "&colors=rgb(" + colors.r + "," + colors.g + "," + colors.b + ")";
            Debug.Log("requisition with: " + url);
            StartCoroutine(GetRequest(url));
        }
    }

    // generate sprite based on base64 string that came from server
    void generateViz(string base64string)
    {
        byte[] Bytes = Convert.FromBase64String(base64string);
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
        switch (charttype)
        {
            case ChartType.BarChartVertical:
                dim = 2;
                break;
            case ChartType.LineChart:
                dim = 3;
                break;
            case ChartType.PieChart:
                dim = 2;
                break;
            case ChartType.AreaChart:
                dim = 3;
                break;
        }
        return dim;
    }

    public bool verifyparameters() // TODO: verify dimensions to avoid send broken requistions
    {
        return true;
    }
}
