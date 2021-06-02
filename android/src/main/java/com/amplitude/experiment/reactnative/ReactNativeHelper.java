package com.amplitude.experiment.reactnative;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableNativeMap;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

public class ReactNativeHelper {
    /**
     * This method will convert the input of type ReadableMap into the JSONObject.
     */
    private static final String UNSUPPORTED_TYPE = "Unsupported data type";

    public static void putObject(WritableMap map, String key, Object value) {
        if (value == null) {
            map.putNull(key);
        } else if (value instanceof Boolean) {
            map.putBoolean(key, (Boolean) value);
        } else if (value instanceof Double) {
            map.putDouble(key, (Double) value);
        } else if (value instanceof Integer) {
            map.putInt(key, (Integer) value);
        } else if (value instanceof String) {
            map.putString(key, (String) value);
        } else if (value instanceof Map) {
            map.putMap(key, toWritableMap((Map) value));
        } else if (value.getClass() != null && value.getClass().isArray()) {
            map.putArray(key, toWritableArray((Object[]) value));
        }
    }

    public static Map<String, Object> toMap(ReadableMap readableMap) {
        return readableMap.toHashMap();
    }

    public static List<Object> toArray(ReadableArray readableArray) {
        return readableArray.toArrayList();
    }

    public static WritableMap toWritableMap(Map<String, Object> map) {
        WritableMap writableMap = new WritableNativeMap();

        for (Map.Entry<String, Object> entry : map.entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();

            if (value == null) {
                writableMap.putNull(key);
            } else if (value instanceof Boolean) {
                writableMap.putBoolean(key, (Boolean) value);
            } else if (value instanceof Double) {
                writableMap.putDouble(key, (Double) value);
            } else if (value instanceof Integer) {
                writableMap.putInt(key, (Integer) value);
            } else if (value instanceof String) {
                writableMap.putString(key, (String) value);
            } else if (value instanceof Map) {
                writableMap.putMap(key, toWritableMap((Map<String, Object>) value));
            } else if (value.getClass() != null && value.getClass().isArray()) {
                writableMap.putArray(key, toWritableArray((Object[]) value));
            } else if (value instanceof List) {
                writableMap.putArray(key, toWritableArray((List<Object>) value));
            }
        }

        return writableMap;
    }

    public static WritableArray toWritableArray(Object[] array) {
        WritableArray writableArray = new WritableNativeArray();

        for (int i = 0; i < array.length; i++) {
            Object value = array[i];

            if (value == null) {
                writableArray.pushNull();
            } else if (value instanceof Boolean) {
                writableArray.pushBoolean((Boolean) value);
            } else if (value instanceof Double) {
                writableArray.pushDouble((Double) value);
            } else if (value instanceof Integer) {
                writableArray.pushInt((Integer) value);
            } else if (value instanceof String) {
                writableArray.pushString((String) value);
            } else if (value instanceof Map) {
                writableArray.pushMap(toWritableMap((Map<String, Object>) value));
            } else if (value.getClass() != null && value.getClass().isArray()) {
                writableArray.pushArray(toWritableArray((Object[]) value));
            } else if (value instanceof List) {
                writableArray.pushArray(toWritableArray((List<Object>) value));
            }
        }

        return writableArray;
    }

    public static WritableArray toWritableArray(List<Object> list) {
        WritableArray writableArray = new WritableNativeArray();

        for (Iterator it = list.iterator(); it.hasNext(); ) {
            Object value = it.next();

            if (value == null) {
                writableArray.pushNull();
            } else if (value instanceof Boolean) {
                writableArray.pushBoolean((Boolean) value);
            } else if (value instanceof Double) {
                writableArray.pushDouble((Double) value);
            } else if (value instanceof Integer) {
                writableArray.pushInt((Integer) value);
            } else if (value instanceof String) {
                writableArray.pushString((String) value);
            } else if (value instanceof Map) {
                writableArray.pushMap(toWritableMap((Map<String, Object>) value));
            } else if (value.getClass() != null && value.getClass().isArray()) {
                writableArray.pushArray(toWritableArray((Object[]) value));
            } else if (value instanceof List) {
                writableArray.pushArray(toWritableArray((List<Object>) value));
            }
        }

        return writableArray;
    }

    public static JSONObject convertMapToJson(ReadableMap value) throws JSONException {
        if (value == null) {
            return null;
        }
        JSONObject properties = new JSONObject();
        ReadableMapKeySetIterator iterator = value.keySetIterator();
        while (iterator.hasNextKey()) {
            String key = iterator.nextKey();
            ReadableType valueType = value.getType(key);
            switch (valueType) {
                case Null:
                    properties.put(key, JSONObject.NULL);
                    break;
                case Boolean:
                    properties.put(key, value.getBoolean(key));
                    break;
                case Number:
                    properties.put(key, value.getDouble(key));
                    break;
                case String:
                    properties.put(key, value.getString(key));
                    break;
                case Map:
                    properties.put(key, convertMapToJson(value.getMap(key)));
                    break;
                case Array:
                    properties.put(key, convertArrayToJson(value.getArray(key)));
                    break;
                default:
                    throw new IllegalArgumentException(UNSUPPORTED_TYPE + valueType);
            }
        }
        return properties;
    }

    /**
     * This method will convert the input of type ReadableArray into the Json
     * object.
     */
    public static JSONArray convertArrayToJson(ReadableArray value) throws JSONException {
        if (value == null) {
            return null;
        }
        JSONArray properties = new JSONArray();
        for (int i = 0; i < value.size(); i++) {
            ReadableType valueType = value.getType(i);
            switch (valueType) {
                case Null:
                    properties.put(JSONObject.NULL);
                    break;
                case Boolean:
                    properties.put(value.getBoolean(i));
                    break;
                case Number:
                    properties.put(value.getDouble(i));
                    break;
                case String:
                    properties.put(value.getString(i));
                    break;
                case Map:
                    properties.put(convertMapToJson(value.getMap(i)));
                    break;
                case Array:
                    properties.put(convertArrayToJson(value.getArray(i)));
                    break;
                default:
                    throw new IllegalArgumentException(UNSUPPORTED_TYPE + valueType);
            }
        }
        return properties;
    }

    public static WritableMap convertJsonToMap(JSONObject jsonObject) throws JSONException {
        WritableMap map = new WritableNativeMap();
        for (Iterator<String> it = jsonObject.keys(); it.hasNext(); ) {
            String key = it.next();
            Object value = jsonObject.get(key);
            if (value == null) {
                map.putNull(key);
            } else if (value instanceof Boolean) {
                map.putBoolean(key, (Boolean) value);
            } else if (value instanceof Double) {
                map.putDouble(key, (Double) value);
            } else if (value instanceof Integer) {
                map.putInt(key, (Integer) value);
            } else if (value instanceof String) {
                map.putString(key, (String) value);
            } else if (value instanceof JSONObject) {
                map.putMap(key, convertJsonToMap((JSONObject) value));
            } else if (value instanceof JSONArray) {
                map.putArray(key, convertJsonToArray((JSONArray) value));
            }
        }
        return map;
    }

    public static WritableArray convertJsonToArray(JSONArray jsonArray) throws JSONException {
        WritableArray array = new WritableNativeArray();
        for (int i = 0; i < jsonArray.length(); i++) {
            Object value = jsonArray.get(i);
            if (value == null) {
                array.pushNull();
            } else if (value instanceof Boolean) {
                array.pushBoolean((Boolean) value);
            } else if (value instanceof Double) {
                array.pushDouble((Double) value);
            } else if (value instanceof Integer) {
                array.pushInt((Integer) value);
            } else if (value instanceof String) {
                array.pushString((String) value);
            } else if (value instanceof JSONObject) {
                array.pushMap(convertJsonToMap((JSONObject) value));
            } else if (value instanceof JSONArray) {
                array.pushArray(convertJsonToArray((JSONArray) value));
            } else {
                array.pushNull();
            }
        }
        return array;
    }
}
