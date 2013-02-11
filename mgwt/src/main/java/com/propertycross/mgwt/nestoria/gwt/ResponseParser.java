package com.propertycross.mgwt.nestoria.gwt;

import com.google.gwt.json.client.JSONObject;
import com.propertycross.mgwt.nestoria.RequestSender.Callback;


interface ResponseParser {

    void parse(JSONObject root, Callback c) throws ParseException;

    public static final class ParseException extends Exception {

        private static final long serialVersionUID = 1L;

        public ParseException(String msg)
        {
            super(msg);
        }

        public ParseException(String msg, Throwable t)
        {
            super(msg, t);
        }

    }

}
