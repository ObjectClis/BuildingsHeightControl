185, 224, 240185, 224, 240185, 224, 240185, 224, 240185, 224, 240185, 224, 240
//var localIP = "192.168.1.128";
//var localIP = "172.20.10.2";
var localIP = "localhost";

var map,
    view;

var mainModel,//主模型
    mainRenderer,//主渲染器
    mainRenderer_sp,//主渲染器2
    JZRenderer,//建筑单体渲染器
    expressionInfosKG,//模型点击弹窗表达式
    fieldInfosKG;//模型点击弹窗内容

var P1 = 0, P2 = 0, P3 = 0, P4 = 0, P5 = 0, P6 = 0;
var P101 = 0, P102 = 0, P501 = 0, P502 = 0, P601 = 0, P602 = 0;

var heigthFactor = 1,//模型高乘倍数
    mutiFactor=1.7;//模型评分乘倍数

require([
  "esri/Map",
  "esri/views/SceneView",

  "esri/layers/FeatureLayer",
  "esri/layers/ImageryLayer",
  "esri/layers/MapImageLayer",

  "esri/Basemap",
  "esri/widgets/LayerList",
  "esri/widgets/BasemapToggle",
  "esri/widgets/Legend",
  "esri/widgets/Home",

  "dojo/domReady!"
], function (
  Map,
  SceneView,

  FeatureLayer,
  ImageryLayer,
  MapImageLayer,

  Basemap,
  LayerList,
  BasemapToggle,
  Legend,
  Home
) {
    
    function setP() {
        P1 = $('#inputP1')[0].value;
        P2 = $('#inputP2')[0].value;
        P3 = $('#inputP3')[0].value;
        P4 = $('#inputP4')[0].value;
        P5 = $('#inputP5')[0].value;
        P6 = $('#inputP6')[0].value;
        P101 = $('#inputP101')[0].value;
        P102 = $('#inputP102')[0].value;
        P301 = $('#inputP301')[0].value;
        P302 = $('#inputP302')[0].value;
        P501 = $('#inputP501')[0].value;
        P502 = $('#inputP502')[0].value;
        P601 = $('#inputP601')[0].value;
        P602 = $('#inputP602')[0].value;
    }

   
    function createMainModel() {

        var model = "";

        //factor1
        if (P1 == 0 || (P101===0 && P102==0)) {//若P1不计或P101与P102和为0（不参与模型计算）
            model += "1*";
        }
        else {
            model += "(";
            P101 == 0 ? model += "1*"+P101+"+" : model += "($feature.CQJGFM)*" + P101+"+";
            P102 == 0 ? model += "1*"+P102 : model += "($feature.CQSTKJGJ)*" + P102;
            model += ")/" + (parseFloat(P101) + parseFloat(P102)) + "*" + P1 + "*";
        }
        
        //factor2
        P2 == 0 ? model += "1*" : model += "($feature.LSWHYZ)*" + parseFloat(P2) + "*";

        //factor3
        if (P3 == 0 || (P301 === 0 && P302 == 0)) {
            model += "1*";
        }
        else {
            model += "(";
            P301 == 0 ? model += "1*" + P301 + "+" : model += "($feature.STKZQ)*" + P301 + "+";
            P302 == 0 ? model += "1*" + P302 : model += "($feature.STBHQ)*" + P302;
            model += ")/" + (parseFloat(P301) + parseFloat(P302)) + "*" + P3 + "*";
        }

        //factor4
        P4 == 0 ? model += "1*" : model += "($feature.TDJGYZ)*" + parseFloat(P4) + "*";

        //factor5
        if (P5 == 0 || (P501 === 0 && P502 == 0)) {
            model += "1*";
        }
        else {
            model += "(";
            P501 == 0 ? model += "1*" + P501 + "+" : model += "($feature.GDJT)*" + P501 + "+";
            P502 == 0 ? model += "1*" + P502 : model += "($feature.GGJT)*" + P502;
            model += ")/" + (parseFloat(P501) + parseFloat(P502)) + "*" + P5 + "*";
        }

        //factor6
        if (P6 == 0 || (P601 === 0 && P602 == 0)) {
            model += "1";
        }
        else {
            model += "(";
            P601 == 0 ? model += "1*" + P601 + "+" : model += "($feature.KJGZGH)*" + P601 + "+";
            P602 == 0 ? model += "1*" + P602 : model += "($feature.YDSYX)*" + P602;
            model += ")/" + (parseFloat(P601) + parseFloat(P602)) + "*" + P6;
        }



        return model;

        //return "(" + "($feature.CQJGFM)*" + P101 + "+($feature.CQSTKJGJ)*" + P102 + ")/" + (parseFloat(P101) + parseFloat(P102)) + "*" + P1 + "*" +
        //"($feature.LSWHYZ)*" + parseFloat(P2) + "*" +
        //"(" + "($feature.STKZQ)*" + P301 + "+($feature.STBHQ)*" + P302 + ")/" + (parseFloat(P301) + parseFloat(P302)) + "*" + P3 + "*" +
        //"($feature.TDJGYZ)*" + parseFloat(P4) + "*" +
        //"(" + "($feature.GDJT)*" + P501 + "+($feature.GGJT)*" + P502 + ")/" + (parseFloat(P501) + parseFloat(P502)) + "*" + P5 + "*" +
        //"(" + "($feature.KJGZGH)*" + P601 + "+($feature.YDSYX)*" + P602 + ")/" + (parseFloat(P601) + parseFloat(P602)) + "*" + P6;


    }

    function createMainRenderer_sp() {
        return {
            type: "simple", // autocasts as new SimpleRenderer()
            symbol: {
                type: "polygon-3d", // autocasts as new PolygonSymbol3D()
                symbolLayers: [{
                    type: "extrude" // autocasts as new ExtrudeSymbol3DLayer()
                }]
            },
            visualVariables: [{
                type: "size",
                valueExpression: mainModel + "*" + mutiFactor + "*100*" + heigthFactor
            },
            {
                type: "color",
                //field: "GDKZ",
                valueExpression: mainModel,
                legendOptions: {
                    title: "建设建议"
                },
                stops: [
                    {
                        value: 0,
                        color: "rgba(255,240,245,0.75)",
                        label: "高层禁止区"
                    },
                    {
                        value: 0.2,
                        color: "rgba(255,182,193,0.75)",
                        label: "高层控制区"
                    },
                    {
                        value: 0.4,
                        color: "rgba(255,105,180,0.75)",
                        label: "高层适当区"
                    },
                    {
                        value: 0.6,
                        color: "rgba(255,20,147,0.75)",
                        label: "高层鼓励区"
                    }
                ]
            }]
        }
    }


    function createMainRenderer() {
        return {
            type: "simple", // autocasts as new SimpleRenderer()
            symbol: {
                type: "polygon-3d", // autocasts as new PolygonSymbol3D()
                symbolLayers: [{
                    type: "extrude" // autocasts as new ExtrudeSymbol3DLayer()
                }]
            },
            visualVariables: [{
                type: "size",
                valueExpression: mainModel + "*" + mutiFactor + "*100*" + heigthFactor
            },
            {
                type: "color",
                //field: "GDKZ",
                valueExpression: mainModel,
                legendOptions: {
                    title: "建设建议"
                },
                stops: [
                    {
                        value: 0,
                        color: "rgba(0, 113, 180 ,0.7)",
                        label: "高层禁止区"
                    },
                    {
                        value: 0.2,
                        color: "rgba(52, 112, 191,0.7)",
                        label: "高层控制区"
                    },
                    {
                        value: 0.4,
                        color: "rgba(94, 155, 235,0.7)",
                        label: "高层适当区"
                    },
                    {
                        value: 6,
                        color: "rgba(187, 231, 251,0.7)",
                        label: "高层鼓励区"
                    }
                ]
            }]
        }
    }

  




    function createJZRenderer(){
        return {
            type: "simple", // autocasts as new SimpleRenderer()
            symbol: {
                type: "polygon-3d", // autocasts as new PolygonSymbol3D()
                symbolLayers: [{
                    type: "extrude" // autocasts as new ExtrudeSymbol3DLayer()
                }]
            },
            visualVariables: [{
                type: "size",
                valueExpression: "($feature.LC)*3*" + heigthFactor
            },
            {
                type: "color",
                field: "LC",
                //valueExpression: mainModel,
                legendOptions: {
                    title: "建筑单体层数"
                },
                stops: [
                    {
                        value: 0,
                        color: "rgba(86, 249, 207,1)",
                        label: "建筑单体"
                    }
                ]
            }]
        };
    }



   
    function createExpressionInfos() {
        return [
                {
                    name: "factorYDMC",
                    title: "<b><span style='white-space:pre;font-size:1.2em;'>用地性质</span></b>",
                    expression: "($feature.YDMC)"
                },
                {
                    name: "factorKG",
                    title: "<b><span style='white-space:pre;font-size:1.2em;'>参考高度(±10m)</span></b>",
                    expression: "Round(" + mainModel + "*" + mutiFactor + "*100,2)"
                    //expression: mainModel + "*100*"+heigthFactor
                },
                {
                    name: "factorFZ",
                    title: "<b><span style='white-space:pre;font-size:1.2em;'>模型评分</span></b>",
                    expression: "Round(" + mainModel+",4)"
                },
                {
                    name: "factor1",
                    title: "<b><span style='white-space:pre;font-size:1.2em;'>1城市风貌因子</span></b>",
                    expression: "(" + "($feature.CQJGFM)*" + P101 + "+($feature.CQSTKJGJ)*" + P102 + ")/" + (parseFloat(P101) + parseFloat(P102))
                },
                {
                    name: "factor101",
                    title: "<span style='white-space:pre;'>    城区景观风貌</span>",
                    expression: "$feature.CQJGFM"
                },
                {
                    name: "factor102",
                    title: "<span style='white-space:pre;'>    城区生态空间格局</span>",
                    expression: "($feature.CQSTKJGJ)"
                },
                {
                    name: "factor2",
                    title: "<b><span style='white-space:pre;font-size:1.2em;'>2历史文化因子</span></b>",
                    expression: "$feature.LSWHYZ"
                },
                {
                    name: "factor3",
                    title: "<b><span style='white-space:pre;font-size:1.2em;'>3城市景观因子</span></b>",
                    expression: "(" + "($feature.STKZQ)*" + P301 + "+($feature.STBHQ)*" + P302 + ")/" + (parseFloat(P301) + parseFloat(P302))
                },
                {
                    name: "factor301",
                    title: "<span style='white-space:pre;'>    生态控制区</span>",
                    expression: "$feature.STKZQ"
                },
                {
                    name: "factor302",
                    title: "<span style='white-space:pre;'>    生态保护区</span>",
                    expression: "$feature.STBHQ"
                },
                {
                    name: "factor4",
                    title: "<b><span style='white-space:pre;font-size:1.2em;'>4土地价格因子</span></b>",
                    expression: "$feature.TDJGYZ"
                },
                {
                    name: "factor5",
                    title: "<b><span style='white-space:pre;font-size:1.2em;'>5交通可达性因子</span></b>",
                    expression: "(" + "($feature.GDJT)*" + P101 + "+($feature.GGJT)*" + P102 + ")/" + (parseFloat(P101) + parseFloat(P102))
                },
                {
                    name: "factor501",
                    title: "<span style='white-space:pre;'>    轨道交通</span>",
                    expression: "$feature.GDJT"
                },
                {
                    name: "factor502",
                    title: "<span style='white-space:pre;'>    公共交通</span>",
                    expression: "$feature.GGJT"
                },
                {
                    name: "factor6",
                    title: "<b><span style='white-space:pre;font-size:1.2em;'>6建设潜力因子</span></b>",
                    expression: "(" + "($feature.KJGZGH)*" + P601 + "+($feature.YDSYX)*" + P602 + ")/" + (parseFloat(P601) + parseFloat(P602))
                },
                {
                    name: "factor601",
                    title: "<span style='white-space:pre;'>    空间管制规划</span>",
                    expression: "$feature.KJGZGH"
                },
                {
                    name: "factor602",
                    title: "<span style='white-space:pre;'>    用地适宜性</span>",
                    expression: "$feature.YDSYX"
                },


        ];
    }

   

    function creatFieldInfos() {
        var infos = [
            {
                fieldName: "expression/factorYDMC"
            },
            {
                fieldName: "expression/factorKG"
            },
            {
                fieldName: "expression/factorFZ"
            }
        ];


        if (P1 != 0) {
            infos.push({ fieldName: "expression/factor1" });
            infos.push({ fieldName: "expression/factor101" });
            infos.push({ fieldName: "expression/factor102" });
        }

        if (P2 != 0) {
            infos.push({ fieldName: "expression/factor2" });
        }

        if (P3 != 0) {
            infos.push({ fieldName: "expression/factor3" });
            infos.push({ fieldName: "expression/factor301" });
            infos.push({ fieldName: "expression/factor302" });
        }

        if (P4 != 0) {
            infos.push({ fieldName: "expression/factor4" });
        }

        if (P5 != 0) {
            infos.push({ fieldName: "expression/factor5" });
            infos.push({ fieldName: "expression/factor501" });
            infos.push({ fieldName: "expression/factor502" });
        }

        if (P6 != 0) {
            infos.push({ fieldName: "expression/factor6" });
            infos.push({ fieldName: "expression/factor601" });
            infos.push({ fieldName: "expression/factor602" });
        }

        return infos;
    }




    //主要计算部分
    setP();//设定权值
    mainModel = createMainModel();//创建主模型
    mainRenderer_sp = createMainRenderer_sp();//创建主模型2
    mainRenderer = createMainRenderer();//创建主模型
    JZRenderer = createJZRenderer();//建筑单体渲染器
    expressionInfosKG = createExpressionInfos();//模型点击弹窗表达式
    fieldInfosKG = creatFieldInfos();//模型点击弹窗内容

    var popupTemplateKG = {
        title: "<font color='#3BB4F2'>地块详情",
        content: [{
            type: "fields",
            fieldInfos: fieldInfosKG
        }],
        expressionInfos: expressionInfosKG
    };

    var popupTemplateJZ = {
        title: "建筑单体详情",
        content: [{
            type: "fields",
            fieldInfos: [
                {
                    fieldName: "expression/floor",
                },
                {
                    fieldName: "expression/height",
                }
            ]
        }],

        expressionInfos: [
            {
                name: "floor",
                title: "层数",
                expression: "$feature.LC"
            },
            {
                name: "height",
                title: "高度",
                expression: "$feature.LC*3"
            }
        ]

    };




    var base101 = new ImageryLayer({
        title: "中心城区景观风貌规划图",
        value:"ght",
        url: "http://" + localIP + ":6080/arcgis/rest/services/建筑控高示例数据/1_1_38中心城区景观风貌规划图/ImageServer",
    });
    var base102 = new ImageryLayer({
        title: "主城区生态空间格局图",
        value: "ght",
        url: "http://" + localIP + ":6080/arcgis/rest/services/建筑控高示例数据/102_07主城区生态空间格局图/ImageServer",
    });

    var base201 = new ImageryLayer({
        title: "中心城区紫线控制图",
        value: "ght",
        url: "http://" + localIP + ":6080/arcgis/rest/services/建筑控高示例数据/201_13中心城区紫线控制图1/ImageServer",
    });

    var base202 = new ImageryLayer({
        title: "市域历史文化遗产保护规划图",
        value: "ght",
        url: "http://" + localIP + ":6080/arcgis/rest/services/建筑控高示例数据/202_07市域历史文化遗产保护规划图1/ImageServer",
    });

    var base203 = new ImageryLayer({
        title: "中心城区文化遗产保护规划图(历史文化要素分布)",
        value: "ght",
        url: "http://" + localIP + ":6080/arcgis/rest/services/建筑控高示例数据/2_1_13中心城区紫线控制图1/ImageServer",
    });

    var base301 = new ImageryLayer({
        title: "市域基本生态控制线规划图",
        value: "ght",
        url: "http://" + localIP + ":6080/arcgis/rest/services/建筑控高示例数据/301_11市域基本生态控制线规划图1/ImageServer",
    });

    var base302 = new ImageryLayer({
        title: "环巢湖生态保护区图",
        value: "ght",
        url: "http://" + localIP + ":6080/arcgis/rest/services/建筑控高示例数据/302_14环巢湖生态保护区图1/ImageServer",
    });

    var base601 = new ImageryLayer({
        title: "中心城区空间管制规划图",
        value: "ght",
        url: "http://" + localIP + ":6080/arcgis/rest/services/建筑控高示例数据/601_36中心城区空间管制规划图/ImageServer",
    });

    var base602 = new ImageryLayer({
        title: "市域用地适宜性分析图",
        value: "ght",
        url: "http://" + localIP + ":6080/arcgis/rest/services/建筑控高示例数据/602_13市域用地适宜性分析图/ImageServer",
    });

    //用地图
    var lyrYD = new MapImageLayer({
        title: "总规图",
        url: "http://" + localIP + ":6080/arcgis/rest/services/建筑控高示例数据/建筑控高示例数据/MapServer",
    });




    //庐阳数据模型图
    var lyrKG_ly = new FeatureLayer({
        title: "庐阳数据模型图",
        visible:false,
        url: "http://" + localIP + ":6080/arcgis/rest/services/建筑控高示例数据/建筑控高示例数据/FeatureServer/5",
        renderer: mainRenderer,
        outFields: ['*'],
        popupTemplate: popupTemplateKG
    });
    //瑶海数据模型图
    var lyrKG_yh = new FeatureLayer({
        title: "瑶海数据模型图",
        visible: false,
        url: "http://" + localIP + ":6080/arcgis/rest/services/建筑控高示例数据/建筑控高示例数据/FeatureServer/2",
        renderer: mainRenderer,
        outFields: ['*'],
        popupTemplate: popupTemplateKG
    });
    //出让地块数据模型图
    var lyrKG_CR = new FeatureLayer({
        title: "出让地块模型图",
        visible: true,
        url: "http://" + localIP + ":6080/arcgis/rest/services/建筑控高示例数据/建筑控高示例数据/FeatureServer/0",
        renderer: mainRenderer_sp,
        outFields: ['*'],
        popupTemplate: popupTemplateKG
    });

    //庐阳数据模型图(擦除单体)
    var lyrCC_ly = new FeatureLayer({
        title: "庐阳数据模型图",
        url: "http://" + localIP + ":6080/arcgis/rest/services/建筑控高示例数据/建筑控高示例数据/FeatureServer/5",
        renderer: mainRenderer,
        outFields: ['*'],
        popupTemplate: popupTemplateKG
    });
    //瑶海数据模型图(擦除单体)
    var lyrCC_yh = new FeatureLayer({
        title: "瑶海数据模型图",
        url: "http://" + localIP + ":6080/arcgis/rest/services/建筑控高示例数据/建筑控高示例数据/FeatureServer/2",
        renderer: mainRenderer,
        outFields: ['*'],
        popupTemplate: popupTemplateKG
    });

    //庐阳建筑现状图
    var lyrJZ_ly = new FeatureLayer({
        title: "庐阳建筑现状图",
        url: "http://" + localIP + ":6080/arcgis/rest/services/建筑控高示例数据/建筑控高示例数据/FeatureServer/6",
        renderer: JZRenderer,
        outFields: ['*'],
        popupTemplate: popupTemplateJZ
    });
    //瑶海建筑现状图
    var lyrJZ_yh = new FeatureLayer({
        title: "瑶海建筑现状图",
        url: "http://" + localIP + ":6080/arcgis/rest/services/建筑控高示例数据/建筑控高示例数据/FeatureServer/3",
        renderer: JZRenderer,
        outFields: ['*'],
        popupTemplate: popupTemplateJZ
    });
    //滨湖新区建筑现状图
    var lyrJZ_bh = new FeatureLayer({
        title: "滨湖新区建筑现状图",
        url: "http://" + localIP + ":6080/arcgis/rest/services/建筑控高示例数据/建筑控高示例数据/FeatureServer/9",
        renderer: JZRenderer,
        outFields: ['*'],
        popupTemplate: popupTemplateJZ
    });

    //滨湖新区建筑现状图(后加)
    var lyrJZ_bh2 = new FeatureLayer({
        title: "滨湖新区建筑现状图(后加)",
        url: "http://" + localIP + ":6080/arcgis/rest/services/建筑控高示例数据/建筑控高示例数据/FeatureServer/10",
        renderer: JZRenderer,
        outFields: ['*'],
        popupTemplate: popupTemplateJZ
    });

    map = new Map({
        //basemap: "hybrid",
        basemap: "streets-night-vector",
        layers: [lyrJZ_ly, lyrJZ_yh, lyrJZ_bh, lyrJZ_bh2]
        //layers: [lyrJZ_ly, lyrJZ_yh, lyrJZ_bh, lyrJZ_bh2]
    });


    var mCamera = {
        position: {
            latitude: 31.631517,
            longitude: 117.292154,
            z: 3788
        },
        tilt: 72.69,
        heading: 358.68
    }

    view = new SceneView({
        container: "viewDiv",
        map: map,
        camera:mCamera
    });

   



    ///菜单栏按钮事件
    //规划图叠加
    $("ul#baseImageSelect").on("click", "li", function (event) {

        var li = event.currentTarget;
        var ul = li.parentElement;
        for (var i = 0; i < ul.childElementCount; i++) {
            ul.children[i].classList.remove("am-active");
        }


        var lyrs = map.layers.items;
        for (var i = 0; i < lyrs.length; i++) {
            if (lyrs[i].value=="ght") {
                map.layers.remove(lyrs[i]);
            }
        }

        switch (li.value) {
            case 0:
                map.layers.removeMany([base101, base102]);
                break;
            default:
                var mBasemap = eval("base" + event.currentTarget.value);
                map.layers.add(mBasemap);
                break;
        }
        li.classList.add("am-active");
    });

    //底图小部件
    var toggle = new BasemapToggle({
        // 2 - Set properties
        view: view, // view that provides access to the map's 'topo' basemap
        nextBasemap: "hybrid" // allows for toggling to the 'hybrid' basemap
    });
    //view.ui.add(toggle, "top-right");//默认放入底图切换小部件

    //图例小部件
    var legend = new Legend({
        name: 'legend',
        view: view
    });
    //view.ui.add(legend, "bottom-right");//默认放入图例小部件

    //图层控制小部件
    var layerList = new LayerList({
        view: view
    });
    //view.ui.add(layerList, "bottom-left");//默认放入图层列表小部件

    //主页按钮小部件
    var homeWidget = new Home({
        view: view
    });
    view.ui.add(homeWidget, "top-left");


    //小部件按钮
    $('#btnWidget').click(function () {
        if (!this.classList.contains('am-active')) {

            view.ui.add(legend, "bottom-right");
            view.ui.add(toggle, "top-right");
            view.ui.add(layerList, "bottom-left");


            this.classList.add('am-active');
        }
        else {

            view.ui._components.forEach(function (item) {
                if (item.widget.id == 'legend') { search = item.widget }
            })
            view.ui.remove(legend);
            view.ui.remove(toggle);
            view.ui.remove(layerList);


            this.classList.remove('am-active');
        }
    });


    //用地图按钮
    $('#btnYD').click(function () {
        if (!this.classList.contains('am-active')) {

            map.layers.add(lyrYD);

            this.classList.add('am-active');
        }
        else {
            map.layers.remove(lyrYD);

            this.classList.remove('am-active');
        }
    });


    //控高模型按钮
    $('#btnKG').click(function () {
        if (!this.classList.contains('am-active')) {

            map.layers.addMany([lyrKG_yh, lyrKG_ly, lyrKG_CR]);

            this.classList.add('am-active');
        }
        else {
            map.layers.removeMany([lyrKG_yh, lyrKG_ly, lyrKG_CR]);

            this.classList.remove('am-active');
        }
    });


    //侧边栏_置零按钮
    $('#btnSetZero').click(function () {
        $('#inputP1')[0].value = 0;
        $('#inputP2')[0].value = 0;
        $('#inputP3')[0].value = 0;
        $('#inputP4')[0].value = 0;
        $('#inputP5')[0].value = 0;
        $('#inputP6')[0].value = 0;
    });

    //侧边栏_重置按钮
    $('#btnReset').click(function () {
        $('#inputP1')[0].value = 1;
        $('#inputP2')[0].value = 1;
        $('#inputP3')[0].value = 1;
        $('#inputP4')[0].value = 1;
        $('#inputP5')[0].value = 1;
        $('#inputP6')[0].value = 1;
        $('#inputP101')[0].value = 0.5;
        $('#inputP102')[0].value = 0.5;
        $('#inputP301')[0].value = 0.5;
        $('#inputP302')[0].value = 0.5;
        $('#inputP501')[0].value = 0.6;
        $('#inputP502')[0].value = 0.4;
        $('#inputP601')[0].value = 0.5;
        $('#inputP602')[0].value = 0.5;
    });

    //侧边栏_应用按钮
    $('#btnFactorsDo').click(function () {

        setP(); 
        mainModel = createMainModel();
        mainRenderer = createMainRenderer();
        mainRenderer_sp = createMainRenderer_sp();

        var popupTemplateKG = {
            title: "<font color='#3BB4F2'>地块详情",
            content: [{
                type: "fields",
                fieldInfos: creatFieldInfos()
            }],
            expressionInfos: expressionInfosKG
        };

        lyrKG_ly.renderer = mainRenderer;
        lyrKG_ly.popupTemplate = popupTemplateKG;
        lyrKG_ly.popupTemplate.expressionInfos = createExpressionInfos();
     
        lyrKG_yh.renderer = mainRenderer;
        lyrKG_yh.popupTemplate = popupTemplateKG;
        lyrKG_yh.popupTemplate.expressionInfos = createExpressionInfos();
       
        lyrKG_CR.renderer = mainRenderer_sp;
        lyrKG_CR.popupTemplate = popupTemplateKG;
        lyrKG_CR.popupTemplate.expressionInfos = createExpressionInfos();
      




     

    });

    


    //侧边栏_关闭按钮
    $("#btnFactorsCancel").click(function () {
        $('#doc-oc-demo3').offCanvas('close'); //关闭边栏
    });



    $('#btnTest').click(function () {

    });

    //去掉esri logo
    view.then(function () {

        var interactive = document.getElementsByClassName('esri-attribution')[0];
        interactive.parentElement.removeChild(interactive);
    })

});

