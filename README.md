# VizGen
Generate charts on the go, run the server and connect for simple chart construction.
See the [web service](https://github.com/tiagodavi70/Web-Gen-Viz/tree/master/chart-generation-service/) and the [Unity client](https://github.com/tiagodavi70/Web-Gen-Viz/tree/master/unity-client) for instructions on installation and usage.

# Overview 
The purpose of the service is to provide simple abstractions for chart generation, mainly in form of images for use in textures. The main reason for this format is to ease the usage in 3D tools, mainly [Unity](https://unity.com/). It works over [VEGA and VEGA-LITE](https://vega.github.io/) grammars, generating various types of parameterized charts. 


# Technical aspects
The generated charts are exported in two non-interactive formats, PNG and SVG. The interaction in web pages can be made possible with SVG manipulation, and with some tweaks make it fully VEGA compatible. On the other hand, on 3D environments, the interaction with 2D charts is a research problem, and we present some solutions. With png textures, the charts are transported by the network as a `base64` string, to ease communication. 
 

# TODO
* gifs of the library on AR
* Images of it working, a big one at the beginning for overview and some others for example
* Architecture image
* step by step video on clean machine
* Gallery

# Contributions
All servers modifications (unless it is a bug correction) must update the corresponding README, right now it's the most trustable specification outside the code. 

# Credits and Contact
* Tiago Davi Oliveira de Araújo - [email](mailto:tiagodavi70@gmail.com)
* Vinicius Queiroz - [email](mailto:viniciusquei@hotmail.com)

