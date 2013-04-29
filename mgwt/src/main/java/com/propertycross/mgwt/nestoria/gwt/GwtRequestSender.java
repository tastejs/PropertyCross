package com.propertycross.mgwt.nestoria.gwt;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.http.client.URL;
import com.google.gwt.json.client.JSONObject;
import com.propertycross.mgwt.nestoria.RequestSender;
import com.propertycross.mgwt.nestoria.gwt.ResponseParser.ParseException;

public final class GwtRequestSender implements RequestSender {

    private static int id;

    private final ResponseParser parser;

    GwtRequestSender(ResponseParser parser)
    {
        this.parser = parser;
    }

    public GwtRequestSender()
    {
        this(new ResponseValidator(new ResponseHandler()));
    }

    @Override
    public void ping(String url, Callback c)
    {
        getJson(id++, URL.encode(url), this, c);
    }

    private void handleJsonResponse(Callback c, JavaScriptObject jso)
    {
        try {
            parser.parse(new JSONObject(jso), c);
        }
        catch(ParseException ex) {
            c.onError(ex);
        }
    }

    private native static void getJson(int requestId, String url,
            GwtRequestSender handler, Callback c)
    /*-{
        var callback = "callback" + requestId;

        var script = document.createElement("script");
        script.setAttribute("src", url + "&callback=" + callback);
        script.setAttribute("type", "text/javascript");

        window[callback] = function(jsonObj) {
            handler.@com.propertycross.mgwt.nestoria.gwt.GwtRequestSender::handleJsonResponse(Lcom/propertycross/mgwt/nestoria/RequestSender$Callback;Lcom/google/gwt/core/client/JavaScriptObject;)(c, jsonObj);
            window[callback + "done"] = true;
        }

        setTimeout(function() {
            if(!window[callback + "done"]) {
                c.@com.propertycross.mgwt.nestoria.RequestSender$Callback::onTimeout()();
            }
            document.body.removeChild(script);
            delete window[callback];
            delete window[callback + "done"];
        }, 1000);

        document.body.appendChild(script);
    }-*/;

}
